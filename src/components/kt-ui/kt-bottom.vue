<script setup>
onMounted(() => {});
</script>

<template>
  <div class="bottom animate__animated  animate__fadeIn">
    <slot />
  </div>
</template>

<style scoped>
.bottom {
  grid-template-rows: 1fr;
  display: grid;
  width: 100%;
  background: rgba(19, 22, 24, 0.4);
  height: 300px;
  padding: 24px 40px;
  column-gap: 65px;
  pointer-events: all;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>
