<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup lang="ts">
import autofit from 'autofit.js'
import ktHeader from '@/components/my-ui/kt-header.vue'
import ktTime from '@/components/my-ui/kt-time.vue'
onMounted(() => {
  autofit.init(
    {
      el: '#app-main', // 默认是 "body" 支持所有 css 选择器 (推荐使用 id )
      dw: 3840,
      dh: 2160,
      resize: true, // 默认是 true 关闭后无法自动计算拖动后的大小
    },
    false // 默认是 false 检查autofit.js是否正在运行
  )
})
</script>

<template>
  <div id="app-main">
    <ktHeader />
    <ktTime />
    <div class="absolute w-[100%] h-[100%] bg-[url('@/assets/img/overlay.png')] bg-[length:100%_100%] z-[-1]"></div>
    <!-- <KtNav />
    <KtTimer /> -->
    <router-view />
  </div>
</template>

<style scoped>
#app-main {
  height: 100%;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
style
