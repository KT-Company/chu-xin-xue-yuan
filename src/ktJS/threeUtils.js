class Mitter {
  constructor() {
    this.events = new Map();
  }

  // 监听事件
  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(handler);
  }

  // 触发事件
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((handler) => handler(...args));
    }
  }

  // 移除事件监听器
  off(event, handler) {
    if (this.events.has(event)) {
      const handlers = this.events.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 移除所有事件监听器
  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

const mitter = new Mitter();

let container = null;
let Bol3D = window.Bol3D;
/**
 * 初始化 TU
 * @date 2023-05-06
 * @param {any} scene container
 * @param {any} bol3d Bol3D
 * @returns {void}
 */
function init(scene, bol3d) {
  container = scene;
  Bol3D = bol3d;
  function animate() {
    requestAnimationFrame(animate);
    mitter.emit('update');
  }
  animate();
}

function addScene(obj) {
  container.scene.add(obj);
}

class MapAnimation {
    /**
     * 描述
     * @date 2023-02-15
     * @param {any} mesh  目标 mesh 对象
     * @param {number} offset  偏移量
     * @param {'x'|'y'|'all'} [axis] axis='x'  偏移方向
     */
    constructor(meshs, offset, axis = 'x') {
        this.meshs = meshs;
        this.offset = offset;
        this.axis = axis;
        this.rAFid = null;
    }
    /**
     * 动画开始
     * @date 2023-02-15
     * @param {any} callback 回调, 返回一个 mesh 参数
     */
    start(callback) {
        this.meshs.forEach(mesh => {
            const offset = mesh.material.map.offset;
            const targetOffsetAxis = offset[this.axis];
            const offsetArry = [];
            if (this.axis === 'x') {
                offsetArry[0] = targetOffsetAxis + this.offset;
                offsetArry[1] = offset.y;
            } else if (this.axis === 'y') {
                offsetArry[0] = offset.x;
                offsetArry[1] = targetOffsetAxis + this.offset;
            } else {
                offsetArry[0] = offset.x + this.offset;
                offsetArry[1] = offset.y + this.offset;
            }
            mesh.material.map.offset.set(...offsetArry);
        });
        this.rAFid = requestAnimationFrame(this.start.bind(this, callback));
        callback?.(this.meshs);
    }
    /**
     * 动画停止
     * @date 2023-02-15
     */
    stop() {
        cancelAnimationFrame(this.rAFid);
    }

}

/** 添加动画
 * @param {Tween} t   // 动画对象
 */
function addTween(t) {
  const _t = Array.isArray(t) ? t : [t];
  _t.forEach((t) => container.tweenGroup.add(t));
}

/** 移除动画
 * @param {Tween} t   // 动画对象
 */
function removeTween(t) {
  const _t = Array.isArray(t) ? t : [t];
  _t.forEach((t) => container.tweenGroup.remove(t));
}

/** 模型聚焦
 * @date 2023-01-31
 * @param {array}    position      // 点坐标
 * @param {array}    target        // 视角坐标
 * @param {number}   [times=1000]  // 聚焦动画时间 默认 1000 毫秒
 * @param {Function} [doit]        // 回调函数
 */
function focus(position, target, times = 1000, doit) {
  const p = new Promise((resolve, reject) => {
    const t1 = new Bol3D.TWEEN.Tween(container.orbitCamera).to(
      {
        position: new Bol3D.Vector3(...position),
      },
      times
    );
    const t2 = new Bol3D.TWEEN.Tween(container.orbitControls)
      .to(
        {
          target: new Bol3D.Vector3(...target),
        },
        times
      )
      .onComplete(function () {
        doit?.();
        resolve();
        removeTween([t1, t2]);
      });

    addTween([t1, t2]);
    t1.start();
    t2.start();
  });

  return p
}

/** 显示隐藏模型
 * @param {Bol3D.Object3D[]} models   // 要显示或隐藏的模型数组
 * @param {string[]} names   // 要显示或隐藏的模型名称数组
 */
function showModels(models, names) {
  names = Array.isArray(names) ? names : [names];
  if (Array.isArray(models)) {
    models.forEach((model) => (model.visible = names.includes(model.name)));
  } else {
    models.traverse((child) => {
      child.visible = names.includes(child.name);
    });
  }
}

/** 设置透明度
 * @date 2023-01-31
 * @param {any} meshs               // mesh 的类型数组
 * @param {number} num              // 透明度 0~1
 * @param {boolean} [isTran=true]   // 可选：true 透明，false 不透明，（默认透明）
 */
function setOpacity(meshs, num, isTran = true) {
  getMesh(meshs).forEach((mesh) => {
    mesh.material.transparent = isTran;
    mesh.material.opacity = num;
  });
}

/** 设置颜色
 * @date 2023-01-31
 * @param {any} meshs   // 要查找的元素
 * @param {color} color // 颜色 16 进制
 */
function setColor(meshs, color) {
  getMesh(meshs).forEach((item) => item.material.color.set(color));
}

/** 查找 mesh 元素
 * @date 2023-01-31
 * @param {array | object} data   // 要查找的元素
 * @returns {array}    // 返回结果
 */
function getMesh(data) {
  const meshList = [];
  function _getMesh(list) {
    list.forEach((a) => {
      if (a.isMesh) meshList.push(a);
      else {
        a.children?.forEach((a) => _getMesh([a]));
      }
    });
  }
  data = Array.isArray(data) ? data : [data];
  _getMesh(data);
  return meshList
}

/** 创建镜面物体
 * @date 2023-01-31
 * @param {object} option
 * @param {array} [option.size=[10000, 10000]] // 镜面大小默认 [10000,10000]
 * @param {color} [option.color=0xffffff]  // 镜面颜色
 * @returns {any}               //创建的镜面物体对象
 */
function createMirror(option = {}) {
  const { size = [10000, 10000], color = 0xffffff } = option;
  const geometry = new Bol3D.PlaneGeometry(...size);
  const verticalMirror = new Bol3D.Reflector(geometry, {
    clipBias: 0.0003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color,
  });
  verticalMirror.material.transparent = false;
  return verticalMirror
}

/**
 * 虚化场景
 * @date 2023-04-19
 * @param {any} target
 * @param {object} options
 * @param {any} [options.color]  虚化颜色
 * @param {any} [options.lineColor]  线颜色
 */
function onFadeModel(target, options = {}) {
  const { lineColor = '#36BCFF', color = '#009EFF' } = options;
  let buildMaterial = new Bol3D.MeshStandardMaterial({
    color, // 颜色
    transparent: true, // 是否开启使用透明度
    opacity: 0.25, // 透明度
    depthWrite: false, // 关闭深度写入 透视效果
    side: Bol3D.DoubleSide, // 双面显示
    // 粗糙度
    roughness: 0,
    envMap: container.envMap, // 环境贴图
  });
  // 建筑线材质
  let lineMaterial = new Bol3D.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    side: Bol3D.DoubleSide,
  });
  target.traverse((child) => {
    if (child.isMesh) {
      if (!child.userData.initMaterial) child.userData.initMaterial = child.material.clone();
      child.userData.fadeMaterial = buildMaterial;
      child.material = buildMaterial;
      if (child.geometry) {
        const edges = new Bol3D.EdgesGeometry(child.geometry);
        const line = new Bol3D.LineSegments(
          edges,
          lineMaterial // 赋线条材质
        );
        const oldLine = child.children.find((item) => item.isLineSegments);
        oldLine && child.remove(oldLine);
        child.add(line); // 把每一个mesh生成的线条添加到场景中
      }
    }
  });
}

/**
 * 还原虚化场景
 * @date 2023-04-19
 * @param {any} target
 */
function offFadeModel(target) {
  target.traverse((child) => {
    if (child.isMesh) {
      child.userData.initMaterial && (child.material = child.userData.initMaterial);
      child.traverse((item) => {
        if (item.isLineSegments) {
          item.visible = false;
        }
      });
    }
  });
}

function disposeModel(model) {
  if (!model) return
  if (model.isMesh) {
    model.geometry.dispose();
    model.material.dispose();
    model?.parent?.remove(model);
  } else {
    for (let i = model.children.length - 1; i >= 0; i--) {
      disposeModel(model.children[i]);
    }
  }
}

function removeModel(model, isRemoveCurrent = false) {
  if (!model) return
  disposeModel(model);
  for (let i = model.children.length - 1; i >= 0; i--) {
    const item = model.children[i];
    item.parent.remove(item);
  }
  if (isRemoveCurrent) {
    model?.parent?.remove(model);
  }
}

function animaiton(callback) {
  requestAnimationFrame(animaiton.bind(this, callback));
  callback?.();
}

/**
 * 获取世界坐标
 * @param {Bol3D.Object3D} model 模型
 * @returns {Bol3D.Vector3} 世界坐标
 * */
function getWorldPosition(model) {
  const position = new Bol3D.Vector3();
  model.getWorldPosition(position);
  return position
}

/**
 * 获取距离最近的 num 个模型的位置
 * @param {Bol3D.Object3D[]} modelList 模型列表
 * @param {Bol3D.Vector3} targetModel 目标模型
 * @param {number} num 数量
 * @returns {Bol3D.Object3D[]} 距离最近的 num 个模型
 */
function getMinDistance(modelList, targetModel, num = 3) {
  const targetModelPosition = getWorldPosition(targetModel);
  const distanceList = modelList.map((model) => {
    const position = getWorldPosition(model);
    const { distance } = position.distanceTo(targetModelPosition);
    return { model, position, distance }
  });

  distanceList.sort((a, b) => a.distance - b.distance);
  return distanceList.filter((item, index) => index < num)
}

function getDistance(p1, p2) {
  const distance = p1.distanceTo(p2); // 两点距离
  const midPoint = new Bol3D.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  return { distance, midPoint }
}

function createRectangleFromPoints(options) {
  const { start, end, width = 5, textureUrl, density = 30 } = options;
  // 计算方向向量和法向量
  const dir = new Bol3D.Vector3().subVectors(end, start).normalize(); // 线段方向
  const normal = new Bol3D.Vector3(0, 1, 0); // Y轴方向，水平面法向量
  const side = new Bol3D.Vector3()
    .crossVectors(dir, normal)
    .normalize()
    .multiplyScalar(width / 2); // 水平方向的偏移

  // 计算矩形的四个顶点
  const p1 = new Bol3D.Vector3().addVectors(start, side);
  const p2 = new Bol3D.Vector3().subVectors(start, side);
  const p3 = new Bol3D.Vector3().addVectors(end, side);
  const p4 = new Bol3D.Vector3().subVectors(end, side);

  // 创建 BufferGeometry
  const geometry = new Bol3D.BufferGeometry();
  const vertices = new Float32Array([
    p1.x,
    p1.y,
    p1.z, // 顶点1
    p2.x,
    p2.y,
    p2.z, // 顶点2
    p3.x,
    p3.y,
    p3.z, // 顶点3
    p3.x,
    p3.y,
    p3.z, // 顶点3
    p2.x,
    p2.y,
    p2.z, // 顶点2
    p4.x,
    p4.y,
    p4.z, // 顶点4
  ]);
  geometry.setAttribute('position', new Bol3D.BufferAttribute(vertices, 3));
  // 添加 UV 坐标
  // UV 坐标映射到矩形四个顶点，从 (0, 0) 到 (1, 1)
  const uvs = new Float32Array([
    0,
    1, // p1
    0,
    0, // p2
    1,
    1, // p3
    1,
    1, // p3
    0,
    0, // p2
    1,
    0, // p4
  ]);
  geometry.setAttribute('uv', new Bol3D.BufferAttribute(uvs, 2));

  // 创建材质和网格
  const textureLoader = new Bol3D.TextureLoader();
  const texture = textureLoader.load(textureUrl); //
  texture.wrapS = texture.wrapT = Bol3D.RepeatWrapping; // 使纹理重复
  const distance = start.distanceTo(end); // 计算线段长度
  texture.repeat.set(distance / 30, 1); // 设置纹理重复次数

  const material = new Bol3D.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    side: Bol3D.DoubleSide,
    map: texture,
    transparent: true,
  });
  const mesh = new Bol3D.Mesh(geometry, material);
  mesh.renderOrder = 10; // 保证在其它物体前面渲染
  return mesh
}

/**
 * 将数组或者对象转换为 Bol3D.Vector3 对象
 * @param {Bol3D.Vector3 | number[] | object} positon 坐标
 * @returns {Bol3D.Vector3}
 */
function fromVector3(positon) {
  if (Array.isArray(positon)) {
    return new Bol3D.Vector3(...positon)
  } else if (!positon?.isVector3) {
    return new Bol3D.Vector3(positon?.x, positon?.y, positon?.z)
  }
  return positon || new Bol3D.Vector3(0, 0, 0)
}

/**
 * 创建圆柱体
 * @param {object} options
 * @param {Bol3D.Vector3[]} options.points 圆柱体的两个端点,起始位置
 * @param {number} [options.radius=1] 圆柱体的半径
 * @param {number} [options.color=0xff0000] 圆柱体的颜色
 * @param {number} [options.segments=32] 圆柱体的分段数
 */
