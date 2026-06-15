<!--
 * @Author: 米龙
 * @Date: 2026-06-15 11:21:11
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    name: '室外温度',
    val: 18.2,
    unit: '℃',
  },
  {
    name: '室外湿度',
    val: 62.3,
    unit: '%',
  },
  {
    name: '太阳辐射',
    val: 120,
    unit: 'W/㎡',
  },
])
let bgList = [
  'bg-[url(@/assets/img/situational_awareness/comp3-content1.png)]',
  'bg-[url(@/assets/img/situational_awareness/comp3-content2.png)]',
  'bg-[url(@/assets/img/situational_awareness/comp3-content3.png)]',
]
</script>
<template>
  <ktItem :titleList="['气象实时监测']">
    <div class="w-[100%] flex items-center">
      <div class="flex justify-between w-[100%] mt-[20px]">
        <div class="relative w-[236px] h-[116px] bg-[length:100%_100%]" v-for="(item, i) in list" :class="bgList[i]">
          <p class="text-[28px] text-[rgba(255,255,255,0.8)] mt-[10px] ml-[18px]">{{ item.name }}</p>
          <div class="flex items-end font-[500] text-[#fff] ml-[26px]">
            <p class="text-[40px]">{{ item.val }}</p>
            <span class="text-[24px] mb-[8px] ml-[8px]">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[100%] h-[504px] bg-[url(@/assets/img/situational_awareness/comp5-e1.png)] bg-[length:100%_100%] mt-[22px]"></div>
    <div class="2-[100%] h-[494px] bg-[url(@/assets/img/situational_awareness/comp5-e2.png)] bg-[length:100%_100%]"></div>
  </ktItem>
</template>
<style scoped lang="less"></style>
