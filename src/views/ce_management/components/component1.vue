<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const carbonEmissionOption = ref({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
    formatter: (params) => `${params.name}<br/>占比：${params.value}%`,
  },
  series: [
    {
      name: '碳排',
      type: 'pie',
      clockwise: true,
      startAngle: 90,
      radius: ['100%', '90%'],
      center: ['50%', '50%'],
      label: { show: false },
      labelLine: { show: false },
      data: [
        { name: '园区非供暖碳排', value: 20, itemStyle: { color: '#0091EB' } },
        { name: '充电桩碳排', value: 20, itemStyle: { color: '#E9A84C' } },
        { name: '园区供暖碳排', value: 20, itemStyle: { color: '#6EF8FA' } },
        { name: '厨房燃气碳排', value: 20, itemStyle: { color: '#D0F13F' } },
        { name: '燃油汽车碳排', value: 20, itemStyle: { color: '#52DE8C' } },
      ],
    },
  ],
})
const carbonReductionOption = ref({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
    formatter: (params) => `${params.name}<br/>占比：${params.value}%`,
  },
  series: [
    {
      name: '降碳',
      type: 'pie',
      clockwise: true,
      startAngle: 90,
      radius: ['100%', '90%'],
      center: ['50%', '50%'],
      label: { show: false },
      labelLine: { show: false },
      data: [
        { name: '绿电', value: 79, itemStyle: { color: '#0091EB' } },
        { name: '绿植', value: 3, itemStyle: { color: '#E9A84C' } },
        { name: '光伏', value: 3, itemStyle: { color: '#6EF8FA' } },
        { name: 'CER', value: 3, itemStyle: { color: '#D0F13F' } },
        { name: '光热', value: 3, itemStyle: { color: '#52DE8C' } },
        { name: 'CCER', value: 3, itemStyle: { color: '#FFFFFF' } },
        { name: '绿证', value: 3, itemStyle: { color: '#C3FFB0' } },
        { name: '绿建节能', value: 3, itemStyle: { color: '#B8B8B8' } },
      ],
    },
  ],
})
let list1 = ref([
  {
    name: '园区非供暖碳排',
    val: 20,
  },
  {
    name: '充电桩碳排',
    val: 20,
  },
  {
    name: '园区供暖碳排',
    val: 20,
  },
  {
    name: '厨房燃气碳排',
    val: 20,
  },
  {
    name: '燃油汽车碳排',
    val: 20,
  },
])
let list2 = ref([
  {
    name: '绿电',
    val: 79,
  },
  {
    name: '绿植',
    val: 3,
  },
  {
    name: '光伏',
    val: 3,
  },
  {
    name: 'CER',
    val: 3,
  },
  {
    name: '光热',
    val: 3,
  },
  {
    name: 'CCER',
    val: 3,
  },
  {
    name: '绿证',
    val: 3,
  },
  {
    name: '绿建节能',
    val: 3,
  },
])
let colorList = {
  0: 'border-[#0091EB]',
  1: 'border-[#E9A84C]',
  2: 'border-[#6EF8FA]',
  3: 'border-[#D0F13F]',
  4: 'border-[#52DE8C]',
  5: 'border-[#FFFFFF]',
  6: 'border-[#C3FFB0]',
  7: 'border-[#B8B8B8]',
}
</script>
<template>
  <ktItem :titleList="['碳管理']">
    <div class="w-[100%] h-[653px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] text-[#fff]">
      <div>
        <div class="flex items-center justify-between text-[28px] font-[500]">
          <div class="w-[130px] h-[68px] bg-[url('@/assets/img/ce/comp1-icon1.png')] bg-[length:100%_100%] flex items-center pl-[18px]">碳 排</div>
          <div class="w-[590px] h-[12px] bg-[url('@/assets/img/ce/comp1-line.png')] bg-[length:100%_100%]"></div>
        </div>
        <div class="ml-[27px] flex items-center justify-between">
          <div class="left">
            <div class="w-[200px] h-[200px] relative flex justify-center items-center">
              <div class="w-[200px] h-[200px]">
                <ktEchart :option="carbonEmissionOption" />
              </div>
              <div class="w-[168px] h-[168px] flex justify-center items-center bg-[url('@/assets/img/ce/public-box.png')] bg-[length:100%_100%] absolute">
                <div class="flex flex-col items-center">
                  <p class="font-[500] text-[40px] font-[D-DIN-PRO]">69.01</p>
                  <p class="font-[500] text-[24px] font-[D-DIN-PRO]">tCO₂</p>
                </div>
              </div>
            </div>
          </div>
          <div class="right flex flex-wrap ml-[31px] w-[460px]">
            <div v-for="(item, i) in list1" :key="i" class="w-[50%]">
              <div class="flex items-center">
                <div class="w-[20px] h-[20px] rounded-[50%] border-[6px] border-solid bg-[transparent]" :class="colorList[i]"></div>
                <p class="son-title pl-[7px] text-[28px]">{{ item.name }}</p>
              </div>
              <div class="flex items-center">
                <div class="w-[28px] h-[32px] bg-[url('@/assets/img/ce/comp1-list-line.png')] bg-[length:100%_100%]"></div>
                <div class="flex items-end">
                  <p class="text-[40px] font-[400] font-[D-DIN-PRO]">{{ item.val }}</p>
                  <p class="text-[24px] font-[400] ml-[8px] mb-[8px] font-[D-DIN-PRO]">%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between text-[28px] font-[500]">
          <div class="w-[130px] h-[68px] bg-[url('@/assets/img/ce/comp1-icon2.png')] bg-[length:100%_100%] flex items-center pl-[18px]">降 碳</div>
          <div class="w-[590px] h-[12px] bg-[url('@/assets/img/ce/comp1-line.png')] bg-[length:100%_100%]"></div>
        </div>
        <div class="flex ml-[37px]">
          <div class="left flex flex-wrap w-[439px] justify-between mr-[47px]">
            <div class="flex items-center" v-for="(item, i) in list2" :key="i">
              <div class="w-[20px] h-[20px] rounded-[50%] border-[4px] border-solid bg-[transparent]" :class="colorList[i]"></div>
              <div class="w-[174px] flex justify-between">
                <p class="text-[28px] pl-[14px] son2-title">{{ item.name }}</p>
                <p class="text-[24px] font-[D-DIN-PRO]">{{ item.val }}%</p>
              </div>
            </div>
          </div>
          <div class="w-[200px] h-[200px] relative flex justify-center items-center">
            <div class="w-[200px] h-[200px] absolute">
              <ktEchart :option="carbonReductionOption" />
            </div>
            <div class="w-[168px] h-[168px] flex justify-center items-center bg-[url('@/assets/img/ce/public-box.png')] bg-[length:100%_100%] absolute">
              <div class="flex flex-col items-center">
                <p class="font-[500] text-[40px] font-[D-DIN-PRO]">1.22</p>
                <p class="font-[500] text-[24px] font-[D-DIN-PRO]">tCO₂</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.son-title {
  position: relative;
  &::after {
    display: block;
    content: '';
    position: absolute;
    width: 185.77px;
    height: 28px;
    border-radius: 66px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.3) 20%, rgba(217, 217, 217, 0) 100%);
    left: 0%;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
  }
}
.son2-title {
  position: relative;
  &::after {
    display: block;
    content: '';
    position: absolute;
    width: 102px;
    height: 40px;
    border-radius: 66px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.3) 20%, rgba(217, 217, 217, 0) 100%);
    left: 0%;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
  }
}
</style>
