<!--
 * @Author: 米龙
 * @Date: 2026-06-15 11:21:11
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const timeList = ['00:00', '06:00', '08:00', '10:00', '18:00', '24:00']
const lineOption = ref({
  color: ['#69f7ff', '#e7ff4f'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 16,
    left: 'center',
    itemWidth: 18,
    itemHeight: 4,
    icon: 'rect',
    itemGap: 62,
    textStyle: { color: '#fff', fontSize: 24 },
    data: ['温度', '湿度'],
  },
  grid: {
    top: 92,
    left: 66,
    right: 64,
    bottom: 54,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: timeList,
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.32)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22, margin: 16 },
  },
  yAxis: [
    {
      type: 'value',
      name: '℃',
      min: 0,
      max: 40,
      splitNumber: 4,
      nameTextStyle: { color: '#fff', fontSize: 22, padding: [0, 34, 0, 0] },
      axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed' } },
    },
    {
      type: 'value',
      name: '%',
      min: 0,
      max: 100,
      splitNumber: 4,
      nameTextStyle: { color: '#fff', fontSize: 22, padding: [0, 0, 0, 34] },
      axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: '温度',
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 4 },
      itemStyle: { borderWidth: 0 },
      data: [32, 33, 37, 32, 34, 25],
    },
    {
      name: '湿度',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 4 },
      itemStyle: { borderWidth: 0 },
      data: [45, 58, 57, 51, 48, 57],
    },
  ],
})
const barOption = ref({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  grid: {
    top: 68,
    left: 66,
    right: 34,
    bottom: 68,
  },
  xAxis: {
    type: 'category',
    data: timeList,
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.32)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22, margin: 18 },
  },
  yAxis: {
    type: 'value',
    name: 'W/m³',
    min: 0,
    max: 800,
    splitNumber: 4,
    nameTextStyle: { color: '#fff', fontSize: 22, padding: [0, 28, 16, 0] },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed' } },
  },
  series: [
    {
      name: '太阳辐射',
      type: 'bar',
      barWidth: 26,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#77fbff' },
            { offset: 0.45, color: 'rgba(75, 226, 224, 0.72)' },
            { offset: 1, color: 'rgba(39, 168, 176, 0.08)' },
          ],
        },
      },
      data: [650, 770, 620, 540, 530, 500],
    },
  ],
})
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
    <div class="w-[100%] h-[504px] bg-[url(@/assets/img/item-box.png)] bg-[length:100%_100%] mt-[22px]">
      <ktEchart :option="lineOption" />
    </div>
    <div class="w-[100%] h-[494px] bg-[url(@/assets/img/item-box.png)] bg-[length:100%_100%]">
      <ktEchart :option="barOption" />
    </div>
  </ktItem>
</template>
<style scoped lang="less"></style>
