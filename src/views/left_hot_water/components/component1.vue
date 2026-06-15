<!--
 * @Author: 米龙
 * @Date: 2026-06-15 15:00:58
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
</script>
<template>
  <ktItem :titleList="['总功能耗']">
    <div class="w-[100%] h-[258px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] flex flex-wrap items-center justify-center">
      <div>
        <div>
          <div></div>
        </div>
        <div>
          <div>
            <p>累计供热量</p>
          </div>
          <div>
            <p>23.578</p>
            <p>万kW</p>
          </div>
        </div>
      </div>
    </div>
  </ktItem>
</template>
