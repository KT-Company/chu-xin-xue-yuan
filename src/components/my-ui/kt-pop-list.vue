<!--
 * @Author: 米龙
 * @Date: 2026-06-17 16:27:40
 * @Description:
-->
<script setup lang="ts">
const emit = defineEmits(['close'])

const maintenanceList = [
  {
    energySystem: '地热能系统',
    category: '地源热泵机组',
    name: '1# 主地源热泵',
    startDate: '2024-01-15',
    period: 3,
    lastDate: '2026-04-15',
    reminder: '距下次维保仅剩 7 天，请尽快安排',
  },
  {
    energySystem: '地热能系统',
    category: '地源热泵机组',
    name: '2# 备用地源热泵',
    startDate: '2024-01-15',
    period: 3,
    lastDate: '2026-03-20',
    reminder: '已超过维保周期，立即处理',
  },
  {
    energySystem: '空调系统',
    category: '循环水泵',
    name: '空调冷却循环泵 1#',
    startDate: '2023-06-01',
    period: 1,
    lastDate: '2026-05-18',
    reminder: '距下次维保还有 18 天',
  },
  {
    energySystem: '空调系统',
    category: '循环水泵',
    name: '空调冷却循环泵 2#',
    startDate: '2023-06-01',
    period: 1,
    lastDate: '2026-06-01',
    reminder: '正常，距下次维保还有 15 天',
  },
  {
    energySystem: '空调系统',
    category: '多联机设备',
    name: '一号办公区多联机外机 A2',
    startDate: '2023-05-10',
    period: 6,
    lastDate: '2025-12-10',
    reminder: '已超过维保周期，立即处理',
  },
  {
    energySystem: '空调系统',
    category: '多联机设备',
    name: '二号办公区多联机外机 B1',
    startDate: '2023-05-10',
    period: 6,
    lastDate: '2026-03-10',
    reminder: '距下次维保还有 24 天',
  },
  {
    energySystem: '新风系统',
    category: '新风设备',
    name: '楼顶新风机 X1',
    startDate: '2023-08-20',
    period: 2,
    lastDate: '2026-02-20',
    reminder: '距下次维保仅剩 4 天，请尽快安排',
  },
  {
    energySystem: '新风系统',
    category: '新风设备',
    name: '楼顶新风机 X2',
    startDate: '2023-08-20',
    period: 2,
    lastDate: '2026-05-05',
    reminder: '正常，距下次维保还有 19 天',
  },
  {
    energySystem: '新风系统',
    category: '新风设备',
    name: '三楼走廊新风机组 X3',
    startDate: '2024-02-01',
    period: 2,
    lastDate: '2026-06-01',
    reminder: '正常，距下次维保还有 15 天',
  },
  {
    energySystem: '配电系统',
    category: '配电设备',
    name: '空调机房配电柜',
    startDate: '2022-11-01',
    period: 12,
    lastDate: '2025-11-01',
    reminder: '距下次维保还有 15 天（年度大修）',
  },
  {
    energySystem: '配电系统',
    category: '配电设备',
    name: '地下室动力配电箱 D1',
    startDate: '2022-11-01',
    period: 12,
    lastDate: '2025-12-15',
    reminder: '正常，距下次维保还有 183 天',
  },
  {
    energySystem: '光伏系统',
    category: '光伏组件',
    name: '园区 1# 屋面光伏阵列',
    startDate: '2023-03-15',
    period: 3,
    lastDate: '2026-03-15',
    reminder: '距下次维保还有 29 天',
  },
  {
    energySystem: '光伏系统',
    category: '逆变器',
    name: '1# 光伏并网逆变器',
    startDate: '2023-03-15',
    period: 6,
    lastDate: '2025-12-15',
    reminder: '已超过维保周期，立即处理',
  },
  {
    energySystem: '光伏系统',
    category: '光伏组件',
    name: '停车场 2# 棚顶光伏阵列',
    startDate: '2023-07-01',
    period: 3,
    lastDate: '2026-04-01',
    reminder: '新设备首次维保，请确认计划',
  },
  {
    energySystem: '储能系统',
    category: '储能电池组',
    name: '主楼储能电池柜 B1',
    startDate: '2024-09-01',
    period: 6,
    lastDate: '2026-03-01',
    reminder: '距下次维保还有 15 天',
  },
]
</script>

