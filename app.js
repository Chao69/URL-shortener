const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const router = require('./routes')
const PORT = process.env.PORT || 3000

require('./config/mongoose')

const app = express()

app.engine('handlebars', handlebars({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
})