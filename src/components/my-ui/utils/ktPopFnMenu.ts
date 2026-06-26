/*
 * @Author: milong
 * @Date: 2026-06-17 17:08:27
 * @Description:
 */
import type { AddMenuFormValidateResult, MenuItem, MenuType } from '../types/ktPopFn'
import { MENU_NAME_MAX_LENGTH, MENU_PATH_PATTERN, SECOND_MENU_LIST } from '@/components/my-ui/constants/ktPopFnMenus'
export const cloneMenuList = (menuList: MenuItem[]) => menuList.map((item) => ({ ...item }))

export const getMenuEditingKey = (menuType: MenuType, index: number) => `${menuType}-${index}`

export const validateAddMenuForm = (menuName: string, menuPath: string): AddMenuFormValidateResult => {
  const menuNameError = !menuName ? '菜单名称不能为空' : menuName.length > MENU_NAME_MAX_LENGTH ? '菜单名称长度为 1-15 位' : ''
  const menuPathError = !menuPath ? '路由地址不能为空' : MENU_PATH_PATTERN.test(menuPath) ? '' : '路由地址仅支持字母、数字、/、_、-'

  return {
    isValid: !menuNameError && !menuPathError,
    menuNameError,
    menuPathError,
  }
}

export const addMenuItem = (menuList: MenuItem[], menuType: MenuType, name: string, path?: string) => {
  menuList.push({ id: `${menuType}-${Date.now()}-${menuList.length}`, name, path })

  return menuList.length - 1
}

export const updateMenuItemName = (menuList: MenuItem[], index: number, name: string, menuType: string) => {
  if (!menuList[index]) return

  menuList[index].name = name
  if (menuType == 'second') {
    SECOND_MENU_LIST.forEach((item) => {
      if (item.name == name) {
        menuList[index].path = item.path
      }
    })
  }
}

export const deleteMenuItem = (menuList: MenuItem[], index: number) => {
  if (!menuList[index]) return

  menuList.splice(index, 1)
}

export const moveMenuItem = (menuList: MenuItem[], fromIndex: number, toIndex: number) => {
  if (!menuList[fromIndex] || !menuList[toIndex] || fromIndex === toIndex) return

  const [menuItem] = menuList.splice(fromIndex, 1)
  menuList.splice(toIndex, 0, menuItem)
}
