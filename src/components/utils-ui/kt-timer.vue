<script setup>
const { now, pause, resume } = useNow({ controls: true });
const formatted = useDateFormat(now, 'YYYY年MM月DD日 dddd HH:mm:ss', { locales: 'zh-cn' });
</script>

<template>
  <div class="absolute z-[2] top-2.5 right-8 text-shadow-black text-white text-3xl">
    {{ formatted }}
  </div>
</template>

<style scoped></style>
