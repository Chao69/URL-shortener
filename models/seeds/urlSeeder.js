const mongoose = require('mongoose')
const URL = require('../url')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/url-shortener'

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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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