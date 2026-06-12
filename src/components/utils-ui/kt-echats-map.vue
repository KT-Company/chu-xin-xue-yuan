<script setup>
import chinaGeoNoShi from '@/assets/geo/china-no10.json';
import chinaGeo from '@/assets/geo/china.json';
import { getImg } from '@/utils/assets.js';
import * as echarts from 'echarts';

const mapRef = ref(null);
const mapName = 'china';
const mapName2 = 'china-no-shi';// 无十段线及海南诸岛
echarts.registerMap(mapName, chinaGeo);
echarts.registerMap(mapName2, chinaGeoNoShi);

let myChart = null;
function resizeHandler() {
  myChart.resize();
}
function debounce(fun, delay) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun();
    }, delay);
  };
}
const cancelDebounce = debounce(resizeHandler, 500);

const points = [
  { name: '呼和浩特', value: [111.701166, 40.792508] }, // 呼和浩特赛罕区
  { name: '北京', value: [116.405285, 39.904989] }, // 北京
  { name: '澳门', value: [113.54909, 22.198951] },
  { name: '拉萨', value: [91.132212, 29.660361] },
  { name: '哈尔滨', value: [126.642464, 45.756967] },
  { name: '乌鲁木齐', value: [87.617733, 43.792818] },
  { name: '重庆', value: [106.551787, 29.56268] }, // 重庆
];
const option = {
  geo: [
    {
      layoutCenter: ['50%', '50%'], // 位置
      layoutSize: '180%', // 大小
      zlevel: 0,
      show: true,
      map: mapName,
      roam: false,
      zoom: 0.65,
      aspectScale: 0.75,
      itemStyle: {
        // areaColor: {
        //   type: "linear",
        //   x: 1200,
        //   y: 0,
        //   x2: 0,
        //   y2: 0,
        //   colorStops: [{
        //     offset: 0,
        //     color: "rgba(0,73,255,0)", // 0% 处的颜色
        //   }, {
        //     offset: 1,
        //     color: "rgba(255,255,255,0)", // 50% 处的颜色
        //   },],
        //   global: true, // 缺省为 false
        // },

        areaColor: {
          image: getImg('map4.png'),
          repeat: 'no-repeat',
          x: -370,
          y: -198,
          scaleX: 2,
          scaleY: 2.25,
        },
        borderColor: '#7bee89',
        borderWidth: 1,
        shadowColor: 'rgba(132,255,195,0.65)',
        shadowOffsetY: 1,
        shadowBlur: 4,
      },
      emphasis: { // 区域激活时的样式
        itemStyle: {
          areaColor: 'rgba(2,16,43,0.71)',
        },
        label: {
          color: '#fff',
        },
      },
    },
    {
      layoutCenter: ['50%', '51.5%'], // 位置
      layoutSize: '180%', // 大小
      zlevel: -1,
      show: true,
      map: mapName2,
      roam: false,
      zoom: 0.65,
      aspectScale: 0.75,
      itemStyle: {
        areaColor: '#3f8050',
        borderWidth: 0,
      },
    },
    {
      layoutCenter: ['50%', '53%'], // 位置
      layoutSize: '180%', // 大小
      zlevel: -2,
      show: true,
      map: mapName2,
      roam: false,
      zoom: 0.65,
      aspectScale: 0.75,
      itemStyle: {
        areaColor: '#2e643e',
        borderWidth: 0,
      },
    },
    {
      layoutCenter: ['50%', '54.5%'], // 位置
      layoutSize: '180%', // 大小
      zlevel: -3,
      show: true,
      map: mapName2,
      roam: false,
      zoom: 0.65,
      aspectScale: 0.75,
      itemStyle: {
        areaColor: '#214d30',
        borderWidth: 0,
      },
    },
  ],
  series: [
    {
      type: 'map',
      map: mapName,
      geoIndex: 0,
    },
    { // 带有涟漪特效动画的散点（气泡）图
      type: 'effectScatter',
      coordinateSystem: 'geo',
      z: 4,
      showEffectOn: 'render',
      zlevel: 1,
      rippleEffect: {
        color: '#ffd700',
        number: 4, // 波纹的数量。
        period: 8, // 动画的周期，秒数。
        scale: 25, // 动画中波纹的最大缩放比例。
        brushType: 'fill', // 波纹的绘制方式，可选 'stroke' 和 'fill'。
      },
      label: {
        show: true, // (地图上的城市名称)是否显示标签
        distance: 5,
        padding: [10, 15, 10, 15],
        backgroundColor: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(82,82,82,0)', // 0% 处的颜色
            },

            {
              offset: 0.5,
              color: 'rgba(82,82,82,0.5)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(82,82,82,0)', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        formatter(params) {
          return params.name ? params.name : ' ';
        },
        // 标签的字体样式
        color: '#fff', // 地图初始化区域字体颜色
        fontSize: 16, // 字体大小
      },
      symbolSize: 3,
      data: points,
    },
    { // 添加迁移线数据
      type: 'lines',
      z: 4,
      data: [ // 配置多个点的数据
        {
          coords: [
            [111.701166, 40.792508],
            [113.54909, 22.198951],
          ],
        },
        {
          coords: [
            [111.701166, 40.792508],
            [91.132212, 29.660361],
          ],
        },
        {
          coords: [
            [111.701166, 40.792508],
            [126.642464, 45.756967],
          ],
        },
        {
          coords: [
            [111.701166, 40.792508],
            [87.617733, 43.792818],
          ],
        },
        {
          coords: [
            [111.701166, 40.792508],
            [116.405285, 39.904989],
          ],
        },
        {
          coords: [
            [111.701166, 40.792508],
            [106.551787, 29.56268],
          ],
        },
      ],
      label: {
        show: true,
        position: 'end',
      },
      effect: {
        show: true,
        period: 5,
        trailLength: 0.7,
        // symbol: 'arrow',
        symbol: `image://${getImg('arrow.png')}`,
        symbolSize: 30,
      },
      lineStyle: {
        color: 'rgba(181,235,101,1)',
        cap: 'butt', // 折线两端形状，可选为'butt', 'square', 'round'
        width: 0, // 尾迹线条宽度
        opacity: 1, // 尾迹线条透明度
        curveness: 0.3, // 尾迹线条曲直度
      },
    },
  ],
};

onMounted(() => {
  myChart = echarts.init(mapRef.value);
  myChart.setOption(option);
  window.addEventListener('resize', cancelDebounce);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', cancelDebounce);
  myChart.dispose();
});
</script>

<template>
  <div class="w-[1115px] h-[750px] pointer-events-auto kt-center">
    <div ref="mapRef" class="kt-full" />
  </div>
</template>

<style scoped>

</style>
