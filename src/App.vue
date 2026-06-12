<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
import KtWatermark from '@/components/utils-ui/kt-watermark.vue'
import router from '@/router/index.js'
import { sendToUE, watchUEEvents } from '@/utils/useEventBus'
import Layout from '@/views/Layout.vue'
// import Scene from '@/views/Scene.vue'

const showPixelStream = ref(false)
watchUEEvents({
  clickMesh: (data) => {
    console.log('data: ', data)
  },
})
onMounted(() => {
  showPixelStream.value = window.kt_config.usePixelStream
  router.push('/') // 页面刷新重定向至首页
})
console.log('app')
</script>

<template>
  <KtWatermark :enable="false">
    <Layout />

    <!-- <kt-pixel-streaming-player v-if="showPixelStream" />
    <Scene v-else /> -->
  </KtWatermark>
</template>

<style scoped>
:global(#app) {
  height: 100%;
  width: 100%;
  /* pointer-events: none; */
}
</style>
