<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const option = ref({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(3, 17, 35, 0.9)',
    borderColor: 'rgba(99, 219, 255, 0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
    formatter: (params) => `${params.name}<br/>数值：${params.value || ''}`,
  },
  series: [
    {
      type: 'sankey',
      left: 10,
      right: 96,
      top: 28,
      bottom: 28,
      nodeGap: 10,
      nodeWidth: 12,
      draggable: false,
      layoutIterations: 0,
      emphasis: { focus: 'adjacency' },
      label: {
        color: '#fff',
        fontSize: 16,
        position: 'insideLeft',
      },
      lineStyle: {
        color: 'source',
        opacity: 0.52,
        curveness: 0.5,
      },
      data: [
        { name: '园区非供暖碳排', itemStyle: { color: '#3879f2' } },
        { name: '充电桩碳排', itemStyle: { color: '#3459d7' } },
        { name: '园区供暖碳排', itemStyle: { color: '#0ecad4' } },
        { name: '厨房燃气碳排', itemStyle: { color: '#d5e93d' } },
        { name: '燃油汽车碳排', itemStyle: { color: '#46df85' } },
        { name: '间接碳排', itemStyle: { color: '#e24949' } },
        { name: '直接碳排', itemStyle: { color: '#f0a33d' } },
        { name: '累计碳排', itemStyle: { color: 'rgba(255,255,255,0)' }, label: { color: '#fff', position: 'right', distance: 10 } },
        { name: '绿建节能', itemStyle: { color: '#1a8fe6' } },
        { name: '光伏系统', itemStyle: { color: '#3a75ff' } },
        { name: '光热系统', itemStyle: { color: '#4ee0d0' } },
        { name: '绿证购碳', itemStyle: { color: '#49df88' } },
        { name: '碳建购碳', itemStyle: { color: '#7e57f6' } },
        { name: 'CER降碳', itemStyle: { color: '#5f55db' } },
        { name: 'CLIR降碳', itemStyle: { color: '#4c4ed0' } },
        { name: '自身降碳', itemStyle: { color: '#23c79a' } },
        { name: '外购降碳', itemStyle: { color: '#8756f5' } },
        { name: '累计降碳', itemStyle: { color: 'rgba(255,255,255,0)' }, label: { color: '#fff', position: 'right', distance: 10 } },
      ],
      links: [
        { source: '园区非供暖碳排', target: '间接碳排', value: 18 },
        { source: '充电桩碳排', target: '间接碳排', value: 12 },
        { source: '园区供暖碳排', target: '间接碳排', value: 16 },
        { source: '厨房燃气碳排', target: '直接碳排', value: 14 },
        { source: '燃油汽车碳排', target: '直接碳排', value: 16 },
        { source: '间接碳排', target: '累计碳排', value: 46 },
        { source: '直接碳排', target: '累计碳排', value: 30 },
        { source: '绿建节能', target: '自身降碳', value: 16 },
        { source: '光伏系统', target: '自身降碳', value: 18 },
        { source: '光热系统', target: '自身降碳', value: 14 },
        { source: '绿证购碳', target: '自身降碳', value: 16 },
        { source: '碳建购碳', target: '外购降碳', value: 10 },
        { source: 'CER降碳', target: '外购降碳', value: 8 },
        { source: 'CLIR降碳', target: '外购降碳', value: 8 },
        { source: '自身降碳', target: '累计降碳', value: 64 },
        { source: '外购降碳', target: '累计降碳', value: 26 },
      ],
    },
  ],
})
</script>
<template>
  <ktItem :titleList="['碳管理']">
    <div class="w-[100%] h-[525px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center justify-center">
      <div class="w-[709px] h-[510px] bg-[length:100%_100%]">
        <ktEchart :option="option" />
      </div>
    </div>
  </ktItem>
</template>
