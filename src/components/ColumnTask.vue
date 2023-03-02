<template>
  <AppDrop
    @drop="moveTaskOrColumn"
    @click="goToTask(task, 'AppDrop')"
  >
    <AppDrag
      class="task"
      :transferData="{
        type: 'task',
        fromColumnIndex: columnIndex,
        fromTaskIndex: taskIndex
      }"
      @click="goToTask(task, 'AppDrag')"
    >
      <span class="w-full flex-no-shrink font-bold">
        {{ task.name }}
      </span>
      <p
        v-if="task.description"
        class="w-full flex-no-shrink mt-1 text-sm"
      >
        {{ task.description }}
      </p>
    </AppDrag>
  </AppDrop>
</template>

<script>
import movingTasksAndColumnsMixin from '@/mixins/movingTasksAndColumnsMixin'
import AppDrag from './AppDrag'
import AppDrop from './AppDrop'
import { mapGetters } from 'vuex'

export default {
  components: { AppDrag, AppDrop },
  mixins: [movingTasksAndColumnsMixin],
  props: {
    task: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(['board'])
  },
  methods: {
    goToTask (task, component) {
      console.log(component + task)
      this.$router.push({ name: 'task', params: { id: task._id } })
    }
  }
}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}
</style>
