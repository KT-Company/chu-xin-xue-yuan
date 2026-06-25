import type { MenuItem, MenuType } from '../types/ktPopFn'

export const FIRST_MENU_LIST: MenuItem[] = [{ id: 'first-1', name: '初心学院天光地热平台' }]

export const SECOND_MENU_LIST: MenuItem[] = [
  { id: 'second-1', name: '态势感知', path: '/situational_awareness' },
  { id: 'second-2', name: '光伏管理', path: '/pv_management' },
  { id: 'second-3', name: '碳排管理', path: '/ce_management' },
  { id: 'second-4', name: '生活热水', path: '/left_hot_water' },
  { id: 'second-5', name: '空调系统', path: '/air_conditioner' },
  { id: 'second-6', name: '运维监控', path: '/om_monitor' },
]

export const FOOTER_BUTTON_LIST = ['预览', '取消', '确认']

export const MAX_MENU_COUNT = 8

export const MENU_DEFAULT_NAME_MAP: Record<MenuType, string> = {
  first: '新一级菜单',
  second: '新二级菜单',
}