function createCylinderBetweenPoints(options) {
  const { points = [], radius = 1, color = 0xff0000, segments = 32 } = options;
  // 定义两个点
  const point2 = fromVector3(points[0]);
  const point1 = fromVector3(points[1]);

  // 计算两个点之间的距离，作为圆柱体的高度
  const height = point1.distanceTo(point2);
  // 计算圆柱体的中心点位置
  const center = point1.clone().add(point2).divideScalar(2);
  // 创建一个圆柱体几何体
  const cylinderGeometry = new Bol3D.CylinderGeometry(radius, radius, height, segments); // 半径为1，高度为height，32段分段
  // 创建一个材质
  const material = new Bol3D.MeshBasicMaterial({ color });

  // 创建一个圆柱体网格对象
  const cylinder = new Bol3D.Mesh(cylinderGeometry, material);
  // 将圆柱体放置在两个点的中心位置
  cylinder.position.copy(center);
  // 计算两个点的方向向量，并将其标准化
  const direction = new Bol3D.Vector3().subVectors(point2, point1).normalize();

  // 计算圆柱体的朝向上方的向量
  const up = new Bol3D.Vector3(0, 1, 0);

  // 计算四元数，使圆柱体的方向与两个点的方向一致
  const quaternion = new Bol3D.Quaternion();
  quaternion.setFromUnitVectors(up, direction);

  // 将四元数设置为圆柱体的旋转四元数
  cylinder.quaternion.copy(quaternion);

  return cylinder
}

/**
 * 控制模型的 Transform 组件
 */
function setModelTransform(model) {
  const controls = container.transformControl;
  controls.attach(model);
}

/**
 * 移出模型的 Transform 组件
 */
function detachTransform() {
  const controls = container.transformControl;
  controls.detach();
}

/**
 * 设置 Transform 组件类型
 */
function setTransformType(type) {
  const controls = container.transformControl;
  if (type === '旋转') controls.setMode('rotate');
  else if (type === '平移') controls.setMode('translate');
}

var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addTween: addTween,
  removeTween: removeTween,
  focus: focus,
  showModels: showModels,
  setOpacity: setOpacity,
  setColor: setColor,
  getMesh: getMesh,
  createMirror: createMirror,
  onFadeModel: onFadeModel,
  offFadeModel: offFadeModel,
  disposeModel: disposeModel,
  removeModel: removeModel,
  animaiton: animaiton,
  getWorldPosition: getWorldPosition,
  getMinDistance: getMinDistance,
  getDistance: getDistance,
  createRectangleFromPoints: createRectangleFromPoints,
  fromVector3: fromVector3,
  createCylinderBetweenPoints: createCylinderBetweenPoints,
  setModelTransform: setModelTransform,
  detachTransform: detachTransform,
  setTransformType: setTransformType
});

class Roam {
  /**
   * 漫游
   * @date 2023-05-10
   * @param {any[object]} positionArr 位置数组 [{time：补间时间，position：相机 position 位置，target：相机 target 位置,onComplete：补间动画完成后的回调}]
   */
  constructor(positionArr, parameter = {}) {
    const { loop = false } = parameter;
    this.loop = loop;
    this.t1arr = [];
    this.t2arr = [];
    this.positionArr = positionArr;
    this.init();
  }
  init() {
    this.positionArr.forEach((position) => {
      const item = Object.assign({}, position);
      var _t1 = new Bol3D.TWEEN.Tween(container.orbitCamera).to(
        {
          position: new Bol3D.Vector3(...item.position),
        },
        item.time
      );
      var _t2 = new Bol3D.TWEEN.Tween(container.orbitControls).to(
        {
          target: new Bol3D.Vector3(...item.target),
        },
        item.time
      );
      if (item.onComplete) {
        _t1.onComplete(() => {
          item.onComplete();
        });
      }
      this.t1arr.push(_t1);
      this.t2arr.push(_t2);
    });

    const finallyLength = this.t1arr.length - 1;
    for (let index = 0; index < this.t1arr.length; index++) {
      const num = index + 1;
      if (num <= finallyLength) {
        this.t1arr[index].chain(this.t1arr[index + 1]);
        this.t2arr[index].chain(this.t2arr[index + 1]);
      }
      if (this.loop) {
        this.t1arr[finallyLength].chain(this.t1arr[0]);
        this.t2arr[finallyLength].chain(this.t2arr[0]);
      }
    }

    addTween(this.t1arr);
    addTween(this.t2arr);
  }
  /**
   * 终止漫游
   * @date 2023-05-12
   */
  stop() {
    this.t1arr.forEach((t) => t.stop());
    this.t2arr.forEach((t) => t.stop());
  }
  /**
   * 开始漫游
   * @date 2023-05-10
   */
  start() {
    this.stop();
    this.t1arr[0].start();
    this.t2arr[0].start();
  }
  /**
   * 暂停漫游
   * @date 2023-05-10
   */
  pause() {
    this.t1arr.forEach((item) => item.pause());
    this.t2arr.forEach((item) => item.pause());
  }
  /**
   * 继续漫游
   * @date 2023-05-10
   */
  resume() {
    this.t1arr.forEach((item) => item.resume());
    this.t2arr.forEach((item) => item.resume());
  }
}

class ModelTWEEN {
  /**
   * 动画
   * @date 2023-05-10
   * @param {any[object]} model 模型对象
   * @param {any[object]} optionsArr 动画参数
   * @param {any[object]} parameter  动画配置项
   */
  constructor(model, optionsArr, parameter = {}) {
    const { loop = false } = parameter;
    this.loop = loop;
    this.t1arr = [];
    this.optionsArr = optionsArr;
    this.model = model;
    this.init();
  }
  init() {
    this.optionsArr.forEach((option) => {
      const item = Object.assign({}, option);
      const noTimeItem = omit(item, 'time');
      const _t1 = new Bol3D.TWEEN.Tween(this.model).to(noTimeItem, item.time);
      for (const key in item) {
        const v = item[key];
        if (v instanceof Function) {
          _t1[key](() => {
            item[key]();
          });
        }
      }
      this.t1arr.push(_t1);
    });

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

    addTween(this.t1arr);
  }
  /**
   * 终止动画
   * @date 2023-05-12
   */
  stop() {
    this.t1arr.forEach((t) => t.stop());
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
    this.t1arr.forEach((item) => item.pause());
  }
  /**
   * 继续动画
   * @date 2023-05-10
   */
  resume() {
    this.t1arr.forEach((item) => item.resume());
  }
}

function omit(obj, arr) {
  return Object.keys(obj)
    .filter((k) => !arr.includes(k))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc
    }, {})
}

//缓冲条样式
var KT_cl, KT_loadText, KT_loading, KT_cbox;
var lightLoader = function (c, cw, ch) { var _this = this; this.c = c; this.ctx = c.getContext("2d"); this.cw = cw; this.ch = ch; this.loaded = 0; this.loaderSpeed = 0.6; this.loaderHeight = 10; this.loaderWidth = 310; this.loader = { x: (this.cw / 2) - (this.loaderWidth / 2), y: (this.ch / 2) - (this.loaderHeight / 2) }; this.particles = []; this.particleLift = 180; this.hueStart = 0; this.hueEnd = 120; this.hue = 0; this.gravity = 0.15; this.particleRate = 4; this.init = function () { this.loop(); }; this.rand = function (rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi) }; this.hitTest = function (x1, y1, w1, h1, x2, y2, w2, h2) { return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1) }; this.updateLoader = function () { if (this.loaded < 100) { this.loaded = this.loaderSpeed; } }; this.renderLoader = function () { this.ctx.fillStyle = "#000"; this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight); this.hue = this.hueStart + (this.loaded / 100) * (this.hueEnd - this.hueStart); var newWidth = (this.loaded / 100) * this.loaderWidth; this.ctx.fillStyle = "hsla(" + this.hue + ", 100%, 40%, 1)"; this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight); this.ctx.fillStyle = "#222"; this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight / 2); }; this.Particle = function () { this.x = _this.loader.x + ((_this.loaded / 100) * _this.loaderWidth) - _this.rand(0, 1); this.y = _this.ch / 2 + _this.rand(0, _this.loaderHeight) - _this.loaderHeight / 2; this.vx = (_this.rand(0, 4) - 2) / 100; this.vy = (_this.rand(0, _this.particleLift) - _this.particleLift * 2) / 100; this.width = _this.rand(1, 4) / 2; this.height = _this.rand(1, 4) / 2; this.hue = _this.hue; }; this.Particle.prototype.update = function (i) { this.vx += (_this.rand(0, 6) - 3) / 100; this.vy += _this.gravity; this.x += this.vx; this.y += this.vy; if (this.y > _this.ch) { _this.particles.splice(i, 1); } }; this.Particle.prototype.render = function () { _this.ctx.fillStyle = "hsla(" + this.hue + ", 100%, " + _this.rand(50, 70) + "%, " + _this.rand(20, 100) / 100 + ")"; _this.ctx.fillRect(this.x, this.y, this.width, this.height); }; this.createParticles = function () { var i = this.particleRate; while (i--) { this.particles.push(new this.Particle()); } }; this.updateParticles = function () { var i = this.particles.length; while (i--) { var p = this.particles[i]; p.update(i); } }; this.renderParticles = function () { var i = this.particles.length; while (i--) { var p = this.particles[i]; p.render(); } }; this.clearCanvas = function () { this.ctx.globalCompositeOperation = "source-over"; this.ctx.clearRect(0, 0, this.cw, this.ch); this.ctx.globalCompositeOperation = "lighter"; }; this.loop = function () { var loopIt = function () { requestAnimationFrame(loopIt, _this.c); _this.clearCanvas(); _this.createParticles(); _this.updateLoader(); _this.updateParticles(); _this.renderLoader(); _this.renderParticles(); }; loopIt(); }; };var setupRAF = function () { var lastTime = 0; var vendors = ["ms", "moz", "webkit", "o"]; for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) { window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"]; window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"]; } if (!window.requestAnimationFrame) { window.requestAnimationFrame = function (callback, element) { var currTime = new Date().getTime(); var timeToCall = Math.max(0, 16 - (currTime - lastTime)); var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall); lastTime = currTime + timeToCall; return id }; } if (!window.cancelAnimationFrame) { window.cancelAnimationFrame = function (id) { clearTimeout(id); }; } };


function create() {
    //背景底纹
    KT_loading = document.createElement('div');
    KT_loading.style.background = '#222 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAFVBMVEUqKiopKSkoKCgjIyMuLi4kJCQtLS0dJckpAAAAO0lEQVR42iXLAQoAUQhCQSvr/kfe910jHIikElsl5qVFa1iE5f0Pom/CNZdbNM6756lQ41NInMfuFPgAHVEAlGk4lvIAAAAASUVORK5CYII=")';
    KT_loading.style.position = "absolute";
    KT_loading.style.width = "100%";
    KT_loading.style.height = "100%";
    KT_loading.style.zIndex = "2";
    KT_loading.style.display = "block";
    KT_loading.style.top = "0px";
    KT_loading.style.left = "0px";
    document.body.appendChild(KT_loading);

    //进度文字
    KT_loadText = document.createElement('div');
    KT_loadText.style.position = "absolute";
    KT_loadText.style.width = "40px";
    KT_loadText.style.height = "20px";
    KT_loadText.style.top = "50%";
    KT_loadText.style.marginTop = "-30px";
    KT_loadText.style.left = "50%";
    KT_loadText.style.marginLeft = "-20px";
    KT_loadText.style.color = "#ff0000";
    KT_loadText.style.fontSize = "14px";
    KT_loadText.style.textAlign = "center";
    KT_loadText.innerHTML = "0%";
    KT_loading.appendChild(KT_loadText);

    //进度条
    KT_cbox = document.createElement('canvas');
    KT_cbox.style.position = "absolute";
    KT_cbox.style.width = "400px";
    KT_cbox.style.height = "150px";
    KT_cbox.style.zIndex = "99";
    KT_cbox.style.top = "50%";
    KT_cbox.style.marginTop = "-75px";
    KT_cbox.style.left = "50%";
    KT_cbox.style.marginLeft = "-230px";
    KT_loading.appendChild(KT_cbox);
    KT_cl = new lightLoader(KT_cbox, 400, 150);
}


function update(percentComplete) {
    KT_cl.loaderSpeed = Math.round(percentComplete) * 0.85;                              //进度条
    KT_loadText.innerHTML = Math.round(percentComplete) + '%';                           //进度文字
    KT_loadText.style.color = 'hsla(' + Math.round(percentComplete) + ', 100%, 40%, 1)';   //进度文字颜色
    // if (percentComplete >= 100) document.body.removeChild(KT_loading)
}


function remove() {
    KT_loading && document.body.removeChild(KT_loading);
}

const progress = {
    init: () => {
        create();
        setupRAF();
        KT_cl.init();
    },
    update,
    remove,
};

const vertexShader = `
#include <common>
#include <logdepthbuf_pars_vertex>
uniform vec3 u_color;
uniform float u_height;

varying float v_opacity;

void main() {
    // 计算透明度，从底部到顶部逐渐透明
    v_opacity = mix(1.0, 0.0, position.y / u_height);

    // 计算顶点位置
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #include <logdepthbuf_vertex>
}
`;

const fragmentShader = `
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 u_color;
uniform float u_opacity;

varying float v_opacity;

void main() {
    // 应用透明度
    gl_FragColor = vec4(u_color, v_opacity * u_opacity);
      #include <logdepthbuf_fragment>
}
`;

