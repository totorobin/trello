import Repository from './Repository'

const resource = '/board'
export default {
  get () {
    return Repository.get(`${resource}`)
  },
  update (board) {
    return Repository.put(board._id, board)
  },
  create (payload) {
    return Repository.post(`${resource}`, payload)
  }
}
