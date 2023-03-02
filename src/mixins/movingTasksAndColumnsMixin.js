export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    moveTaskOrColumn (transferData) {
      if (transferData.type === 'task') {
        this.moveTask(transferData)
      } else {
        this.moveColumn(transferData)
      }
    },
    moveTask ({ fromColumnIndex, fromTaskIndex }) {
      const fromColumnId = this.board.columns[fromColumnIndex]._id

      this.$store.dispatch('MOVE_TASK', {
        fromColumnId,
        fromTaskIndex,
        toColumnId: this.column._id,
        toTaskIndex: this.taskIndex || 0
      })
    },
    moveColumn ({ fromColumnIndex }) {
      this.$store.dispatch('MOVE_COLUMN', {
        fromColumnIndex,
        toColumnIndex: this.columnIndex
      })
    }
  }
}
