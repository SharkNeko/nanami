<script setup>
const emit = defineEmits(['click'])
</script>
<template>
  <button @click="emit('click')">
    <slot />
  </button>
</template>

<style scoped>
button {
  background: #e5e5e5;
  border: none;
  border-radius: 2px;
  margin-left: 4px;
  cursor: pointer;
}

button:hover {
  background: #c6c6c6;
}
</style>