<!--
 * @Author: 米龙
 * @Date: 2026-06-15 11:21:11
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let listActive = ref()
let list = ref([
  {
    icon: new URL('@/assets/img/pv/icon1.png', import.meta.url).href,
    name: '累计发电量',
    val: '5.872',
    unit: '万kWh',
  },
  {
    icon: new URL('@/assets/img/pv/icon2.png', import.meta.url).href,
    name: '日发电量',
    val: '62',
    unit: 'kWh',
  },
  {
    icon: new URL('@/assets/img/pv/icon3.png', import.meta.url).href,
    name: '光伏消纳比例',
    val: '75',
    unit: '%',
  },
])
let list2 = ref([
  {
    icon: new URL('@/assets/img/pv/icon4.png', import.meta.url).href,
    name: '上网电量',
    val: '587.2',
    unit: 'kWh',
  },
  {
    icon: new URL('@/assets/img/pv/icon5.png', import.meta.url).href,
    name: '发电效率',
    val: '82',
    unit: '%',
  },
  {
    icon: new URL('@/assets/img/pv/icon6.png', import.meta.url).href,
    name: '自用量',
    val: '75',
    unit: 'kWh',
  },
])
let titleList = ref([
  {
    name: '发电统计',
    active: true,
  },
  {
    name: '光伏消纳',
    active: false,
  },
])
listActive.value = list.value
const changeTitleActive = (activeIndex) => {
  titleList.value = titleList.value.map((item, index) => ({
    ...item,
    active: index === activeIndex,
  }))
  if (activeIndex == 0) {
    listActive.value = list.value
  } else {
    listActive.value = list2.value
  }
}
</script>
<template>
  <ktItem :titleList="titleList" @selectTitle="changeTitleActive">
    <div class="w-[100%] h-[245px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <div class="flex flex-col items-center justify-around w-[100%]" v-for="(item, i) in listActive" :key="item.name">
        <div
          class="w-[208.43px] h-[48.63px] flex items-center justify-center text-[28px] text-[rgba(255,255,255,0.8)] bg-[url('@/assets/img/situational_awareness/comp3-son-title.png')] bg-[length:100%_100%]"
        >
          {{ item.name }}
        </div>
        <div class="flex items-end">
          <p class="text-[50px] text-[#fff]">{{ item.val }}</p>
          <p class="text-[24px] text-[rgba(255,255,255,0.76)] font-[400] ml-[8px] mb-[10px]">{{ item.unit }}</p>
        </div>
        <div class="pv-icon-stage w-[108px] h-[108px] bg-[length:100%_100%] flex justify-center relative">
          <div class="pv-icon-glow"></div>
          <div class="pv-base-ring"></div>
          <div class="pv-top-ring">
            <div class="pv-segments">
              <i v-for="segment in 16" :key="segment" class="pv-seg" :style="{ '--a': `${(segment - 1) * 22.5}deg` }"></i>
            </div>
          </div>
          <img :src="item.icon" class="absolute top-[10px] z-[999] left-[8px]" />
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.pv-icon-stage {
  perspective: 420px;
}

.pv-icon-glow {
  position: absolute;
  width: 110px;
  height: 27px;
  top: 75px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(57, 178, 255, 0.45) 0%, rgba(57, 178, 255, 0.18) 38%, rgba(57, 178, 255, 0) 72%);
  filter: blur(5px);
  animation: pvGlowPulse 1.9s ease-out infinite;
}

.pv-base-ring {
  position: absolute;
  width: 108px;
  height: 108px;
  top: 20px;
  border-radius: 50%;
  transform: rotateX(68deg);
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 12px solid #329fdb;
    box-shadow:
      0 5px 11px rgba(31, 143, 211, 0.35),
      inset 0 -5px 9px rgba(8, 30, 46, 0.65);
    animation: pvSpreadFade 1.9s ease-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 12px;
    border-radius: 50%;
    background: rgba(22, 107, 177, 0.15);
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.55);
  }
}

.pv-top-ring {
  position: absolute;
  width: 104px;
  height: 104px;
  top: 15px;
  border-radius: 50%;
  transform: rotateX(68deg);
  transform-style: preserve-3d;
}

.pv-segments {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform-style: preserve-3d;
  animation: pvRotateRing 10.6s linear infinite;
}

.pv-seg {
  --a: 0deg;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 12px;
  margin-left: -7.5px;
  margin-top: -3.5px;
  background: linear-gradient(180deg, #1f75aa, #40b8f6);
  border-radius: 1px;
  transform: rotate(var(--a)) translateY(-37px) rotate(90deg);
  box-shadow: 0 0 5px rgba(45, 164, 235, 0.22);
}

@keyframes pvRotateRing {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(-360deg);
  }
}

@keyframes pvSpreadFade {
  0% {
    transform: scale(0.92);
    opacity: 0.65;
  }
  65% {
    transform: scale(1.16);
    opacity: 0.35;
  }
  100% {
    transform: scale(1.26);
    opacity: 0;
  }
}

@keyframes pvGlowPulse {
  0% {
    transform: scale(0.9);
    opacity: 0.55;
  }
  65% {
    transform: scale(1.25);
    opacity: 0.22;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
