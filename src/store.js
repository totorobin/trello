import Vue from 'vue'
import Vuex from 'vuex'
import { RepositoryFactory } from './repository/RepositoryFactory'
import path from 'path'
const BoardRepository = RepositoryFactory.get('board')
const ColumnRepository = RepositoryFactory.get('column')
const TaskRepository = RepositoryFactory.get('task')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    board: {},
    columns: {},
    tasks: {},
    socket: {
      isConnected: false,
      reconnectedError: false
    }
  },
  getters: {
    board: state => {
      return {
        ...state.board,
        columns: state.board.columns && state.board.columns.filter(cid => state.columns[cid]).map(cid => {
          return {
            ...state.columns[cid],
            tasks: state.columns[cid].tasks && state.columns[cid].tasks.filter(tid => state.tasks[tid]).map(tid => state.tasks[tid])
          }
        })
      }
    }
  },
  mutations: {
    UPDATE_BOARD (state, board) {
      state.board = board
    },
    UPDATE_TASK (state, task) {
      Vue.set(state.tasks, task._id, task)
    },
    UPDATE_COLUMN (state, column) {
      Vue.set(state.columns, column._id, column)
    },
    SOCKET_ONOPEN (state, event) {
      console.log(event)
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      console.log(message)
      switch (path.dirname(message._id)) {
        case '/board' :
          state.board = message
          break
        case '/column' :
          Vue.set(state.columns, message._id, message)
          break
        case '/task' :
          Vue.set(state.tasks, message._id, message)
          break
        default: break
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  actions: {
    async INIT_BOARD ({ commit }) {
      let res = await BoardRepository.get()
      const board = res.data[0]
      commit('UPDATE_BOARD', board)
      for (const col of board.columns) {
        res = await ColumnRepository.get(col)
        const column = res.data
        commit('UPDATE_COLUMN', column)
        for (const taskId of column.tasks) {
          res = await TaskRepository.get(taskId)
          commit('UPDATE_TASK', res.data)
        }
      }
    },
    async CREATE_COLUMN ({ commit, state }, { name }) {
      const { data } = await ColumnRepository.create(state.board._id, {
        name,
        tasks: []
      })
      commit('UPDATE_COLUMN', data[1])
      commit('UPDATE_BOARD', data[0])
    },
    async CREATE_TASK ({ commit, state }, { column, name }) {
      const { data } = await TaskRepository.create(column._id, { name })
      commit('UPDATE_TASK', data[1])
      commit('UPDATE_COLUMN', data[0])
    },
    async MOVE_TASK ({ commit, state }, { fromColumnId, toColumnId, fromTaskIndex, toTaskIndex }) {
      const fromColumn = { ...state.columns[fromColumnId] }
      const toColumn = (fromColumnId === toColumnId) ? fromColumn : { ...state.columns[toColumnId] }
      const taskToMove = fromColumn.tasks.splice(fromTaskIndex, 1)[0]
      toColumn.tasks.splice(toTaskIndex, 0, taskToMove)
      let res = await ColumnRepository.update(fromColumn)
      commit('UPDATE_COLUMN', res.data)
      if (fromColumnId !== toColumnId) {
        res = await ColumnRepository.update(toColumn)
        commit('UPDATE_COLUMN', res.data)
      }
    },
    async MOVE_COLUMN ({ commit, state }, { fromColumnIndex, toColumnIndex }) {
      const newBoard = {
        ...state.board
      }
      const columnToMove = newBoard.columns.splice(fromColumnIndex, 1)[0]
      newBoard.columns.splice(toColumnIndex, 0, columnToMove)
      const { data } = await BoardRepository.update(newBoard)
      commit('UPDATE_BOARD', data)
    }
  }
})