const fenceGradation = {
  vertexShader,
  fragmentShader,
};

// position = Vector3
/**
 * 电子围栏
 * @param {Object} options 选项
 * @param {Number} options.height 围栏高度
 * @param {Number} options.opacity 围栏透明度
 * @param {String} options.color 围栏颜色
 * @param {Number} options.renderOrder 围栏渲染顺序
 * @param {Number} options.type 围栏类型 1: 电子围栏 2: 人工围栏
 * @param {Boolean} options.close 闭合围栏
 */
class Fence {
  constructor(options) {
    this.options = {
      height: 10,
      opacity: 0.9,
      color: '#efad35',
      renderOrder: 1,
      type: 1,
      close: true,
      ...options,
    };
    this.positionList = [];

    this.fenceGroup = new Bol3D.Group();
    this.fenceGroup.name = 'fenceGroup';

    this.fenceContainer = new Bol3D.Group();
    this.fenceContainer.name = 'fenceContainer';

    addScene(this.fenceGroup);
    addScene(this.fenceContainer);
  }

  create(options) {
    const { height, opacity, color, renderOrder, start, end, type } = options;
    // 创建几何体
    const length = new Bol3D.Vector3().subVectors(end, start).length();
    const geometry = new Bol3D.PlaneGeometry(length, height);
    type === 1 && geometry.translate(0, height / 2, 0);
    // 计算墙的中心位置
    const center = new Bol3D.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // 计算墙的旋转角度
    const direction = new Bol3D.Vector3().subVectors(end, start).normalize();
    const quaternion = new Bol3D.Quaternion().setFromUnitVectors(new Bol3D.Vector3(1, 0, 0), direction);
    // 创建材质
    const material = this.createFence1(options);

    // 创建网格
    const mesh = new Bol3D.Mesh(geometry, material);
    mesh.position.copy(center);
    mesh.setRotationFromQuaternion(quaternion);
    mesh.renderOrder = renderOrder || 1;
    return mesh
  }

  createFence1(options) {
    const { height, opacity, color } = options;
    return new Bol3D.ShaderMaterial({
      uniforms: {
        u_height: {
          value: height,
        },
        u_opacity: {
          value: opacity,
        },
        u_color: {
          value: new Bol3D.Color(color),
        },
        time: {
          value: 0,
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: Bol3D.DoubleSide,
      vertexShader: fenceGradation.vertexShader,
      fragmentShader: fenceGradation.fragmentShader,
    })
  }

  add(position, options = {}) {
    options = {
      ...this.options,
      ...options,
    };

    this.positionList.push({ position, options });
    if (this.positionList.length < 2) return
    const _options = {
      start: this.positionList.at(-2).position,
      end: this.positionList.at(-1).position,
      ...options,
    };

    const mesh = this.create(_options);

    mesh.userData = _options;
    this.fenceGroup.add(mesh);

    this.closeFence();
    return mesh
  }

  closeFence() {
    if (this.options.close && this.positionList.length > 2) {
      const _closeFence = this.fenceGroup.children.find((item) => item.isCloseFence);
      if (_closeFence) removeModel(_closeFence);
      const _options = {
        start: this.positionList.at(0).position,
        end: this.positionList.at(-1).position,
        ...this.options,
      };
      const closeFence = this.create(_options);
      closeFence.userData = _options;
      this.fenceGroup.add(closeFence);
      closeFence.isCloseFence = true;
    }
  }

  delete(fence) {
    const f = this.fenceContainer.children.find((item) => item === fence);
    f && removeModel(f);
  }

  deleteLast() {
    this.positionList.pop();
    if (!this.fenceGroup.children.length) return
    const _closeFence = this.fenceGroup.children.find((item) => item.isCloseFence);
    if (_closeFence) removeModel(_closeFence);
    // 销毁 fenceGroup 里 children 里的 最后一个
    const mesh = this.fenceGroup.children.pop();
    removeModel(mesh);
    this.closeFence();
  }

  clearALL() {
    removeModel(this.fenceContainer);
  }

  clear() {
    // 销毁 fenceGroup 里 children 里的所有
    this.positionList = [];
    disposeModel(this.fenceGroup);
    this.fenceGroup.children = [];
  }

  save() {
    const fence = this.fenceGroup.clone();
    this.fenceContainer.add(fence);
    // 销毁 fenceGroup
    disposeModel(this.fenceGroup);
    this.positionList = [];
    return fence
  }

  createFenceByOptions(options) {
    const fenceGroup = new Bol3D.Group();
    options.forEach((op) => {
      const mesh = this.create(op);
      mesh.userData = op;
      fenceGroup.add(mesh);
    });
    return fenceGroup
  }

  load(data) {
    data.forEach((option) => {
      const fence = this.createFenceByOptions(option);
      this.fenceContainer.add(fence);
    });
  }

  export() {
    const options = this.fenceContainer.children.map((item) => {
      return item.children.map((c) => c.userData)
    });
    return options
  }

  clearAll() {
    removeModel(this.fenceContainer, false);
  }
}

function earcut(data, holeIndices, dim = 2) {

    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
    let outerNode = linkedList(data, 0, outerLen, dim, true);
    const triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    let minX, minY, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = Infinity;
        minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (let i = dim; i < outerLen; i += dim) {
            const x = data[i];
            const y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 32767 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    let last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (let i = start; i < end; i += dim) last = insertNode(i / dim | 0, data[i], data[i + 1], last);
    } else {
        for (let i = end - dim; i >= start; i -= dim) last = insertNode(i / dim | 0, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    let p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    let stop = ear;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        const prev = ear.prev;
        const next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev.i, ear.i, next.i); // cut off the triangle

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    const a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

    // triangle bbox
    const x0 = Math.min(ax, bx, cx),
        y0 = Math.min(ay, by, cy),
        x1 = Math.max(ax, bx, cx),
        y1 = Math.max(ay, by, cy);

    let p = c.next;
    while (p !== a) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
            pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    const a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

    // triangle bbox
    const x0 = Math.min(ax, bx, cx),
        y0 = Math.min(ay, by, cy),
        x1 = Math.max(ax, bx, cx),
        y1 = Math.max(ay, by, cy);

    // z-order range for the current triangle bbox;
    const minZ = zOrder(x0, y0, minX, minY, invSize),
        maxZ = zOrder(x1, y1, minX, minY, invSize);

    let p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
            pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
            pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
            pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
            pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles) {
    let p = start;
    do {
        const a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i, p.i, b.i);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    let a = start;
    do {
        let b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                let c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    const queue = [];

    for (let i = 0, len = holeIndices.length; i < len; i++) {
        const start = holeIndices[i] * dim;
        const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        const list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareXYSlope);

    // process holes from left to right
    for (let i = 0; i < queue.length; i++) {
        outerNode = eliminateHole(queue[i], outerNode);
    }

    return outerNode;
}

function compareXYSlope(a, b) {
    let result = a.x - b.x;
    // when the left-most point of 2 holes meet at a vertex, sort the holes counterclockwise so that when we find
    // the bridge to the outer shell is always the point that they meet at.
    if (result === 0) {
        result = a.y - b.y;
        if (result === 0) {
            const aSlope = (a.next.y - a.y) / (a.next.x - a.x);
            const bSlope = (b.next.y - b.y) / (b.next.x - b.x);
            result = aSlope - bSlope;
        }
    }
    return result;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    const bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
        return outerNode;
    }

    const bridgeReverse = splitPolygon(bridge, hole);

    // filter collinear points around the cuts
    filterPoints(bridgeReverse, bridgeReverse.next);
    return filterPoints(bridge, bridge.next);
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    let p = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    // unless they intersect at a vertex, then choose the vertex
    if (equals(hole, p)) return p;
    do {
        if (equals(hole, p.next)) return p.next;
        else if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                m = p.x < p.next.x ? p : p.next;
                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    const stop = m;
    const mx = m.x;
    const my = m.y;
    let tanMin = Infinity;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            const tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    let p = start;
    do {
        if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    let numMerges;
    let inSize = 1;

    do {
        let p = list;
        let e;
        list = null;
        let tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            let q = p;
            let pSize = 0;
            for (let i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            let qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = (x - minX) * invSize | 0;
    y = (y - minY) * invSize | 0;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    let p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
           (bx - px) * (cy - py) >= (cx - px) * (by - py);
}

// check if a point lies within a convex triangle but false if its equal to the first point of the triangle
function pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, px, py) {
    return !(ax === px && ay === py) && pointInTriangle(ax, ay, bx, by, cx, cy, px, py);
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    const o1 = sign(area(p1, q1, p2));
    const o2 = sign(area(p1, q1, q2));
    const o3 = sign(area(p2, q2, p1));
    const o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    let p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    let p = a;
    let inside = false;
    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    const a2 = createNode(a.i, a.x, a.y),
        b2 = createNode(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    const p = createNode(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function createNode(i, x, y) {
    return {
        i, // vertex index in coordinates array
        x, y, // vertex coordinates
        prev: null, // previous and next vertex nodes in a polygon ring
        next: null,
        z: 0, // z-order curve value
        prevZ: null, // previous and next nodes in z-order
        nextZ: null,
        steiner: false // indicates whether this is a steiner point
    };
}

function signedArea(data, start, end, dim) {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

class Area {
  constructor() {
    this.pointList = []; // 面积点列表 [x,y,z]
    this.areaGroup = new Bol3D.Group(); // 面积容器
    this.areaGroup.name = 'areaGroup';
    this.area = 0; // 面积
    this.midPoint = [0, 0, 0]; // 中心点
    this.areaPlane = null; // 面积平面
    container.scene.add(this.areaGroup); // 加入场景
    this.hoverPoint = new Bol3D.Vector3(); // 鼠标悬停点
    this.init();
  }

  init() {
    this.tips = new Bol3D.POI.Popup2DObject({
      value: `<div id="to-3d-area-tips" style="position: absolute;
                                               transform: translate(-50%, -50%);
                                               background: rgba(0, 0, 0, 0.8);
                                               border-radius: 3px; 
                                               color: white;
                                               padding: 1px 10px; 
                                               white-space: nowrap;" class="to-3d-distance">0</div>`,
      position: [0, 0, 0],
      className: 'to-3d-area-tips',
      size: 1,
      closeVisible: false,
      click: () => {},
      dblclick: (e) => {},
    });
    this.tips.visible = false;
    addScene(this.tips);
  }

  updateTips(fnc) {
    this.tips.visible = this.pointList.length > 1;
    const potison = this.pointList.at(-1);
    if (potison) {
      this.tips.position.set(...potison);
    }
    fnc?.(this.tips, this.area);
  }

  // 生成面积平面
  create(pointList) {
    if (pointList.length < 2) return
    const points = pointList;
    const count = pointList.length;
    // 创建几何体
    const geometry = new Bol3D.BufferGeometry();
    let coords = [];
    let vertices = [];
    let indices = [];
    for (let i = 0; i < count; i++) {
      const point = points[i];
      coords = coords.concat([point[0], point[2]]);
      vertices = vertices.concat(point[0], point[1], point[2]);
    }
    indices = earcut(coords);
    geometry.setIndex(indices);
    geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(vertices, 3));
    // 创建材质
    const material = new Bol3D.MeshBasicMaterial({
      color: 0xff0000,
      side: Bol3D.DoubleSide,
      opacity: 0.5,
      transparent: true,
    });
    // 创建网格
    const areaPlane = new Bol3D.Mesh(geometry, material);
    areaPlane.name = 'areaPlane';

    // 高度多加 0.02 防止被遮挡
    // areaPlane.position.y = pointList[0][1] + 0.02

    const p1 = new Bol3D.Vector3(...pointList[0]);
    const p2 = new Bol3D.Vector3(...points[Math.round(count / 2)]);
    // 面积
    const area = computeGeometryArea(geometry);
    // 计算中心点
    const midPoint = new Bol3D.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    this.areaPlane = areaPlane;
    areaPlane.position.y += 0.01;
    this.area = area;
    this.midPoint = [midPoint.x, midPoint.y, midPoint.z];
  }

  //  清除面积平面
  clear() {
    // 每次创建前先清除之前的面积平面
    this.areaGroup.children.forEach((item) => {
      if (item.isMesh) {
        item.geometry.dispose();
        item.material.dispose();
        item.parent.remove(item);
      }
    });
    this.tips.visible = false;
  }

  // 添加面积平面点位
  add(point) {
    this.clear();
    this.pointList.push(point);
    this.create(this.pointList);
    this.areaPlane && this.areaGroup.add(this.areaPlane);
  }

  // 更新面积平面点位
  update(point) {
    this.clear();
    const pointList = [...this.pointList, point.toArray()];
    this.create(pointList);
    this.hoverPoint.copy(point);
    this.areaPlane && this.areaGroup.add(this.areaPlane);
  }

  // 删除上一个点位
  deleteLastPoint() {
    this.clear();
    this.pointList.pop();
    this.create(this.pointList);
    this.areaPlane && this.areaGroup.add(this.areaPlane);
  }

  // 销毁
  dispose() {
    this.clear();
    this.pointList = [];
    this.area = 0;
    this.midPoint = [0, 0, 0];
    if (this.areaPlane) {
      this.areaPlane.geometry.dispose();
      this.areaPlane.material.dispose();
      this.areaGroup.remove(this.areaPlane);
      this.areaPlane = null;
    }
  }
}

// 面积计算方法
function computeGeometryArea(geometry) {
  let area = 0; // 初始化总面积为 0
  const position = geometry.attributes.position; // 获取顶点位置属性
  const index = geometry.index; // 获取索引

  // 如果几何体没有索引，就使用之前的方法直接计算
  if (!index) {
    for (let i = 0; i < position.count; i += 3) {
      const p1 = new Bol3D.Vector3().fromBufferAttribute(position, i);
      const p2 = new Bol3D.Vector3().fromBufferAttribute(position, i + 1);
      const p3 = new Bol3D.Vector3().fromBufferAttribute(position, i + 2);

      const edge1 = new Bol3D.Vector3().subVectors(p2, p1);
      const edge2 = new Bol3D.Vector3().subVectors(p3, p1);
      const crossProduct = new Bol3D.Vector3().crossVectors(edge1, edge2);
      const triangleArea = crossProduct.length() / 2;
      area += triangleArea;
    }
  } else {
    // 如果有索引，则使用索引来计算每个三角形的面积
    const indices = index.array; // 获取索引数组

    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i + 1];
      const c = indices[i + 2];

      const p1 = new Bol3D.Vector3().fromBufferAttribute(position, a);
      const p2 = new Bol3D.Vector3().fromBufferAttribute(position, b);
      const p3 = new Bol3D.Vector3().fromBufferAttribute(position, c);

      const edge1 = new Bol3D.Vector3().subVectors(p2, p1);
      const edge2 = new Bol3D.Vector3().subVectors(p3, p1);
      const crossProduct = new Bol3D.Vector3().crossVectors(edge1, edge2);
      const triangleArea = crossProduct.length() / 2;
      area += triangleArea;
    }
  }

  return area
}

// 创建平面
function createPlane(points, options) {
  const count = points.length;
  // 创建几何体
  const geometry = new Bol3D.BufferGeometry();

  let coords = [];
  let vertices = [];
  let indices = [];

  for (let i = 0; i < count; i++) {
    const point = points[i];
    coords = coords.concat([point[0], point[2]]);
    vertices = vertices.concat(...point);
  }
  indices = earcut(coords);
  geometry.setIndex(indices);
  geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(vertices, 3));

  // **************************************************************

  // 创建材质
  const material = new Bol3D.MeshBasicMaterial({
    color: 0xff0000,
    side: Bol3D.DoubleSide,
    ...options,
  });

  // 创建网格
  const mesh = new Bol3D.Mesh(geometry, material);
  return mesh
}

/**
 * 获取实例化模型的矩阵信息
 * @param {Bol3D.InstancedMesh} object 实例化模型
 * @param {number} instanceId 实例编号
*/
function getInstanceMatrix(object, instanceId) {
  const matrix = new Bol3D.Matrix4();
  object.getMatrixAt(instanceId, matrix);
  return matrix
}

/**
 * 设置实例化模型的位置
 * @param {Bol3D.InstancedMesh} object 实例化模型
 * @param {number} instanceId 实例编号
 * @param {Bol3D.Matrix4} matrix 位置矩阵
*/
function setInstanceMatrix(object, instanceId, matrix) {
  object.setMatrixAt(instanceId, matrix);
  object.instanceMatrix.needsUpdate = true;
}

/**
 * 获取实例化模型的位置、旋转和缩放信息
 * @param {Bol3D.InstancedMesh} object 实例化模型
 * @param {number} instanceId 实例编号
 * @returns {object} 位置、旋转和缩放信息
*/
function getInstanceTransformInfo(object, instanceId) {
  const matrix = getInstanceMatrix(object, instanceId);
  const position = new Bol3D.Vector3();
  const quaternion = new Bol3D.Quaternion();
  const scale = new Bol3D.Vector3();
  matrix.decompose(position, quaternion, scale);
  return { position, quaternion, scale }
}

/**
 * 设置实例化模型的颜色
 * @param {Bol3D.InstancedMesh} object 实例化模型
 * @param {number} instanceId 实例编号
 * @param {Bol3D.Color} 实例颜色
 */
function setInstanceColor(object, instanceId, color) {
  object.setColorAt(instanceId, color);
  object.instanceColor.needsUpdate = true;
}

/**
 * 获取实例化模型的颜色
 * @param {Bol3D.InstancedMesh} object 实例化模型
 * @param {number} instanceId 实例编号
 * @returns {Bol3D.Color} 实例颜色
 */
function getInstanceColor(object, instanceId) {
  const color = new Bol3D.Color();
  object.getColorAt(instanceId, color);
  return color
}

/**
 * 创建实例化模型
 * @param {Bol3D.Geometry} geometry 几何体
 * @param {Bol3D.Material} material 材质
 * @param {number} count 实例数量
 * @param {function} callback 实例化模型的回调函数，用于设置实例的属性
 */
function createInstancedMesh(geometry, material, count, callback) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  for (let i = 0; i < count; i++) {
    callback(mesh, i);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh
}

var instance = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getInstanceMatrix: getInstanceMatrix,
  setInstanceMatrix: setInstanceMatrix,
  getInstanceTransformInfo: getInstanceTransformInfo,
  setInstanceColor: setInstanceColor,
  getInstanceColor: getInstanceColor,
  createInstancedMesh: createInstancedMesh
});

const {
  Box3: Box3$1,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer: InstancedInterleavedBuffer$1,
  InterleavedBufferAttribute: InterleavedBufferAttribute$1,
  Sphere: Sphere$1,
  Vector3: Vector3$1,
  WireframeGeometry,
} = Bol3D;

const _box$1 = new Box3$1();
const _vector = new Vector3$1();

class LineSegmentsGeometry extends InstancedBufferGeometry {
  constructor() {
    super();

    this.isLineSegmentsGeometry = true;

    this.type = 'LineSegmentsGeometry';

    const positions = [
      -1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1,
      0,
    ];
    const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
    const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];

    this.setIndex(index);
    this.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  }

  applyMatrix4(matrix) {
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;

    if (start !== undefined) {
      start.applyMatrix4(matrix);

      end.applyMatrix4(matrix);

      start.needsUpdate = true;
    }

    if (this.boundingBox !== null) {
      this.computeBoundingBox();
    }

    if (this.boundingSphere !== null) {
      this.computeBoundingSphere();
    }

    return this
  }

  setPositions(array) {
    let lineSegments;

    if (array instanceof Float32Array) {
      lineSegments = array;
    } else if (Array.isArray(array)) {
      lineSegments = new Float32Array(array);
    }

    const instanceBuffer = new InstancedInterleavedBuffer$1(lineSegments, 6, 1); // xyz, xyz

    this.setAttribute(
      'instanceStart',
      new InterleavedBufferAttribute$1(instanceBuffer, 3, 0)
    ); // xyz
    this.setAttribute(
      'instanceEnd',
      new InterleavedBufferAttribute$1(instanceBuffer, 3, 3)
    ); // xyz

    //

    this.computeBoundingBox();
    this.computeBoundingSphere();

    return this
  }

  setColors(array) {
    let colors;

    if (array instanceof Float32Array) {
      colors = array;
    } else if (Array.isArray(array)) {
      colors = new Float32Array(array);
    }

    const instanceColorBuffer = new InstancedInterleavedBuffer$1(colors, 6, 1); // rgb, rgb

    this.setAttribute(
      'instanceColorStart',
      new InterleavedBufferAttribute$1(instanceColorBuffer, 3, 0)
    ); // rgb
    this.setAttribute(
      'instanceColorEnd',
      new InterleavedBufferAttribute$1(instanceColorBuffer, 3, 3)
    ); // rgb

    return this
  }

  fromWireframeGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);

    return this
  }

  fromEdgesGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);

