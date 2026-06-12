/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2025-12-25 15:28:49
 * @Description:
 */
import { CACHE } from '../CACHE.js'
export default function onProgress(model, container) {
  model.traverse((item) => {
    if (item.isMesh) {
      CACHE._myMeshArr.push(item)
    }
  })
}
