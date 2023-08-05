const express = require('express')
const app = express()
const config = require('./config.json')
const { params } = require('./img/params')
const { proxy } = require('./img/proxy')
const { statusPage } = require('./src/statusPage')
const { videoCompress } = require('./video/videoCompress')

const Port = config.port || 8080

app.enable('trust proxy')

app.get('/images', params, proxy)
app.get('/img', params, proxy)

app.get('/', statusPage)

app.get('/favicon.ico', (req, res) => res.status(204).end())

// Usar express.raw() para lidar com o corpo da requisição como raw bytes
app.use(express.raw({ type: 'video/*', limit: '100mb' }))
app.post('/compress-video', videoCompress)

app.listen(Port, () =>
  console.log(`Estou online em ${Port}`)
)
