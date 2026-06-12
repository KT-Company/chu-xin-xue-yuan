import {CACHE} from "../CACHE.js";
import {getImg} from "../../utils/assets.js";

/*
* 暂时存放，后续有空整理这部分代码。
* onload中直接调用
* 使用方式：按“d”开始绘制，按鼠标左键绘制路径，按鼠键右键停止绘制，按照鼠标左或中键清除路径，按照鼠键P播放进度动画
*
* 绘制后的点存入在path3D._points中,初始调用会打印信息
* */
export const addPath3D = ()=>{

const params = {
  texture: 'images/diffuse.jpg',
  color: [88, 222, 222],
  scrollUV: true,
  scrollSpeed: 0.03,
  width: 0.3,
  side: 'both',
  cornerRadius: 0.2,
  cornerSplit: 10,
  progress: 1,
  playSpeed: 0.14
};

let drawing = false;
let playing = true; // animation playing
window.drawing = drawing;
window.playing = playing;

const renderer = CACHE.container.renderer;
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);

container.renderer.setAnimationLoop(() => {
  container.animation()
  renderer.domElement.style.cursor = drawing ? 'crosshair' : 'default';
  if (drawing) {
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      arrow: true
    });
  } else {
    if (playing) {
      const pathPointList = path3D.getPathPointList();
      const distance = pathPointList.distance();

      if (distance > 0) {
        params.progress += params.playSpeed / distance;
        if (params.progress >= 1) {
          params.progress = 1;
          playing = false;
        }
      } else {
        params.progress = 1;
        playing = false;
      }

      geometry.update(pathPointList, {
        width: params.width,
        side: params.side,
        progress: params.progress,
        arrow: true
      });
    }
  }

  if (params.scrollUV && material.map) {
    material.map.offset.x -= params.scrollSpeed;
    material.map.repeat.x = 1;
  }
})

const raycaster = new Bol3D.Raycaster();
const mouse = new Bol3D.Vector2();
const path3D = new Path3D();
console.log("🚀 ~ path3D:",path3D)
window.fixRadius = 0.5; // fixRadius should larger than cornerRadius
window.height = 0.1;

const geometry = new Bol3D.PathGeometry(128);

const textureMap = new Map();

function getTexture(url) {
  if (textureMap.has(url)) {
    return textureMap.get(url);
  } else {
    const texture = new Bol3D.TextureLoader().load(url, function (texture) {
      texture.wrapS = texture.wrapT = Bol3D.RepeatWrapping;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });
    textureMap.set(url, texture);
  }
}

getTexture(getImg('jiantou2.png'));


const material = new Bol3D.MeshBasicMaterial({
  color: '#58DEDE',
  depthWrite: true,
  transparent: true,
  opacity: 0.9,
  side: Bol3D.DoubleSide,
  map: getTexture(getImg('arrow2.png'))
});

const line = new Bol3D.Mesh(geometry, material);
line.name = '__line';
line.frustumCulled = false;
container.scene.add(line);


document.addEventListener('keydown', event => {
  const keyName = event.key;
  if ('Escape' === keyName) {
    if (!playing) {
      path3D.clear();
      geometry.update(path3D.getPathPointList());
      drawing = false;
    } else {
      console.warn('clear after playing finished');
    }
  } else if ('d' === keyName) {
    drawing = true;
    path3D.start();
  } else if ('p' === keyName) {
    if (!drawing) {
      playing = true;
      params.progress = 0;
    } else {
      console.warn('play after drawing finished');
    }
  }
});


function onMouseDown(event) {
  if (event.button === 0) {
    if (!drawing) {
      return;
    }
    console.log("🚀 ~ 1      :", 1)

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, CACHE.container.orbitCamera);
    // See if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObjects(CACHE._myMeshArr);
    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
      path3D.confirm();
    }
  } else if (event.button === 1) {
    console.log("🚀 ~ 2      :", 2)
    path3D.clear();
    geometry.update(path3D.getPathPointList());
    drawing = false;
  } else if (event.button === 2) {
    console.log("🚀 ~ 3      :", 3)
    drawing = false;
    path3D.stop();
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      arrow: true
    });
  }
}

function onMouseMove(event) {
  if (!drawing) {
    return;
  }

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, CACHE.container.orbitCamera);
  // See if the ray from the camera into the world hits one of our meshes
  const intersects = raycaster.intersectObjects(CACHE._myMeshArr);
  // Toggle rotation bool for meshes that we clicked
  if (intersects.length > 0) {
    path3D.update(intersects[0].point);
  }
}

{
  const gui = new dat.GUI();
  gui.add(params, 'texture', ['jiantou2.png']).onChange(function(val) {
    if (val === 'none') {
      material.map = null;
    } else {
      material.map = getTexture(getImg(val));
    }
    material.needsUpdate = true;
  });
  gui.add(material, 'wireframe');
  gui.add(material, 'depthWrite');
  gui.addColor(params, 'color').onChange(function(value) {
    material.color.r = value[0] / 255;
    material.color.g = value[1] / 255;
    material.color.b = value[2] / 255;
  });
  gui.add(material, 'opacity').min(0).max(1);
  gui.add(params, 'scrollUV');
  gui.add(params, 'scrollSpeed').min(-0.1).max(0.1);
  gui.add(params, 'width').min(-0.1).max(10).onChange(function() {
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      arrow: true
    });
  });
  gui.add(params, 'side', ['both', 'left', 'right']).onChange(function(value) {
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: value,
      arrow: true
    });
  });
  gui.add(params, 'progress').min(0).max(1).step(0.01).listen().onChange(function() {
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      progress: params.progress,
      arrow: true
    });
  });
  gui.add(params, 'playSpeed').min(0.01).max(0.2);
  gui.add(params, 'cornerRadius').min(0).max(1).onChange(function(val) {
    path3D.cornerRadius = val;
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      arrow: true
    });
  });
  gui.add(params, 'cornerSplit').min(0).max(30).step(1).onChange(function(val) {
    path3D.cornerSplit = val;
    geometry.update(path3D.getPathPointList(), {
      width: params.width,
      side: params.side,
      arrow: true
    });
  });
}

}
