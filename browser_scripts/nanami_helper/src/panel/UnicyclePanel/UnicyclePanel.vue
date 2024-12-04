<script setup>
import { ref } from 'vue'
import {
  loadUnicycleRules as loadUnicycleRulesApi,
  loadInterval as loadIntervalApi,
  saveInterval,
  saveUnicycleRules,
  startUnicyle,
  stopUnicycle,
} from '@/service/unicycle'
import UnicycleItem from './UnicycleItem.vue'

const unicycleRules = ref([])
const sendInterval = ref(6)
const isEditing = ref(false)
const editingRule = ref({
  id: '',
  name: '',
  text: '',
})
const runningUnicycleId = ref('')

loadUnicycleRules()
loadInterval()

function loadUnicycleRules() {
  unicycleRules.value = loadUnicycleRulesApi()
}

function loadInterval() {
  sendInterval.value = loadIntervalApi()
}

function clickNew() {
  editingRule.value = {
    id: '',
    name: '',
    text: '',
  }
  isEditing.value = true
}

function clickEdit(id) {
  const rule = unicycleRules.value.find((item) => item.id === id)
  editingRule.value = rule
  isEditing.value = true
}

function clickDelete(id) {
  const rules = unicycleRules.value.filter((item) => item.id !== id)
  if (runningUnicycleId.value === id) {
    stopUnicycle()
  }
  saveUnicycleRules(rules)
  loadUnicycleRules()
}

function clickStart(id) {
  const text = unicycleRules.value.find((item) => item.id === id)?.text
  if (text) {
    startUnicyle(text, sendInterval.value)
    runningUnicycleId.value = id
  }
}

function clickStop() {
  stopUnicycle()
  runningUnicycleId.value = ''
}

function onIntervalChange() {
  saveInterval(sendInterval.value)
}

function confirmEdit() {
  let finded = false
  let rules = unicycleRules.value
  for (const rule of rules) {
    if (rule.id === editingRule.value.id) {
      rule.text = editingRule.value.text
      rule.name = editingRule.value.name
      finded = true
      break
    }
  }
  if (!finded) {
    rules.unshift({
      id: crypto.randomUUID(),
      name: editingRule.value.name,
      text: editingRule.value.text,
    })
  }
  saveUnicycleRules(rules)
  loadUnicycleRules()
  isEditing.value = false
}

function cancelEdit() {
  loadUnicycleRules()
  isEditing.value = false
}
</script>
<template>
  <div v-if="!isEditing">
    <div>
      <button @click="clickNew">新建独轮车</button>
      <div>
        间隔:
        <input type="number" v-model="sendInterval" @change="onIntervalChange" />
      </div>
    </div>
    <div class="nnm-unicycle-list">
      <UnicycleItem
        v-for="rule in unicycleRules"
        :key="rule.id"
        :name="rule.name"
        :running="rule.id === runningUnicycleId"
        @edit="clickEdit(rule.id)"
        @delete="clickDelete(rule.id)"
        @start="clickStart(rule.id)"
        @stop="clickStop(rule.id)"
      />
    </div>
  </div>
  <div v-else>
    <div>
      <div>名称:</div>
      <input type="text" v-model="editingRule.name" />
    </div>
    <div>规则:</div>
    <textarea cols="30" rows="10" v-model="editingRule.text"></textarea>
    <div>
      <button @click="confirmEdit">确定</button>
      <button @click="cancelEdit">取消</button>
    </div>
  </div>
</template>

<style scoped></style>
