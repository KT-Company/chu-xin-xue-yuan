export type MenuType = 'first' | 'second'

export interface MenuItem {
  id: string
  name: string
  path?: string
}

export interface AddMenuFormValidateResult {
  isValid: boolean
  menuNameError: string
  menuPathError: string
}
