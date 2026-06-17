<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const option = ref({
  color: ['#48e6ff', '#438dff', '#63f59e'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(2,18,42,0.9)',
    borderColor: 'rgba(70,185,255,0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 0,
    right: 6,
    itemWidth: 18,
    itemHeight: 8,
    textStyle: { color: 'rgba(255,255,255,0.78)', fontSize: 18 },
    data: ['今日', '昨日', '预测'],
  },
  grid: {
    top: 50,
    left: 40,
    right: 20,
    bottom: 28,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '06:00', '08:00', '10:00', '18:00', '24:00'],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.56)', fontSize: 16 },
  },
  yAxis: {
    type: 'value',
    name: 'kW',
    min: 0,
    max: 100,
    nameTextStyle: { color: 'rgba(255,255,255,0.72)', fontSize: 18, align: 'right' },
    axisLabel: { color: 'rgba(255,255,255,0.56)', fontSize: 16 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' } },
  },
  series: [
    {
      name: '今日',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [76, 70, 82, 71, 78, 64],
    },
    {
      name: '昨日',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [34, 38, 40, 32, 30, 38],
    },
    {
      name: '预测',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [72, 66, 70, 69, 73, 58],
    },
  ],
})
</script>
<template>
  <ktItem :titleList="['供热负荷']">
    <div class="w-[100%] h-[360px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] px-[34px] py-[20px] text-[#fff]">
      <ktEchart :option="option" />
    </div>
  </ktItem>
</template>
