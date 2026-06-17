<script setup>
import router from '@/router/index.js'
import { useStore } from '@/stores/index'
const props = defineProps({
  isPopFnVisible: Boolean,
})
const emit = defineEmits(['openPopFn'])
let menuListState = ref('态势感知')
const now = useNow({ interval: 1000 })
const currentDate = useDateFormat(now, 'YYYY-MM-DD')
const currentTime = useDateFormat(now, 'HH:mm:ss')

const store = useStore()
let menuList = ref([
  {
    name: '态势感知',
    path: '/situational_awareness',
  },
  {
    name: '光伏管理',
    path: '/pv_management',
  },
  {
    name: '碳排管理',
    path: '/ce_management',
  },
  {
    name: '生活热水',
    path: '/left_hot_water',
  },
  {
    name: '空调系统',
    path: '/air_conditioner',
  },
  {
    name: '运维监控',
    path: '/om_monitor',
  },
])

let headerState = ref([true, true])
let isKeyboardTipVisible = ref(false)

let headerStateFn = (i) => {
  headerState.value[i] = !headerState.value[i]
}

let showKeyboardTip = () => {
  isKeyboardTipVisible.value = true
}

let hideKeyboardTip = () => {
  isKeyboardTipVisible.value = false
}

let navigationSwitch = (data) => {
  if (data.name == '态势感知' || data.name == '空调系统' || data.name == '运维监控') {
    store.timeWeather = true
  } else {
    store.timeWeather = false
  }
  menuListState.value = data.name
  router.push(data.path)
}
let handleCloseDashboard = () => {
  store.isDashboardVisible = !store.isDashboardVisible
}
let handleOpenPopFn = () => {
  emit('openPopFn')
}
</script>
<template>
  <div class="pointer-events-auto w-[100%] h-[2160px] absolute left-0 top-0 bg-[url('@/assets/img/header-box.png')] bg-[length:100%_100%] font-[SHSCN]">
    <div class="w-[100%] h-[218px] absolute bg-[url('@/assets/img/header-line.gif')] bg-[length:100%_100%]"></div>
    <div class="absolute w-[944px] h-[132px] left-[50%] translate-x-[-50%] top-[40px] bg-[url('@/assets/img/font-text.png')] bg-[length:100%_100%]"></div>
    <!-- 左侧用于承载时间和一级导航，方便大屏头部按视觉稿固定定位 -->
    <div class="absolute left-[80px] top-[78px] flex items-center text-[28px]">
      <div class="flex items-center font-[38px]">
        <p class="time time1 pr-[5px]">{{ currentDate }}</p>
        <p class="time time2 pl-[5px]">{{ currentTime }}</p>
      </div>
      <div class="flex items-center text-[40px] ml-[50px] cursor-pointer">
        <div
          class="route-list w-[292px] h-[88px] flex items-center justify-center text-[rgba(255,255,255,0.8)]"
          v-for="(item, index) in menuList.slice(0, 3)"
          :key="index"
          @click="navigationSwitch(item)"
          :class="menuListState == item.name ? 'active' : ''"
        >
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 右侧与左侧分开定位，避免中间标题区域被导航挤压 -->
    <div class="absolute right-[106px] top-[78px] flex items-center">
      <div class="flex items-center text-[40px] ml-[50px] cursor-pointer">
        <div
          class="route-list2 w-[292px] h-[88px] flex items-center justify-center text-[rgba(255,255,255,0.8)]"
          v-for="(item, index) in menuList.slice(3, 6)"
          :key="index"
          @click="navigationSwitch(item)"
          :class="menuListState == item.name ? 'active' : ''"
        >
          <p>{{ item.name }}</p>
        </div>
      </div>
      <div class="flex w-[300px] justify-end">
        <div
          class="relative ml-[12px] cursor-pointer w-[72.31px] h-[72.31px] bg-[url('@/assets/img/header-icon-box.png')] bg-[length:100%_100%] flex items-center justify-center hover:bg-[url('@/assets/img/header-icon-box-active.png')]"
          :class="headerState[1] ? 'bg-[url(@/assets/img/header-icon-box.png)]' : 'bg-[url(@/assets/img/header-icon-box-active.png)]'"
          @click="headerStateFn(1)"
          @mouseenter="showKeyboardTip"
          @mouseleave="hideKeyboardTip"
        >
          <div class="w-[44px] h-[46px] bg-[url('@/assets/img/keyboard.png')] bg-[length:100%_100%]"></div>
          <div
            v-show="isKeyboardTipVisible"
            class="absolute top-[86px] left-[50%] translate-x-[-50%] w-[408px] h-[288px] bg-[url('@/assets/img/keyboard-tip.png')] bg-[length:100%_100%] z-[10]"
          ></div>
        </div>

        <div
          class="ml-[12px] cursor-pointer w-[72.31px] h-[72.31px] bg-[url('@/assets/img/header-icon-box.png')] bg-[length:100%_100%] flex items-center justify-center hover:bg-[url('@/assets/img/header-icon-box-active.png')]"
          :class="props.isPopFnVisible ? 'bg-[url(@/assets/img/header-icon-box-active.png)]' : 'bg-[url(@/assets/img/header-icon-box.png)]'"
          @click="handleOpenPopFn"
        >
          <div class="w-[44px] h-[46px] bg-[url('@/assets/img/header-set.png')] bg-[length:100%_100%]"></div>
        </div>

        <div
          class="ml-[12px] cursor-pointer w-[72.31px] h-[72.31px] bg-[url('@/assets/img/header-icon-box.png')] bg-[length:100%_100%] flex items-center justify-center hover:bg-[url('@/assets/img/header-icon-box-active.png')]"
          :class="store.isDashboardVisible ? 'bg-[url(@/assets/img/header-icon-box.png)]' : 'bg-[url(@/assets/img/header-icon-box-active.png)]'"
          @click="handleCloseDashboard"
        >
          <div class="w-[44px] h-[46px] bg-[url('@/assets/img/header-close.png')] bg-[length:100%_100%]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.time {
  position: relative;
  font-style: normal;
  text-transform: none;
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 40%, rgba(62, 186, 240, 1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.time1 {
  &::after {
    position: absolute;
    display: block;
    content: '';
    background: url('@/assets/img/time-after.png') no-repeat;
    background-size: 100% 100%;
    width: 2px;
    height: 22px;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.route-list {
  position: relative;
  &.active {
    color: rgba(109, 210, 254, 1);
    &::before {
      position: absolute;
      display: block;
      content: '';
      background: url('@/assets/img/header-list-active.png') no-repeat;
      background-size: 100% 100%;
      width: 174px;
      height: 66px;
      left: 50%;
      bottom: 0%;
      transform: translateX(-50%);
    }
  }
  &::after {
    position: absolute;
    display: block;
    content: '';
    background: url('@/assets/img/header-icon.png') no-repeat;
    background-size: 100% 100%;
    width: 25px;
    height: 38px;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.route-list2 {
  position: relative;
  &.active {
    color: rgba(109, 210, 254, 1);
    &::before {
      position: absolute;
      display: block;
      content: '';
      background: url('@/assets/img/header-list-active.png') no-repeat;
      background-size: 100% 100%;
      width: 174px;
      height: 66px;
      left: 50%;
      bottom: 0%;
      transform: translateX(-50%);
    }
  }
  &::after {
    position: absolute;
    display: block;
    content: '';
    background: url('@/assets/img/header-icon2.png') no-repeat;
    background-size: 100% 100%;
    width: 25px;
    height: 38px;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
