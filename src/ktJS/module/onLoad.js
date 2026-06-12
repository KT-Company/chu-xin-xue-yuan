/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2025-12-25 15:28:49
 * @Description:
 */
import { theatreDemo } from '@/ktJS/theatre'
import { API } from '../API.js'
import { CACHE } from '../CACHE.js'
import { GUI } from '../GUI.js'
import { STATE } from '../STATE.js'
import TU from '../threeUtils'

export default function onLoad(container) {
  container.loadingBar.style.visibility = 'hidden'
  window.container = container
  CACHE.container = container
  window.CACHE = CACHE
  window.API = API
  window.TU = TU
  window.STATE = STATE
  window.GUI = GUI
  TU.init(container, Bol3D)
  init()
  theatreDemo()
}

function init() {
  // 粒子初始化
  initParticle()
}

function initParticle() {
  const particlesOpts = {
    uuid: '520FE4E4-71A0-4049-98C1-4001C6E99CAB',
    name: 'Particle',
    type: 'smoke',
    options: {
      position: [0, 0, 0],
      direction: [0, 1, 0],
      scale: [500, 500, 500],
      renderOrder: 1,
      visible: true,
      color: '#cccccc',
      size: 100,
      width: 0,
      height: 0,
      depth: 0,
      numbers: 100,
      type: 'smoke',
    },
  }

  const particles = new Bol3D.Primitives.BaseParticles(particlesOpts.options)
  const smokeMap = new Bol3D.TextureLoader().load(`/assets/3d/editor/smoke.png`)
  particles.material.uniforms.map.value = smokeMap
  particles.material.uniforms.useMap.value = 1
  particles.scale.set(500, 500, 500)
  particles.startSmokeSimulation()
  CACHE.container.particlesGroup.add(particles)
}
