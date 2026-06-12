/**
 * 监听 dom 元素是否加载完成
 * @param {any} domName
 * @param {any} callback
 */
export function observerDdomLoad(domName, callback) {
  let rAFid = null;
  let dom;
  function obs() {
    dom = document.getElementById(domName);
    if (dom) {
      cancelAnimationFrame(rAFid);
      callback(dom);
      return;
    }
    rAFid = requestAnimationFrame(obs);
  }
  if (dom) {
    callback(dom);
  }
  else {
    rAFid = requestAnimationFrame(obs);
  }
}

function omit(obj, arr) {
  return Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

export class DomTWEEN {
  /**
   * 动画
   * @date 2023-05-10
   * @param {any[object]} model  动画对象
   * @param {any[object]} optionsArr 动画参数
   * @param {any[object]} parameter  动画配置项
   */
  constructor(model, optionsArr, parameter = {}, func) {
    const { loop = false } = parameter;
    this.loop = loop;
    this.t1arr = [];
    this.optionsArr = optionsArr;
    this.func = func;
    this.model = Array.isArray(model) ? model : [model];
    this.init();
  }

  init() {
    const _this = this;
    const isOne = this.model.length === 1;
    for (let index = 0; index < this.optionsArr.length; index++) {
      const option = this.optionsArr[index];
      const item = Object.assign({}, option);
      const noTimeItem = omit(item, 'time');
      const next_item = Object.assign({}, this.optionsArr[index + 1]);
      const next_noTimeItem = omit(next_item, 'time');
      if (Object.getOwnPropertyNames(next_item).length !== 0) {
        const _t1 = new Bol3D.TWEEN.Tween(noTimeItem).to(
          next_noTimeItem,
          next_item.time,
        ).onUpdate((value) => {
          for (const key in value) {
            _this.model.forEach((item, i) => {
              if (!isOne) {
                item.style.visibility = i + 1 === value.area ? 'visible' : 'hidden';
              }
              item.style[key] = `${value[key]}%`;
            });
          }
        });
        this.t1arr.push(_t1);
      }
    }

    const finallyLength = this.t1arr.length - 1;
    for (let index = 0; index < this.t1arr.length; index++) {
      const num = index + 1;
      if (num <= finallyLength) {
        this.t1arr[index].chain(this.t1arr[index + 1]);
      }
      if (this.loop) {
        this.t1arr[finallyLength].chain(this.t1arr[0]);
      }
    }
    this.t1arr.at(-1).onComplete(() => {
      this.func?.();
    });
  }

  /**
   * 终止动画
   * @date 2023-05-12
   */
  stop() {
    this.t1arr.forEach(t => t.stop());
  }

  /**
   * 开始动画
   * @date 2023-05-10
   */
  start() {
    this.stop();
    this.t1arr[0].start();
  }

  /**
   * 暂停动画
   * @date 2023-05-10
   */
  pause() {
    this.t1arr.forEach(item => item.pause());
  }

  /**
   * 继续动画
   * @date 2023-05-10
   */
  resume() {
    this.t1arr.forEach(item => item.resume());
  }
}

function animate() {
  requestAnimationFrame(animate);
  Bol3D.TWEEN.update();
}
animate();

export function hasScrollbar(element) {
  return element.scrollHeight > element.clientHeight;
}

// 读取监控excel文件
export async function LoadXLSX() {
  const url = './assets/3d/xlsx/test.xlsx';
  const file = await (await fetch(url)).arrayBuffer();
  const workbook = window.XLSX.read(file);
  const xlsxData = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const handleData = xlsxData.reduce((acc, cur) => {
    const { 通道名称: channelName, 组织名称: organization, 编码: channelId, 设备IP: ip } = cur;
    acc.push({ channelName, organization, channelId, ip });
    return acc;
  }, []);
  console.log('handleData: ', handleData);
  return handleData;
}
