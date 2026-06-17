<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
import ktRight from '@/components/kt-ui/kt-right.vue'
import ktLeft from '@/components/kt-ui/kt-left.vue'
import component1 from './components/component1.vue'
import component2 from './components/component2.vue'
import component3 from './components/component3.vue'
import component4 from './components/component4.vue'
import component5 from './components/component5.vue'
import component6 from './components/component6.vue'
</script>

<template>
  <ktLeft style="width: 747px; height: 1770px">
    <component1 />
    <component2 />
    <component3 />
  </ktLeft>
  <ktRight style="width: 747px; height: 1770px">
    <component4 />
    <component5 />
    <component6 />
  </ktRight>
</template>

<style scoped></style>
