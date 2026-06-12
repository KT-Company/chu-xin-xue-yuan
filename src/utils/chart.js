import * as echarts from 'echarts';
import { observerDdomLoad } from './dom';

export function setChart(dom, option) {
  observerDdomLoad(dom, (_dom) => {
    const myChart = echarts.init(_dom);
    myChart.setOption(option);
  });
}

export function clearChartData(data) {
  data.xData = [];
  data.data.forEach((item) => {
    item.value = [];
  });
}
