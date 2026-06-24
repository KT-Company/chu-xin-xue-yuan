<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup lang="ts">
import autofit from 'autofit.js'
import ktHeader from '@/components/my-ui/kt-header.vue'
import ktPopFn from '@/components/my-ui/kt-pop-fn.vue'
import ktPopList from '@/components/my-ui/kt-pop-list.vue'
import ktTime from '@/components/my-ui/kt-time.vue'
import { useStore } from '@/stores/index'
let store = useStore()
const route = useRoute()
const isPopFnVisible = ref(false)
const backgroundClass = computed(() =>
  route.path === '/pv_management' ? "bg-[url('@/assets/img/bg2.png')]" : "bg-[url('@/assets/img/bg.png')]"
)

let togglePopFn = () => {
  isPopFnVisible.value = !isPopFnVisible.value
}
let hidePopFn = () => {
  isPopFnVisible.value = false
}
let hidePopList = () => {
  store.isPopListVisible = false
}
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
    <ktHeader :is-pop-fn-visible="isPopFnVisible" @openPopFn="togglePopFn" />
    <ktTime />
    <div class="absolute w-[100%] h-[100%] bg-[url('@/assets/img/overlay.png')] bg-[length:100%_100%] z-[-1]"></div>
    <div class="absolute w-[100%] h-[100%] bg-[length:100%_100%] z-[-2]" :class="backgroundClass"></div>
    <!-- <KtNav />
    <KtTimer /> -->
    <ktPopFn v-if="isPopFnVisible" @close="hidePopFn" />
    <ktPopList v-if="store.isPopListVisible" @close="hidePopList" />
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
