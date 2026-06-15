<!--
 * @Author: 米龙
 * @Date: 2026-06-15 11:21:11
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    icon: 'bg-[url(@/assets/img/pv/comp1-icon1.png)]',
    name: '累计发电量',
    val: '5.872',
    unit: '万kWh',
  },
  {
    icon: 'bg-[url(@/assets/img/pv/comp1-icon2.png)]',
    name: '日发电量',
    val: '62',
    unit: 'kWh',
  },
  {
    icon: 'bg-[url(@/assets/img/pv/comp1-icon3.png)]',
    name: '光伏消纳比例',
    val: '75',
    unit: '%',
  },
])
</script>
<template>
  <ktItem :titleList="['节能减排']">
    <div class="w-[100%] h-[245px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <div class="flex flex-col items-center justify-around w-[100%]" v-for="(item, i) in list" :key="i">
        <div
          class="w-[208.43px] h-[48.63px] flex items-center justify-center text-[28px] text-[rgba(255,255,255,0.8)] bg-[url('@/assets/img/situational_awareness/comp3-son-title.png')] bg-[length:100%_100%]"
        >
          {{ item.name }}
        </div>
        <div class="flex items-end">
          <p class="text-[50px] text-[#fff]">{{ item.val }}</p>
          <p class="text-[24px] text-[rgba(255,255,255,0.76)] font-[400] ml-[8px] mb-[10px]">{{ item.unit }}</p>
        </div>
        <div class="w-[108px] h-[108px] bg-[length:100%_100%]" :class="item.icon"></div>
      </div>
    </div>
  </ktItem>
</template>
