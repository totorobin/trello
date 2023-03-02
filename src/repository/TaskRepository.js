import Repository from './Repository'

const resource = '/task'
export default {
  get (taskId) {
    return Repository.get(`${taskId}`)
  },
  update (task) {
    return Repository.put(`${task._id}`, task)
  },
  create (columnId, task) {
    return Repository.post(`${columnId}/tasks${resource}`, task)
  }
}
