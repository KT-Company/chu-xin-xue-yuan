/*
 * @Author: milong
 * @Date: 2026-06-17 17:08:27
 * @Description:
 */
import type { MenuItem, MenuType } from '../types/ktPopFn'
import { SECOND_MENU_LIST } from '@/components/my-ui/constants/ktPopFnMenus'
export const cloneMenuList = (menuList: MenuItem[]) => menuList.map((item) => ({ ...item }))

export const getMenuEditingKey = (menuType: MenuType, index: number) => `${menuType}-${index}`

export const addMenuItem = (menuList: MenuItem[], menuType: MenuType, name: string) => {
  menuList.push({ id: `${menuType}-${Date.now()}-${menuList.length}`, name })

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
