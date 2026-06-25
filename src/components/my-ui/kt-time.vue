<!--
 * @Author: 米龙
 * @Date: 2026-06-15 13:54:47
 * @Description:
-->
<script setup>
import { useStore } from '@/stores/index'
import { moveX } from '@/components/my-ui/utils/dragMove'
const store = useStore()
let weather = ref([
  {
    icon: 'bg-[url(@/assets/img/weather-icon1.png)]',
    state: true,
  },
  {
    icon: 'bg-[url(@/assets/img/weather-icon2.png)]',
    state: false,
  },
  {
    icon: 'bg-[url(@/assets/img/weather-icon3.png)]',
    state: false,
  },
])
let perspectiveState = ref(false)
let perspectiveTitle = ref('第一视角')
let perspective = ref([
  {
    name: '第一视角',
  },
  {
    name: '第三视角',
  },
])

let perspectiveFn = () => {
  perspectiveState.value = !perspectiveState.value
}
let perspectiveListFn = (data) => {
  perspectiveTitle.value = data.name
}
//时间指针移动时改变场景光效
let changeLight = (offsetX) => {
  if (0 < offsetX < 0.14) {
    //00:00-03:00
  } else if (0.14 < offsetX < 0.24) {
    //03:00-06:00
  } else if (0.24 < offsetX < 0.34) {
    //06:00-09:00
  } else if (0.34 < offsetX < 0.44) {
    //09:00-12:00
  } else if (0.44 < offsetX < 0.54) {
    //12:00-15:00
  } else if (0.54 < offsetX < 0.64) {
    //15:00-18:00
  } else if (0.64 < offsetX < 0.74) {
    //18:00-21:00
  } else if (0.74 < offsetX < 0.84) {
    //21:00-24:00
  }
}
onMounted(() => {
  setTimeout(() => {
    moveX(document.getElementById('timeParent'), document.getElementById('moveDom'), changeLight)
  }, 200)
})
</script>
<template>
  <div
    class="time-weather w-[1186px] h-[108px] bg-[url('@/assets/img/time-box.png')] bg-[length:100%_100%] absolute flex items-center"
    :class="store.timeWeather == false ? 'move' : ''"
  >
    <div
      id="timeParent"
      class="pointer-events-auto cursor-pointer w-[526.48px] h-[50.2px] bg-[url('@/assets/img/time-scale.png')] bg-[length:100%_100%] mt-[27.8px] ml-[47.52px] relative"
    >
      <div class="pointer-events-none w-[465px] flex justify-between text-[23.04px] text-[#fff] font-[] absolute left-[50%] translate-x-[-50%]">
        <P>00:00</P>
        <P>06:00</P>
        <P>12:00</P>
        <P>18:00</P>
        <P>24:00</P>
      </div>
      <div
        id="moveDom"
        class="cursor-pointer absolute w-[76.8px] h-[102px] bg-[url('@/assets/img/time-icon.png')] bg-[length:100%_100%] top-[-26px] left-[0px]"
      ></div>
    </div>
    <div class="flex ml-[29px]">
      <div
        class="pointer-events-auto cursor-pointer weather w-[48px] h-[48px] bg-[url('@/assets/img/weather-icon1.png')] bg-[length:100%_100%] mr-[19.77px]"
        v-for="(item, i) in weather"
        :class="[item.icon, { active: item.state }]"
      ></div>
    </div>
    <div
      class="pointer-events-auto cursor-pointer w-[236px] h-[60px] bg-[url('@/assets/img/perspective.png')] bg-[length:100%_100%] ml-[31px] text-[#fff] relative"
    >
      <div class="flex items-center justify-around h-[100%]" @click="perspectiveFn">
        <p class="text-[28px]">{{ perspectiveTitle }}</p>
        <div class="w-[16px] h-[12px] bg-[url('@/assets/img/pull-down.png')] bg-[length:100%_100%]"></div>
      </div>

      <div class="absolute w-[236px] bg-[rgba(0,0,0,0.6)] h-[156px] rounded-[16px] flex flex-col items-center" v-if="perspectiveState">
        <div
          class="pull-down w-[224px] h-[72px] text-[28px] flex justify-center items-center mt-[6px]"
          v-for="(item, i) in perspective"
          @click="perspectiveListFn(item)"
          :class="{ active: perspectiveTitle == item.name }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      class="pointer-events-auto cursor-pointer w-[60px] h-[60px] bg-[url('@/assets/img/refresh-box.png')] bg-[length:100%_100%] ml-[24px] flex items-center justify-center"
    >
      <div class="w-[28.26px] h-[32px] bg-[url('@/assets/img/refresh-icon.png')] bg-[length:100%_100%]"></div>
    </div>
  </div>
</template>
<style scoped lang="less">
.time-weather {
  top: 254px;
  left: 868px;
  transition: all 1s;
  &.move {
    left: 178px;
  }
}

.weather {
  position: relative;
  &.active {
    &::after {
      position: absolute;
      display: block;
      content: '';
      width: 56px;
      height: 56px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(@/assets/img/weather-box.png) no-repeat;
      background-size: 100% 100%;
    }
  }
}
.pull-down {
  &:hover {
    background: url(@/assets/img/perspective-active.png) no-repeat;
    background-size: 100% 100%;
  }
  &.active {
    background: url(@/assets/img/perspective-active.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
