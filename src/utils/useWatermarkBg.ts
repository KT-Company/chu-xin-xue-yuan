// 通过props配置水印，并返回base64图片和
import { computed } from 'vue';

export default function useWatermarkBg(props) {
  const { text, fontSize, gap } = props;
  return computed(() => {
    const canvas = document.createElement('canvas');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const font = `${fontSize * devicePixelRatio}px Arial`;
    const ctx = canvas.getContext('2d');
    const { width } = ctx.measureText(text);
    const canvasSize = Math.max(100, width + gap * 2) * devicePixelRatio;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    return {
      base64: canvas.toDataURL(),
      size: canvasSize / devicePixelRatio,
    };
  });
}
