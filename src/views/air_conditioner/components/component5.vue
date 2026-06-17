<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'

const list = ref([
  {
    name: '设备报警',
    type: 'device',
    values: [
      { label: '未处理', value: 12, state: 'todo' },
      { label: '处理中', value: 12, state: 'doing' },
      { label: '已恢复', value: 12, state: 'done' },
    ],
  },
  {
    name: '参数报警',
    type: 'param',
    values: [
      { label: '未处理', value: 12, state: 'todo' },
      { label: '处理中', value: 12, state: 'doing' },
      { label: '已恢复', value: 12, state: 'done' },
    ],
  },
])
</script>
<template>
  <ktItem :titleList="['重点监控']">
    <div class="w-[100%] h-[365px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex flex-col justify-center px-[34px] text-[#fff]">
      <div class="line w-[688px] h-[138px] bg-[length:100%_100%] relative pl-[72px] pt-[16px] mb-[14px]" v-for="(item, i) in list" :key="i">
        <p class="text-[28px] font-[Noto-Sans-SC]">{{ item.name }}</p>
        <div class="flex items-center mt-[8px]">
          <div class="flex items-center mr-[20px]" v-for="(items, j) in item.values" :key="j">
            <div class="w-[100px] h-[40px] rounded-[4px] border-[4px] flex items-center justify-center text-[24px] font-[Noto-Sans-SC]" :class="items.state">
              {{ items.label }}
            </div>
            <p class="text-[40px] font-[Noto-Sans-SC] ml-[9.37px]">{{ items.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.todo {
  border-color: rgba(255, 183, 77, 1);
  background: rgba(255, 183, 77, 0.1);
}
.doing {
  border-color: rgba(18, 192, 240, 1);
  background: rgba(18, 192, 240, 0.1);
}
.done {
  border-color: rgba(18, 240, 195, 1);
  background: rgba(18, 240, 195, 0.1);
}
.line {
  &:nth-child(odd) {
    background: url(@/assets/img/hot_water/comp2-box1.png);
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 56px;
      height: 106px;
      background: url(@/assets/img/hot_water/comp2-icon1.png) no-repeat;
      background-size: 100% 100%;
      top: 16px;
      left: 16px;
    }
  }
  &:nth-child(even) {
    background: url(@/assets/img/hot_water/comp2-box2.png);
    &::after {
      display: block;
      position: absolute;
      content: '';
      width: 56px;
      height: 106px;
      background: url(@/assets/img/hot_water/comp2-icon2.png) no-repeat;
      background-size: 100% 100%;
      top: 16px;
      left: 16px;
    }
  }
}
</style>
