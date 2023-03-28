import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref<Array<string>>([
    'ubuntu',
    'root',
    'runfengw', 'yanjunz', 'huizhang', 'qingz'])

  return { count }
})