<template>
  <div class="pop-list pointer-events-auto absolute left-[50%] top-[50%] z-[25] translate-x-[-50%] translate-y-[-50%] text-[#fff]">
    <div class="pop-list__title">
      <span>设备维保</span>
      <button class="pop-list__close" type="button" @click="emit('close')">
        <img src="@/assets/img/pop/pop-close.png" alt="" />
      </button>
    </div>

    <div class="pop-list__table">
      <div class="pop-list__row pop-list__head">
        <span>序号</span>
        <span>能源系统</span>
        <span>设备类别</span>
        <span>设备名称</span>
        <span>初始维保日期</span>
        <span>维保周期（月）</span>
        <span>上次维保时间</span>
        <span>维保计时提醒</span>
      </div>
      <div class="pop-list__row pop-list__body-row" v-for="(item, index) in maintenanceList" :key="`${item.name}-${item.lastDate}`">
        <span>{{ index + 1 }}</span>
        <span>{{ item.energySystem }}</span>
        <span>{{ item.category }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.startDate }}</span>
        <span>{{ item.period }}</span>
        <span>{{ item.lastDate }}</span>
        <span>{{ item.reminder }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pop-list {
  width: 2100px;
  height: 1214px;

  background: url('@/assets/img/pop/pop-box.png') no-repeat;
  background-size: 100% 100%;
}

.pop-list__title {
  position: relative;
  display: flex;
  height: 80px;
  align-items: center;
  padding-left: 34px;
  background: url('@/assets/img/pop/pop-title1.png') no-repeat;
  background-size: 100% 100%;
  font-size: 36px;

  line-height: 80px;
}

.pop-list__title::before {
  position: absolute;
  left: 0;
  width: 8px;
  height: 40px;
  background: url('@/assets/img/pop/pop-icon.png') no-repeat;
  background-size: 100% 100%;
  content: '';
}

.pop-list__close {
  margin-left: auto;
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.pop-list__table {
  margin: 44px auto 0;
  width: 2000px;
  overflow: hidden;
  border: 1px solid rgba(42, 94, 158, 0.74);
  border-radius: 2px;
  box-shadow:
    inset 0 0 20px rgba(25, 118, 210, 0.16),
    0 0 18px rgba(0, 0, 0, 0.28);
  color: rgba(222, 241, 255, 0.9);
  font-size: 16px;
}

.pop-list__row {
  display: grid;
  grid-template-columns: 70px 180px 180px 450px 200px 190px 190px 1fr;
  align-items: center;
  color: '#fff';
  font-size: 24px;
}

.pop-list__row > span {
  display: flex;
  min-width: 0;
  height: 100%;
  align-items: center;
  border-right: 1px solid rgba(81, 132, 190, 0.28);
  padding: 0 18px;
  white-space: nowrap;
}

.pop-list__row > span:first-child,
.pop-list__row > span:nth-child(6) {
  justify-content: center;
  padding: 0;
}

.pop-list__row > span:last-child {
  border-right: 0;
}

.pop-list__head {
  height: 65px;
  background: url('@/assets/img/pop/pop-son-title.png') no-repeat;
  background-size: 100% 100%;
  color: #8bd2ff;
  font-size: 24px;
}

.pop-list__body-row {
  height: 61.5px;
  background: rgba(8, 29, 56, 0.92);
}

.pop-list__body-row:nth-child(even) {
  background: rgba(22, 62, 111, 0.9);
}

.pop-list__body-row + .pop-list__body-row {
  border-top: 1px solid rgba(24, 74, 132, 0.34);
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
