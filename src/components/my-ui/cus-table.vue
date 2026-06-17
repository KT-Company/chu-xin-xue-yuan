<!--
 * @Author: 米龙
 * @Date: 2026-06-16 14:06:08
 * @Description:
-->
<template>
  <div class="kt-full kt-cus-table" :class="[sl]">
    <kt-pj-table v-bind="$attrs">
      <template v-for="(slotKey, slotIndex) in Object.keys($slots)" :key="slotIndex" #[slotKey]="params">
        <slot :name="slotKey" v-bind="params"></slot>
      </template>
    </kt-pj-table>
  </div>
</template>

<script setup>
// 该组件用来定制table样式
const props = defineProps({
  sl: {
    type: String,
    default: 's1',
  },
})
</script>

<style lang="less" scoped>
.s1 {
  :deep(.kt-table) {
    font-size: 12px;

    .kt-table-header {
      font-size: 24px;
      height: 61px;
      color: rgba(128, 177, 255, 1);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url('@/assets/img/table-header.png');
    }
    .kt-table-content > .kt-table-row {
      position: relative;
      align-items: center;
      font-size: 24px;
      height: 62px;
      color: rgba(209, 219, 229, 1);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      &:nth-child(odd) {
        background-color: rgba(25, 81, 154, 0.4);
      }
      &:nth-child(even) {
        background-color: rgba(8, 37, 75, 0.5);
      }
    }
  }
}
</style>