    return this
  }

  fromMesh(mesh) {
    this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry));

    // set colors, maybe

    return this
  }

  fromLineSegments(lineSegments) {
    const geometry = lineSegments.geometry;

    this.setPositions(geometry.attributes.position.array); // assumes non-indexed

    // set colors, maybe

    return this
  }

  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3$1();
    }

    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;

    if (start !== undefined && end !== undefined) {
      this.boundingBox.setFromBufferAttribute(start);

      _box$1.setFromBufferAttribute(end);

      this.boundingBox.union(_box$1);
    }
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere$1();
    }

    if (this.boundingBox === null) {
      this.computeBoundingBox();
    }

    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;

    if (start !== undefined && end !== undefined) {
      const center = this.boundingSphere.center;

      this.boundingBox.getCenter(center);

      let maxRadiusSq = 0;

      for (let i = 0, il = start.count; i < il; i++) {
        _vector.fromBufferAttribute(start, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));

        _vector.fromBufferAttribute(end, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
      }

      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

      if (isNaN(this.boundingSphere.radius)) {
        console.error(
          'THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.',
          this
        );
      }
    }
  }

  toJSON() {
    // todo
  }

  applyMatrix(matrix) {
    console.warn(
      'THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().'
    );

    return this.applyMatrix4(matrix)
  }
}

const { ShaderLib, ShaderMaterial, UniformsLib, UniformsUtils, Vector2 } = Bol3D;

UniformsLib.line = {
	worldUnits: { value: 1 },
	linewidth: { value: 1 },
	resolution: { value: new Vector2(1, 1) },
	dashOffset: { value: 0 },
	dashScale: { value: 1 },
	dashSize: { value: 1 },
	gapSize: { value: 1 }, // todo FIX - maybe change to totalSize
};

