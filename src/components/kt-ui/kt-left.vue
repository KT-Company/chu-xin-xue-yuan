<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
onMounted(() => {})
</script>

<template>
  <div class="left">
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
  background: rgba(33, 37, 52, 0.5);
}
</style>
