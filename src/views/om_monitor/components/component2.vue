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
</script>
<template>
  <ktItem
    :titleList="['设备运行数据']"
    :sonTitleList="[
      {
        name: '列表详情',
        active: true,
        class: 'w-[100%]',
      },
    ]"
  >
    <div class="w-[100%] h-[390px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center justify-center">
      <div class="w-[708px] h-[364px]">
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
