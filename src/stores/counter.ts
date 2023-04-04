import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref<Array<string>>([
    'allanhan',
    'peiyueh',
    'qianglin',
    'linqiang',
    'jasonjia',
    'runfengw',
    'yanjunz',
    'huizhang',
    'qingz'
  ])

  const dailys = ref<Array<string>>([
    '10.176.179.103',
    '10.176.179.108',
    '10.176.179.78',
    '10.176.179.79',
    '10.176.179.95',
    '10.176.179.97',
    '10.176.179.98'
  ])

  return { count, dailys }
})
