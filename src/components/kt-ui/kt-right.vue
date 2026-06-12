<script setup>
</script>

<template>
  <div class="right animate__animated  animate__bounceInRight">
    <slot />
  </div>
</template>

<style scoped>
.right {
  width: 365px;
  height: 817px;
  top: 121px;
  pointer-events: all;
  display: grid;
  grid-template-columns: 1fr;
  gap: 23.5px;
  position: absolute;
  right: 8px;
  z-index: 1;
  background: rgba(33, 37, 52, 0.5);
}
</style>
