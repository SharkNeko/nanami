<template>
  <h1>Nanami page</h1>
  {{ text }}
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const text = ref('')

onMounted(async () => {
  try {
    const resp = await fetch('/api/test_api', {
      method: 'post'
    })
    const data = await resp.json()
    text.value = data.text
  } catch (e) {
    console.error(e)
    text.value = 'request error'
  }
})
</script>