ShaderLib['line'] = {
	uniforms: UniformsUtils.merge([
		UniformsLib.common,
		UniformsLib.fog,
		UniformsLib.line,
	]),

	vertexShader: /* glsl */ `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,

	fragmentShader: /* glsl */ `
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`,
};

class LineMaterial extends ShaderMaterial {
	constructor(parameters) {
		super({
			type: 'LineMaterial',

			uniforms: UniformsUtils.clone(ShaderLib['line'].uniforms),

			vertexShader: ShaderLib['line'].vertexShader,
			fragmentShader: ShaderLib['line'].fragmentShader,

			clipping: true, // required for clipping support
		});

		this.isLineMaterial = true;

		this.setValues(parameters);
	}

	get color() {
		return this.uniforms.diffuse.value
	}

	set color(value) {
		this.uniforms.diffuse.value = value;
	}

	get worldUnits() {
		return 'WORLD_UNITS' in this.defines
	}

	set worldUnits(value) {
		if (value === true) {
			this.defines.WORLD_UNITS = '';
		} else {
			delete this.defines.WORLD_UNITS;
		}
	}

	get linewidth() {
		return this.uniforms.linewidth.value
	}

	set linewidth(value) {
		if (!this.uniforms.linewidth) return
		this.uniforms.linewidth.value = value;
	}

	get dashed() {
		return 'USE_DASH' in this.defines
	}

	set dashed(value) {
		if ((value === true) !== this.dashed) {
			this.needsUpdate = true;
		}

		if (value === true) {
			this.defines.USE_DASH = '';
		} else {
			delete this.defines.USE_DASH;
		}
	}

	get dashScale() {
		return this.uniforms.dashScale.value
	}

	set dashScale(value) {
		this.uniforms.dashScale.value = value;
	}

	get dashSize() {
		return this.uniforms.dashSize.value
	}

	set dashSize(value) {
		this.uniforms.dashSize.value = value;
	}

	get dashOffset() {
		return this.uniforms.dashOffset.value
	}

	set dashOffset(value) {
		this.uniforms.dashOffset.value = value;
	}

	get gapSize() {
		return this.uniforms.gapSize.value
	}

	set gapSize(value) {
		this.uniforms.gapSize.value = value;
	}

	get opacity() {
		return this.uniforms.opacity.value
	}

	set opacity(value) {
		if (!this.uniforms) return
		this.uniforms.opacity.value = value;
	}

	get resolution() {
		return this.uniforms.resolution.value
	}

	set resolution(value) {
		this.uniforms.resolution.value.copy(value);
	}

	get alphaToCoverage() {
		return 'USE_ALPHA_TO_COVERAGE' in this.defines
	}

	set alphaToCoverage(value) {
		if (!this.defines) return

		if ((value === true) !== this.alphaToCoverage) {
			this.needsUpdate = true;
		}

		if (value === true) {
			this.defines.USE_ALPHA_TO_COVERAGE = '';
		} else {
			delete this.defines.USE_ALPHA_TO_COVERAGE;
		}
	}
}

const {
  Box3,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute,
  Line3,
  MathUtils,
  Matrix4,
  Mesh,
  Sphere,
  Vector3,
  Vector4,
} = Bol3D;

const _viewport = new Vector4();

const _start = new Vector3();
const _end = new Vector3();

const _start4 = new Vector4();
const _end4 = new Vector4();

const _ssOrigin = new Vector4();
const _ssOrigin3 = new Vector3();
const _mvMatrix = new Matrix4();
const _line = new Line3();
const _closestPoint = new Vector3();

const _box = new Box3();
const _sphere = new Sphere();
const _clipToWorldVector = new Vector4();

let _ray, _lineWidth;

// Returns the margin required to expand by in world space given the distance from the camera,
// line width, resolution, and camera projection
function getWorldSpaceHalfWidth(camera, distance, resolution) {
  // transform into clip space, adjust the x and y values by the pixel width offset, then
  // transform back into world space to get world offset. Note clip space is [-1, 1] so full
  // width does not need to be halved.
  _clipToWorldVector
    .set(0, 0, -distance, 1.0)
    .applyMatrix4(camera.projectionMatrix);
  _clipToWorldVector.multiplyScalar(1.0 / _clipToWorldVector.w);
  _clipToWorldVector.x = _lineWidth / resolution.width;
  _clipToWorldVector.y = _lineWidth / resolution.height;
  _clipToWorldVector.applyMatrix4(camera.projectionMatrixInverse);
  _clipToWorldVector.multiplyScalar(1.0 / _clipToWorldVector.w);

  return Math.abs(Math.max(_clipToWorldVector.x, _clipToWorldVector.y))
}

function raycastWorldUnits(lineSegments, intersects) {
  const matrixWorld = lineSegments.matrixWorld;
  const geometry = lineSegments.geometry;
  const instanceStart = geometry.attributes.instanceStart;
  const instanceEnd = geometry.attributes.instanceEnd;
  const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);

  for (let i = 0, l = segmentCount; i < l; i++) {
    _line.start.fromBufferAttribute(instanceStart, i);
    _line.end.fromBufferAttribute(instanceEnd, i);

    _line.applyMatrix4(matrixWorld);

    const pointOnLine = new Vector3();
    const point = new Vector3();

    _ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
    const isInside = point.distanceTo(pointOnLine) < _lineWidth * 0.5;

    if (isInside) {
      intersects.push({
        point,
        pointOnLine,
        distance: _ray.origin.distanceTo(point),
        object: lineSegments,
        face: null,
        faceIndex: i,
        uv: null,
        uv1: null,
      });
    }
  }
}

function raycastScreenSpace(lineSegments, camera, intersects) {
  const projectionMatrix = camera.projectionMatrix;
  const material = lineSegments.material;
  const resolution = material.resolution;
  const matrixWorld = lineSegments.matrixWorld;

  const geometry = lineSegments.geometry;
  const instanceStart = geometry.attributes.instanceStart;
  const instanceEnd = geometry.attributes.instanceEnd;
  const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);

  const near = -camera.near;

  //

  // pick a point 1 unit out along the ray to avoid the ray origin
  // sitting at the camera origin which will cause "w" to be 0 when
  // applying the projection matrix.
  _ray.at(1, _ssOrigin);

  // ndc space [ - 1.0, 1.0 ]
  _ssOrigin.w = 1;
  _ssOrigin.applyMatrix4(camera.matrixWorldInverse);
  _ssOrigin.applyMatrix4(projectionMatrix);
  _ssOrigin.multiplyScalar(1 / _ssOrigin.w);

  // screen space
  _ssOrigin.x *= resolution.x / 2;
  _ssOrigin.y *= resolution.y / 2;
  _ssOrigin.z = 0;

  _ssOrigin3.copy(_ssOrigin);

  _mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);

  for (let i = 0, l = segmentCount; i < l; i++) {
    _start4.fromBufferAttribute(instanceStart, i);
    _end4.fromBufferAttribute(instanceEnd, i);

    _start4.w = 1;
    _end4.w = 1;

    // camera space
    _start4.applyMatrix4(_mvMatrix);
    _end4.applyMatrix4(_mvMatrix);

    // skip the segment if it's entirely behind the camera
    const isBehindCameraNear = _start4.z > near && _end4.z > near;
    if (isBehindCameraNear) {
      continue
    }

    // trim the segment if it extends behind camera near
    if (_start4.z > near) {
      const deltaDist = _start4.z - _end4.z;
      const t = (_start4.z - near) / deltaDist;
      _start4.lerp(_end4, t);
    } else if (_end4.z > near) {
      const deltaDist = _end4.z - _start4.z;
      const t = (_end4.z - near) / deltaDist;
      _end4.lerp(_start4, t);
    }

    // clip space
    _start4.applyMatrix4(projectionMatrix);
    _end4.applyMatrix4(projectionMatrix);

    // ndc space [ - 1.0, 1.0 ]
    _start4.multiplyScalar(1 / _start4.w);
    _end4.multiplyScalar(1 / _end4.w);

    // screen space
    _start4.x *= resolution.x / 2;
    _start4.y *= resolution.y / 2;

    _end4.x *= resolution.x / 2;
    _end4.y *= resolution.y / 2;

    // create 2d segment
    _line.start.copy(_start4);
    _line.start.z = 0;

    _line.end.copy(_end4);
    _line.end.z = 0;

    // get closest point on ray to segment
    const param = _line.closestPointToPointParameter(_ssOrigin3, true);
    _line.at(param, _closestPoint);

    // check if the intersection point is within clip space
    const zPos = MathUtils.lerp(_start4.z, _end4.z, param);
    const isInClipSpace = zPos >= -1 && zPos <= 1;

    const isInside = _ssOrigin3.distanceTo(_closestPoint) < _lineWidth * 0.5;

    if (isInClipSpace && isInside) {
      _line.start.fromBufferAttribute(instanceStart, i);
      _line.end.fromBufferAttribute(instanceEnd, i);

      _line.start.applyMatrix4(matrixWorld);
      _line.end.applyMatrix4(matrixWorld);

      const pointOnLine = new Vector3();
      const point = new Vector3();

      _ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);

      intersects.push({
        point: point,
        pointOnLine: pointOnLine,
        distance: _ray.origin.distanceTo(point),
        object: lineSegments,
        face: null,
        faceIndex: i,
        uv: null,
        uv1: null,
      });
    }
  }
}

class LineSegments2 extends Mesh {
  constructor(
    geometry = new LineSegmentsGeometry(),
    material = new LineMaterial({ color: Math.random() * 0xffffff })
  ) {
    super(geometry, material);

    this.isLineSegments2 = true;

    this.type = 'LineSegments2';
  }

  // for backwards-compatibility, but could be a method of LineSegmentsGeometry...

  computeLineDistances() {
    const geometry = this.geometry;

    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const lineDistances = new Float32Array(2 * instanceStart.count);

    for (let i = 0, j = 0, l = instanceStart.count; i < l; i++, j += 2) {
      _start.fromBufferAttribute(instanceStart, i);
      _end.fromBufferAttribute(instanceEnd, i);

      lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
      lineDistances[j + 1] = lineDistances[j] + _start.distanceTo(_end);
    }

    const instanceDistanceBuffer = new InstancedInterleavedBuffer(
      lineDistances,
      2,
      1
    ); // d0, d1

    geometry.setAttribute(
      'instanceDistanceStart',
      new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)
    ); // d0
    geometry.setAttribute(
      'instanceDistanceEnd',
      new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)
    ); // d1

    return this
  }

  raycast(raycaster, intersects) {
    const worldUnits = this.material.worldUnits;
    const camera = raycaster.camera;

    if (camera === null && !worldUnits) {
      console.error(
        'LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'
      );
    }

    const threshold =
      raycaster.params.Line2 !== undefined
        ? raycaster.params.Line2.threshold || 0
        : 0;

    _ray = raycaster.ray;

    const matrixWorld = this.matrixWorld;
    const geometry = this.geometry;
    const material = this.material;

    _lineWidth = material.linewidth + threshold;

    // check if we intersect the sphere bounds
    if (geometry.boundingSphere === null) {
      geometry.computeBoundingSphere();
    }

    _sphere.copy(geometry.boundingSphere).applyMatrix4(matrixWorld);

    // increase the sphere bounds by the worst case line screen space width
    let sphereMargin;
    if (worldUnits) {
      sphereMargin = _lineWidth * 0.5;
    } else {
      const distanceToSphere = Math.max(
        camera.near,
        _sphere.distanceToPoint(_ray.origin)
      );
      sphereMargin = getWorldSpaceHalfWidth(
        camera,
        distanceToSphere,
        material.resolution
      );
    }

    _sphere.radius += sphereMargin;

    if (_ray.intersectsSphere(_sphere) === false) {
      return
    }

    // check if we intersect the box bounds
    if (geometry.boundingBox === null) {
      geometry.computeBoundingBox();
    }

    _box.copy(geometry.boundingBox).applyMatrix4(matrixWorld);

    // increase the box bounds by the worst case line width
    let boxMargin;
    if (worldUnits) {
      boxMargin = _lineWidth * 0.5;
    } else {
      const distanceToBox = Math.max(
        camera.near,
        _box.distanceToPoint(_ray.origin)
      );
      boxMargin = getWorldSpaceHalfWidth(
        camera,
        distanceToBox,
        material.resolution
      );
    }

    _box.expandByScalar(boxMargin);

    if (_ray.intersectsBox(_box) === false) {
      return
    }

    if (worldUnits) {
      raycastWorldUnits(this, intersects);
    } else {
      raycastScreenSpace(this, camera, intersects);
    }
  }

  onBeforeRender(renderer) {
    const uniforms = this.material.uniforms;

    if (uniforms && uniforms.resolution) {
      renderer.getViewport(_viewport);
      this.material.uniforms.resolution.value.set(_viewport.z, _viewport.w);
    }
  }
}

// import { LineGeometry } from './LineGeometry.js'
// import { LineMaterial } from './LineMaterial.js'

class Line2 extends LineSegments2 {
  // constructor(
  //   geometry = new LineGeometry(),
  //   material = new LineMaterial({ color: Math.random() * 0xffffff })
  // ) {
  //   super(geometry, material)
  //   this.isLine2 = true
  //   this.type = 'Line2'
  // }
}

class LineGeometry extends LineSegmentsGeometry {
  constructor() {
    super();

    this.isLineGeometry = true;

    this.type = 'LineGeometry';
  }

  setPositions(array) {
    // converts [ x1, y1, z1,  x2, y2, z2, ... ] to pairs format

    const length = array.length - 3;
    const points = new Float32Array(2 * length);

    for (let i = 0; i < length; i += 3) {
      points[2 * i] = array[i];
      points[2 * i + 1] = array[i + 1];
      points[2 * i + 2] = array[i + 2];

      points[2 * i + 3] = array[i + 3];
      points[2 * i + 4] = array[i + 4];
      points[2 * i + 5] = array[i + 5];
    }

    super.setPositions(points);

    return this
  }

  setColors(array) {
    // converts [ r1, g1, b1,  r2, g2, b2, ... ] to pairs format

    const length = array.length - 3;
    const colors = new Float32Array(2 * length);

    for (let i = 0; i < length; i += 3) {
      colors[2 * i] = array[i];
      colors[2 * i + 1] = array[i + 1];
      colors[2 * i + 2] = array[i + 2];

      colors[2 * i + 3] = array[i + 3];
      colors[2 * i + 4] = array[i + 4];
      colors[2 * i + 5] = array[i + 5];
    }

    super.setColors(colors);

    return this
  }

  fromLine(line) {
    const geometry = line.geometry;

    this.setPositions(geometry.attributes.position.array); // assumes non-indexed

    // set colors, maybe

    return this
  }
}

class Distance {
  constructor() {
    this.distanceGroup = new Bol3D.Group();
    this.distanceGroup.name = 'distance';
    this.pointList = [];
    this.distance = 0;
    this.midPoint = [0, 0, 0]; // 中心点
    addScene(this.distanceGroup);
    this.init();
  }

  init() {
    this.tips = new Bol3D.POI.Popup2DObject({
      value: `<div id="to-3d-distance-tips" style="position: absolute;
                                               transform: translate(-50%, -50%);
                                               background: rgba(0, 0, 0, 0.8);
                                               border-radius: 3px; 
                                               color: white;
                                               padding: 1px 10px; 
                                               white-space: nowrap;" class="to-3d-distance">0</div>`,
      position: [0, 0, 0],
      className: 'to-3d-distance-tips',
      size: 1,
      closeVisible: false,
      click: () => {},
      dblclick: (e) => {},
    });
    this.tips.visible = false;
    addScene(this.tips);

    const geometry = new Bol3D.SphereGeometry(0.5, 16, 16);
    const material = new Bol3D.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new Bol3D.Mesh(geometry, material);
    sphere.visible = false;
    this.startPoint = sphere.clone();
    this.endPoint = sphere.clone();
    this.distanceGroup.add(this.startPoint);
    this.distanceGroup.add(this.endPoint);

    const lineGeometry = new LineGeometry();
    const vertices = [...this.startPoint.position.toArray(), ...this.endPoint.position.toArray()];
    lineGeometry.setPositions(vertices);
    const lineMaterial = new LineMaterial({
      color: 0xff0000,
      linewidth: 2,
    });
    this.line = new Line2(lineGeometry, lineMaterial);
    this.line.visible = false;
    this.line.position.y = 0.1;
    this.distanceGroup.add(this.line);
  }

  updateTips(fnc) {
    this.tips.position.copy(this.midPoint);
    fnc?.(this.tips, this.distance);
  }

  showPoint(isShow = true) {
    this.startPoint.visible = isShow;
    this.endPoint.visible = isShow;
  }

  clear() {
    this.pointList = [];
    this.startPoint.visible = false;
    this.endPoint.visible = false;
    this.tips.visible = false;
    this.line.visible = false;
  }

  add(point) {
    this.showPoint(false);
    this.pointList.push(point);
    if (this.pointList.length > 2) {
      this.clear();
      this.add(point);
    } else if (this.pointList.length === 2) {
      const { distance, midPoint } = getDistance(...this.pointList);
      this.distance = distance;
      this.midPoint = midPoint;
      this.updateTips();
      this.tips.visible = true;
      this.updateLine(...this.pointList);
      this.showPoint(true);
    } else {
      this.startPoint.position.copy(point);
      this.startPoint.visible = true;
      this.tips.visible = false;
    }
  }

  update(point) {
    if (this.pointList.length === 1) {
      this.endPoint.visible = true;
      this.endPoint.position.copy(point);
      this.updateLine(...this.pointList, point);
    }
  }

  updateLine(p1, p2) {
    if (this.pointList.length === 2) return
    this.line.visible = true;
    const vertices = [...p1.toArray(), ...p2.toArray()];
    this.line.geometry.setPositions(vertices);
    this.line.geometry.attributes.position.needsUpdate = true;
  }

  deleteLastPoint() {
    this.clear();
    this.pointList.pop();
    this.create(this.pointList);
    this.areaPlane && this.areaGroup.add(this.areaPlane);
  }

  dispose() {
    this.clear();
    this.pointList = [];
    this.area = 0;
    this.midPoint = [0, 0, 0];
    if (this.areaPlane) {
      this.areaPlane.geometry.dispose();
      this.areaPlane.material.dispose();
      this.areaGroup.remove(this.areaPlane);
      this.areaPlane = null;
    }
  }
}

