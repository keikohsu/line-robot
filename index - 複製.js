// 引用 line機器人套件
import linebot from 'linebot'

// 引用 dotenv套件
import dotenv from 'dotenv'
// 引用 axios 套件
import axios from 'axios'
// 引用 node-schedule
import schedule from 'node-schedule'
let exhibitions = []

const updateData = async () => {
  const response = await axios.get('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
  exhibitions = response.data
}
schedule.scheduleJob('* * 0 * * *', () => {
  updateData()
})

updateData()
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
bot.on('message', async event => {
  // const reply2 = []
  try {
    let reply
    let str = ''
    const text = event.message.text

    if (text === 'flex') {
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
                url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover',
                action: {
                  type: 'uri',
                  uri: 'http://linecorp.com/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'Brown Cafe',
                    weight: 'bold',
                    size: 'xl'
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    margin: 'md',
                    contents: [
                      {
                        type: 'icon',
                        size: 'sm',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'sm',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'sm',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'sm',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'sm',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                      },
                      {
                        type: 'text',
                        text: '4.0',
                        size: 'sm',
                        color: '#999999',
                        margin: 'md',
                        flex: 0
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: 'Place',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1
                          },
                          {
                            type: 'text',
                            text: 'Miraina Tower, 4-1-6 Shinjuku, Tokyo',
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: 'Time',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1
                          },
                          {
                            type: 'text',
                            text: '10:00 - 23:00',
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5
                          }
                        ]
                      }
                    ]
                  }
                ]
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
      for (const dd of exhibitions) {
        if (text.includes(dd.showInfo[0].location.slice(0, 2)) && text.includes(dd.category)) {
          str += '地點' + dd.showInfo[0].locationName
        }
      }
      reply = (str.length === 0) ? '找不到資料2' : str
    }

    event.reply(reply)
    console.log(str)
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
