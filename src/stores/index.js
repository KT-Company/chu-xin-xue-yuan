import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('container', () => {
  const time = ref('2025-7-17') // 项目限制日期
  let timeWeather = ref(true)
  const isDashboardVisible = ref(true)
  return {
    time,
    timeWeather,
    isDashboardVisible,
  }
})
