<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import { useStore } from '@/stores/index'
let store = useStore()
let list = ref([
  {
    name: '热泵热水机',
    val: 2,
    unit: '台',
    bg: 'active1',
  },
  {
    name: '电锅炉',
    val: 2,
    unit: '台',
    bg: 'active1',
  },
  {
    name: '定频水泵',
    val: 2,
    unit: '台',
    bg: 'active1',
  },
  {
    name: '变频水泵',
    val: 2,
    unit: '台',
    bg: 'active2',
  },
  {
    name: '充电桩',
    val: 2,
    unit: '台',
    bg: 'active2',
  },
  {
    name: '空气源热泵机组',
    val: 2,
    unit: '台',
    bg: 'active2',
  },
])
const data = ref({
  columns: [
    {
      label: '编号',
      prop: 'k1',
      dir: 'center',
      width: 0.5,
    },
    {
      label: '设备类别',
      prop: 'k2',
      dir: 'center',
      width: 1.5,
    },
    {
      label: '设备名称',
      prop: 'k3',
      dir: 'center',
      width: 1,
    },
    {
      label: '设备编码',
      prop: 'k4',
      dir: 'center',
      width: 2,
    },
    {
      label: '维修状态',
      prop: 'k5',
      dir: 'center',
      width: 1,
    },
  ],
  data: [
    {
      k1: '1',
      k2: '地源热泵机 1#',
      k3: '地源主热泵',
      k4: 'KT-01-001',
      k5: '正常无维修',
    },
    {
      k1: '2',
      k2: '循环水泵',
      k3: '空调冷却循环泵',
      k4: 'SB-02-001',
      k5: '轴承异响待检修',
    },
    {
      k1: '3',
      k2: '多联机设备',
      k3: '办公区多联机外机 A1',
      k4: 'DL-03-001',
      k5: '正常无维修',
    },
    {
      k1: '4',
      k2: '新风设备',
      k3: '楼顶新风机 X1',
      k4: 'XF-05-001',
      k5: '滤网堵塞维保中',
    },
  ],
})
let changeSonTitleActive = () => {
  store.isPopListVisible = true
}
</script>
<template>
  <ktItem
    :titleList="['设备台账']"
    :sonTitleList="[
      {
        name: '列表详情',
        active: true,
        class: 'w-[100%]',
      },
    ]"
    @changeSonTitleActive="changeSonTitleActive"
  >
    <div class="w-[100%] h-[659px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] text-[#fff] px-[20px]">
      <div>
        <div class="flex justify-between text-[28px] w-[100%] mt-[7px]">
          <div class="flex items-center justify-between w-[256px] h-[52px] bg-[url('@/assets/img/om/comp1-box2.png')] bg-[length:100%_100%]">
            <p class="ml-[26px]">区域1</p>
            <div class="w-[15.23px] h-[9.21px] mr-[21px] bg-[url('@/assets/img/pull-down.png')] bg-[length:100%_100%]"></div>
          </div>
          <div class="flex items-center justify-between w-[425px] h-[52px] bg-[url('@/assets/img/om/comp1-box1.png')] bg-[length:100%_100%]">
            <p class="ml-[26px]">能源系统</p>
            <div class="w-[15.23px] h-[9.21px] mr-[21px] bg-[url('@/assets/img/pull-down.png')] bg-[length:100%_100%]"></div>
          </div>
        </div>
        <div class="w-[100%] flex flex-wrap justify-between">
          <div class="w-[216px] h-[85px] pl-[14px] mt-[17px] list" v-for="(item, i) in list" :class="item.bg">
            <p class="text-[28px]">{{ item.name }}</p>
            <div class="flex items-end">
              <P class="text-[34px]">{{ item.val }}</P>
              <P class="text-[20px] text-[rgba(255,255,255,0.76)] mb-[6px] ml-[16px]">{{ item.unit }}</P>
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[342px] mt-[18px]">
          <cus-table :columns="data.columns" :data="data.data" gap="0px" @click-row="getPopData">
            <template #k5-cell="{ val }">
              <div>
                <span class="kt-text-g-base text-bg-1 font-bold">{{ val }}</span>
              </div>
            </template>
          </cus-table>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  &.active1 {
    background: url(@/assets/img/om/comp1-box3.png) no-repeat;
    background-size: 100% 100%;
  }
  &.active2 {
    background: url(@/assets/img/om/comp1-box4.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
