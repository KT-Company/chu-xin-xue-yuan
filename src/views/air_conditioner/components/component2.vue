<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon3.png)]',
    name: '综合单耗',
    val: 0.44,
    unit: '(tCO₂)',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon2.png)]',
    name: '冷单耗',
    val: 0.44,
    unit: '(tCO₂)',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon1.png)]',
    name: '热单耗',
    val: 0.44,
    unit: '(tCO₂)',
  },
])
</script>
<template>
  <ktItem :titleList="['地源能效单耗统计']">
    <div class="w-[100%] h-[308px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center">
      <div class="flex ml-[27px]">
        <div class="list flex flex-col items-center w-[196px] h-[268px] text-[24px] text-[rgba(255,255,255,0.8)] mr-[52px]" v-for="(item, i) in list" :key="i">
          <div class="w-[92px] h-[92px] bg-[length:100%_100%] mt-[35px]" :class="item.icon"></div>
          <p class="text-[#fff] text-[44px] font-[DINPro]">{{ item.val }}</p>
          <p class="">{{ item.name }}</p>
          <p class="">{{ item.unit }}</p>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  background-size: 100% 100%;
  &:nth-child(odd) {
    background: url(@/assets/img/situational_awareness/comp1-box1.png) no-repeat;
  }
  &:nth-child(even) {
    background: url(@/assets/img/situational_awareness/comp1-box2.png) no-repeat;
  }
}
</style>
