import { createApp } from 'vue'
import PluginEntry from './PluginEntry.vue'
import PluginPanel from './panel/PluginPanel.vue'
import './index.css'

const check = setInterval(() => {
  let groupEl = document.querySelector('.bottom-actions.p-relative')
  let chatPanel = document.querySelector('.chat-history-panel')
  let chatInput = document.querySelector('textarea.chat-input')

  if (groupEl && chatPanel && chatInput) {
    clearInterval(check)
    main()
  }
}, 500)

function main() {
  createEntry()
  createPanel()
}

function createEntry() {
  const nativeActionGroup = document.querySelector('.bottom-actions.p-relative')
  const div = document.createElement('div')
  nativeActionGroup.appendChild(div)
  createApp(PluginEntry).mount(div)
}

function createPanel() {
  const nativeChatPanel = document.querySelector('.chat-history-panel')
  const div = document.createElement('div')
  div.id = 'nnm-helper-panel'
  div.style.display = 'none'
  nativeChatPanel.appendChild(div)
  createApp(PluginPanel).mount(div)
}

main()
