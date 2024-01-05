import {GptManager} from './GptManager.js'
import { apiKey, proxy } from './const.js'
import fetch from 'node-fetch'
import fs from 'fs'


const wbUid = '7198559139' // nnm

async function main() {
  // const url = 'https://m.weibo.cn/api/container/getIndex?containerid=107603' + wbUid
  // const resp = await fetch(url)
  // const data = await resp.json()

  // const dataString = JSON.stringify(data, null, 2)

  // fs.writeFile('output.json', dataString, (err) => {
  //   if (err) {
  //     console.error('Error writing file', err);
  //   } else {
  //     console.log('Successfully wrote file');
  //   }
  // });
  const gptManager = new GptManager(apiKey, proxy)
  const resp = await gptManager.explainImage('图片中有什么', '')
  console.log(resp)
}

main()