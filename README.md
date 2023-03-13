# nanami

## chatGPT自动回复海海微博

1. 申请openai api key: https://platform.openai.com/account/api-keys
2. 在一台有公网ip的linux服务器上，初始化项目所需的环境，nodejs 18, redis, 并启动redis监听6379端口
3. 然后安装 pm2: 
`npm install -g pm2`
4. 将项目代码克隆到服务器上 
`git clone https://github.com/SharkNeko/nanami.git`
5. 填写open api key
  ```bash
    cd nanami/deploy
    touch .env
    cat "OPENAI_KEY=你申请的OpenaiKey" >> .env
  ```
6. 将 nanami/wb_wacher/wb_watcher.config.json中的auto_reply字段改为true
. 启动admin_server和wb_watcher
  ```bash
  cd ../nanami/deploy
  pm2 start start_nanami_server.json
  pm2 start start_wb_watcher.json
  ```
8. 使用chrome或edge浏览器，并在浏览器上安装 [Tampermonkey beta](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf)
  这一步必须使用beta版，因为正式版获取不到cookie
9. 打开 https://github.com/SharkNeko/nanami/blob/master/browser_scripts/auto_set_wb_cookie.user.js ，点击屏幕中间偏右侧raw按钮，安装脚本
10. 进入微博主页，右键打开控制台，执行代码：`localStorage.setItem('send_cookie_url', 'http://服务器ip:10010/set_wb_cookie')`
11. 刷新微博页面，这是TamperMonkey会提醒你是否允许发送请求，选择允许所有。

理论上来说完成上面的步骤就能在海海发微博时自动调用chatgpt接口生成回复并自动发送了。因为微博cookie有效期只有不到一天，所以应该每天至少使用浏览器进入一次微博主页来更新cookie
chatgpt的prompt列表在 `nanami/wb_watcher/prompt.txt`中，有#号前缀的会被忽略，每次回复时会随机选择一个prompt来使用。你可以自行修改 prompt.txt来启用、禁用、添加、删除prompt，修改保存后wb_watcher服务会自动重启。

