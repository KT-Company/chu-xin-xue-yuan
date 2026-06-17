<!--
 * @Author: 米龙
 * @Date: 2026-06-17 15:40:29
 * @Description:
-->
<script setup lang="ts">
import { FIRST_MENU_LIST, FOOTER_BUTTON_LIST, MAX_MENU_COUNT, MENU_DEFAULT_NAME_MAP, SECOND_MENU_LIST } from './constants/ktPopFnMenus'
import type { MenuType } from './types/ktPopFn'
import { addMenuItem, cloneMenuList, deleteMenuItem, getMenuEditingKey, updateMenuItemName } from './utils/ktPopFnMenu'

const emit = defineEmits(['close'])
const firstMenuList = ref(cloneMenuList(FIRST_MENU_LIST))
const secondMenuList = ref(cloneMenuList(SECOND_MENU_LIST))
const footerButtonList = FOOTER_BUTTON_LIST
const editingKey = ref('')
const editingName = ref('')

const getMenuList = (menuType: MenuType) => (menuType === 'first' ? firstMenuList.value : secondMenuList.value)

const addMenu = (menuType: MenuType) => {
  const menuList = getMenuList(menuType)
  if (menuList.length >= MAX_MENU_COUNT) return

  const menuName = MENU_DEFAULT_NAME_MAP[menuType]
  const menuIndex = addMenuItem(menuList, menuType, menuName)

  editingKey.value = getMenuEditingKey(menuType, menuIndex)
  editingName.value = menuName
}

const startEditMenu = (menuType: MenuType, index: number) => {
  const menuItem = getMenuList(menuType)[index]
  if (!menuItem) return

  editingKey.value = getMenuEditingKey(menuType, index)
  editingName.value = menuItem.name
}

const saveEditMenu = (menuType: MenuType, index: number) => {
  const menuName = editingName.value.trim()
  if (menuName) {
    updateMenuItemName(getMenuList(menuType), index, menuName)
  }

  editingKey.value = ''
  editingName.value = ''
}

const removeMenu = (menuType: MenuType, index: number) => {
  deleteMenuItem(getMenuList(menuType), index)
  editingKey.value = ''
  editingName.value = ''
}
</script>

<template>
  <div
    class="pop-fn pointer-events-auto absolute left-[50%] top-[50%] z-[30] h-[1000px] w-[1600px] translate-x-[-50%] translate-y-[-50%] bg-[url('@/assets/img/pop/pop-box.png')] bg-[length:100%_100%] bg-no-repeat font-[SHSCN] text-[#fff]"
  >
    <div
      class="flex relative h-[80px] items-center bg-[url('@/assets/img/pop/pop-title1.png')] bg-[length:100%_100%] bg-no-repeat pl-[34px] text-[32px] font-[700]"
    >
      <div class="absolute left-0 w-[8px] h-[40px] bg-[url(@/assets/img/pop/pop-icon.png)] bg-[length:100%_100%]"></div>
      <span>菜单配置功能</span>
      <button class="ml-auto h-[80px] w-[80px] cursor-pointer" type="button" @click="emit('close')">
        <img src="@/assets/img/pop/pop-close.png" alt="" />
      </button>
    </div>

    <div class="flex gap-[48px] px-[40px] pt-[100px]">
      <section class="w-[724px]">
        <div class="flex items-center justify-between">
          <h3 class="h-[54px] text-[32px] leading-[54px] font-[700]">一级菜单</h3>
          <button class="h-[68px] w-[68px] cursor-pointer" type="button" @click="addMenu('first')">
            <img src="@/assets/img/pop/pop-add.png" alt="" />
          </button>
        </div>
        <div class="mt-[44px] h-[566px] border border-[rgba(52,103,165,0.38)] bg-[rgba(8,31,59,0.42)] px-[26px] py-[44px]">
          <div class="pop-fn__row mb-[22px] h-[28px] text-[22px] font-bold text-[rgba(255,255,255,0.72)]">
            <span>序号</span>
            <span>一级名称</span>
          </div>
          <div class="pop-fn__row mb-[28px] h-[48px]" v-for="(item, index) in firstMenuList" :key="item.id">
            <span
              class="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border border-[rgba(95,139,194,0.45)] bg-[rgba(32,56,89,0.7)] text-[22px] text-[rgba(255,255,255,0.75)]"
            >
              {{ index + 1 }}
            </span>
            <input
              v-if="editingKey === getMenuEditingKey('first', index)"
              v-model="editingName"
              class="pop-fn__input pop-fn__input1"
              type="text"
              autofocus
              @blur="saveEditMenu('first', index)"
              @keyup.enter="saveEditMenu('first', index)"
            />
            <span v-else class="pop-fn__menu-name h-[54px]">
              {{ item.name }}
            </span>
            <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="startEditMenu('first', index)">
              <img src="@/assets/img/pop/pop-edit.png" alt="" />
            </button>
            <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="removeMenu('first', index)">
              <img src="@/assets/img/pop/pop-del.png" alt="" />
            </button>
          </div>
        </div>
      </section>

      <section class="w-[724px]">
        <div class="flex items-center justify-between">
          <h3 class="h-[54px] text-[32px] leading-[54px] font-[700]">二级菜单</h3>
          <button class="h-[68px] w-[68px] cursor-pointer" type="button" @click="addMenu('second')">
            <img src="@/assets/img/pop/pop-add.png" alt="" />
          </button>
        </div>
        <div class="mt-[44px] h-[566px] border border-[rgba(52,103,165,0.38)] bg-[rgba(8,31,59,0.42)] px-[26px] py-[44px]">
          <div class="pop-fn__row mb-[22px] h-[28px] text-[22px] font-[700] text-[rgba(255,255,255,0.72)]">
            <span>序号</span>
            <span>二级名称</span>
          </div>
          <div class="pop-fn__row mb-[28px] h-[48px]" v-for="(item, index) in secondMenuList" :key="item.id">
            <span
              class="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border border-[rgba(95,139,194,0.45)] bg-[rgba(32,56,89,0.7)] text-[22px] text-[rgba(255,255,255,0.75)]"
            >
              {{ index + 1 }}
            </span>
            <input
              v-if="editingKey === getMenuEditingKey('second', index)"
              v-model="editingName"
              class="pop-fn__input"
              type="text"
              autofocus
              @blur="saveEditMenu('second', index)"
              @keyup.enter="saveEditMenu('second', index)"
            />
            <span v-else class="pop-fn__menu-name h-[48px]">
              {{ item.name }}
            </span>
            <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="startEditMenu('second', index)">
              <img src="@/assets/img/pop/pop-edit.png" alt="" />
            </button>
            <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="removeMenu('second', index)">
              <img src="@/assets/img/pop/pop-del.png" alt="" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <div class="mt-[36px] flex justify-center gap-[48px]">
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]" v-for="item in footerButtonList" :key="item">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pop-fn__row {
  display: grid;
  grid-template-columns: 76px 1fr 48px 48px;
  column-gap: 16px;
  align-items: center;
}

.pop-fn__menu-name,
.pop-fn__input {
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgba(85, 121, 157, 0.8);
  background-color: rgba(0, 8, 16, 0.8);
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 22px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.75);
}

.pop-fn__input {
  height: 48px;
  outline: none;
}
.pop-fn__input1 {
  height: 54px;
  outline: none;
}
button {
  padding: 0;
  border: 0;
  background-color: transparent;
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
