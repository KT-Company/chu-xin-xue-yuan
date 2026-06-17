<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
const option = ref({
  color: ['#69f7ff', '#e7ff4f', '#4df2a2'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 20,
    left: 'center',
    itemWidth: 28,
    itemHeight: 4,
    icon: 'rect',
    itemGap: 58,
    textStyle: { color: '#fff', fontSize: 24 },
    data: ['今日', '昨日', '预测'],
  },
  grid: {
    top: 92,
    left: 78,
    right: 42,
    bottom: 58,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '06:00', '08:00', '10:00', '18:00', '24:00'],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22, margin: 16 },
  },
  yAxis: {
    type: 'value',
    name: '℃',
    min: 0,
    max: 100,
    splitNumber: 4,
    nameTextStyle: { color: '#fff', fontSize: 22, padding: [0, 34, 0, 0] },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 22 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed' } },
  },
  series: [
    {
      name: '今日',
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 4 },
      itemStyle: { borderWidth: 0 },
      data: [88, 90, 99, 86, 80, 68],
    },
    {
      name: '昨日',
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 4 },
      itemStyle: { borderWidth: 0 },
      data: [49, 61, 60, 53, 51, 59],
    },
    {
      name: '预测',
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 4 },
      itemStyle: { borderWidth: 0 },
      data: [94, 84, 84, 90, 90, 84],
    },
  ],
})
const sonTitleList = ref([
  {
    name: '供热',
    active: true,
    class: 'w-[50%]',
  },
  {
    name: '供冷',
    active: false,
    class: 'w-[50%]',
  },
])

const changeSonTitleActive = activeIndex => {
  sonTitleList.value = sonTitleList.value.map((item, index) => ({
    ...item,
    active: index === activeIndex,
  }))
}
</script>
<template>
  <ktItem :titleList="['供冷热负荷']" :sonTitleList="sonTitleList" @changeSonTitleActive="changeSonTitleActive">
    <div class="w-[100%] h-[468px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <kt-echart :option="option" />
    </div>
  </ktItem>
</template>
