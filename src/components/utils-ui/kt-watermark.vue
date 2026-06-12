<script setup>
import useWatermarkBg from '@/utils/useWatermarkBg';

const props = defineProps({
  enable: {
    type: Boolean, // 水印组件是否开启
    default: false,
    required: true,
  },
  text: {
    type: String,
    default: 'KT',
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  gap: {
    type: Number,
    default: 10,
  },
});

const parent = ref();

const bg = useWatermarkBg(props);

let div;

function resetWatermark() {
  if (!parent.value) {
    return;
  }
  if (div) {
    div.remove();
  }
  const { base64, size } = bg.value;
  div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.backgroundImage = `url(${base64})`;
  div.style.backgroundSize = `${size}px ${size}px`;
  div.style.pointerEvents = 'none';
  div.style.repeat = 'repeat';
  div.style.zIndex = '9999';
  div.style.inset = '0';
  parent.value.appendChild(div);
}

const ob = new MutationObserver((i) => {
  for (const item of i) {
    for (const node of item.removedNodes) {
      if (node === div) {
        // console.log("🚀 ~ 该节点变化了,重置1")
        resetWatermark();
      }
    }

    if (item.target === div) {
      // console.log("🚀 ~ 该节点变化了,重置2")
      resetWatermark();
    }
  }
});

onMounted(() => {
  if (props.enable) {
    resetWatermark();
    ob.observe(parent.value, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
});

onUnmounted(() => {
  ob.disconnect();
});
</script>

<template>
  <div ref="parent">
    <slot />
  </div>
</template>

<style scoped>

</style>
