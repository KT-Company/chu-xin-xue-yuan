<script setup>
let menuListState = ref('')
import router from '@/router/index.js'
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
    path: '',
  },
  {
    name: '运维监控',
    path: '',
  },
])
let navigationSwitch = (data) => {
  menuListState.value = data.name
  router.push(data.path)
}
</script>
<template>
  <div class="pointer-events-auto w-[100%] h-[2160px] absolute left-0 top-0 bg-[url('@/assets/img/header-box.png')] bg-[length:100%_100%] font-[SHSCN]">
    <div class="absolute w-[944px] h-[132px] left-[50%] translate-x-[-50%] top-[40px] bg-[url('@/assets/img/font-text.png')] bg-[length:100%_100%]"></div>
    <!--header-left-->
    <div class="absolute left-[80px] top-[78px] flex items-center">
      <div class="flex items-center font-[38px]">
        <p class="time time1 pr-[5px]">2026-06-09</p>
        <p class="time time2 pl-[5px]">13:44</p>
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
    <!--header-right-->
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
      <div class="w-[72.31px] h-[72.31px] bg-[url('@/assets/img/header-close.png')] bg-[length:100%_100%] ml-[147px]"></div>
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
