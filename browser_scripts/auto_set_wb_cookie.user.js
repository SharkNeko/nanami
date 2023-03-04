// ==UserScript==
// @name         Weibo Cookie Sender
// @namespace    weibo-cookie-sender
// @version      1
// @description  更新cookie以保持登录
// @match        https://weibo.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  'use strict';

  // 从当前页面获取cookie信息
  const cookie = document.cookie;

  // 构造发送的数据
  const data = JSON.stringify({ wb_cookie: cookie });

  // 发送请求到接口
  const url = localStorage.getItem('send_cookie_url')
  if (url) {
    GM_xmlhttpRequest({
      method: 'POST',
      url,
      headers: {
          'Content-Type': 'application/json'
      },
      data: data,
      onload: function (response) {
          console.log(response.responseText);
      }
    });
  } else {
    console.error('未找到更新cookie的url，请将localStorage的 send_cookie_url 字段设置为接受cookie的url')
  }
})();
