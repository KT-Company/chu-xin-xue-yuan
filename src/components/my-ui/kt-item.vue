<!--
 * @Author: 米龙
 * @Date: 2026-06-12 15:27:58
 * @Description:
-->
<script setup>
const props = defineProps({
  titleList: {
    type: Array,
    default: [],
  },
})
</script>
<template>
  <div class="flex flex-col">
    <div class="relative overflow-hidden w-[747px] h-[79px] bg-[url('@/assets/img/item-header.png')] bg-[length:100%_100%] font-[SHSCN] flex">
      <div class="absolute top-0 left-0 w-[8px] h-[68px] bg-[url('@/assets/img/item-header-icon.png')] bg-[length:100%_100%]"></div>
      <div class="ml-[82px] text-[36px] text-[rgba(255,255,255,1)] mt-[8px]" v-for="(item, i) in props.titleList" :key="i">
        <p>{{ item }}</p>
      </div>
    </div>
    <div class="w-[100%] mt-[10px] font-[SHSCN]">
      <slot></slot>
    </div>
  </div>
</template>
<style>
/* div{
  position: relative;
} */
</style>
