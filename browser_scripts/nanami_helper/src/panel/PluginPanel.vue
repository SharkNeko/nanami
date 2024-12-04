<script setup>
import { ref } from 'vue'
import AvoidBlockPanel from './AvoidBlockPanel/AvoidBlockPanel.vue'
import UnicyclePanel from './UnicyclePanel/UnicyclePanel.vue'

const PANEL_LIST = {
  UNICYCLE: 'unicycle',
  AVOID_BLOCK: 'avoid_block',
}

const activePanel = ref(PANEL_LIST.UNICYCLE)

function openPanel(value) {
  activePanel.value = value
}
</script>
<template>
  <div class="nnm__tab-header">
    <button
      :class="['nnm__tab-btn', activePanel === PANEL_LIST.UNICYCLE && 'is-active']"
      @click="openPanel(PANEL_LIST.UNICYCLE)"
    >
      独轮车
    </button>
    <button
      :class="['nnm__tab-btn', activePanel === PANEL_LIST.AVOID_BLOCK && 'is-active']"
      @click="openPanel(PANEL_LIST.AVOID_BLOCK)"
    >
      防屏蔽
    </button>
  </div>
  <div class="nnm__tab-content">
    <UnicyclePanel v-show="activePanel === PANEL_LIST.UNICYCLE"></UnicyclePanel>
    <AvoidBlockPanel v-show="activePanel === PANEL_LIST.AVOID_BLOCK"></AvoidBlockPanel>
  </div>
</template>

<style scoped>
.nnm__tab-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nnm__tab-btn {
  background: none;
  border: none;
  display: block;
  flex-grow: 1;
  padding: 6px 0;
  cursor: pointer;
  font-size: 14px;
  background: #e5e5e5;
  transition: background-color 0.1s ease;
}

.nnm__tab-btn:hover {
  background: #c6c6c6;
}

.nnm__tab-btn.is-active {
  background: #56d6ff;
  transition: none;
}

.nnm__tab-content {
  padding: 6px;
}
</style>
