<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
import { useStore } from '@/stores/index'

const store = useStore()
onMounted(() => {})
</script>

<template>
  <div class="left animate__animated animate__bounceInLeft" :class="{ 'board-hidden': !store.isDashboardVisible }">
    <slot />
  </div>
</template>

<style scoped>
.left {
  top: 286px;
  height: 1600px;
  pointer-events: all;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  left: 92px;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.board-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
