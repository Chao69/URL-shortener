const express = require('express')
const router = express.Router()
const URL = require('../../models/url')
const { randomUrlCode } = require('../../tools/utility')
const PORT = process.env.PORT || 3000
const mainUrl = `http://localhost:${PORT}/`

//根目錄
router.get('/', (req, res) => {
  res.render('index')
})

//post目錄
router.post('/', async (req, res) => {
  const inputUrl = req.body.originURL.trim() //避免使用者在網址開頭或結尾輸入到空白鍵
  let usefulShortUrl = ''
  // 產生randomCode直到不予資料庫重複
  await URL.find()
    .lean()
    .then(result => {
      let codeCheck = true
      do {
        const shortUrl = randomUrlCode()
        const codeView = result.find(data => data.shortURL === shortUrl)
        if (codeView === undefined) {
          codeCheck = false
          usefulShortUrl = shortUrl
        }
      } while (codeCheck)
    })
    .catch(error => console.error(error))

  // 確認使用者輸入的網址是否有與資料庫相同
  await URL.find({ originURL: inputUrl })
    .lean()
    .then(url => {
      if (url.length === 1) {
        res.render('index', { shortenedURL: mainUrl.concat(url[0].shortURL) })
      } else {
        const NewURL = new URL({
          originURL: inputUrl,
          shortURL: usefulShortUrl
        })
        NewURL.save()
          .then(() => res.render('index', { shortenedURL: mainUrl.concat(NewURL.shortURL) }))
      }
    })
    .catch(error => console.error(error))
})

router.get('/:randomUrlCode', (req, res) => {
  const randomUrlCode = req.params.randomCode
  URL.find({ shortURL: randomUrlCode })
    .lean()
    .then(result => res.redirect(result[0].originURL))
    .catch(error => console.error(error))
})

module.exports = router