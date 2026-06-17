<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    name: '冷热产出统计',
    values: [
      {
        label: '累计供热量',
        val: '12162.38',
        unit: 'kW',
      },
      {
        label: '瞬时冷热负荷',
        val: '272.3',
        unit: 'kW',
      },
      {
        label: '累计供热量',
        val: '12162.38',
        unit: 'kW',
      },
      {
        label: '瞬时冷热负荷',
        val: '272.3',
        unit: 'kW',
      },
    ],
  },
  {
    name: '系统用电统计',
    values: [
      {
        label: '累计耗电量',
        val: '42680.8',
        unit: 'kW',
      },
      {
        label: '日耗电量',
        val: '1352.6',
        unit: 'kW',
      },
      {
        label: '地源耗电量',
        val: '946.8',
        unit: 'kW',
      },
      {
        label: '地源空调占比',
        val: '75',
        unit: '%',
      },
    ],
  },
])
</script>
<template>
  <ktItem :titleList="['空调冷热能耗监测']">
    <div class="w-[100%] h-[693px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex flex-col text-[#fff] pt-[11px] pr-[24px]">
      <div class="list" v-for="(item, i) in list">
        <div class="line w-[207.79px] h-[68px] bg-[url('@/assets/img/air/comp1-icon1.png')] bg-[length:100%_100%] flex items-center">
          <p class="ml-[10px] text-[28px]">{{ item.name }}</p>
        </div>
        <div class="ml-[196px] flex flex-wrap justify-between">
          <div class="w-[236px] mb-[20px]" v-for="(items, j) in item.values" :key="j">
            <p class="son-title text-[rgba(255,255,255,0.8)] text-[28px]">{{ items.label }}</p>
            <div class="flex items-end justify-between w-[100%]">
              <p class="text-[44px] font-[DINPro]">{{ items.val }}</p>
              <p class="text-[rgba(255,255,255,0.76)] text-[24px] mb-[6px]">{{ items.unit }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.line {
  position: relative;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 519px;
    height: 12px;
    background: url(@/assets/img/air/comp1-line.png) no-repeat;
    background-size: 100% 100%;
    right: -538px;
  }
  &:nth-child(odd) {
  }
  &:nth-child(even) {
  }
}
.list {
  &:nth-child(odd) {
    .son-title {
      position: relative;
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
  }
  &:nth-child(even) {
    margin-top: 16px;
    .son-title {
      position: relative;
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
}
</style>
