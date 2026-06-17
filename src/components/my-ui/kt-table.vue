<script setup>
const props = defineProps({
  data: Array,
  title: Array,
  titleClass: String,
  contentClass: String,
  keys: Array,
  width: Array,
})
</script>

<template>
  <div class="table">
    <ul class="table-title w-[23px] h-[23px] bg-no-repeat text-[#fff] text-[23px] font-[800] font-[微软雅黑]" :class="[titleClass]">
      <li v-for="(item, i) in title" :key="i" :style="{ flex: width ? width[i] : '' }">
        {{ item }}
      </li>
    </ul>
    <ul class="table-content" :class="[contentClass]">
      <li v-for="(item, i) in data" :key="i">
        <span v-for="(child, index) in keys" :key="index" class="yc" :title="item[child]" :style="{ flex: width ? width[index] : '' }">{{ item[child] }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.table {
  height: 100%;
  width: 100%;
}

.table-title {
  display: flex;
  height: 3rem;

  li {
    flex: 1;
    justify-content: center;
    display: flex;
    align-items: center;
    color: rgb(69, 144, 253);
  }
}

.table-content {
  height: calc(100% - 3rem);
  overflow: auto;

  li {
    display: flex;
    align-items: center;
    height: 2rem;
    border-radius: 0.2rem;
    text-align: center;

    span {
      color: rgb(255, 255, 255);
      flex: 1;
      align-items: center;
      font-size: 0.7vw;
      padding: 0 0.4rem;

      :nth-child(1) {
        padding-left: 3%;
      }

      :last-child {
        padding-right: 1.3%;
      }
    }
  }

  li:nth-child(even) {
    height: 2.6rem;
  }

  li:nth-child(odd) {
    background: rgba(69, 144, 253, 0.5);
  }
}
</style>
