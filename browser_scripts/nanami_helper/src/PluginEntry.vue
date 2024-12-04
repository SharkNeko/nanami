<script setup>
import { computed, watch } from 'vue'
import { store, setPanelOpen } from './store'

const btnText = computed(() => {
  return store.isPanelOpen ? '关闭面板' : '打开面板'
})

watch(
  () => store.isPanelOpen,
  (value) => {
    const panel = document.querySelector('#nnm-helper-panel')
    if (value) {
      panel.style.display = 'block'
    } else {
      panel.style.display = 'none'
    }
  },
)

function handleClick() {
  setPanelOpen(!store.isPanelOpen)
}
</script>

<template>
  <button @click="handleClick">{{ btnText }}</button>
</template>