class PathAnimation {
  constructor(options) {
    this.positionList = [];
    this.options = options;
    this.pathAnimationGroup = new Bol3D.Group();
    this.pathAnimationContainer = new Bol3D.Group();
    this.y = 0.01;
    this.isPlay = true;
    addScene(this.pathAnimationContainer);
    addScene(this.pathAnimationGroup);
    const _this = this;
    mitter.on('update', () => {
      if (!_this.isPlay) return
      this.pathAnimationContainer.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.material.map.offset[_this.options.axis] += _this.options.step;
        }
      });
    });
  }

  add(point) {
    this.positionList.push(point);
    if (this.positionList.length < 2) return
    const optison = {
      start: this.positionList.at(-2),
      end: this.positionList.at(-1),
      ...this.options,
    };
    const mesh = createRectangleFromPoints(optison);
    if (this.y === 0.01) this.y = 0.02;
    else this.y = 0.01;
    mesh.position.y = this.y;
    mesh.userData = optison;
    this.pathAnimationGroup.add(mesh);
  }

  deleteLast() {
    const model = this.pathAnimationGroup.children.at(-1);
    this.positionList.pop();
    removeModel(model, true);
  }

  clear() {
    this.positionList = [];
    removeModel(this.pathAnimationGroup);
  }

  clearAll() {
    removeModel(this.pathAnimationContainer);
  }

  save() {
    const pathAnimationGroup = this.pathAnimationGroup.clone();
    this.pathAnimationContainer.add(pathAnimationGroup);
    this.clear();
  }

  createPathAnimationByOptions(options) {
    const pathAnimationGroup = new Bol3D.Group();
    let y = 0.02;
    options.forEach((option) => {
      option.start = new Bol3D.Vector3(option.start.x, option.start.y, option.start.z);
      option.end = new Bol3D.Vector3(option.end.x, option.end.y, option.end.z);
      const mesh = createRectangleFromPoints(option);
      if (y === 0.01) y = 0.02;
      else y = 0.01;
      mesh.position.y = y;
      mesh.userData = option;
      pathAnimationGroup.add(mesh);
    });
    return pathAnimationGroup
  }

  export() {
    const options = this.pathAnimationContainer.children.map((item) => {
      return item.children.map((c) => c.userData)
    });
    return options
  }

  load(data) {
    data.forEach((options) => {
      const pathAnimationGroup = this.createPathAnimationByOptions(options);
      this.pathAnimationContainer.add(pathAnimationGroup);
    });
  }
}

const useZhangHang = {
  createPlane,
  PathAnimation,
  Distance,
  Area,
  computeGeometryArea,
  MapAnimation,
  Roam,
  ModelTWEEN,
  progress,
  Fence,
  ...api,
  ...instance,
  addScene,
};

/**
 * 输出一个shader基本框架
 * 材质赋值 看源码中的注释
 * @returns shaderConfig
 */
function shaderTemplate() {
  const shaderConfig = {
    uniform: {
      iTime: { value: 0 }
    },
    vertexShader: `
      // 解决深度问题
      #include <logdepthbuf_pars_vertex>
      #include <common>

      // 获取时间 颜色 位置 uv信息等基本属性
      uniform float iTime;
      varying vec3 vColor;
      varying vec3 vPosition;
      varying vec2 vUv;

      
      void main() { 
        // 输出位置 uv信息
        vPosition = vec3(position.x, position.y, position.z);
        vUv = vec2(uv.x, uv.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

        // 解决深度问题
        #include <logdepthbuf_vertex>
      } 
    `,
    // 片元着色器
    fragmentShader: ` 
      // 解决深度问题
      #include <logdepthbuf_pars_fragment>
      #include <common>

      // 接收位置
      uniform float iTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      float x;
      float y;
      float z;

      void main() {
        x = vPosition.x / 1.0 + 0.5;  // 除以模型长宽高的 x  +0.5是让坐标系变为0-1(居中)
        y = vPosition.y / 1.0 + 0.5;  // 除以模型长宽高的 y  +0.5是让坐标系变为0-1(居中)
        z = vPosition.z / 1.0 + 0.5;  // 除以模型长宽高的 z  +0.5是让坐标系变为0-1(居中)

        // 用 position 位置信息
        // gl_FragColor = vec4(x, y, z, 1.0);

        // 用 uv 信息
        gl_FragColor = vec4(vUv.x, 0.8, vUv.y, 1.0);

        // 解决深度问题
        #include <logdepthbuf_fragment>
      }
    `
  };

  // const mat = new Bol3D.ShaderMaterial()
  // mat.uniforms = shaderConfig.uniform
  // mat.vertexShader = shaderConfig.vertexShader
  // mat.fragmentShader = shaderConfig.fragmentShader
  // mat.transparent = true
  // mat.side = 2

  return shaderConfig
}

/**
 * 飞线动画
 * 
 * const flyLine1 = new FlyLine()
 * 
 * render 中
 * const dt = clock.getElapsedTime()
 * flyline1.animation(dt)
 */
class FlyLine {
  // 输出实例
  flyLine = null

  // 基本属性
  source = { x: 0, y: 0, z: 0 }
  target = { x: 100, y: 100, z: 100 }
  range = 100
  height = 100
  color = '#ff0000'
  size = 30
  density = 2.0
  speed = 1.0
  gap = 1.1

  /**
   * option 参数:
   * @param {Objcet} option 开始位置
   * @param {Objcet} option.source 开始位置
   * @param {Objcet} .target 目标位置
   * @param {Float | number} option.range 流线拖尾长度
   * @param {Float | number} option.height 流线能跳多高，与 target.y 相同的话效果就是( 终点.y - 起点.y )的 1.5 倍高
   * @param {string} option.color 颜色
   * @param {Float | number} option.size 粒子大小
   * @param {Float} option.density 粒子密度
   * @param {Float} option.speed 速度 需要与 gap 配合调整
   * @param {Float} option.gap 流线出现间隔 (大于等于1) 需要与 speed 配合调整
   */
  constructor(option = {}) {
    const { source, target, range, height, color, speed, size, density, gap } = option;
    this.source = source ?? this.source;
    this.target = target ?? this.target;
    this.range = range ?? this.range;
    this.height = height ?? this.height;
    this.color = color ?? this.color;
    this.speed = speed ?? this.speed;
    this.size = size ?? this.size;
    this.density = density ?? this.density;
    this.gap = gap ?? this.gap;

    this.flyLine = this.init();
    container.attach(this.flyLine);
  }

  init() {
    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    const _source = new Bol3D.Vector3(this.source.x, this.source.y, this.source.z);
    const _target = new Bol3D.Vector3(this.target.x, this.target.y, this.target.z);
    const _center = _target.clone().lerp(_source, 0.5);
    _center.y += this.height;

    const number = parseInt(_source.distanceTo(_center) + _target.distanceTo(_center)) * this.density;
    const curve = new Bol3D.QuadraticBezierCurve3(
      _source,
      _center,
      _target
    );

    const points = curve.getPoints(number);
    // 粒子位置计算 
    points.forEach((elem, i) => {
      const index = i / (number - 1);
      positions.push({
        x: elem.x,
        y: elem.y,
        z: elem.z
      });
      attrCindex.push(index);
      attrCnumber.push(i);
    });


    positions.forEach((p) => {
      attrPositions.push(p.x, p.y, p.z);
    });

    const geometry = new Bol3D.BufferGeometry();

    geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(attrPositions, 3));
    // 传递当前所在位置
    geometry.setAttribute('index', new Bol3D.Float32BufferAttribute(attrCindex, 1));
    geometry.setAttribute('current', new Bol3D.Float32BufferAttribute(attrCnumber, 1));

    const shader = new Bol3D.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: Bol3D.AdditiveBlending,
      uniforms: {
        uColor: {
          value: new Bol3D.Color(this.color) // 颜色
        },
        uRange: {
          value: this.range
        },
        uSize: {
          value: this.size
        },
        uTotal: {
          value: number
        },
        uGap: {
          value: this.gap
        },
        uSpeed: {
          value: this.speed
        },
        time: {
          value: 0
        }
      },
      vertexShader: `
      #include <logdepthbuf_pars_vertex>
      #include <common>
      attribute float index;
      attribute float current;
      uniform float time;
      uniform float uSize; // 大小
      uniform float uRange; // 展示区间
      uniform float uTotal; // 粒子总数
      uniform float uSpeed; // 速度
      uniform float uGap; // 间隔
      uniform vec3 uColor; // 颜色
      
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
          // 需要当前显示的索引
          float size = uSize;
          float showNumber = uTotal * mod(time, uGap) * uSpeed;
          if (showNumber > current && showNumber < current + uRange) {
              float uIndex = ((current + uRange) - showNumber) / uRange;
              size *= uIndex;
              vOpacity = 1.0;
          } else {
              vOpacity = 0.0;
          }

          // 顶点着色器计算后的Position
          vColor = uColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition; 
          // 大小
          gl_PointSize = size * 30.0 / (-mvPosition.z);
          #include <logdepthbuf_vertex>
      }`,
      fragmentShader: `
      #include <logdepthbuf_pars_fragment>
      #include <common>
      varying vec3 vColor; 
      varying float vOpacity;
      void main() {
          gl_FragColor = vec4(vColor, vOpacity);
          #include <logdepthbuf_fragment>
      }`
    });

    const point = new Bol3D.Points(geometry, shader);
    return point
  }

  animation(elapsedTime) {
    this.flyLine.material.uniforms.time.value = elapsedTime;
  }
}

const powerSpheredVertexShader = `
// 解决深度问题
#include <logdepthbuf_pars_vertex>
#include <common>

// 获取时间 颜色 位置 uv信息等基本属性
uniform float time;
uniform float targetRadius;
uniform float radius;
uniform float speed;
uniform float yScale;
varying vec3 vColor;
varying vec3 vPosition;
varying vec2 vUv;
varying float progress;

void main() { 
  // 输出位置 uv信息
  vPosition = vec3(position.x, position.y, position.z);

  vUv = vec2(uv.x, uv.y);
  vUv.x += time * 0.5 * speed; 
  vUv.y += time * 0.5 * speed; 
  float scale = mod((time / (1.0 / speed)), 1.0) * (targetRadius / radius);
  
  progress = radius * scale / targetRadius;
  
  vPosition.x *= scale;
  vPosition.y *= yScale * scale;
  vPosition.z *= scale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);


  // 解决深度问题
  #include <logdepthbuf_vertex>
} 
`;

const powerSpheredFragmentShader = `

// 解决深度问题
#include <logdepthbuf_pars_fragment>
#include <common>

uniform float time;
uniform sampler2D u_tex;
uniform vec3 myColor;
uniform int halfSphere;
uniform float opacity;

varying vec3 vPosition;
varying vec2 vUv;
float x;
float y;
float z;

varying float progress;

void main() {
    x = vPosition.x / 1.0 + 0.5;  // 除以模型长宽高的 x  +0.5是让坐标系变为0-1(居中)
    y = vPosition.y / 1.0 + 0.5;  // 除以模型长宽高的 y  +0.5是让坐标系变为0-1(居中)
    z = vPosition.z / 1.0 + 0.5;  // 除以模型长宽高的 z  +0.5是让坐标系变为0-1(居中)

    // 用 position 位置信息
    // gl_FragColor = vec4(x, y, z, 1.0);

    // 用 uv 信息
    // gl_FragColor = vec4(vUv.x, 0.8, vUv.y, 1.0);

    vec4 baseColor = vec4(myColor,0.1);
    // 基础色

    vec4 color = baseColor;

    // 动态纹理
    vec4 maskA = texture(u_tex, vUv);
    maskA.a = maskA.r;
    color += maskA;
    
    if (halfSphere == 1 && y < 0.5) {
        discard;
    }

    // 透明度
    color.a =(-(progress-0.5) / sin((progress -0.5) * 6.0) + 1.3) * opacity;
    gl_FragColor = color;

    // 解决深度问题
    #include <logdepthbuf_fragment>
}
`;

/**
 * 一个丐版的能量球 没有边缘检测
 * 
 * render 中
 * const dt = clock.getElapsedTime()
 * powerSphere.animation(dt)
 */
