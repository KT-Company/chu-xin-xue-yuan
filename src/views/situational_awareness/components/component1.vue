<!--
 * @Author: 米龙
 * @Date: 2026-06-12 15:42:21
 * @Description:
-->
<!--
 * @Author: 米龙
 * @Date: 2026-06-12 15:42:21
 * @Description:
-->
<script setup>
import ktItem from '@/components/my-ui/kt-item.vue'
let list = ref([
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon3.png)]',
    name: '总减碳量',
    val: 4162.38,
    unit: '(tCO₂)',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon2.png)]',
    name: '光伏减碳量',
    val: 2756.94,
    unit: '(tCO₂)',
  },
  {
    icon: 'bg-[url(@/assets/img/situational_awareness/comp1-icon1.png)]',
    name: '可再生能源减碳量',
    val: 4162.38,
    unit: '(tCO₂)',
  },
])
let titleList = ref([
  {
    name: '耗电情况',
    active: true,
  },
  {
    name: '能源负荷',
    active: false,
  },
])
const changeTitleActive = (activeIndex) => {
  titleList.value = titleList.value.map((item, index) => ({
    ...item,
    active: index === activeIndex,
  }))
}
</script>
<template>
  <ktItem :titleList="titleList" @selectTitle="changeTitleActive">
    <div class="w-[100%] h-[545px] bg-[url('@/assets/img/item-box.png')] bg-[length:100%_100%] pt-[5px] pl-[16px]">
      <div class="w-[700px] h-[174px] bg-[url('@/assets/img/situational_awareness/comp1-box.png')] bg-[length:100%_100%] flex items-center">
        <div class="w-[108px] h-[108px] ml-[24px] bg-[url('@/assets/img/situational_awareness/carbon-emissions.png')] bg-[length:100%_100%]"></div>
        <p class="text-[40px] text-[#fff] ml-[30px]">总碳排放量</p>
        <div class="w-[10px] h-[18px] mx-[20px] bg-[url('@/assets/img/situational_awareness/carbon-ico.png')] bg-[length:100%_100%]"></div>
        <p class="text-[44px] text-[rgba(62,186,240,1)] mr-[10px]">12162.38</p>
        <p class="text-[24px] text-[rgba(255,255,255,0.76)]">tCO₂</p>
      </div>
      <div class="flex mt-[42px]">
        <div
          class="list flex flex-col items-center justify-around w-[196px] h-[268px] text-[24px] text-[rgba(255,255,255,0.8)] mr-[52px]"
          v-for="(item, i) in list"
          :key="i"
        >
          <div class="w-[92px] h-[92px] bg-[length:100%_100%] mt-[6px]" :class="item.icon"></div>
          <p class="text-[#fff] text-[44px]">{{ item.val }}</p>
          <p class="text-center font-[DINPro]">{{ item.name }}</p>
          <p class="">{{ item.unit }}</p>
        </div>
      </div>
    </div>
  </ktItem>
</template>
<style scoped lang="less">
.list {
  background-size: 100% 100%;
  &:nth-child(odd) {
    background: url(@/assets/img/situational_awareness/comp1-box1.png) no-repeat;
  }
  &:nth-child(even) {
    background: url(@/assets/img/situational_awareness/comp1-box2.png) no-repeat;
  }
}
</style>
