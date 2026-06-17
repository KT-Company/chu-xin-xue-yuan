<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
import { useStore } from '@/stores/index'
let store = useStore()
const data = ref({
  columns: [
    {
      label: '序号',
      prop: 'k1',
      dir: 'center',
      width: 0.5,
    },
    {
      label: '设备名称',
      prop: 'k2',
      dir: 'center',
      width: 1.5,
    },
    {
      label: '设备编号',
      prop: 'k3',
      dir: 'center',
      width: 1,
    },
    {
      label: '所属区域',
      prop: 'k4',
      dir: 'center',
      width: 2,
    },
    {
      label: '运行状态',
      prop: 'k5',
      dir: 'center',
      width: 1,
    },
  ],
  data: [
    {
      k1: '1',
      k2: '地源主热泵 1#',
      k3: 'KT-01-001',
      k4: '主楼中央空调区',
      k5: '运行',
    },
    {
      k1: '2',
      k2: '地源主热泵 2#',
      k3: 'KT-01-002',
      k4: '主楼中央空调区',
      k5: '故障',
    },
    {
      k1: '3',
      k2: '空调循环水泵1#',
      k3: 'SB-02-001',
      k4: '机房换热区',
      k5: '运行',
    },
    {
      k1: '4',
      k2: '空调循环水泵 2#',
      k3: 'SB-02-002',
      k4: '机房换热区',
      k5: '停机',
    },
    {
      k1: '5',
      k2: '多联机外机 A1',
      k3: 'DL-03-001',
      k4: '一号办公区',
      k5: '运行',
    },
    {
      k1: '6',
      k2: '多联机外机 A2',
      k3: 'DL-03-002',
      k4: '一号办公区',
      k5: '运行',
    },
    {
      k1: '7',
      k2: '冷却补水泵',
      k3: 'BS-04-001',
      k4: '冷水机房',
      k5: '故障',
    },
    {
      k1: '8',
      k2: '楼顶新风机组 X1',
      k3: 'XF-05-001',
      k4: '二楼公共区域',
      k5: '停机',
    },
    {
      k1: '9',
      k2: '楼顶新风机组 X2',
      k3: 'XF-05-002',
      k4: '三楼公共区域',
      k5: '运行',
    },
    {
      k1: '10',
      k2: '空调电控配电柜',
      k3: 'PD-06-001',
      k4: '设备机房',
      k5: '运行',
    },
  ],
})
const getStatusTextClass = (status) => {
  const statusMap = new Map([
    ['运行', 'text-[#52C41A]'],
    ['故障', 'text-[#FF4D4F]'],
    ['停机', 'text-[#FAAD14]'],
  ])
  return statusMap.get(status)
}
let changeSonTitleActive = () => {
  store.isPopListVisible = true
}
</script>
<template>
  <ktItem
    :titleList="['设备运行状态']"
    :sonTitleList="[
      {
        name: '列表详情',
        active: true,
        class: 'w-[100%]',
      },
    ]"
    @changeSonTitleActive="changeSonTitleActive"
  >
    <div class="w-[100%] h-[739px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <cus-table :columns="data.columns" :data="data.data" gap="0px" @click-row="getPopData">
        <template #k5-cell="{ val }">
          <div>
            <span class="kt-text-g-base text-bg-1 font-bold" :class="[getStatusTextClass(val)]">{{ val }}</span>
          </div>
        </template>
      </cus-table>
    </div>
  </ktItem>
</template>