class PowerSphere {
  // 客制化属性
  color = '#00ffff'
  radius = 30
  speed = 0.6
  half = true
  textureEnabled = false
  textureUrl = './noise1.png'
  textureSpeed = 5
  opacity = 0.7
  yScale = 0.8

  // 几何体
  sphere = null
  minRadius = 1

  /** 
   * option 参数:
   * @param {String} color 基础颜色
   * @param {Float} radius 半径
   * @param {Float} speed 速度
   * @param {Boolean} half 开启半球
   * @param {Boolean} textureEnabled 开启贴图
   * @param {String} textureUrl 贴图地址
   * @param {Float | Number} textureSpeed 贴图流动速度
   * @param {Float} opacity 透明度 0-1
   * @param {Float} yScale y轴缩放系数(y轴压扁)
   */
  constructor(option = {}) {
    // 覆盖原有属性
    const { color, radius, speed, half, textureEnabled, textureUrl, textureSpeed, opacity, yScale } = option;
    this.color = color ?? this.color;
    this.radius = radius ?? this.radius;
    this.speed = speed ?? this.speed;
    this.half = half ?? this.half;
    this.textureEnabled = textureEnabled ?? this.textureEnabled;
    this.textureUrl = textureUrl ?? this.textureUrl;
    this.textureSpeed = textureSpeed ?? this.textureSpeed;
    this.opacity = opacity ?? this.opacity;
    this.yScale = yScale ?? this.yScale;

    // sphere
    let texture = null;
    if (this.textureEnabled) {
      const textureLoader = new Bol3D.TextureLoader();
      texture = textureLoader.load('./noise1.png');
      texture.wrapS = texture.wrapT = Bol3D.RepeatWrapping;
    }
    const spheredGeometry = new Bol3D.SphereGeometry(this.minRadius, 128, 128);
    let myColor = new Bol3D.Color(this.color);
    const spheredMaterial = new Bol3D.ShaderMaterial({
      uniforms: {
        u_tex: { value: null },
        time: { value: 0 },
        radius: { value: this.minRadius },
        targetRadius: { value: this.radius },
        myColor: { value: myColor },
        halfSphere: { value: this.half ? 1 : 0 },
        opacity: { value: this.opacity },
        speed: { value: this.speed },
        yScale: { value: this.yScale }
      },
      vertexShader: powerSpheredVertexShader,
      fragmentShader: powerSpheredFragmentShader,
      transparent: true,
      side: Bol3D.DoubleSide
    });
    this.sphere = new Bol3D.Mesh(spheredGeometry, spheredMaterial);
    this.sphere.position.set(10, 0, 10);
    this.sphere.material.uniforms.u_tex.value = texture;
    this.sphere.material.alphaToCoverage = true;
    container.attach(this.sphere);
  }

  animation(dt) {
    this.sphere.material.uniforms.time.value = dt;
  }
}

/**
 * 切换场景的过渡(保存 3D 当前帧，然后 opacity 过渡)
 * 要改 main.js
 * 1、全局搜索 initRender(attrs) {
 * 2、在 // 3d renderer 上面一行增加一行
 * const preserveDrawingBuffer = attrs && attrs.renderer !== undefined && attrs.renderer.preserveDrawingBuffer !== undefined ? attrs.renderer.preserveDrawingBuffer : false;
 * 3、在 // 3d renderer 下面的 if 语句里增加一行
 * this.renderer = new WebGLRenderer({ antialias, canvas: attrs.container, precision, logarithmicDepthBuffer, alpha, preserveDrawingBuffer });
 * 4、最后在 index.js container.renderer 中开启
 * renderer: {
 *    // something
 *    preserveDrawingBuffer: true
 *  },
 *
 * @param {number} duration 动画时长
 */
function prtScreenTransition(duration = 500) {
  const canvas = container.renderer.domElement;
  const imageDataUrl = canvas.toDataURL();

  const img = document.createElement('img');
  img.style.position = 'fixed';
  img.style.height = '100vh';
  img.style.width = '100vw';
  img.style.left = '0';
  img.style.top = '0';
  img.style.pointerEvents = 'none';
  img.style.zIndex = 100;
  img.src = imageDataUrl;
  document.body.appendChild(img);

  const keyframes = [{ opacity: 1 }, { opacity: 0 }];
  const options = {
    iterations: 1, // 动画执行次数
    duration: duration, // 动画时长
  };
  const webAnimation = img.animate(keyframes, options);

  webAnimation.play();
  webAnimation.onfinish = () => {
    img.remove();
  };
}

var useJiangNan = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shaderTemplate: shaderTemplate,
  FlyLine: FlyLine,
  PowerSphere: PowerSphere,
  prtScreenTransition: prtScreenTransition
});

/**
 * 设置模型位置(position)，旋转(rotation)，缩放(scale),有该属性的物体亦可
 * @param {object} mesh 待操作模型
 */
function setModelPosition(mesh) {
    const controls = container.transformControl;
    const gui = new dat.GUI();
    const options = {
        transformModel: "translate"
    };
    gui.add(options, 'transformModel', ["translate", 'rotate', 'scale']).onChange(val => controls.setMode(val));
    const positionX = gui.add(mesh.position, 'x').onChange(val => mesh.position.x = val).name('positionX');
    const positionY = gui.add(mesh.position, 'y').onChange(val => mesh.position.y = val).name('positionY');
    const positionZ = gui.add(mesh.position, 'z').onChange(val => mesh.position.z = val).name('positionZ');
    const rotationX = gui.add(mesh.rotation, 'x').step(0.01).onChange(val => mesh.rotation.x = val).name('rotationX');
    const rotationY = gui.add(mesh.rotation, 'y').step(0.01).onChange(val => mesh.rotation.y = val).name('rotationY');
    const rotationZ = gui.add(mesh.rotation, 'z').step(0.01).onChange(val => mesh.rotation.z = val).name('rotationZ');
    const scaleX = gui.add(mesh.scale, "x").step(0.001).onChange(val => mesh.scale.x = val).name('scaleX');
    const scaleY = gui.add(mesh.scale, "y").step(0.001).onChange(val => mesh.scale.y = val).name('scaleY');
    const scaleZ = gui.add(mesh.scale, "z").step(0.001).onChange(val => mesh.scale.z = val).name('scaleZ');
    controls.attach(mesh);
    controls.addEventListener("change", (e) => {
        positionX.setValue(mesh.position.x);
        positionY.setValue(mesh.position.y);
        positionZ.setValue(mesh.position.z);
        rotationX.setValue(mesh.rotation.x);
        rotationY.setValue(mesh.rotation.y);
        rotationZ.setValue(mesh.rotation.z);
        scaleX.setValue(mesh.scale.x);
        scaleY.setValue(mesh.scale.y);
        scaleZ.setValue(mesh.scale.z);
    });
}

/**
 * 查看模型长宽高
 * @param {object} mesh 待操作模型 
 */
function findModelXYZ(mesh) {
    // 计算模型的 bounding box
    const box = new Bol3D.Box3().setFromObject(mesh);
    // 获取 bounding box 的长宽高
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const depth = box.max.z - box.min.z;
    // 创建 Box3Helper 对象，并将其添加到场景中
    const helper = new Bol3D.Box3Helper(box, 0xffff00);
    //获取模型中心点位置
    const center = box.getCenter(new Bol3D.Vector3());
    const offsetX = center.x;
    const offsetY = center.y;
    const offsetZ = center.z;
    container.scene.add(helper);
    console.log(`模型的x为：${width} , y为${height} , z为${depth}`);
    console.log(`模型的中心点为：x:${offsetX},y:${offsetY},z:${offsetZ}`);
}

/**
 * 显示orbitCamera的position和orbitControls的target
 */
function showTargetPositon() {
    let mypt = {
        position: "",
        target: ""
    };
    const gui = new dat.GUI();
    const guiPosition = gui.add(mypt, "position");
    const guiTarget = gui.add(mypt, "target");

    container.orbitControls.addEventListener("end", () => {
        const position = container.orbitCamera.position;
        const pString = '{x:' + position.x + ",y:" + position.y + ',z:' + position.z + "}";
        guiPosition.setValue(pString);
        const target = container.orbitControls.target;
        const tString = '{x:' + target.x + ",y:" + target.y + ',z:' + target.z + "}";
        guiTarget.setValue(tString);
    });
}
/**
 * 设置mesh材质
 */
function setMaterial() {
    const gui = new dat.GUI();

    const materialMap = {
        LightMapIntensity: 1,
        EnvMapIntensity: 1,
        roughness: 1,
        metalness: 1,
        EmissiveIntensity: 1,
        aoMapIntensity: 1,
    };

    gui.add(materialMap, 'roughness').min(0).max(2).step(0.001).name("粗糙度roughness").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.roughness = val;
                item.material.needsUpdate = true;

            }
        });
    });
    gui.add(materialMap, 'metalness').min(0).max(2).step(0.001).name("金属度metalness").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.metalness = val;
                item.material.needsUpdate = true;
            }
        });
    });

    gui.add(materialMap, 'LightMapIntensity').min(0).max(2).step(0.001).name("light贴图强度lightMapIntensity").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.lightMapIntensity = val;
                item.material.needsUpdate = true;
            }
        });
    });

    gui.add(materialMap, 'EnvMapIntensity').min(0).max(10).step(0.001).name("HDR强度envMapIntensity").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.envMapIntensity = val;
                item.material.needsUpdate = true;
            }
        });
    });
    gui.add(materialMap, 'EmissiveIntensity').min(0).max(2).step(0.001).name("自发光强度emissiveIntensity").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.emissiveIntensity = val;
                item.material.needsUpdate = true;
            }
        });
    });
    gui.add(materialMap, 'aoMapIntensity').min(0).max(2).step(0.001).name("AO贴图强度aoMapIntensity").onChange(val => {
        container.scene.traverse(item => {
            if (item.isMesh) {
                item.material.aoMapIntensity = val;
                item.material.needsUpdate = true;
            }
        });
    });
}

/**
 * @returns 屏幕四个顶点坐标
 */
function getScreenVertex() {

    let pick1 = new Bol3D.Vector2(-1, 1);
    let pick2 = new Bol3D.Vector2(1, 1);
    let pick3 = new Bol3D.Vector2(-1, -1);
    let pick4 = new Bol3D.Vector2(1, -1);
    let rayCaster = new Bol3D.Raycaster();

    //左上角
    rayCaster.setFromCamera(pick1, container.orbitCamera);
    let intersects1 = rayCaster.intersectObjects(container.scene.children, true);
    intersects1 = intersects1.filter(i => i.object.name !== "fulou" && i.object.type !== "TransformControlsPlane");
    const geo1 = new Bol3D.SphereGeometry(0.1, 32, 32);
    const mat1 = new Bol3D.MeshBasicMaterial({ color: 0xff0000 });
    const mesh1 = new Bol3D.Mesh(geo1, mat1);
    mesh1.scale.set(100, 100, 100);
    mesh1.position.copy(intersects1[0].point);
    container.scene.add(mesh1);
    //右上角
    rayCaster.setFromCamera(pick2, container.orbitCamera);
    let intersects2 = rayCaster.intersectObjects(container.scene.children, true);
    intersects2 = intersects2.filter(i => i.object.name !== "fulou" && i.object.type !== "TransformControlsPlane");
    const geo2 = new Bol3D.SphereGeometry(0.1, 32, 32);
    const mat2 = new Bol3D.MeshBasicMaterial({ color: 0xff0000 });
    const mesh2 = new Bol3D.Mesh(geo2, mat2);
    mesh2.scale.set(100, 100, 100);
    mesh2.position.copy(intersects2[0].point);
    container.scene.add(mesh2);
    //左下角
    rayCaster.setFromCamera(pick3, container.orbitCamera);
    let intersects3 = rayCaster.intersectObjects(container.scene.children, true);
    intersects3 = intersects3.filter(i => i.object.name !== "fulou" && i.object.type !== "TransformControlsPlane");
    const geo3 = new Bol3D.SphereGeometry(0.1, 32, 32);
    const mat3 = new Bol3D.MeshBasicMaterial({ color: 0xff0000 });
    const mesh3 = new Bol3D.Mesh(geo3, mat3);
    mesh3.scale.set(100, 100, 100);
    mesh3.position.copy(intersects3[0].point);
    container.scene.add(mesh3);

    //右下角
    rayCaster.setFromCamera(pick4, container.orbitCamera);
    let intersects4 = rayCaster.intersectObjects(container.scene.children, true);
    intersects4 = intersects4.filter(i => i.object.name !== "fulou" && i.object.type !== "TransformControlsPlane");
    const geo4 = new Bol3D.SphereGeometry(0.1, 32, 32);
    const mat4 = new Bol3D.MeshBasicMaterial({ color: 0xff0000 });
    const mesh4 = new Bol3D.Mesh(geo4, mat4);
    mesh4.scale.set(100, 100, 100);
    mesh4.position.copy(intersects4[0].point);
    container.scene.add(mesh4);

    return {
        leftTop: intersects1[0].point,
        rightTop: intersects2[0].point,
        leftBottom: intersects3[0].point,
        rightBottom: intersects4[0].point,
    }
}


/** 
    * 鼠标悬浮在模型上，模型闪烁，注意开启outlineEnabled和outline配置项中的pulsePeriod控制脉冲周期。
    * @param  {object}  target  待选中的模型
    */
