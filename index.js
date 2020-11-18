// 引用 line機器人套件
import linebot from 'linebot'

// 引用 dotenv套件
import dotenv from 'dotenv'
// 引用 axios 套件
import axios from 'axios'
// 引用 node-schedule
// import schedule from 'node-schedule'
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

// 使用者

let num = 0
bot.on('message', async event => {
  // const reply2 = []
  try {
    let exhibitions = []
    let reply
    // let str = ''
    const text = event.message.text
    if (text === '1' || text === '2' || text === '3' || text === '4' || text === '5' || text === '6' || text === '7' || text === '8' || text === '11' || text === '13' || text === '14' || text === '15' || text === '17' || text === '19') {
      num = text
      reply = '請輸入城市'
      event.reply(reply)
      console.log(num)
      console.log(text)
    }
    else {
      const updateData = async (event) => {
        try {
          const response = await axios.get(`https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=${num}`)
          exhibitions = response.data
          // 資料名稱
          let title = ''
          let location = ''
          let time = ''
          let price = ''
          let timestart = ''
          let web = ''
          let info = []
          // int r = 0;
          // let a = []
          // r = (int)(Math.random() * 9);
          // let b = Math.round(Math.random() * 9)
          for (const dd of exhibitions) {
            if (!dd.showInfo[0]) return
            if (dd.showInfo[0].location.includes(text) || dd.title.includes(text)) {
              // reply2.push()
              // if (info.length > 9) return
              title = dd.title + '。'
              location = dd.showInfo[0].locationName + '。'
              time = dd.showInfo[0].endTime + '-'
              price = dd.showInfo[0].price + '$'
              timestart = dd.showInfo[0].time + '-'
              // web = web ? dd.webSales : 'https://example.com'
              if (web) {
                web = dd.webSales
              } else {
                // encodeURI因為不接收中文字所以要寫數值轉檔
                web = encodeURI(`https://www.google.com/search?q=${title}`)
              }
              if (info.length < 9) {
                info.push({ title: title, location: location, time: time, price: price, timestart: timestart, web: web })
              }
              // else if (dd.webSales.includes(text))
              // else if (dd.webSales)
              // console.log(info.length)
              // 改過要測試
              // if (dd.webSales === '') return
            }
          }
          console.log(info[0])
          if (info.length === 0) {
            reply = '找不到資料'
          } else {
            reply = {
              type: 'flex',
              altText: 'Flex',
              contents: {
                type: 'carousel',
                // flex 內容開始
                contents: [
                  {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
                      size: 'full',
                      aspectRatio: '20:10',
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
                      contents: [
                        {
                          type: 'text',
                          text: info[0].title,
                          weight: 'bold',
                          size: 'xl'
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
                                  text: '地點',
                                  weight: 'bold',
                                  color: '#aaaaaa',
                                  size: 'sm',
                                  flex: 1
                                },
                                {
                                  type: 'text',
                                  text: info[0].location,
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
                                  text: '開始',
                                  color: '#aaaaaa',
                                  size: 'sm',
                                  flex: 1
                                },
                                {
                                  type: 'text',
                                  text: info[0].timestart,
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
                                  text: '結束',
                                  color: '#aaaaaa',
                                  size: 'sm',
                                  flex: 1
                                },
                                {
                                  type: 'text',
                                  text: info[0].time,
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
                                  text: 'price',
                                  color: '#aaaaaa',
                                  size: 'sm',
                                  flex: 1
                                },
                                {
                                  type: 'icon',
                                  url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                },
                                {
                                  type: 'text',
                                  text: info[0].price,
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
                      contents: [
                        {
                          type: 'button',
                          style: 'primary',
                          height: 'sm',
                          color: '#905c44',
                          action: {

                            type: 'uri',
                            label: '點我看更多!',
                            uri: info[0].web
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
          }
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

    // console.log(str)
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
