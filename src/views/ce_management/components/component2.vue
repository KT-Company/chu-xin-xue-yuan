<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const option = ref({
  color: ['#3d7df4', '#42e6cf'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 16,
    right: 28,
    itemWidth: 16,
    itemHeight: 16,
    itemGap: 22,
    textStyle: { color: '#fff', fontSize: 16 },
    data: ['直接碳排', '间接碳排'],
  },
  grid: {
    top: 58,
    left: 54,
    right: 24,
    bottom: 42,
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.28)' } },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 16, margin: 12 },
  },
  yAxis: {
    type: 'value',
    name: '万kgCO₂',
    min: 0,
    max: 1000,
    splitNumber: 5,
    nameTextStyle: { color: 'rgba(255,255,255,0.82)', fontSize: 16, padding: [0, 22, 0, 0] },
    axisLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 16 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed' } },
  },
  series: [
    {
      name: '直接碳排',
      type: 'bar',
      barWidth: 18,
      data: [620, 380, 510, 850, 720, 710, 820],
    },
    {
      name: '间接碳排',
      type: 'bar',
      barWidth: 18,
      data: [560, 530, 930, 620, 360, 950, 500],
    },
  ],
})
</script>
<template>
  <ktItem :titleList="['碳管理']">
    <div class="w-[100%] h-[291px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <div class="w-[100%] h-[276px] bg-[length:100%_100%]">
        <ktEchart :option="option" />
      </div>
    </div>
  </ktItem>
</template>
