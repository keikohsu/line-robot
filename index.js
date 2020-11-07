// 引用 line機器人套件
import linebot from 'linebot'

// 引用 dotenv套件
import dotenv from 'dotenv'
// 引用 axios 套件
import axios from 'axios'
// 引用 node-schedule
// import schedule from 'node-schedule'
let exhibitions = []
// schedule.scheduleJob('* * 0 * * *', () => {
//   updateData()
// })

// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 宣告filter 函式
// const filter = (str, data) => {
//   const result = [] // result 儲存filter 的東西
//   for (const d of data) { // for of 跑API.data 的json 資料
//     if (d.TR_POSITION == null) continue // 空值要跳過，不然程式會抓不到；若if () 後面只有一行，可不用加大括號 {}
//     else if (d.TR_POSITION.includes(str)) {
//       result.push(d) // 篩出position 包含str 的資料，整包json push 到result 陣列
//     } else if (d.TR_CNAME.includes(str)) {
//       result.push(d)
//     }
//   } return result
// }

let num = 0
bot.on('message', async event => {
  // const reply2 = []
  try {
    let reply
    let str = ''
    const text = event.message.text
    if (text === '1' || text === '2' || text === '3' || text === '4' || text === '5' || text === '6' || text === '7' || text === '8' || text === '11' || text === '13' || text === '14' || text === '15' || text === '17' || text === '19') {
      num = text
      reply = '請輸入城市'
      event.reply(reply)
      console.log(num)
      console.log(text)
    }
    else if (text === 'flex') {
      reply = {
        type: 'flex',
        altText: 'Flex',
        contents: {
          type: 'carousel',
          contents: [
            {
              type: 'bubble',
              hero: {
                type: 'image',
                url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_2_restaurant.png',
                size: 'full',
                aspectRatio: '20:8',
                aspectMode: 'cover',
                action: {
                  type: 'uri',
                  uri: 'http://linecorp.com/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: [],
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: 'http://linecorp.com/'
                }
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                      type: 'uri',
                      label: 'CALL',
                      uri: 'https://linecorp.com'
                    }
                  },
                  {
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                      type: 'uri',
                      label: 'WEBSITE',
                      uri: 'https://linecorp.com'
                    }
                  },
                  {
                    type: 'spacer',
                    size: 'sm'
                  }
                ],
                flex: 0
              }
            }
          ]
        }
      }
    } else {
      const updateData = async (event) => {
        try {
          const response = await axios.get(`https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=${num}`)
          exhibitions = response.data
          for (const dd of exhibitions) {
            if (!dd.showInfo[0]) return
            if (text.includes(dd.showInfo[0].location.slice(0, 2))) {
              str += '主題名稱:' + dd.title + '。' + '\n'
              str += '地點名稱:' + dd.showInfo[0].locationName + '。' + '\n'
            }
          }
          str.length === 0 ? reply = '找不到資料' : reply = str
          // reply = (str.length === 0) ? '找不到資料2' : str
          console.log(reply)
          event.reply(reply)
        }
        catch (error) {
          console.log(error)
        }
      }
      updateData(event)
    }

    console.log(str)
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
