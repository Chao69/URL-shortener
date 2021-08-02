const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = 3000
const mainUrl = `http://localhost:${PORT}/`
const URL = require('./models/url')
const { randomUrlCode } = require('./tools/utility')

const app = express()

mongoose.connect('mongodb://localhost/url-shortener', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', handlebars({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

//根目錄
app.get('/', (req, res) => {
  res.render('index')
})

//post目錄
app.post('/', (req, res) => {
  const inputUrl = req.body.originURL.trim() //避免使用者在網址開頭或結尾輸入到空白鍵
  let usefulShortUrl = ''
  // 產生randomCode直到不予資料庫重複
  URL.find()
    .lean()
    .then(result => {
      let codeCheck = false
      do {
        const shortUrl = randomUrlCode()
        const codeView = result.find(data => data.shortURL === shortUrl)
        if (codeView === undefined) {
          codeCheck = true
          usefulShortUrl = shortUrl
        }
      } while (codeCheck)
    })
    .catch(error => console.error(error))

  // 確認使用者輸入的網址是否有與資料庫相同
  URL.find({ originURL: inputUrl })
    .lean()
    .then(url => {
      if (url.length === 1) {
        res.render('index', { shortenedURL: mainUrl.concat(url[0].shortURL) })
      } else {
        const NewURL = new URL ({
          originURL: inputUrl,
          shortURL: usefulShortUrl
        })
        NewURL.save()
          .then(() => res.render('index', { shortenedURL: mainUrl.concat(NewURL.shortURL) }))
      }
    })
    .catch(error => console.error(error))
})

app.get('/:randomUrlCode', (req, res) => {
  const randomUrlCode = req.params.randomCode.replace('/', '')
  URL.find({ shortURL: randomUrlCode })
    .lean()
    .then(result => res.redirect(result[0].originURL))
    .catch(error => console.error(error))
})

app.listen('3000', () => {
  console.log('app is running on http://localhost:3000')
})