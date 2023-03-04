// ==UserScript==
// @name         Weibo Cookie Sender
// @namespace    weibo-cookie-sender
// @version      1
// @description  更新cookie以保持登录
// @match        https://weibo.com/*
// @match        https://weibo.com
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM.cookie
// @connect      *
// ==/UserScript==

;(function () {
  'use strict'


  const url = localStorage.getItem('send_cookie_url')
  if (!url) {
    console.error('未找到更新cookie的url，请将localStorage的 send_cookie_url 字段设置为接受cookie的url')
    return
  }

  GM_cookie.list({ path: '/' }, (cookieObjs, error) => {
    let extractCookieStrList = [document.cookie]
    const extractKeyList = ['SCF', 'SUB', 'WBPSESS']
    for (const cookieObj of cookieObjs) {
      if (extractKeyList.indexOf(cookieObj.name) >= 0) {
        extractCookieStrList.push(`${cookieObj.name}=${cookieObj.value}`)
      }
    }
    const data = JSON.stringify({ wb_cookie: extractCookieStrList.join(';') })
    if (!url) {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
        onload: function (response) {
          console.log(response.responseText)
        },
      })
    }
  })
})()
