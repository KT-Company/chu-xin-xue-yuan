<!--
 * @Author: 米龙
 * @Date: 2026-06-17 15:40:29
 * @Description:
-->
<script setup lang="ts">
import { FIRST_MENU_LIST, FOOTER_BUTTON_LIST, MAX_MENU_COUNT } from './constants/ktPopFnMenus'
import type { MenuType } from './types/ktPopFn'
import { addMenuItem, cloneMenuList, deleteMenuItem, getMenuEditingKey, moveMenuItem, updateMenuItemName, validateAddMenuForm } from './utils/ktPopFnMenu'
import { useStore } from '@/stores/index'
const store = useStore()
const emit = defineEmits(['close'])
const savedHeaderTitle = store.headerTitle
const savedSecondMenuList = cloneMenuList(store.navMenuList)
const firstMenuList = ref(cloneMenuList(FIRST_MENU_LIST))
const secondMenuList = ref(cloneMenuList(store.navMenuList))
const footerButtonList = FOOTER_BUTTON_LIST
const editingKey = ref('')
const editingName = ref('')
const dragMenuType = ref<MenuType | ''>('')
const dragMenuIndex = ref(-1)
const isMenuConfirmed = ref(false)
const pendingDeleteMenu = ref<{ menuType: MenuType; index: number } | null>(null)
const isAddMenuVisible = ref(false)
const addMenuName = ref('')
const addMenuPath = ref('')
const addMenuNameError = ref('')
const addMenuPathError = ref('')
const isSecondMenuMaxed = computed(() => secondMenuList.value.length >= MAX_MENU_COUNT)

firstMenuList.value[0].name = store.headerTitle

const getMenuList = (menuType: MenuType) => (menuType === 'first' ? firstMenuList.value : secondMenuList.value)

const resetEditingState = () => {
  editingKey.value = ''
  editingName.value = ''
  dragMenuType.value = ''
  dragMenuIndex.value = -1
}

const resetMenuDraft = () => {
  firstMenuList.value = cloneMenuList(FIRST_MENU_LIST)
  firstMenuList.value[0].name = savedHeaderTitle
  secondMenuList.value = cloneMenuList(savedSecondMenuList)
  resetEditingState()
}

const resetAddMenuForm = () => {
  addMenuName.value = ''
  addMenuPath.value = ''
  addMenuNameError.value = ''
  addMenuPathError.value = ''
}

const validateAddMenu = () => {
  const validateResult = validateAddMenuForm(addMenuName.value.trim(), addMenuPath.value.trim())
  addMenuNameError.value = validateResult.menuNameError
  addMenuPathError.value = validateResult.menuPathError

  return validateResult.isValid
}

const openAddMenu = () => {
  if (isSecondMenuMaxed.value) return

  saveEditingMenu()
  resetAddMenuForm()
  isAddMenuVisible.value = true
}

const closeAddMenu = () => {
  isAddMenuVisible.value = false
  resetAddMenuForm()
}

const confirmAddMenu = () => {
  const menuName = addMenuName.value.trim()
  const menuPath = addMenuPath.value.trim()
  if (!validateAddMenu() || isSecondMenuMaxed.value) return

  addMenuItem(secondMenuList.value, 'second', menuName, menuPath)
  closeAddMenu()
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
    updateMenuItemName(getMenuList(menuType), index, menuName, menuType)
  }

  editingKey.value = ''
  editingName.value = ''
}

const removeMenu = (menuType: MenuType, index: number) => {
  deleteMenuItem(getMenuList(menuType), index)
  editingKey.value = ''
  editingName.value = ''
}

const openDeleteConfirm = (menuType: MenuType, index: number) => {
  pendingDeleteMenu.value = { menuType, index }
}

const closeDeleteConfirm = () => {
  pendingDeleteMenu.value = null
}

const confirmDeleteMenu = () => {
  if (!pendingDeleteMenu.value) return

  const { menuType, index } = pendingDeleteMenu.value
  removeMenu(menuType, index)
  closeDeleteConfirm()
}

const startDragMenu = (menuType: MenuType, index: number, event: DragEvent) => {
  dragMenuType.value = menuType
  dragMenuIndex.value = index
  editingKey.value = ''
  editingName.value = ''
  event.dataTransfer?.setData('text/plain', `${menuType}-${index}`)
}

const enterDragMenu = (menuType: MenuType, index: number) => {
  if (dragMenuType.value !== menuType || dragMenuIndex.value === index) return

  moveMenuItem(getMenuList(menuType), dragMenuIndex.value, index)
  dragMenuIndex.value = index
}

const endDragMenu = () => {
  dragMenuType.value = ''
  dragMenuIndex.value = -1
}

const saveEditingMenu = () => {
  if (!editingKey.value) return

  const [menuType, menuIndex] = editingKey.value.split('-')
  saveEditMenu(menuType as MenuType, Number(menuIndex))
}

const applyMenuDraft = () => {
  store.headerTitle = firstMenuList.value[0]?.name || store.headerTitle
  store.navMenuList = cloneMenuList(secondMenuList.value)
}

