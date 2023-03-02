import BoardRepository from './BoardRepository'
import ColumnRepository from './ColumnRepository'
import TaskRepository from './TaskRepository'

const repositories = {
  board: BoardRepository,
  column: ColumnRepository,
  task: TaskRepository
}

export const RepositoryFactory = {
  get: name => repositories[name]
}
