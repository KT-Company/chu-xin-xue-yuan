<!--
 * @Author: 米龙
 * @Date: 2026-06-15 10:24:27
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp2-line-icon1.png)]',
    name: '多联机耗电额',
    val1: '2156.3',
    unit1: 'kWh',
    val2: '45',
    unit2: '%',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp2-line-icon2.png)]',
    name: '地热耗电总额',
    val1: '2156.3',
    unit1: 'kWh',
    val2: '45',
    unit2: '%',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp2-line-icon3.png)]',
    name: '其它',
    val1: '2156.3',
    unit1: 'kWh',
    val2: '45',
    unit2: '%',
  },
])
</script>
<template>
  <ktItem :titleList="['耗电情况']">
    <div class="w-[100%] h-[370px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <div
        class="w-[258.46px] h-[258.46px] ml-[33.85px] bg-[url('@/assets/img/situational_awareness/comp2-e-box.png')] bg-[length:100%_100%] relative flex items-centerc justify-center"
      >
        <div></div>
        <div class="flex flex-col items-center justify-center text-[#fff]">
          <p class="text-[40px]">7268.6</p>
          <p class="text-[24px]">kWh</p>
        </div>
      </div>
      <div class="ml-[61.69px]">
        <div v-for="(item, i) in list" :key="i">
          <div class="flex items-center">
            <div
              class="w-[24px] h-[24px] ml-[33.85px] bg-[url('@/assets/img/situational_awareness/comp2-line-icon1.png')] bg-[length:100%_100%]"
              :class="item.icon"
            ></div>
            <p class="list-title text-[28px] text-[rgba(255,255,255,0.8)] pl-[6px]">{{ item.name }}</p>
          </div>
          <div class="flex items-end text-[#fff]">
            <div class="w-[28px] h-[32px] ml-[33.85px] bg-[url('@/assets/img/situational_awareness/comp2-line-after.png')] bg-[length:100%_100%]"></div>
            <p class="text-[40px]">{{ item.val1 }}</p>
            <p class="text-[rgba(255,255,255,0.8)] text-[24px] ml-[4px] mr-[22px]">{{ item.unit1 }}</p>
            <p class="text-[40px]">{{ item.val2 }}</p>
            <p class="text-[24px]">{{ item.unit2 }}</p>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list-title {
  position: relative;
  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 196px;
    height: 28px;
    background: url(@/assets/img/situational_awareness/comp2-line.png);
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
  }
}
</style>
