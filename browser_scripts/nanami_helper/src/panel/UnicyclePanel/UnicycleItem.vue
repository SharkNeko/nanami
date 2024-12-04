<script setup>
import { computed } from 'vue'
import BaseButton from '../../components/BaseButton.vue'
import { confirm } from '../../components/Confirm/index.js'

const emit = defineEmits(['edit', 'delete', 'start', 'stop'])
const props = defineProps({
  name: String,
  running: {
    type: Boolean,
    default: false,
  },
})

const toggleText = computed(() => {
  return props.running ? '暂停' : '启动'
})

function clickEdit() {
  emit('edit')
}

function clickToggle() {
  props.running ? emit('stop') : emit('start')
}

function clickDelete() {
  confirm('确定删除').then(() => {
    emit('delete')
  })
}
</script>
<template>
  <div class="nnm__unicycle-item">
    <BaseButton class="nnm__unicycle-item-start" @click="clickToggle">{{ toggleText }}</BaseButton>
    <div class="nnm__unicycle-item-name">{{ name }}</div>
    <div class="nnm__unicycle-item-btn-right">
      <BaseButton @click="clickEdit">编辑</BaseButton>
      <BaseButton @click="clickDelete">删除</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.nnm__unicycle-item {
  display: flex;
  flex-direction: row;
  padding: 6px 0;
  position: relative;
}

.nnm__unicycle-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 1px;
  width: 98%;
  background: #c5c5c5;
}
.nnm__unicycle-item:last-child:after {
  display: none;
}

.nnm__unicycle-item-start {
  flex-shrink: 0;
}

.nnm__unicycle-item-name {
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nnm__unicycle-item-btn-right {
  margin-left: auto;
  flex-shrink: 0;
}
</style>
