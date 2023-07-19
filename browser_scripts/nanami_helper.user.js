// ==UserScript==
// @name         七海直播间助手
// @namespace    http://tampermonkey.net/
// @version      1.0.18
// @description  自动晚安，自动打call，独轮车，规避屏蔽词
// @author       pekomiko
// @match        https://live.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

;(function () {
  const check = setInterval(() => {
    let groupEl = document.querySelector('.bottom-actions.p-relative')
    let chatPanel = document.querySelector('.chat-history-panel')
    let chatInput = document.querySelector('textarea.chat-input')

    if (groupEl && chatPanel && chatInput) {
      clearInterval(check)
      main()
    }
  }, 1000)

  function main() {
    // Const
    const KEY_PREFIX = 'nnmHelper_'
    const MAX_LENGTH_KEY = KEY_PREFIX + 'maxLength'
    const DIFF_COUNT_KEY = KEY_PREFIX + 'diffCount'
    const INTERVAL_KEY = KEY_PREFIX + 'interval'
    const REPLACE_SENS_KEY = KEY_PREFIX + 'replaceSens'
    const CALL_STR_KEY = KEY_PREFIX + 'callStr'
    const UNICYCLE_STR_KEY = KEY_PREFIX + 'unicyleStr'

    const WANAN_MODE = 'wanan_mode'
    const CALL_MODE = 'call_mode'
    const UNICYCLE_MODE = 'unicycle_mode'

    const state = {
      maxLength: parseInt(GM_getValue(MAX_LENGTH_KEY)) || 40, // chat content length limit
      diffCount: parseInt(GM_getValue(DIFF_COUNT_KEY)) || 5, // count of unique comment in wanan mode and call mode
      interval: parseFloat(GM_getValue(INTERVAL_KEY)) || 6, // auto send comment interval
      replaceSens: GM_getValue(REPLACE_SENS_KEY) === 'on',
      mode: '',
      callStr: GM_getValue(CALL_STR_KEY) || '七海',
      unicycleStr: GM_getValue(UNICYCLE_STR_KEY) || '',

      panelOpen: false,
    }

    const refs = {
      nativeActionGroup: document.querySelector('.bottom-actions.p-relative'),
      nativeChatPanel: document.querySelector('.chat-history-panel'),
      nativeChatInput: document.querySelector('textarea.chat-input'),

      panel: null,
      panelBtn: null,
      startWananBtn: null,
      stopWananBtn: null,
      startCallBtn: null,
      stopCallBtn: null,
      startUnicycleBtn: null,
      stopUnicycleBtn: null,

      unicycleInput: null,
      maxlengthInput: null,
      intervalInput: null,
      callInput: null,
      replaceSensInput: null,
    }

    let chatTimer = null
    let isComposition = false

    GM_addStyle(pageStyle())
    initUI()
    initEvent()

    // Init

    function initUI() {
      const panelBtn = createPanelBtn()
      refs.nativeActionGroup.appendChild(panelBtn)

      const panel = createPanel()
      refs.nativeChatPanel.appendChild(panel)
    }

    function initEvent() {
      const inputEl = refs.nativeChatInput
      inputEl.addEventListener('input', () => {
        if (state.replaceSens && !isComposition) {
          const safeContent = replaceSensWord(inputEl.value)
          if (inputEl.value !== safeContent) {
            inputEl.value = replaceSensWord(inputEl.value)
            setTimeout(() => {
              const evt = new Event('input')
              inputEl.dispatchEvent(evt)
            })
          }
        }
      })
      inputEl.addEventListener('compositionstart', () => {
        isComposition = true
      })
      inputEl.addEventListener('compositionend', () => {
        isComposition = false
        inputEl.value = replaceSensWord(inputEl.value)
        setTimeout(() => {
          const evt = new Event('input')
          inputEl.dispatchEvent(evt)
        })
      })
    }

    // UI

    function createPanelBtn() {
      const btn = document.createElement('button')
      btn.className = 'nnm-panel-btn'
      btn.innerText = state.panelOpen ? '关闭面板' : '打开面板'
      btn.addEventListener('click', () => setPanelOpen(!state.panelOpen))
      refs.panelBtn = btn
      return btn
    }

    function createPanel() {
      const panel = document.createElement('div')
      panel.className = 'nnm-panel nnm-hidden'
      panel.innerHTML = `
      <div>
        <div class="nnm-group">
          <div>启用替换敏感词</div>
          <input id="replace-sens-input" type="checkbox"></input>
        </div>
        <div class="nnm-group">
          <div>限制长度</div>
          <input id="maxlength-input" type="number"></input>
        </div>
        <div class="nnm-group">
          <div>发送间隔</div>
          <input id="interval-input" type="number"></input>
        </div>
        <div>
          <div class="nnm-group">
            <button class="nnm-btn" id="start-wanan-btn">开始晚安</button>
            <button class="nnm-btn" id="stop-wanan-btn" class="nnm-hidden">停止晚安</button>
          </div>
          <div class="nnm-group">
            <button class="nnm-btn" id="start-call-btn">开始打call</button>
            <button class="nnm-btn" id="stop-call-btn">停止打call</button>
            <input id="call-input" type="text" value="七海" placeholder="用空格分割打call词"></input>
          </div>
          <div class="nnm-group">
            <button class="nnm-btn" id="start-unicycle-btn">开始独轮车</button>
            <button class="nnm-btn" id="stop-unicycle-btn">停止独轮车</button>
            <textarea id="unicycle-input" type="text" placeholder="用“|”或换行分割弹幕"></textarea>
          </div>
        </div>
      </div>
    `
      refs.startWananBtn = panel.querySelector('#start-wanan-btn')
      refs.startWananBtn.addEventListener('click', () => setMode(WANAN_MODE))

      refs.stopWananBtn = panel.querySelector('#stop-wanan-btn')
      refs.stopWananBtn.addEventListener('click', () => setMode(''))

      refs.startCallBtn = panel.querySelector('#start-call-btn')
      refs.startCallBtn.addEventListener('click', () => setMode(CALL_MODE))

      refs.stopCallBtn = panel.querySelector('#stop-call-btn')
      refs.stopCallBtn.addEventListener('click', () => setMode(''))

      refs.startUnicycleBtn = panel.querySelector('#start-unicycle-btn')
      refs.startUnicycleBtn.addEventListener('click', () => setMode(UNICYCLE_MODE))

      refs.stopUnicycleBtn = panel.querySelector('#stop-unicycle-btn')
      refs.stopUnicycleBtn.addEventListener('click', () => setMode(''))

      refs.intervalInput = panel.querySelector('#interval-input')
      refs.intervalInput.value = state.interval
      refs.intervalInput.addEventListener('change', (e) => setIntervalState(e.target.value, false))

      refs.maxlengthInput = panel.querySelector('#maxlength-input')
      refs.maxlengthInput.value = state.maxLength
      refs.maxlengthInput.addEventListener('change', (e) => setMaxlength(e.target.value, false))

      refs.callInput = panel.querySelector('#call-input')
      refs.callInput.value = state.callStr
      refs.callInput.addEventListener('change', (e) => setCallStr(e.target.value, false))

      refs.unicycleInput = panel.querySelector('#unicycle-input')
      refs.unicycleInput.value = state.unicycleStr
      refs.unicycleInput.addEventListener('change', (e) => setUnicycleStr(e.target.value, false))

      refs.replaceSensInput = panel.querySelector('#replace-sens-input')
      refs.replaceSensInput.checked = state.replaceSens
      refs.replaceSensInput.addEventListener('change', (e) => setReplaceSens(e.target.checked))

      refs.panel = panel
      return panel
    }

    // Set state

    function setPanelOpen(open) {
      state.panelOpen = open
      updatePanelBtn()
      updatePanel()
    }

    function setMode(mode) {
      if (state.mode === mode) {
        return
      }
      state.mode = mode
      updatePanel()
      execMode()
    }

    function setIntervalState(value, update) {
      state.interval = parseFloat(value)
      GM_setValue(INTERVAL_KEY, value)
      if (update) {
        refs.intervalInput.value = value
      }
    }

    function setMaxlength(value, update) {
      state.maxLength = parseInt(value)
      GM_setValue(MAX_LENGTH_KEY, value)
      if (update) {
        refs.maxlengthInput.value = value
      }
    }

    function setCallStr(value, update) {
      state.callStr = value
      GM_setValue(CALL_STR_KEY, value)
      if (update) {
        refs.callInput.value = value
      }
    }

    function setUnicycleStr(value, update) {
      state.unicycleStr = value
      GM_setValue(UNICYCLE_STR_KEY, value)
      if (update) {
        refs.unicycleInput.value = value
      }
    }

    function setReplaceSens(value) {
      state.replaceSens = value
      if (value) {
        GM_setValue(REPLACE_SENS_KEY, 'on')
      } else {
        GM_setValue(REPLACE_SENS_KEY, 'off')
      }
    }

    // Update UI

    function updatePanelBtn() {
      refs.panelBtn.innerText = state.panelOpen ? '关闭面板' : '打开面板'
    }

    function updatePanel() {
      if (state.panelOpen) {
        show(refs.panel)
      } else {
        hide(refs.panel)
      }

      const resetBtn = () => {
        show(refs.startCallBtn)
        show(refs.startWananBtn)
        show(refs.startUnicycleBtn)
        hide(refs.stopCallBtn)
        hide(refs.stopWananBtn)
        hide(refs.stopUnicycleBtn)
      }
      resetBtn()

      if (state.mode === WANAN_MODE) {
        show(refs.stopWananBtn)
        hide(refs.startWananBtn)
      } else if (state.mode === CALL_MODE) {
        show(refs.stopCallBtn)
        hide(refs.startCallBtn)
      } else if (state.mode === UNICYCLE_MODE) {
        show(refs.stopUnicycleBtn)
        hide(refs.startUnicycleBtn)
      }
    }

    // exec

    function execMode() {
      clearInterval(chatTimer)
      const mode = state.mode
      let chats = []
      let index = 0
      if (mode === UNICYCLE_MODE) {
        chats = generateUnicycle()
      } else if (mode === WANAN_MODE) {
        chats = generateWanan()
      } else if (mode === CALL_MODE) {
        chats = gennerateCall()
      }
      const run = () => {
        sendChat(chats[index])
        index++
        if (index >= chats.length) {
          index = 0
        }
      }

      run()
      let interval = state.interval || 6
      chatTimer = setInterval(run, interval * 1000)
    }

    // helper

    function show(el) {
      el.classList.remove('nnm-hidden')
    }

    function hide(el) {
      el.classList.add('nnm-hidden')
    }

    // Methods

    function replaceSensWord(content) {
      let result = content
      for (const sensWord in rules) {
        result = result.replaceAll(sensWord, rules[sensWord])
      }
      return result
    }

    function generateUnicycle() {
      const content = refs.unicycleInput.value
      let result = []
      content.split('|').forEach((element) => {
        result = result.concat(element.split('\n'))
      })
      return result
    }

    function gennerateCall() {
      const callStrList = state.callStr.split(' ').filter((s) => s)
      const argsLen = callStrList.length

      let result = []

      for (let i = 0; i < state.diffCount; i++) {
        let callStr = ''
        let tempCallStr = ''
        let j = 0
        while (tempCallStr.length <= state.maxLength) {
          callStr = tempCallStr
          tempCallStr += `\\${callStrList[j % argsLen]}/`
          if (i === j) {
            tempCallStr += '/'
          }
          j++
        }
        result.push(callStr)
      }
      return result
    }

    function generateWanan() {
      const repeatTimes = (state.maxLength - 2) / 2
      const baseStr = '晚安'.repeat(repeatTimes)
      const result = []
      for (let i = 0; i < state.diffCount; i++) {
        result.push(baseStr + i)
      }
      return result
    }

    function sendChat(content) {
      if (!content) {
        return
      }
      const safeContent = replaceSensWord(content)
      // let evt = document.createEvent('HTMLEvents')
      // evt.initEvent('input', true, true)
      refs.nativeChatInput.value = safeContent
      let evt = new Event('input')
      refs.nativeChatInput.dispatchEvent(evt)
      document.querySelector('.live-skin-highlight-button-bg').click()
    }

    // Resource

    function pageStyle() {
      return `
      .nnm-hidden {
        display: none !important;
      }
      .nnm-panel-btn {
          cursor:pointer;
      }
      .nnm-panel {
        position: absolute;
        bottom: 146px;
        background: wheat;
        z-index: 999;
        width: 100%;
      }
      .nnm-btn {
        height: 30px;
      }
      .nnm-group {
        display: flex;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      }
      #unicycle-input {
        min-height: 100px;
        width: 60%;
        box-sizing: border-box;
      }
      #call-input {
        height: 25px;
        width: 60%;
        box-sizing: border-box;
      }
    `
    }

    const rules = {
      '01': '〇1',
      99: '九九',
      狗: '苟',
      看看: '看㸔',
      sc: 'sс',
      雷: '镭',
      岁: '歲',
      日: '曰',
      寄: '继',
      au: 'aμ',
      holo: 'horo',
      爹: '跌',
      充: '冲',
      牛逼: '牛b',
      牛牛: '牛䒜',
      绷不住: '蚌不住',
      猩猩: '猩星',
      自杀: '紫沙',
      op: '〇p',
      'as': 'αs',
      前世: '前.世',
      抖音: '斗音',
      智障: '智樟',
      蛙: '哇',
      栽种: '载钟',
      好烧: '好焼',
      哈人: '哈银',
      苦逼: '苦比',
      拼多多: '并夕夕',
      弱智: 'rz',
      上分: '上芬',
      滑: '猾',
      油管: '油馆',
      恶心: '悪心',
      ky: 'k丫',
      成人: '成仁',
      血压: '血圧',
      抗吧: '抗巴',
      贫贱: '贫溅',
      免费: '免費',
      猝死: '萃死',
      丢人: '丢仁',
      急了: '急叻',
      脏: '賍',
      bug: 'bμg',
      耗材: '秏材',
      举办: '挙办',
      三年: '3年',
      氪金: '课金',
      sm: 'sΜ',
      矮: '躷',
      骗人: '骗仁',
      牛魔: '䒜魔',
      屏蔽: '屏敝',
      呃呃: '呃厄',
      包子: '包籽',
      然然: '然䔳',
      墨: '默',
      握手: '握.手',
      ip: '1p',
      复活: '復活',
      滚: '蓘',
      工商: 'エ商',
      耳机: '耳機',
      哇哇哇: '哇哇娃',
      爆头: '暴头',
      B社: 'β社',
      莲: '连',
      原神: '〇神',
      烤全羊: '考全羊',
      男友: '侽友',
      米诺: '米喏',
      集合: '集和',
    }
  }
})()
