<script setup lang="ts">
import { useTemplateRef } from 'vue';
// props
const {
  width = 120,
  height = 40,
  minFontSize = 26,
  maxFontSize = 32,
  rotation = 30,
  lineWidth = 1,
  pointRadius = 1,
} = defineProps<{
  width: number; // 验证码框宽度
  height: number; // 验证码框高度
  minFontSize?: number; // 验证码最小字体
  maxFontSize?: number; // 验证码最大字体
  rotation?: number; // 文字旋转角度
  lineWidth?: number; // 干扰线宽度
  pointRadius?: number; // 干扰点半径
}>();

const canvasDom = useTemplateRef<HTMLCanvasElement>('canvasDom');
// 密码池和最终生成的验证码
const codePool: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let getCode: string = '';
// 获取随机大小
function getRandomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// 获取随机颜色
function getRandomColor(min: number, max: number): string {
  const r = getRandomNum(min, max);
  const g = getRandomNum(min, max);
  const b = getRandomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

// 绘制canvas验证码
function drawCode(): void {
  if (!canvasDom.value)
    return;
  getCode = '';
  const ctx = canvasDom.value.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = getRandomColor(180, 230);
  ctx.fillRect(0, 0, width, height);

  // 随机生成字符串
  for (let i = 0; i < 4; i++) {
    const codePoolIdx = getRandomNum(0, codePool.length);
    const codeVal = codePool[codePoolIdx];
    getCode += codeVal;
    // 随机字体大小
    const fontSize = getRandomNum(minFontSize, maxFontSize);
    // 随机旋转角度
    const deg = getRandomNum(-rotation, rotation);
    ctx.font = `${fontSize}px Microsoft Yahei`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = getRandomColor(80, 150);
    ctx.save(); // 当前状态封存入栈
    const offsetX = width / 4 * i + width / 16;
    const offsetY = 10;
    ctx.translate(offsetX, offsetY);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(codeVal, 0, 0);
    ctx.restore(); // 恢复出栈，可以继续画别的东西
  }
  // 随机生成干扰线条
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); // 开始路径
    ctx.moveTo(getRandomNum(0, width), getRandomNum(0, height)); // 下笔
    ctx.lineTo(getRandomNum(0, width), getRandomNum(0, height)); // 移动
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = getRandomColor(100, 230);
    ctx.closePath(); // 闭合路径
    ctx.stroke();
  }

  // 随机生成干扰点
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(getRandomNum(0, width), getRandomNum(0, height), pointRadius, 0, 2 * Math.PI); // (x,y(圆心),半径，起始弧度，旋转角度)
    ctx.fillStyle = getRandomColor(150, 200);
    ctx.closePath();
    ctx.fill();
  }
}

// 检查验证码
function checkCode(code: string): boolean {
  return code === getCode;
}

// expose
defineExpose({
  drawCode,
  checkCode,
});
onMounted(() => {
  console.log('canvasDom: ', canvasDom.value);
  drawCode();
  console.log('getCode: ', getCode);
});
</script>

<template>
  <canvas ref="canvasDom" :width :height title="点击刷新验证码" @click="drawCode()" />
</template>

<style scoped></style>
