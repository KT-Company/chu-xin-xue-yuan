<script setup>
const randomNum = ref(0)
let timer = null
onMounted(() => {
  timer = setInterval(() => {
    randomNum.value = Math.floor(Math.random() * 100)
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div>
    <div class="w-[200px] h-[100px] kt-border kt-flex pointer-events-auto absolute top-1/3 left-1/2 text-shadow-black">
      <div class="w-[64px] h-[64px] kt-bg-full bg-[url(@/assets/img/arrow.png)]" />
      测试钉钉进步体  Web Components {{ randomNum }}
    </div>
  </div>
</template>

<style scoped>

</style>
