<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const stats = ref([
  { name: '热水量温度', value: '38.2', unit: '℃', color: '#65f7de' },
  { name: '供水出水温度', value: '28.2', unit: '℃', color: '#43d7ff' },
  { name: '系统回水温度', value: '15.2', unit: '℃', color: '#9cff45' },
])

const option = ref({
  color: ['#67f8df', '#3ddcff', '#ecff50'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(2,18,42,0.9)',
    borderColor: 'rgba(70,185,255,0.6)',
    textStyle: { color: '#fff', fontSize: 24 },
  },
  legend: {
    top: 0,
    right: 8,
    itemWidth: 20,
    itemHeight: 10,
    textStyle: { color: 'rgba(255,255,255,0.78)', fontSize: 20 },
    data: ['热水量实时温度', '热水量实时温度', '供水出水温度'],
  },
  grid: {
    top: 54,
    left: 36,
    right: 18,
    bottom: 30,
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
    min: 0,
    max: 40,
    splitNumber: 4,
    axisLabel: { color: 'rgba(255,255,255,0.56)', fontSize: 16 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' } },
  },
  series: [
    {
      name: '热水量实时温度',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [34, 30, 34, 31, 32, 24],
    },
    {
      name: '热水量实时温度',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [29, 32, 30, 31, 32, 20],
    },
    {
      name: '供水出水温度',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3 },
      data: [15, 19, 19, 17, 16, 21],
    },
  ],
})
let sonTitleList = ref([
  {
    name: '温度',
    active: true,
    class: 'w-[50%]',
  },
  {
    name: '电量',
    active: false,
    class: 'w-[50%]',
  },
])
const changeSonTitleActive = (activeIndex) => {
  sonTitleList.value = sonTitleList.value.map((item, index) => ({
    ...item,
    active: index === activeIndex,
  }))
}
</script>
<template>
  <ktItem :titleList="['设备运行']" :sonTitleList="sonTitleList" @changeSonTitleActive="changeSonTitleActive">
    <div class="w-[100%] h-[460px] bg-[length:100%_100%] text-[#fff]">
      <div class="flex justify-between pl-[10px] w-[100%] h-[102px] bg-[url('@/assets/img/hot_water/comp3-list-bg.png')] bg-[length:100%_100%]">
        <div v-for="item in stats" :key="item.name" class="list w-[249px] h-[100px] pl-[34px]">
          <p class="text-[28px] text-[rgba(255, 255, 255, 0.8)] mt-[5px]">{{ item.name }}</p>
          <div class="flex items-end">
            <p class="text-[40px] font-[DINPro]">{{ item.value }}</p>
            <p class="text-[20px] text-[rgba(255, 255, 255, 0.76)] ml-[33px] mb-[6px]">{{ item.unit }}</p>
          </div>
        </div>
      </div>
      <div class="h-[352px] mt-[4px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%]">
        <ktEchart :option="option" />
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  position: relative;
  &:nth-child(odd) {
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 8px;
      height: 24px;
      left: 10px;
      top: 14px;
      background: url(@/assets/img/hot_water/comp3-list-icon1.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  &:nth-child(even) {
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 8px;
      height: 24px;
      left: 10px;
      top: 14px;
      background: url(@/assets/img/hot_water/comp3-list-icon2.png) no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
