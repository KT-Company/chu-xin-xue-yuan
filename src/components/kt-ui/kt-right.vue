<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup></script>

<template>
  <div class="right animate__animated animate__bounceInRight">
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
  background: rgba(33, 37, 52, 0.5);
}
</style>
