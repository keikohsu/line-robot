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
// 訊息事件
bot.on('message', async event => {
  try {
    let exhibitions = []
    let reply
    // let str = ''
    const text = event.message.text
    if (text === '找類別') {
      event.reply('請輸入搜尋特定編號:\n' + '🎼  音樂:  1 \n' + '🎭  戲劇:  2 \n' + '💃  舞蹈:  3 \n' + '👩‍👦  親子:  4\n' + '🎧  獨立音樂: 5 \n' +
        '👁  展覽:  6 \n' + '👨‍🏫  講座:  7 \n' + '🎬  電影:  8 \n' + '🧛  綜藝:  11 \n' + '⛳  競賽:  13 \n' + '🏆  徵選:  14 \n' + ' ❓  其他:  15 \n' + '🎤  演唱會:  17 \n' + '📖  研習課程:  19\n')
    } else if (text === '今天想裝文青🤓') {
      reply = await quickReply
      event.reply(reply)
    }
    if (text === '1' || text === '2' || text === '3' || text === '4' || text === '5' || text === '6' || text === '7' || text === '8' || text === '11' || text === '13' || text === '14' || text === '15' || text === '17' || text === '19') {
      num = text
      reply = await quickCity

      event.reply(reply)
      console.log(num)
      console.log(text)
    } else {
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
              web = dd.webSales
              // 兩種方式
              // 第一種(簡寫)
              // web = web ? dd.webSales : 'https://example.com'
              // 第二種
              if (web) {
                web = dd.webSales
              } else {
                // encodeURI因為不接收中文字所以要寫數值轉檔
                web = encodeURI(`https://www.google.com/search?q=${title}`)
              }
              if (info.length <= 9) {
                info.push({ title: title, location: location, time: time, price: price, timestart: timestart, web: web })
              }
              // else if (info.length <= 9) {
              //   info.push({ title: title, location: location, time: time, price: price, timestart: timestart, web: web })
              // }

              console.log(info.length)
            }
          }
          console.log(info[0])
          for (let i = 0; i < info.length; i++) {
            if (info.length === 0) {
              reply = '查無資料，請輸入正確號碼與縣市\n' + '輸入"臺北"不是台北呦'
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
                        url: 'https://i.imgur.com/HdtOodM.jpg',
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
                                    weight: 'bold',
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
                                    weight: 'bold',
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  // {
                                  //   type: 'icon',
                                  //   url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                  // },
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
                            color: '#95CACA',
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
                    },
                    {
                      type: 'bubble',
                      hero: {
                        type: 'image',
                        url: 'https://i.imgur.com/HdtOodM.jpg',
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
                            text: info[1].title,
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
                                    text: info[1].location,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[1].timestart,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[1].time,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  // {
                                  //   type: 'icon',
                                  //   url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                  // },
                                  {
                                    type: 'text',
                                    text: info[1].price,
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
                            color: '#95CACA',
                            action: {

                              type: 'uri',
                              label: '點我看更多!',
                              uri: info[1].web
                            }
                          },

                          {
                            type: 'spacer',
                            size: 'sm'
                          }
                        ],
                        flex: 0
                      }
                    },
                    {
                      type: 'bubble',
                      hero: {
                        type: 'image',
                        url: 'https://i.imgur.com/HdtOodM.jpg',
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
                            text: info[2].title,
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
                                    text: info[2].location,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[2].timestart,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[2].time,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  // {
                                  //   type: 'icon',
                                  //   url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                  // },
                                  {
                                    type: 'text',
                                    text: info[2].price,
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
                            color: '#95CACA',
                            action: {

                              type: 'uri',
                              label: '點我看更多!',
                              uri: info[2].web
                            }
                          },

                          {
                            type: 'spacer',
                            size: 'sm'
                          }
                        ],
                        flex: 0
                      }
                    },
                    {
                      type: 'bubble',
                      hero: {
                        type: 'image',
                        url: 'https://i.imgur.com/HdtOodM.jpg',
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
                            text: info[3].title,
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
                                    text: info[3].location,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[3].timestart,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[3].time,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  // {
                                  //   type: 'icon',
                                  //   url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                  // },
                                  {
                                    type: 'text',
                                    text: info[3].price,
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
                            color: '#95CACA',
                            action: {

                              type: 'uri',
                              label: '點我看更多!',
                              uri: info[3].web
                            }
                          },

                          {
                            type: 'spacer',
                            size: 'sm'
                          }
                        ],
                        flex: 0
                      }
                    },
                    {
                      type: 'bubble',
                      hero: {
                        type: 'image',
                        url: 'https://i.imgur.com/HdtOodM.jpg',
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
                            text: info[4].title,
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
                                    text: info[4].location,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[4].timestart,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  {
                                    type: 'text',
                                    text: info[4].time,
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
                                    weight: 'bold',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1
                                  },
                                  // {
                                  //   type: 'icon',
                                  //   url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png'
                                  // },
                                  {
                                    type: 'text',
                                    text: info[4].price,
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
                            color: '#95CACA',
                            action: {

                              type: 'uri',
                              label: '點我看更多!',
                              uri: info[3].web
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
    event.reply('發生錯誤，請稍後再試')
  }
})

// 放大鏡小選單
const quickReply = {
  type: 'text',
  text: '請選擇喜歡的藝文活動項目吧🥰',
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          type: 'message',
          label: '音樂',
          text: '1'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '戲劇',
          text: '2'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '舞蹈',
          text: '3'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '親子',
          text: '4'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '獨立音樂',
          text: '5'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '展覽',
          text: '6'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '講座',
          text: '7'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '電影',
          text: '8'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '綜藝',
          text: '11'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '競賽',
          text: '13'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '徵選',
          text: '14'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '演唱會',
          text: '17'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '研習課程',
          text: '19'
        }
      }
    ]
  }
}

const quickCity = {
  type: 'text',
  text: '請輸入縣市\n' + '例如: 臺北、臺中',
  quickCity: {
    items: [
      {
        type: 'action',
        action: {
          type: 'message',
          label: '臺北',
          text: '臺北'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '新北',
          text: '新北'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '桃園',
          text: '桃園'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '新竹',
          text: '新竹'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '苗栗',
          text: '苗栗'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '臺中',
          text: '臺中'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '彰化',
          text: '彰化'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '雲林',
          text: '雲林'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '嘉義',
          text: '嘉義'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '臺南',
          text: '臺南'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '高雄',
          text: '高雄'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '屏東',
          text: '屏東'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '臺東',
          text: '臺東'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '花蓮',
          text: '花蓮'
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '宜蘭',
          text: '宜蘭'
        }
      }
    ]
  }
}

// bot.on('postback', async event => {
//   const data = event.postback.data
//   if (data === '1' || data === '2' || data === '3' || data === '4' || data === '5' || data === '6' || data === '7' || data === '8' || data === '11' || data === '13' || data === '14' || data === '17' || data === '19') {
//     console.log(data)
//     event.reply(data)
//   }
// })

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
