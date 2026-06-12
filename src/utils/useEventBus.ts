import { CACHE } from '@/ktJS/CACHE'
import ue, { ue5 } from './linkUE'

type CallbackFunction<T extends unknown[] = unknown[], R = unknown> = (...args: T) => R
type CallbackType = 'always' | 'once'

/**
 * 自定义事件总线
 */
export class EventBus {
  private eventMap: Map<string, Map<CallbackFunction, CallbackType>>

  constructor() {
    this.eventMap = new Map()
  }

  $on<T extends unknown[]>(name: string, callBack: CallbackFunction<T>): void {
    if (!this.eventMap.has(name)) {
      this.eventMap.set(name, new Map())
    }
    this.eventMap.get(name)!.set(callBack, 'always')
  }

  $emit<T extends unknown[]>(name: string, ...args: T): unknown[] {
    if (!this.eventMap.has(name)) {
      console.error(name, '事件不存在')
      return []
    }
    const cbMap = this.eventMap.get(name)!
    const results: unknown[] = []
    const callbacks = Array.from(cbMap.entries())
    for (const [cb, type] of callbacks) {
      const result = cb(...args)
      results.push(result)
      if (type === 'once') {
        this.$off(name, cb)
      }
    }
    return results
  }

  $off<T extends unknown[]>(name: string, callBack: CallbackFunction<T>): void {
    if (!this.eventMap.size || !this.eventMap.has(name)) {
      return
    }
    const cbMap = this.eventMap.get(name)!
    if (!cbMap.has(callBack)) {
      return
    }
    cbMap.delete(callBack)
    if (cbMap.size === 0) {
      this.eventMap.delete(name)
    }
  }

  $once<T extends unknown[]>(name: string, callBack: CallbackFunction<T>): void {
    if (!this.eventMap.has(name)) {
      this.eventMap.set(name, new Map())
    }
    this.eventMap.get(name)!.set(callBack, 'once')
  }
}

const eventBus = new EventBus()

/**
 * Web向UE发送消息
 * @example
 * sendToUE('changeRoute', {path: '/home'});
 */
export function sendToUE(type: string, data: Record<string, unknown> = {}) {
  const params = {
    type,
    data,
  }
  console.log('WebToUE --web发送到UE数据-->', params)
  ue5('WebToUE', params)
  ;(CACHE.pixelStream as any)?.stream?.emitUIInteraction(params)
}

/**
 * UE向Web发送消息
 * @param {*} _params {type: string, data: object}
 * @example
 * ue.interface.UEemit('{"type":"clickMesh","data":{"meshName":"123"}}')
 * ue.interface.UEemit({"type":"clickMesh","data":"{'meshName':'123'}"})
 */
ue.interface.UEemit = function (_params: string | { type: string; data: unknown }) {
  console.log('UEemit --UE发送到web数据-->', _params)

  let params = _params
  if (typeof _params === 'string') params = JSON.parse(_params)

  const { type, data } = params as { type: string; data: unknown }
  eventBus.$emit(type, data)
}

/**
 * 监听UE消息
 * @example
 * watchUEEvents({
 *  clickMesh: (data) => {
 *    console.log('data: ', data);
 *  },
 * });
 */
export function watchUEEvents(events: Record<string, CallbackFunction>) {
  for (const event in events) {
    eventBus.$on(event, events[event])
  }

  onBeforeUnmount(() => {
    for (const event in events) {
      eventBus.$off(event, events[event])
    }
  })
}
