<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
const data = ref({
  columns: [
    {
      label: '序号',
      prop: 'k1',
      dir: 'center',
      width: 0.5,
    },
    {
      label: '设备类型',
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
      label: '维保周期',
      prop: 'k4',
      dir: 'center',
      width: 1,
    },
    {
      label: '下次维保时间',
      prop: 'k5',
      dir: 'center',
      width: 2,
    },
  ],
  data: [
    {
      k1: '1',
      k2: '地源热泵机组',
      k3: '1# 主地源热泵',
      k4: '90 天',
      k5: '2026-07-22',
    },
    {
      k1: '2',
      k2: '循环水泵',
      k3: '空调冷却循环泵 1#',
      k4: '30 天',
      k5: '2026-06-28',
    },
    {
      k1: '3',
      k2: '多联机',
      k3: '一号办公区多联机外机 A2',
      k4: '180 天',
      k5: '2026-11-15',
    },
    {
      k1: '4',
      k2: '新风设备',
      k3: '楼顶新风机 X1',
      k4: '60 天',
      k5: '2026-07-18',
    },
  ],
})
</script>
<template>
  <ktItem
    :titleList="['设备维修']"
    :sonTitleList="[
      {
        name: '列表详情',
        active: true,
        class: 'w-[100%]',
      },
    ]"
  >
    <div class="w-[100%] h-[390px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center justify-center">
      <div class="w-[708px] h-[342px]">
        <cus-table :columns="data.columns" :data="data.data" gap="0px" @click-row="getPopData">
          <template #k5-cell="{ val }">
            <div>
              <span class="kt-text-g-base text-bg-1 font-bold">{{ val }}</span>
            </div>
          </template>
        </cus-table>
      </div>
    </div>
  </ktItem>
</template>