const restoreSavedMenuConfig = () => {
  store.headerTitle = savedHeaderTitle
  store.navMenuList = cloneMenuList(savedSecondMenuList)
}

const previewMenuConfig = () => {
  saveEditingMenu()
  applyMenuDraft()
}

const confirmMenuConfig = () => {
  saveEditingMenu()
  applyMenuDraft()
  isMenuConfirmed.value = true
  emit('close')
}

const cancelMenuConfig = () => {
  restoreSavedMenuConfig()
  resetMenuDraft()
  emit('close')
}

const handleFooterButton = (buttonText: string) => {
  if (buttonText === '预览') {
    previewMenuConfig()
    return
  }

  if (buttonText === '确认') {
    confirmMenuConfig()
    return
  }

  if (buttonText === '取消') {
    cancelMenuConfig()
  }
}

onBeforeUnmount(() => {
  if (!isMenuConfirmed.value) {
    restoreSavedMenuConfig()
  }
})
</script>

<template>
  <div
    class="pop-fn pointer-events-auto absolute left-[50%] top-[50%] z-[30] h-[1000px] w-[1600px] translate-x-[-50%] translate-y-[-50%] bg-[url('@/assets/img/pop/pop-box.png')] bg-[length:100%_100%] bg-no-repeat font-[SHSCN] text-[#fff]"
  >
    <div
      class="flex relative h-[80px] items-center bg-[url('@/assets/img/pop/pop-title1.png')] bg-[length:100%_100%] bg-no-repeat pl-[34px] text-[36px] font-[700]"
    >
      <div class="absolute left-0 w-[8px] h-[40px] bg-[url(@/assets/img/pop/pop-icon.png)] bg-[length:100%_100%]"></div>
      <span>菜单配置功能</span>
      <button class="ml-auto h-[80px] w-[80px] cursor-pointer" type="button" @click="cancelMenuConfig">
        <img src="@/assets/img/pop/pop-close.png" alt="" />
      </button>
    </div>

    <div class="flex gap-[48px] px-[40px] pt-[100px]">
      <section class="w-[724px]">
        <div class="flex items-center justify-between">
          <h3 class="h-[54px] text-[32px] leading-[54px] font-[700]">一级菜单</h3>
          <!-- <button class="h-[68px] w-[68px] cursor-pointer" type="button" @click="addMenu('first')">
            <img src="@/assets/img/pop/pop-add.png" alt="" />
          </button> -->
        </div>
        <div class="mt-[44px] h-[566px] border border-[rgba(52,103,165,0.38)] bg-[rgba(8,31,59,0.42)] px-[26px] py-[44px]">
          <div class="pop-fn__row mb-[22px] h-[28px] text-[26px] font-bold text-[rgba(255,255,255,0.72)]">
            <span>序号</span>
            <span>一级名称</span>
          </div>
          <div class="pop-fn__list">
            <div
              class="pop-fn__row mb-[28px] h-[54px]"
              v-for="(item, index) in firstMenuList"
              :key="item.id"
              draggable="false"
              @dragstart="startDragMenu('first', index, $event)"
              @dragenter.prevent="enterDragMenu('first', index)"
              @dragover.prevent
              @dragend="endDragMenu"
            >
              <span
                class="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border border-[rgba(95,139,194,0.45)] bg-[rgba(32,56,89,0.7)] text-[26px] text-[rgba(255,255,255,0.75)]"
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
              <!-- <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="removeMenu('first', index)">
                <img src="@/assets/img/pop/pop-del.png" alt="" />
              </button> -->
            </div>
          </div>
        </div>
      </section>

      <section class="w-[724px]">
        <div class="flex items-center justify-between">
          <h3 class="h-[54px] text-[32px] leading-[54px] font-[700]">二级菜单</h3>
          <button
            class="h-[68px] w-[68px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="isSecondMenuMaxed"
            @click="openAddMenu"
          >
            <img src="@/assets/img/pop/pop-add.png" alt="" />
          </button>
        </div>
        <div class="mt-[44px] h-[566px] border border-[rgba(52,103,165,0.38)] bg-[rgba(8,31,59,0.42)] px-[26px] py-[44px]">
          <div class="pop-fn__row mb-[22px] h-[28px] text-[26px] font-[700] text-[rgba(255,255,255,0.72)]">
            <span>序号</span>
            <span>二级名称</span>
          </div>
          <div class="pop-fn__list">
            <div
              class="pop-fn__row mb-[28px] h-[54px] cursor-move"
              v-for="(item, index) in secondMenuList"
              :key="item.id"
              draggable="true"
              @dragstart="startDragMenu('second', index, $event)"
              @dragenter.prevent="enterDragMenu('second', index)"
              @dragover.prevent
              @dragend="endDragMenu"
            >
              <span
                class="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border border-[rgba(95,139,194,0.45)] bg-[rgba(32,56,89,0.7)] text-[26px] text-[rgba(255,255,255,0.75)]"
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
              <span v-else class="pop-fn__menu-name h-[54px]">
                {{ item.name }}
              </span>
              <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="startEditMenu('second', index)">
                <img src="@/assets/img/pop/pop-edit.png" alt="" />
              </button>
              <button class="h-[36px] w-[36px] cursor-pointer" type="button" @click="openDeleteConfirm('second', index)">
                <img src="@/assets/img/pop/pop-del.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="mt-[36px] flex justify-center gap-[48px]">
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]" v-for="item in footerButtonList" :key="item">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
          @click="handleFooterButton(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
  <!--新增弹窗-->
  <div
    v-show="isAddMenuVisible"
    class="pointer-events-auto absolute left-[50%] top-[50%] z-[99] h-[680px] w-[898px] translate-x-[-50%] translate-y-[-50%] bg-[url('@/assets/img/pop/pop-box2.png')] bg-[length:100%_100%] bg-no-repeat font-[SHSCN] text-[#fff]"
  >
    <div class="flex relative items-center h-[80px] bg-[url('@/assets/img/pop/pop-title1.png')] bg-[length:100%_100%] bg-no-repeat pl-[33px] text-[36px]">
      <div class="absolute left-0 w-[8px] h-[40px] bg-[url(@/assets/img/pop/pop-icon.png)] bg-[length:100%_100%]"></div>
      <span>新增</span>
    </div>
    <div class="px-[40px] pt-[37px]">
      <div class="w-[100%] h-[54px] rounded-[8px] border-[2px] border-[rgba(255,255,255,0.15)]">
        <input
          v-model="addMenuName"
          class="add-pop-input add-pop-input--name"
          placeholder="菜单名称"
          @input="addMenuNameError = ''"
          @keyup.enter="confirmAddMenu"
        />
      </div>
      <p v-show="addMenuNameError" class="add-pop-error">{{ addMenuNameError }}</p>
      <div class="w-[100%] h-[274px] mt-[28px] rounded-[8px] border-[2px] border-[rgba(255,255,255,0.15)]">
        <input
          v-model="addMenuPath"
          class="add-pop-input add-pop-input--route"
          placeholder="路由地址"
          @input="addMenuPathError = ''"
          @keyup.enter="confirmAddMenu"
        />
      </div>
      <p v-show="addMenuPathError" class="add-pop-error">{{ addMenuPathError }}</p>
    </div>
    <div class="mt-[36px] flex justify-center gap-[48px]">
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
          @click="closeAddMenu"
        >
          取消
        </button>
      </div>
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
          @click="confirmAddMenu"
        >
          确认
        </button>
      </div>
    </div>
  </div>
  <!--删除提示弹窗-->
  <div
    v-show="pendingDeleteMenu"
    class="pointer-events-auto absolute left-[50%] top-[50%] z-[31] h-[508px] w-[898px] translate-x-[-50%] translate-y-[-50%] bg-[url('@/assets/img/pop/pop-box2.png')] bg-[length:100%_100%] bg-no-repeat font-[SHSCN] text-[#fff]"
  >
    <div class="flex relative items-center h-[80px] bg-[url('@/assets/img/pop/pop-title1.png')] bg-[length:100%_100%] bg-no-repeat pl-[33px] text-[36px]">
      <div class="absolute left-0 w-[8px] h-[40px] bg-[url(@/assets/img/pop/pop-icon.png)] bg-[length:100%_100%]"></div>
      <span>确定删除</span>
    </div>
    <div class="h-[132px] px-[40px] mt-[61px] text-[40px]">
      <span>删除后数据不可恢复</span>
    </div>
    <div class="mt-[84px] flex justify-center gap-[48px]">
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
          @click="closeDeleteConfirm"
        >
          取消
        </button>
      </div>
      <div class="w-[320px] h-[100px] flex items-center justify-center rounded-[8px] bg-[rgba(0,0,0,0.5)]">
        <button
          class="h-[80px] w-[300px] cursor-pointer bg-[url('@/assets/img/pop/pop-btn.png')] bg-[length:100%_100%] bg-no-repeat text-[32px] font-[700] text-[#fff]"
          type="button"
          @click="confirmDeleteMenu"
        >
          确认
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

.pop-fn__list {
  height: 420px;
  overflow-y: auto;
  padding-right: 8px;
}

.pop-fn__list::-webkit-scrollbar {
  width: 8px;
}

.pop-fn__list::-webkit-scrollbar-track {
  background-color: rgba(8, 31, 59, 0.42);
}

.pop-fn__list::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(95, 139, 194, 0.7);
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
  font-size: 26px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.75);
}

.pop-fn__input {
  height: 54px;
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
.add-pop-input {
  width: 100%;
  height: 100%;
  outline: none;
  padding-left: 18px;
  font-size: 26px;
}
.add-pop-input--name {
  line-height: 54px;
}
.add-pop-input--route {
  line-height: 274px;
}
.add-pop-error {
  height: 24px;
  margin-top: 4px;
  color: #ff6b6b;
  font-size: 20px;
  line-height: 24px;
}
</style>
