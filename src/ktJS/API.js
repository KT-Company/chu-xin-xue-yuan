/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2025-12-25 15:28:49
 * @Description:
 */
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'

// 深度克隆
function cloneDeep(object, deep = true, cacheMap) {
  if (!cacheMap) cacheMap = new WeakMap()
  if (typeof object === 'object' && object !== null) {
    const newObj = new object.constructor()

    cacheMap.set(object, newObj)
    for (const key of Object.keys(object)) {
      // 防止重复引用导致的死循环
      if (cacheMap.has(object[key])) {
        newObj[key] = cacheMap.get(object[key])
        continue
      }

      newObj[key] = deep ? cloneDeep(object[key], deep, cacheMap) : object[key]
    }

    return newObj
  } else {
    return object
  } // 基本数据类型
}

// ************************************************************* 在此添加你的 API *************************************************************
/**
 * 背景切换
 */
function setBackground(imgName) {
  const options = {
    type: 'panorama',
    panorama: [`/editor/${imgName}`],
  }
  CACHE.container.updateBackground(STATE.PUBLIC_PATH, options)
}

export const API = {
  setBackground,
  cloneDeep,
}
