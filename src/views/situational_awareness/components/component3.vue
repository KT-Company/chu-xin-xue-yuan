<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const option = ref({
  color: ['#67e6ff', '#25f4a3'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 18,
    left: 'center',
    itemWidth: 18,
    itemHeight: 4,
    icon: 'rect',
    itemGap: 54,
    textStyle: { color: 'rgba(255, 255, 255, 0.86)', fontSize: 18 },
    data: ['进水温度', '出水温度'],
  },
  grid: {
    top: 72,
    left: 76,
    right: 38,
    bottom: 58,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '06:00', '08:00', '10:00', '18:00', '24:00'],
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.24)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255, 255, 255, 0.72)', fontSize: 18, margin: 14 },
  },
  yAxis: {
    type: 'value',
    name: '℃',
    min: 0,
    max: 80,
    splitNumber: 4,
    nameTextStyle: { color: 'rgba(255, 255, 255, 0.72)', fontSize: 18, padding: [0, 28, 0, 0] },
    axisLabel: { color: 'rgba(255, 255, 255, 0.72)', fontSize: 18 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'dashed' } },
  },
  series: [
    {
      name: '进水温度',
      type: 'line',
      symbol: 'none',
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(103, 230, 255, 0.18)' },
      data: [28, 38, 53, 46, 57, 72],
    },
    {
      name: '出水温度',
      type: 'line',
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [18, 35, 8, 31, 46, 24],
    },
  ],
})
</script>
<template>
  <ktItem :titleList="['热泵实时监测']">
    <div class="w-[100%] h-[383px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%]">
      <ktEchart :option="option" />
    </div>
  </ktItem>
</template>
