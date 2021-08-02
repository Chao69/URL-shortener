const mongoose = require('mongoose')
const URL = require('../url')
const data = [
  {
    originURL: "https://www.youtube.com/",
    shortURL: "a1w3p"
  },
  {
    originURL: "https://www.instagram.com/",
    shortURL: "3hwa1"
  }
]

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
  URL.create(data)
    .then(() => console.log('seeder create success!'))
    .catch(err => console.error(err))
})