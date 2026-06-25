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
  sonTitleList: {
    type: Array,
    default: [],
  },
})
const emit = defineEmits(['selectTitle', 'changeSonTitleActive'])
</script>
<template>
  <div class="flex flex-col pointer-events-auto">
    <div class="relative overflow-hidden w-[747px] h-[79px] bg-[url('@/assets/img/item-header.png')] bg-[length:100%_100%] font-[SHSCN] flex">
      <div class="absolute top-0 left-0 w-[8px] h-[68px] bg-[url('@/assets/img/item-header-icon.png')] bg-[length:100%_100%]"></div>
      <div
        class="ml-[82px] text-[36px] font-[600] text-[rgba(255,255,255,1)] list cursor-pointer pt-[6px] son-header"
        v-for="(item, i) in props.titleList"
        :key="i"
        :class="item.active ? 'active' : ''"
        @click="emit('selectTitle', i)"
      >
        <p>{{ item?.name ? item.name : item }}</p>
      </div>
      <div
        class="w-[272px] h-[61px] bg-[url('@/assets/img/item-title-bg.png')] bg-[length:100%_100%] absolute top-[2px] right-[6px] flex justify-center px-[5px] py-[5px]"
        v-if="props.sonTitleList.length > 0"
      >
        <div
          class="son-title h-[100%] rounded-[6px] flex items-center justify-center text-[32px] text-[#fff] cursor-pointer"
          v-for="(item, i) in props.sonTitleList"
          :key="i"
          :class="[item.class, item.active ? 'active' : '']"
          @click="emit('changeSonTitleActive', i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="w-[747px] mt-[10px] font-[SHSCN]">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped lang="less">
/* div{
  position: relative;
} */
.son-header {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 30%, rgba(rgba(64, 191, 243, 1)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.list {
  position: relative;
  height: 70px;

  &.active {
    &::before {
      display: block;
      content: '';
      position: absolute;
      width: 310px;
      height: 70px;
      background: url(@/assets/img/item-title-active.png) no-repeat;
      background-size: 100% 100%;
      left: 50%;
      bottom: 4px;
      transform: translateX(-50%);
      z-index: -1;
    }
    &::after {
      display: block;
      content: '';
      position: absolute;
      width: 144px;
      height: 4px;
      border-radius: 2px;
      background-color: #fff;
      left: 50%;
      bottom: 2px;
      transform: translateX(-50%);
      z-index: 0;
    }
  }
}
.son-title {
  &.active {
    background: url(@/assets/img/item-header-active.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
