<script setup>
onMounted(() => {})
</script>

<template>
  <div class="left animate__animated animate__bounceInLeft">
    <slot />
  </div>
</template>

<style scoped>
.left {
  width: 365px;
  height: 817px;
  top: 121px;
  pointer-events: all;
  display: grid;
  grid-template-columns: 1fr;
  gap: 23.5px;
  position: absolute;
  left: 8px;
  z-index: 1;
  background: rgba(33, 37, 52, 0.5);
}
</style>
