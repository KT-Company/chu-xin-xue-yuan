<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import ktEchart from '@/components/utils-ui/kt-echart.vue'

const loadRateOption = ref({
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: '41%',
      style: {
        text: '42.81',
        fill: '#fff',
        fontSize: 30,
        fontFamily: 'DINPro',
        fontWeight: 700,
      },
    },
    {
      type: 'text',
      left: '74%',
      top: '45%',
      style: {
        text: '%',
        fill: '#fff',
        fontSize: 20,
        fontFamily: 'SHSCN',
        fontWeight: 700,
      },
    },
  ],
  series: [
    {
      name: '负荷率',
      type: 'pie',
      clockwise: true,
      startAngle: 205,
      radius: ['98%', '90%'],
      center: ['50%', '50%'],
      label: { show: false },
      labelLine: { show: false },
      data: [
        {
          name: '负荷率',
          value: 42,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#90BCFE' },
                { offset: 1, color: 'rgba(28, 135, 130, 0)' },
              ],
            },
          },
        },
        { name: '剩余', value: 58, itemStyle: { color: 'rgba(75, 196, 245, 0)' }, tooltip: { show: false } },
      ],
    },
  ],
})
let list = ref([
  {
    name: '系统可用率',
    val: '33%',
    width: '30%',
  },
  {
    name: '日等效发电小时数',
    val: '3h',
    width: '40%',
  },
  {
    name: '系统效能',
    val: '77.8%',
    width: '50%',
  },
])
</script>
<template>
  <ktItem :titleList="['综合评价']">
    <div class="w-[100%] h-[349px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center justify-around">
      <div class="flex flex-col justify-between h-[296px]">
        <div class="list" v-for="(item, i) in list" :key="i">
          <div class="flex justify-between text-[28px]">
            <p class="font-[400] text-[rgba(255,255,255,0.8)]">{{ item.name }}</p>
            <p class="font-[500] text-[#fff]">{{ item.val }}</p>
          </div>
          <div class="w-[460px] h-[26px] bg-[rgba(255,255,255,0.1)] flex items-center mt-[8px]">
            <div class="list-line w-[109.71px] h-[12.91px] relative" :style="'width:' + item.width"></div>
          </div>
        </div>
      </div>
      <div class="w-[218px] h-[296px] bg-[url('@/assets/img/pv/comp3-e-box.png')] bg-[length:100%_100%] flex flex-col items-center text-[#fff]">
        <div class="relative w-[198px] h-[188px] bg-[url('@/assets/img/pv/comp3-e-test.png')] bg-[length:100%_100%] mt-[10px] flex items-center justify-center">
          <div class="absolute left-[12px] top-[7px] w-[174px] h-[174px] bg-[url('@/assets/img/pv/comp3-e-bg.png')] bg-[length:100%_100%]">
            <ktEchart :option="loadRateOption" />
          </div>
        </div>
        <p class="son-title text-[36px] font-[700]">负荷率</p>
        <div class="flex items-end">
          <p class="text-[40px]">14.06</p>
          <p class="text-[24px] mb-[8px] ml-[8px]">kw</p>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  &:nth-child(odd) {
    .list-line {
      background-image: linear-gradient(to right, rgba(26, 54, 50, 0.49) 30%, rgba(97, 171, 255, 1) 100%);
    }
  }
  &:nth-child(even) {
    .list-line {
      background-image: linear-gradient(to right, rgba(26, 54, 50, 0.49) 30%, rgba(91, 245, 191, 1) 100%);
    }
  }
  .list-line {
    &::after {
      position: absolute;
      display: block;
      content: '';
      width: 5.16px;
      height: 20.65px;
      background: url(@/assets/img/pv/comp3-line-icon.png) no-repeat;
      background-size: 100% 100%;
      top: 50%;
      transform: translateY(-50%);
      right: 0%;
    }
  }
}
.son-title {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 30%, rgba(97, 171, 255, 1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.rotate-animate {
  animation: rotateAnimate 3s linear infinite;
}
</style>
