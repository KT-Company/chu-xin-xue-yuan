<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    icon: 'bg-[url(@/assets/img/pv/comp4-line1.png)]',
    name: '设备报警',
    state1: '未处理',
    val1: '12',
    state2: '处理中',
    val2: '12',
    state3: '已恢复',
    val3: '8',
  },
  {
    icon: 'bg-[url(@/assets/img/pv/comp4-line2.png)]',
    name: '入侵报警',
    state1: '未处理',
    val1: '12',
    state2: '处理中',
    val2: '12',
    state3: '已恢复',
    val3: '8',
  },
  {
    icon: 'bg-[url(@/assets/img/pv/comp4-line3.png)]',
    name: '参数报警',
    state1: '未处理',
    val1: '12',
    state2: '处理中',
    val2: '12',
    state3: '已恢复',
    val3: '8',
  },
])
</script>
<template>
  <ktItem :titleList="['重点监控']">
    <div class="w-[100%] h-[410px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex items-center justify-around">
      <div class="list w-[232px] h-[374px] flex pt-[16px] pl-[16px] text-[#fff]" v-for="(item, i) in list" :key="i">
        <div class="w-[56px] h-[342px] bg-[url('@/assets/img/pv/comp4-line1.png')] bg-[length:100%_100%]" :class="item.icon"></div>
        <div>
          <p class="text-[28px]">{{ item.name }}</p>
          <div class="mt-[10px]">
            <div class="flex items-center justify-center w-[98.63px] h-[34px] bg-[url('@/assets/img/pv/comp4-state1.png')] bg-[length:100%_100%] text-[24px]">
              未处理
            </div>
            <p class="text-[40px]">{{ item.val1 }}</p>
          </div>
          <div class="mt-[10px]">
            <div class="flex items-center justify-center w-[98.63px] h-[34px] bg-[url('@/assets/img/pv/comp4-state2.png')] bg-[length:100%_100%] text-[24px]">
              处理中
            </div>
            <p class="text-[40px]">{{ item.val2 }}</p>
          </div>
          <div class="mt-[10px]">
            <div class="flex items-center justify-center w-[98.63px] h-[34px] bg-[url('@/assets/img/pv/comp4-state3.png')] bg-[length:100%_100%] text-[24px]">
              已恢复
            </div>
            <p class="text-[40px]">{{ item.val3 }}</p>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  &:nth-child(odd) {
    background: url(@/assets/img/pv/comp4-box1.png) no-repeat;
    background-size: 100% 100%;
  }
  &:nth-child(even) {
    background: url(@/assets/img/pv/comp4-box2.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
