<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['edit', 'delete', 'start', 'stop'])
const props = defineProps({
  name: String,
  running: {
    type: Boolean,
    default: false,
  },
})

const isConfirmDelete = ref(false)

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
  isConfirmDelete.value = true
}

function clickConfirmDelete() {
  emit('delete')
}

function clickCancelDelete() {
  isConfirmDelete.value = false
}
</script>
<template>
  <div class="nnm__unicycle-item">
    <button class="nnm__unicycle-item-start" @click="clickToggle">{{ toggleText }}</button>
    <div class="nnm__unicycle-item-name">{{ name }}</div>
    <div class="nnm__unicycle-item-btn-right" v-if="!isConfirmDelete">
      <button @click="clickEdit">编辑</button>
      <button @click="clickDelete">删除</button>
    </div>
    <div class="nnm__unicycle-item-btn-right" v-else>
      <button @click="clickConfirmDelete">确定删除</button>
      <button @click="clickCancelDelete">取消</button>
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

.nnm__unicycle-item button {
  background: #e5e5e5;
  border: none;
  border-radius: 2px;
  margin-left: 4px;
  cursor: pointer;
}

.nnm__unicycle-item button:hover {
  background: #c6c6c6;
}

.nnm__unicycle-item-btn-right {
  margin-left: auto;
  flex-shrink: 0;
}
</style>
