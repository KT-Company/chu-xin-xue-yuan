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
let isSettingVisible = ref(false)

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
  isSettingVisible.value = data.path === '/om_monitor'
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
    <svg class="flow-line" width="100%" height="126" viewBox="0 2 3840 126" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <path
          id="flowLinePath"
          d="M3840 2H2722.2C2670.59 2 2622.3 27.4476 2593.12 70.0193C2567.97 106.709 2530.28 128 2490.49 128H1349.51C1309.72 128 1272.03 106.709 1246.88 70.0193C1217.7 27.4476 1169.41 2 1117.8 2H0"
        />
        <linearGradient id="cometColor" x1="0" y1="65" x2="3840" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#55E6FF" />
          <stop offset=".42" stop-color="#7AEFFF" />
          <stop offset=".58" stop-color="#FFFFFF" />
          <stop offset="1" stop-color="#6AA7FF" />
        </linearGradient>
        <linearGradient id="cometMaskGradient" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="1" />
          <stop offset=".1" stop-color="#fff" stop-opacity=".95" />
          <stop offset=".42" stop-color="#fff" stop-opacity=".45" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="cometMask" maskUnits="userSpaceOnUse" x="-900" y="-40" width="5640" height="220">
          <rect x="-820" y="-0" width="820" height="220" fill="url(#cometMaskGradient)">
            <animate attributeName="x" values="-820;3840;3840" keyTimes="0;.7;1" dur="12s" repeatCount="indefinite" />
          </rect>
        </mask>
      </defs>
      <use href="#flowLinePath" class="flow-line__comet" />
    </svg>
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
          v-if="isSettingVisible"
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
.flow-line {
  width: 100%;
  height: 190px;
  display: block;
  overflow: visible;
  position: absolute;
  left: 0;
  top: 30px;
}
.flow-line__comet {
  stroke: url(#cometColor);
  stroke-width: 3;
  stroke-linecap: round;
  mask: url(#cometMask);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 12px rgba(85, 230, 255, 1));
}
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