function checkBlinking(target) {
    let blink = null;
    return (function () {
        if (target && blink != target) {
            blink = target;
            container.outlineObjects = [];
            container.outlineObjects.push(target);
        }
        if (!target) {
            container.outlineObjects = [];
            blink = null;
        }
    })()
}

/**
* 基于模型创建边缘线
* @param {object} mesh 原模型
* @param {string} color 线的颜色  
* @returns 
*/
function setEdgesLine(mesh, color = 0x2685fe) {
    const edges = new Bol3D.EdgesGeometry(mesh.geometry);
    const lineMaterial = new Bol3D.LineBasicMaterial({ color, linewidth: 2, });
    const lineS = new Bol3D.LineSegments(edges, lineMaterial);
    //获取原模型世界坐标缩放四元数
    const worldPosition = new Bol3D.Vector3();
    const worldScale = new Bol3D.Vector3();
    const worldRotation = new Bol3D.Quaternion();
    mesh.getWorldPosition(worldPosition);
    mesh.getWorldScale(worldScale);
    mesh.getWorldQuaternion(worldRotation);
    //设置边缘线坐标缩放四元数
    lineS.position.copy(worldPosition);
    lineS.scale.copy(worldScale);
    lineS.quaternion.copy(worldRotation);
    return lineS
}

/**
 * 新增从camera Position到control target的射线
 */
function addTargetRay() {
    const cameraRay = new Bol3D.Ray();
    const arrowLength = 10;
    const arrowColor = 0xff0000; // 红色
    const arrowHelper = new Bol3D.ArrowHelper(new Bol3D.Vector3(), new Bol3D.Vector3(), arrowLength, arrowColor);
    container.scene.add(arrowHelper);
    function updateCameraRay() {
        const cameraPosition = container.orbitCamera.position.clone();
        const targetPosition = container.orbitControls.target.clone();
        cameraRay.origin.copy(cameraPosition);
        cameraRay.direction.subVectors(targetPosition, cameraPosition).normalize();
        arrowHelper.setDirection(cameraRay.direction);
        arrowHelper.position.copy(cameraRay.origin);
        arrowHelper.scale.set(0.1, 1, 0.1);
    }
    container.orbitControls.addEventListener('change', () => {
        updateCameraRay();
    });
    const myanimate = () => {
        requestAnimationFrame(myanimate);
    };
    myanimate();
}
/**
 * 生成空调扩散粒子
 */
function initParticles() {
    // 创建粒子材质
    const particleMaterial = new Bol3D.PointsMaterial({ color: 0x75d4f8, size: 0.1 });
    // 创建粒子系统
    const particlesGeometry = new Bol3D.BufferGeometry();
    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
        //初始化只给x轴复制，animate里面会操作y轴和z轴
        const x = Math.random() * 10 - 5;
        const y = 0;
        const z = 0;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    particlesGeometry.setAttribute('position', new Bol3D.BufferAttribute(positions, 3));
    const particleSystem = new Bol3D.Points(particlesGeometry, particleMaterial);
    particleSystem.position.set(350.43, 36.62, -186.2);
    container.scene.add(particleSystem);
    particleSystem.material.depthWrite = true;
    particleSystem.renderOrder = 3;
    // 控制粒子运动
    const clock = new Bol3D.Clock();
    function animate() {
        requestAnimationFrame(animate);
        let time = clock.getElapsedTime();
        time *= 5;
        const positionAttribute = particlesGeometry.getAttribute('position');
        for (let i = 0; i < particlesCount; i++) {
            const vector = new Bol3D.Vector3(
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
            );
            vector.setY(Math.sin(time + i * 0.05) * 0.5);
            vector.setZ((time + i * 0.05) % 20);
            positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
        }
        positionAttribute.needsUpdate = true;
    }
    animate();
}

/**截屏 */
function screenshot() {
    var image = new Image();
    container.animation();
    let imgData = container.renderer.domElement.toDataURL("image/jpeg");
    image.src = imgData;
    // document.body.appendChild(image);
    let a = document.createElement('a');
    a.href = imgData;
    a.download = 'screenshot.jpg';
    a.click();
}

/**
 * 漫游类
 */
class Roaming {
    constructor(object, pointsArr, startProgress) {
        this.object = object;
        this.pointsArr = pointsArr; //xyz点数据
        this.pointsVec = []; //vec3点数据
        // this.velocity = 0.00005 //漫游动画速度,最慢
        this.velocity = 0.0005; //漫游动画速度,调试
        this.progress = 0; //漫游动画进度
        this.startProgress = startProgress;
        this.curve = null; //漫游动画路径曲线
        this.animationId = null; //漫游动画帧ID
        this.gui = null; //GUI实例
        this.GUIprogress = null; //GUI中进度实例
        this.initCurve();
        this.initDbclick();
    }
    initCurve() {
        //处理pointsArr，生成flagBox和Vector3点数组
        this.pointsArr.forEach((cur, index, arr) => {
            if (index % 3 === 0) {
                const [x, y, z] = [arr[index], arr[index + 1], arr[index + 2]];
                const geometry = new Bol3D.BoxGeometry(3, 100, 3);
                const material = new Bol3D.MeshBasicMaterial({ color: 0xffff00 });
                const box = new Bol3D.Mesh(geometry, material);
                const point = new Bol3D.Vector3(x, y, z);
                box.position.copy(point);
                box.name = 'flagBox' + index / 3;
                this.pointsVec.push(point);
                // CACHE.container.scene.add(box)
                // CACHE.container.clickObjects.push(box)
            }
        });

        //根据Vector3点数组生成curve曲线
        this.curve = new Bol3D.CatmullRomCurve3(this.pointsVec);
        // 使用Catmull - Rom算法， 从一系列的点创建一条平滑的三维样条曲线。
        this.curve.curveType = "catmullrom";
        //设置是否闭环
        this.curve.closed = false;
        //设置线的张力，0为无弧度折线
        this.curve.tension = 0.1;
        // 为曲线添加材质在场景中显示出来，不显示也不会影响运动轨迹，相当于一个Helper
        const points = this.curve.getPoints(10000);
        const geometry = new Bol3D.BufferGeometry().setFromPoints(points);
        const material = new Bol3D.LineBasicMaterial({ color: 0xff0000 });
        new Bol3D.Line(geometry, material);
        // CACHE.container.scene.attach(curveObject)
    }
    initGUI() {
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
        this.gui = new dat.GUI();
        const roamOptions = {
            start: () => {
                this.start();
            },
            stop: () => {
                this.stop();
            },
            pause: () => {
                this.pause();
            },
            resume: () => {
                this.resume();
            },
            progress: this.progress,
            velocity: this.velocity
        };
        const map = {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        };
        this.gui.add(roamOptions, 'start').name("开始");
        this.gui.add(roamOptions, 'stop').name("停止");
        this.gui.add(roamOptions, 'pause').name("暂停");
        this.gui.add(roamOptions, 'resume').name("继续");
        this.gui.add(roamOptions, 'velocity', 0, 0.0001, 0.0000001).name('速度').onChange(val => this.velocity = val);
        this.GUIprogress = this.gui.add(roamOptions, 'progress', 0, 1, 0.0001).name('进度').onChange(val => this.progress = val);
        const solodr = this.gui.addFolder("控制xyz");
        solodr.add(map, "x", 0, 1, 0.1).name("x");
        solodr.add(map, "y", 0, 1, 0.1).name("y");
        solodr.add(map, "z", 0, 1, 0.1).name("z");
    }
    moveOnCurve() {
        CACHE.container.orbitControls;
        if (this.progress <= 1 - this.velocity) {
            const point = this.curve.getPointAt(this.progress);
            const pointBox = this.curve.getPointAt(this.progress + this.velocity);
            if (point && pointBox) {
                this.object.position.copy(point);
                const targetPos = pointBox;
                targetPos.clone().sub(this.object.position).normalize();
                const upDirection = new Bol3D.Vector3(0, 1, 0); // 设置相机的上方向向量，这里假设为正上方向量
                this.object.lookAt(targetPos);
                this.object.up.copy(upDirection);
                // orbitControls.target.copy(this.object.position).add(targetDirection);
                this.progress += this.velocity;
            }

        } else {
            this.progress = 0;
            if (this.startProgress) this.progress = this.startProgress;
        }
        //同步GUI数据
        try {//防止未init GUI时报错
            this.GUIprogress.setValue(this.progress);
        } catch (error) {
          throw new Error('请先初始化GUI')
        }
    }
    animation() { //漫游动画
        this.moveOnCurve();
        // console.log("过程？", this.progress);
        this.animationId = requestAnimationFrame(this.animation.bind(this));
    }
    start() { //漫游开始
        this.progress = 0;
        this.progress = this.startProgress;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.animation();
        } else {
            this.animation();
        }
    }
    stop() { //漫游停止
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.progress = 0;
            // API.cameraAnimation({ cameraState: STATE.initialState })
        }
    }
    pause() { //漫游暂停
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
    }
    resume() { //漫游继续
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.animation();
        } else {
            this.animation();
        }
    }
    initDbclick() {
        const events = new Bol3D.Events(CACHE.container);
        events.ondbclick = (e) => {
            const target = e.objects[0]?.object;
            if (/^flagBox\d+$/.test(target.name)) {
                const controls = CACHE.container.transformControl;
                controls.attach(target);
                console.log("触发点击，重绘曲线");
            }
        };
    }
}

/**
 * 全局事件总线
 */
class EventBus {
    constructor() {
        this.eventMap = new Map();
    }
    //注册事件
    $on(name, callBack) {
        if (!this.eventMap.has(name)) {
            this.eventMap.set(name, new Map());
        }
        this.eventMap.get(name).set(callBack, 'always');
    }
    //触发事件
    $emit(name, ...args) {
        if (!this.eventMap.has(name)) {
            console.error(name, '事件不存在');
            return
        }
        const cbMap = this.eventMap.get(name);
        const results = [];
        cbMap.forEach((value, cb) => {
            const result = cb(...args);
            results.push(result);
            if (value === 'once') this.$off(name, cb);
        });
        return results
    }
    //移除事件
    $off(name, callBack) {
        console.log('callBack: ', callBack);
        if (!this.eventMap.size || !this.eventMap.has(name)) return
        const cbMap = this.eventMap.get(name);
        if (!cbMap.has(callBack)) return
        cbMap.delete(callBack);
        if (cbMap.size) return
        this.eventMap.delete(name);
    }
    //注册一次性事件
    $once(name, callBack) {
        if (!this.eventMap.has(name)) {
            this.eventMap.set(name, new Map());
        }
        this.eventMap.get(name).set(callBack, 'once');
    }
}

var useTanCheng = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setModelPosition: setModelPosition,
  findModelXYZ: findModelXYZ,
  showTargetPositon: showTargetPositon,
  setMaterial: setMaterial,
  getScreenVertex: getScreenVertex,
  checkBlinking: checkBlinking,
  setEdgesLine: setEdgesLine,
  addTargetRay: addTargetRay,
  initParticles: initParticles,
  screenshot: screenshot,
  Roaming: Roaming,
  EventBus: EventBus
});

/**
 * 模型聚焦，获取模型中心位置，在此基础上调整相机位置\
 * @param  {Object3D}  model  需要聚焦的模型
 * @param  {object}  params  偏移参数
 * @param  {number}  params.x  偏移参数X
 * @param  {number}  params.y  偏移参数Y
 * @param  {number}  params.z  偏移参数Z
 */
function modelFocused(model, params = {}) {
  const { x = 200, y = 400, z = 200 } = params;
  if (model) {
    const box = new Bol3D.Box3().setFromObject(model);
    const res = box.getCenter(new Bol3D.Vector3());
    const cameraState = { position: { x: res.x + x, y: res.y + y, z: res.z + z }, target: { x: res.x, y: res.y, z: res.z } };
    API.cameraAnimation({ cameraState });
  }
}

/**
 * 递归删除模型
 * @param {Object3D} group 需要删除的模型
 */
function removeGroup(group) {
  // 遍历并清空所有子对象
  for (let i = group?.children.length - 1; i >= 0; i--) {
    let child = group.children[i];

    // 递归清空子对象
    if (child.children.length > 0) {
      removeGroup(child);
    }

    // 清理几何体资源
    if (child.geometry) {
      child.geometry.dispose();
      child.geometry = null;
    }

    // 清理材质资源
    if (child.material) {
      // 如果材质是数组，逐个清理
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose());
      } else {
        child.material.dispose();
      }
      child.material = null;
    }
    //清理popup dom元素
    if (child.element) {
      child.element.parentNode.removeChild(child.element);
    }
    // 从父节点中移除并清空引用
    child.removeFromParent();
    child = null;
  }
}

var useWuKunLin = /*#__PURE__*/Object.freeze({
  __proto__: null,
  modelFocused: modelFocused,
  removeGroup: removeGroup
});

const TU = {
  Line2,
  LineGeometry,
  LineMaterial,
  init,
  ...useZhangHang,
  //感谢江南同学对ThreeUtils的贡献，虽然他已离我们而去。
  //对此，江南同学评价道：「这是一声警钟，被柳江南当成了耳旁风，你呢？」
  ...useJiangNan,
  ...useTanCheng,
  ...useWuKunLin,
};

export { TU as default };
