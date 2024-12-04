import { reactive } from 'vue'

export const store = reactive({
  isPanelOpen: false,
})

export const setPanelOpen = (value) => {
  store.isPanelOpen = value
}
