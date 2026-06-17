<template>
  <div class="kt-table flex h-full w-full flex-col text-[#ecf0f1]">
    <div class="kt-table-header flex shrink-0 bg-full">
      <div
        v-for="columnItem in columns"
        :Key="columnItem.prop"
        class="h-full grow flex items-center w-full"
        :style="{
          ...opts.getStyleByColumn(columnItem),
        }"
      >
        <slot :name="`${columnItem.prop}-header`" :column="columnItem">
          <span class="font-[Source-Han-Sans-CN]">
            {{ columnItem.label }}
          </span>
        </slot>
      </div>
    </div>
    <div
      class="kt-table-body min-h-[0px] flex-1 bg-full"
      :style="{
        marginTop: gap,
      }"
    >
      <div v-if="data.length" class="h-full">
        <kt-anime-scroll :sSpeed="sSpeed" :aSpeed="aSpeed" :disable-animate="disableAnimate" :mt="mt">
          <div
            class="kt-table-content flex flex-col"
            :style="{
              rowGap: gap,
              paddingTop: gap,
            }"
          >
            <div
              class="kt-table-row flex h-[30px] bg-full"
              v-for="(rowData, rowIndex) in data"
              :key="rowIndex"
              @click="$emit('click-row', rowData)"
              :class="[customRowClass ? customRowClass(rowData) : '']"
            >
              <div
                class="kt-table-cell line-clamp-1 h-full grow overflow-hidden flex items-center flex-nowrap"
                :class="props.name === '空调冷热量表' ? 'ellipsis2' : 'ellipsis1'"
                :title="formatText(rowData[columnItem.prop])"
                v-for="(columnItem, columnIndex) in columns"
                :key="columnItem.prop + columnIndex"
                :style="{
                  ...opts.getStyleByColumn(columnItem),
                  ...(columnItem.style || {}),
                }"
              >
                <slot :name="`${columnItem.prop}-cell`" :row-data="rowData" :column="columnItem" :val="rowData[columnItem.prop]">
                  <span>
                    {{ formatText(rowData[columnItem.prop]) }}
                  </span>
                </slot>
              </div>
            </div>
          </div>
        </kt-anime-scroll>
      </div>
      <div class="kt-table-empty flex justify-center items-center h-full w-full" v-else>
        <slot name="empty">
          <div class="w-[162px] h-[124px] bg-[length:100%_100%] flex items-center justify-center">
            <span class="font-[Source-Han-Sans-CN] mt-[40px]">暂无数据</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import ktAnimeScroll from '../utils-ui/kt-anime-scroll.vue'
const props = defineProps({
  columns: {
    type: Array,
    default: () => [
      // {
      //   label: "序号",
      //   prop: "k1",
      //   dir: "center",
      //   width: 2,
      // }
    ],
  },
  data: {
    type: Array,
    default: () => [],
  },
  gap: {
    type: String,
    default: '10px',
  },
  aSpeed: {
    type: Number,
    default: 30,
  },
  sSpeed: {
    type: Number,
    default: 0.48,
  },
  disableAnimate: {
    type: Boolean,
    default: false,
  },
  customRowClass: {
    type: Function,
    default: null,
  },
  name: {
    type: String,
    default: 'name',
  },
  mt: {
    type: String,
    default: '10px',
  },
})

defineEmits(['click-row'])

const opts = {
  getStyleByColumn: (columnItem) => {
    const width = columnItem.width || (columnItem.label + '').length || 1
    const direction = columnItem.dir || 'center'

    return {
      flex: `${width} ${width} 0%`,
      justifyContent: {
        center: 'center',
        left: 'flex-start',
        right: 'flex-end',
      }[direction],
    }
  },
}
const formatText = (text) => {
  if (text == null) return '' // null 或 undefined
  const str = String(text) // 转成字符串
  return str.replace(/[;；]/g, '\n') // 中文；或英文; 都换行
}
</script>

<style lang="less" scoped>
.bg-full {
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.ellipsis1 {
  overflow: hidden;
  /* 隐藏溢出的内容 */
  text-overflow: ellipsis;
  /* 溢出显示省略号 */
  white-space: nowrap;
  /* 表格行高固定，单行省略能避免内容撑开行高 */
  word-break: normal;
  text-align: center;
}

.ellipsis2 {
  overflow: hidden;
  /* 隐藏溢出的内容 */
  text-overflow: ellipsis;
  /* 溢出显示省略号 */
  white-space: nowrap;
  /* 表格行高固定，单行省略能避免内容撑开行高 */
  word-break: normal;
  text-align: left;
}

.kt-table-cell {
  min-width: 0;
}

.kt-table-cell :deep(span),
.kt-table-cell :deep(div) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
