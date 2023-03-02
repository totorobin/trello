import Repository from './Repository'

const resource = '/column'
export default {
  get (columnId) {
    return Repository.get(`${columnId}`)
  },
  update (column) {
    return Repository.put(`${column._id}`, column)
  },
  create (boardId, column) {
    return Repository.post(`${boardId}/columns${resource}`, column)
  }
}
