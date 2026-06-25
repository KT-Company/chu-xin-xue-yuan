<script setup>
import router from '@/router/index.js'
import { useStore } from '@/stores/index'
const props = defineProps({
  isPopFnVisible: Boolean,
})
const emit = defineEmits(['openPopFn'])
let activeMenuId = ref('second-1')
const now = useNow({ interval: 1000 })
const currentDate = useDateFormat(now, 'YYYY-MM-DD')
const currentTime = useDateFormat(now, 'HH:mm:ss')

const store = useStore()
let menuList = computed(() => store.navMenuList)

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
  store.timeWeather = ['/situational_awareness', '/air_conditioner', '/om_monitor'].includes(data.path)
  activeMenuId.value = data.id
  if (!data.path) return

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
    <div class="absolute w-[944px] h-[132px] left-[50%] translate-x-[-50%] top-[40px] text-[88px] font-[700] text-center">
      <p class="header-text">{{ store.headerTitle }}</p>
    </div>
    <!-- 左侧用于承载时间和一级导航，方便大屏头部按视觉稿固定定位 -->
    <div class="absolute left-[80px] top-[78px] flex items-center text-[28px]">
      <div class="flex items-center font-[38px]">
        <p class="time time1 pr-[5px]">{{ currentDate }}</p>
        <p class="time time2 pl-[5px]">{{ currentTime }}</p>
      </div>
      <div class="flex items-center text-[40px] ml-[50px] cursor-pointer w-[992px]">
        <div
          class="route-list h-[88px] flex items-center justify-center text-[rgba(255,255,255,0.8)]"
          v-for="(item, index) in menuList.slice(0, menuList.length / 2)"
          :key="item.id"
          @click="navigationSwitch(item)"
          :class="activeMenuId == item.id ? 'active' : ''"
        >
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 右侧与左侧分开定位，避免中间标题区域被导航挤压 -->
    <div class="absolute right-[106px] top-[78px] flex items-center">
      <div class="flex items-center text-[40px] ml-[50px] cursor-pointer w-[992px]">
        <div
          class="route-list2 h-[88px] flex items-center justify-center text-[rgba(255,255,255,0.8)]"
          v-for="(item, index) in menuList.slice(menuList.length / 2, menuList.length)"
          :key="item.id"
          @click="navigationSwitch(item)"
          :class="activeMenuId == item.id ? 'active' : ''"
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
.header-text {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 30%, rgba(rgba(64, 191, 243, 1)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
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
  flex-grow: 1;
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
    right: -2%;
    top: 50%;
    transform: translateY(-50%);
  }
}
.route-list2 {
  position: relative;
  flex-grow: 1;
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
    left: -2%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
