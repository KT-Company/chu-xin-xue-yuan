<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
import { useStore } from '@/stores/index'

const store = useStore()
</script>

<template>
  <div class="right animate__animated animate__bounceInRight" :class="{ 'board-hidden': !store.isDashboardVisible }">
    <slot />
  </div>
</template>

<style scoped>
.right {
  top: 286px;
  pointer-events: all;
  height: 1600px;
  pointer-events: all;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  right: 92px;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.6s ease;
}

.board-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
