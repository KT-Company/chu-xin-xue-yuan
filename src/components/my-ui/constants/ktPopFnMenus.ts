import type { MenuItem, MenuType } from '../types/ktPopFn'

export const FIRST_MENU_LIST: MenuItem[] = [{ id: 'first-1', name: '初心学院天地热泵平台' }]

export const SECOND_MENU_LIST: MenuItem[] = [
  { id: 'second-1', name: '态势感知' },
  { id: 'second-2', name: '光伏管理' },
  { id: 'second-3', name: '碳排管理' },
  { id: 'second-4', name: '生活热水' },
  { id: 'second-5', name: '空调系统' },
  { id: 'second-6', name: '运维监控' },
]

export const FOOTER_BUTTON_LIST = ['预览', '取消', '确认']

export const MAX_MENU_COUNT = 6

export const MENU_DEFAULT_NAME_MAP: Record<MenuType, string> = {
  first: '新一级菜单',
  second: '新二级菜单',
}
