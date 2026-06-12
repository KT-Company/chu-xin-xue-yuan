<!--
 * @Author: 米龙
 * @Date: 2025-12-25 15:28:49
 * @Description:
-->
<script setup>
import { getImg } from '@/utils/assets'

const props = defineProps({
  title: String,
  bg: String,
  contentStyle: Object,
  contentClass: String,
  button: {
    default: () => [],
    type: Array,
  },
})

const emit = defineEmits('activeMenu')
const bgImg = props.bg ? getImg(props.bg) : getImg('title_1.png')
const titleStyle = reactive({
  background: `url(${bgImg}) no-repeat center / 100% 150%`,
})

const activeButton = ref(props.button.find((item) => item.active))
function handleItemButton(button) {
  activeButton.value = button
  emit('activeMenu', button)
}
</script>

<template>
  <div class="item">
    <div class="title" :style="[titleStyle]">
      <span class="yc title-span" :title="title">{{ title }}</span>
      <ul class="button">
        <li v-for="(item, i) in button" :key="i" :class="item.name === activeButton.name && 'active'" @click="handleItemButton(item)">
          {{ item.name }}
        </li>
      </ul>
      <div class="title-right">
        <slot name="Tright" />
      </div>
    </div>
    <div class="content" :class="[contentClass]" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.button {
  display: flex;
  margin-left: 1rem;
  pointer-events: all;
  height: 70%;

  li {
    background: rgba(0, 115, 177, 0.5);
    margin: 0 0.3rem;
    cursor: pointer;
    padding: 0 0.75rem;
    font-size: 0.7vw;
    border-radius: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(95, 255, 199, 0.6);
    transition: 0.5s;
  }

  .active {
    background: rgba(0, 115, 177, 1);
    color: rgba(95, 255, 199, 1);
  }
}

.item {
  width: 100%;
  height: 100%;
  --th: 33px;
  position: relative;

  .title-right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-1rem, -50%);
  }

  .title {
    position: relative;
    height: var(--th);
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.15ch;
    white-space: nowrap;
  }

  .title-span {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 2px 0px rgba(95, 161, 219, 0.61);
    background: linear-gradient(0deg, #6cb5e9 6.1279296875%, #f0fdff 55.4443359375%, #ffffff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .content {
    height: calc(100% - var(--th));
    position: absolute;
    width: 100%;
    background: url('../assets/img/item_bg.png') no-repeat center / 100% 100%;
  }
}
</style>
