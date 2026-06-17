<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import icon1 from '@/assets/img/hot_water/comp1-icon1.png'
import icon2 from '@/assets/img/hot_water/comp1-icon2.png'
import icon3 from '@/assets/img/hot_water/comp1-icon3.png'
import icon4 from '@/assets/img/hot_water/comp1-icon4.png'
const list = ref([
  {
    name: '累计供热量',
    val: '23.578',
    unit: '万kWh',
  },
  {
    name: '累计耗电量',
    val: '58.000',
    unit: '万kWh',
  },
  {
    name: '可再生能源占比',
    val: '45',
    unit: '%',
  },
  {
    name: '供热单耗',
    val: '58',
    unit: '万kWh',
  },
])
let iconBg = [
  'bg-[url(@/assets/img/hot_water/comp1-icon-bg1.png)]',
  'bg-[url(@/assets/img/hot_water/comp1-icon-bg1.png)]',
  'bg-[url(@/assets/img/hot_water/comp1-icon-bg2.png)]',
  'bg-[url(@/assets/img/hot_water/comp1-icon-bg2.png)]',
]
let icon = [icon1, icon2, icon3, icon4]
</script>
<template>
  <ktItem :titleList="['总功能耗']">
    <div
      class="hot-summary w-[100%] h-[258px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex flex-wrap items-center justify-between px-[41px] pt-[32px]"
    >
      <div class="flex items-center text-[#fff]" v-for="(item, i) in list" :key="i">
        <div class="relative w-[84px] h-[84px] bg-[length:100%_100%] flex items-center justify-center">
          <div class="rotate-animate absolute w-[84px] h-[84px] bg-[length:100%_100%]" :class="iconBg[i]"></div>

          <img class="absolute" :src="icon[i]" />
        </div>
        <div class="ml-[12px]">
          <div
            class="w-[220px] h-[36px] text-[28px] text-[rgba(255,255,255,0.8)] bg-[url('@/assets/img/hot_water/comp1-line.png')] bg-[length:100%_100%] flex items-center pl-[4px]"
          >
            {{ item.name }}
          </div>
          <div class="font-[D-DIN-PRO] flex items-end mt-[4px]">
            <p class="text-[40px]">{{ item.val }}</p>
            <p class="text-[24px] text-[rgba(255,255,255,0.8)] mb-[8px] ml-[6px]">{{ item.unit }}</p>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.rotate-animate {
  animation: rotateAnimate 3s linear infinite;
}
</style>
