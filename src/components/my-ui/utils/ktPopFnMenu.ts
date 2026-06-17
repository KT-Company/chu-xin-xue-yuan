import type { MenuItem, MenuType } from '../types/ktPopFn'

export const cloneMenuList = (menuList: MenuItem[]) => menuList.map((item) => ({ ...item }))

export const getMenuEditingKey = (menuType: MenuType, index: number) => `${menuType}-${index}`

export const addMenuItem = (menuList: MenuItem[], menuType: MenuType, name: string) => {
  menuList.push({ id: `${menuType}-${Date.now()}-${menuList.length}`, name })

  return menuList.length - 1
}

export const updateMenuItemName = (menuList: MenuItem[], index: number, name: string) => {
  if (!menuList[index]) return

  menuList[index].name = name
}

export const deleteMenuItem = (menuList: MenuItem[], index: number) => {
  if (!menuList[index]) return

  menuList.splice(index, 1)
}
