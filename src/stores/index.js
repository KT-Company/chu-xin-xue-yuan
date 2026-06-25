/*
 * @Author: milong
 * @Date: 2025-12-25 15:28:49
 * @Description:
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SECOND_MENU_LIST } from '@/components/my-ui/constants/ktPopFnMenus'

export const useStore = defineStore('container', () => {
  const time = ref('2025-7-17') // 项目限制日期
  let timeWeather = ref(true)
  const isDashboardVisible = ref(true)
  let isPopListVisible = ref(false)
  let headerTitle = ref('初心学院天光地热平台')
  let navMenuList = ref(SECOND_MENU_LIST.map((item) => ({ ...item })))
  return {
    time,
    timeWeather,
    isDashboardVisible,
    isPopListVisible,
    headerTitle,
    navMenuList,
  }
})
