// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用axios套件
import axios from 'axios'

// import fs, { appendFile } from 'fs'
// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

let MovieData = []
let VideoData = ''

const getMovieData = async (MovieName) => {
  let response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.myapi}&query=${MovieName}`)
  MovieData = response.data
  // 取得電影ID
  const MovieID = MovieData.results[0].id

  // 取得預告片key
  response = await axios.get(`https://api.themoviedb.org/3/movie/${MovieID}?api_key=${process.env.myapi}&append_to_response=videos`)
  VideoData = response.data
  let TrailerKey = ''

  TrailerKey = VideoData.videos.results[0].key

  // 製作評分星
  const score = MovieData.results[0].vote_average
  let star = ''
  if (score >= 8) {
    star = '★★★★★'
  } else if (score > 3 && score < 8) {
    star = '★★★'
  } else {
    star = '★'
  }

  // flex message 版面  電影資訊
  const flex = {
    type: 'flex',
    altText: `查詢 ${MovieName} 的結果`,
    contents: {
      type: 'carousel',
      contents: []
    }
  }

  // flex 內容
  flex.contents.contents.push(
    {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            // 電影海報
            url: `https://image.tmdb.org/t/p/w500${MovieData.results[0].poster_path}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '2:3',
            gravity: 'top'
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    // 電影名稱
                    text: `${MovieData.results[0].title}`,
                    size: 'xl',
                    color: '#ffffff',
                    weight: 'bold'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    color: '#ebebeb',
                    size: 'sm',
                    flex: 0,
                    // 上映日期
                    text: `${MovieData.results[0].release_date}`
                  },
                  {
                    type: 'text',
                    // Rate星星
                    text: `${star}${score}`,
                    color: '#ffffffcc',
                    decoration: 'none',
                    gravity: 'bottom',
                    flex: 0,
                    size: 'sm'
                  }
                ],
                spacing: 'lg'
              },
              {
                // 預告片連結
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'filler'
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'filler'
                      },
                      {
                        type: 'icon',
                        url: 'https://www.flaticon.com/svg/static/icons/svg/1383/1383260.svg',
                        size: 'md'
                      },
                      {
                        type: 'text',
                        text: 'Trailer',
                        color: '#ffffff',
                        offsetTop: '-2px',
                        flex: 0
                      },
                      {
                        type: 'filler'
                      }
                    ],
                    spacing: 'sm',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://www.youtube.com/watch?v=${TrailerKey}`
                    }
                  },
                  {
                    type: 'filler'
                  }
                ],
                borderWidth: '1px',
                cornerRadius: '4px',
                spacing: 'sm',
                borderColor: '#ffffff',
                margin: 'xxl',
                height: '40px'
              }
            ],
            position: 'absolute',
            offsetBottom: '0px',
            offsetStart: '0px',
            offsetEnd: '0px',
            backgroundColor: '#03303Acc',
            paddingAll: '20px',
            paddingTop: '18px'
          }
        ],
        paddingAll: '0px'
      }
    }
  )
  return flex
}

// 訊息事件
bot.on('message', async event => {
  // console.log(event.message.text)
  // event.reply(event.message.text)
  try {
    // 使用者輸入的訊息
    const txt = event.message.text
    // const txtMovie = event.message.text
    // const txtPerson = event.message.text
    // 機器人回覆
    // const replyPerson = await getPersonData(txt.replace('+', ''))


    // 使用者輸入的訊息
    const txt = event.message.text
    // 機器人回覆
    let reply = ''
    if (txt === 'random popular') {
          // // 隨選三部熱門片給他
          // // 
    } 
    else if (txt === 'genre') {
      // 快速reply 按鈕
    }
    else {
    const str = txt
    reply = await getMovieData(str.replace('+', ''))
    event.reply(reply)
    console.log(reply)
    // fs.writeFile('./test.json', JSON.stringify(reply), () => {})
    // }
    } 
  }catch (error) {
    console.log(error)
    event.reply('查詢失敗，請稍後再試')
  }
})

// 監聽3000 port 的東西
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
