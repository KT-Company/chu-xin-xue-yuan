<script setup lang="ts">
import geoJson from '@/assets/geo/zhong-guo.json'
import * as echarts from 'echarts'
/* 已知全局引用就会存在这个警告 geo3D exists */
// import 'echarts-gl';
/* 可以按需加载 */
import { Lines3DChart, Map3DChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'

echarts.use([Lines3DChart, Map3DChart, Grid3DComponent])
echarts.registerMap('china', geoJson as any)

const mapChart = ref(null)

/* 配置中已经注释部分内容,可按需进行配置 */
const option = {
  tooltip: {
    trigger: 'item',
    position: 'inside',
    formatter: '{b}',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: '#FFFFFF',
      textalign: 'center',
      fontSize: '12px',
    },
  },
  series: [
    {
      type: 'map3D',
      map: 'china',
      itemStyle: {
        // 地图的颜色
        color: '#286ECA', // 地图板块的颜色
        opacity: 0.8, // 图形的不透明度 [ default: 1 ]
        borderWidth: 2, // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域
        borderColor: '#5caf69', // 图形描边的颜色。[ default: #333 ]
      },
      regionHeight: 1, //地图厚度
      label: {
        show: true, // (地图上的城市名称)是否显示标签
        distance: 5,
        formatter(params) {
          return params.name ? params.name : ' '
        },
        // 标签的字体样式
        color: '#fff', // 地图初始化区域字体颜色
        fontSize: 16, // 字体大小
      },

      emphasis: {
        label: {
          // label 高亮时的配置
          show: true,
          color: '#fff', // 高亮时标签颜色变为 白色
          fontSize: 15, // 高亮时标签字体 变大
        },
        itemStyle: {
          // itemStyle 高亮时的配置
          color: '#2ffcb3', // 高亮时地图板块颜色改变
        },
      },

      // environment: new echarts.graphic.LinearGradient(
      //     0,
      //     0,
      //     0,
      //     1,
      //     [
      //       {
      //         // 配置为垂直渐变的背景
      //         offset: 0,
      //         color: "#183890", // 天空颜色
      //       },
      //       {
      //         offset: 0.7,
      //         color: "#040829", // 地面颜色
      //       },
      //       {
      //         offset: 1,
      //         color: "#040829", // 地面颜色
      //       },
      //     ],
      //     false
      // ),

      // groundPlane: {
      //   show: false, // 是否显示地面
      //   color: "#fff", // 地面颜色
      // },

      // light: {
      //   main: {
      //     // 场景主光源的设置，在 globe 组件中就是太阳光。
      //     color: "#fdf5e0", // 主光源的颜色。
      //     intensity: 1, // 主光源的强度。
      //     shadow: true, // 主光源是否投射阴影。默认关闭。开启阴影可以给场景带来更真实和有层次的光照效果。会增加程序的运行开销。
      //     shadowQuality: "high", // 阴影的质量。可选'low', 'medium', 'high', 'ultra'
      //     alpha: 55, // 主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向。
      //     beta: 10, // 主光源绕 y 轴，即左右旋转的角度。
      //   },
      //   ambient: {
      //     // 全局的环境光设置。
      //     color: "fff", // 环境光的颜色。[ default: #fff ]
      //     intensity: 0.5, // 环境光的强度。[ default: 0.2 ]
      //   },
      // },

      // viewControl: {
      //   projection: "perspective", // 投影方式
      //   autoRotate: false, // 是否开启视角绕物体的自动旋转查看
      //   autoRotateDirection: "cw", // 物体自传的方向。默认是 'cw'，也可以取 'ccw'
      //   autoRotateSpeed: 10, // 物体自传的速度。角度 / 秒
      //   autoRotateAfterStill: 3, // 在鼠标静止操作后恢复自动旋转的时间间隔
      //   damping: 0, // 鼠标进行旋转，缩放等操作时的迟滞因子
      //   distance: 120, // 默认视角距离主体的距离
      //   alpha: 40, // 视角绕 x 轴，即上下旋转的角度
      //   beta: 0, // 视角绕 y 轴，即左右旋转的角度
      //   center: [0, 0, 0], // 视角中心点
      //   animation: true, // 是否开启动画
      //   animationDurationUpdate: 1000, // 过渡动画的时长
      //   animationEasingUpdate: "cubicInOut", // 过渡动画的缓动效果
      // },
      // 三维图形的着色效果

      // shading: "realistic",
      // 真实感材质相关的配置项
      // realisticMaterial: {
      // detailTexture: getImg('map.png'), // 纹理图片
      // textureTiling: 1,
      //   textureOffset: [1138, 879]
      // },
      // // 后处理特效
      // postEffect: {
      //   enable: true,
      //   SSAO: {
      //     enable: true,
      //     radius: 1,
      //     intensity: 1,
      //     quality: "high",
      //   },
      //   bloom: {
      //     enable: true,
      //     strength: 0.5,
      //     radius: 0,
      //     threshold: 0,
      //   },
      //   FXAA: {
      //     enable: true,
      //     alpha: 0.5,
      //   },
      // },
    },
  ],
}

onMounted(() => {
  const map = echarts.init(mapChart.value)
  map.setOption(option)
})
</script>

<template>
  <div class="w-full h-full absolute z-0 pointer-events-auto">
    <div ref="mapChart" class="kt-full" />
  </div>
</template>

<style scoped></style>
