<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    name: '设备未处理',
    val: 6,
    unit: '件',
    icon: 'active1',
  },
  {
    name: '设备已处理',
    val: 10,
    unit: '件',
    icon: 'active1',
  },
  {
    name: '监视已处理',
    val: 10,
    unit: '件',
    icon: 'active2',
  },
  {
    name: '设备未处理',
    val: 10,
    unit: '件',
    icon: 'active2',
  },
])
const data = ref({
  columns: [
    {
      label: '序号',
      prop: 'k1',
      dir: 'center',
      width: 0.5,
    },
    {
      label: '报警时间',
      prop: 'k2',
      dir: 'center',
      width: 2,
    },
    {
      label: '报警类型',
      prop: 'k3',
      dir: 'center',
      width: 1,
    },
    {
      label: '报警等级',
      prop: 'k4',
      dir: 'center',
      width: 1,
    },
    {
      label: '报警内容',
      prop: 'k5',
      dir: 'center',
      width: 1,
    },
  ],
  data: [
    {
      k1: '1',
      k2: '2026-06-04 08:12:35',
      k3: '设备报警',
      k4: '紧急',
      k5: '地源热泵高压故障',
    },
    {
      k1: '2',
      k2: '2026-06-04 09:05:18',
      k3: '参数报警',
      k4: '一般',
      k5: '热水储水温低于 42°C，低于设定下限值',
    },
    {
      k1: '3',
      k2: '2026-06-04 10:22:46',
      k3: '入侵报警',
      k4: '紧急',
      k5: '机房后门门禁非正常开门触发告警',
    },
    {
      k1: '4',
      k2: '2026-06-04 11:10:03',
      k3: '参数报警',
      k4: '预警',
      k5: '办公区多联机回风温度超设定上限',
    },
  ],
})
const getStatusTextClass = (status) => {
  const statusMap = new Map([
    ['紧急', 'text-[#FF4D4F]'],
    ['一般', 'text-[#FAAD14]'],
    ['预警', 'text-[#1890FF]'],
  ])
  return statusMap.get(status)
}
const loadRateOption = ref({
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: '41%',
      style: {
        text: '26',
        fill: '#fff',
        fontSize: 40,
        fontFamily: 'DINPro',
        fontWeight: 700,
      },
    },
    {
      type: 'text',
      left: '68%',
      top: '50%',
      style: {
        text: '件',
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
</script>
<template>
  <ktItem
    :titleList="['报警信息']"
    :sonTitleList="[
      {
        name: '列表详情',
        active: true,
        class: 'w-[100%]',
      },
    ]"
  >
    <div class="w-[100%] h-[697px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] px-[20px] pt-[23px] text-[#fff]">
      <div class="flex">
        <div class="w-[218px] h-[279px] bg-[url('@/assets/img/pv/comp3-e-box.png')] bg-[length:100%_100%] flex flex-col items-center text-[#fff]">
          <div
            class="relative w-[198px] h-[188px] bg-[url('@/assets/img/pv/comp3-e-test.png')] bg-[length:100%_100%] mt-[10px] flex items-center justify-center"
          >
            <div class="absolute left-[12px] top-[7px] w-[174px] h-[174px] bg-[url('@/assets/img/pv/comp3-e-bg.png')] bg-[length:100%_100%]">
              <kt-echart :option="loadRateOption" />
            </div>
          </div>
          <p class="son-title text-[36px] font-[700]">报警总数</p>
          <!-- <div class="flex items-end">
            <p class="text-[40px]">14.06</p>
            <p class="text-[24px] mb-[8px] ml-[8px]">kw</p>
          </div> -->
        </div>
        <div class="ml-[57px] flex flex-wrap justify-between">
          <div class="w-[156px] mb-[20px]" v-for="(item, i) in list">
            <p class="son-title2 text-[rgba(255,255,255,0.8)] text-[28px]" :class="item.icon">{{ item.name }}</p>
            <div class="flex items-end justify-between w-[100%]">
              <p class="text-[44px] font-[DINPro]">{{ item.val }}</p>
              <p class="text-[rgba(255,255,255,0.76)] text-[24px] mb-[6px] mr-[20px]">{{ item.unit }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[100%] h-[342px] mt-[27px]">
        <cus-table :columns="data.columns" :data="data.data" gap="0px" @click-row="getPopData">
          <template #k4-cell="{ val }">
            <div>
              <span class="kt-text-g-base text-bg-1 font-bold" :class="[getStatusTextClass(val)]">{{ val }}</span>
            </div>
          </template>
        </cus-table>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.son-title2 {
  position: relative;
  &.active1 {
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 8px;
      height: 24px;
      background: url(@/assets/img/air/comp1-icon3.png);
      left: -24px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &.active2 {
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 8px;
      height: 24px;
      background: url(@/assets/img/air/comp1-icon4.png);
      left: -24px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.son-title {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 30%, rgba(97, 171, 255, 1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
