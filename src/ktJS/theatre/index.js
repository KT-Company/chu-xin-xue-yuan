import { getProject, onChange, types, val } from '@theatre/core'
// import studio from '@theatre/studio'
import { CACHE } from '../CACHE'
import projectState from './state.json'

export function theatreDemo() {
  // if (import.meta.env.MODE === 'development') {
  //   studio.initialize()
  // }
  const project = getProject('demoProject', { state: projectState })
  const sheet = project.sheet('demoSheet')
  //
  const geo = new Bol3D.BoxGeometry(10, 10, 10)
  const mat = new Bol3D.MeshPhongMaterial({ color: 0xffffff })
  const mesh = new Bol3D.Mesh(geo, mat)
  mesh.position.set(-80, 2, -50)
  CACHE.container.scene.add(mesh)
  const demo = sheet.object('demo', {
    position: types.compound({
      x: types.number(mesh.position.x),
      y: types.number(mesh.position.y),
      z: types.number(mesh.position.z),
    }),
    rotation: types.compound({
      x: types.number(mesh.rotation.x),
      y: types.number(mesh.rotation.y),
      z: types.number(mesh.rotation.z),
    }),
    color: types.rgba({ r: 1, g: 0, b: 0, a: 1 }),
  })
  demo.onValuesChange(({ position, rotation, color }) => {
    mesh.position.set(position.x, position.y, position.z)
    mesh.rotation.set(rotation.x, rotation.y, rotation.z)
    mesh.material.color.set(color.r, color.g, color.b)
  })

  project.ready.then(() => sheet.sequence.play({ iterationCount: Infinity }))
}
