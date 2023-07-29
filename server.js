const config = require('./config.json')
const app = require('express')()
const { proxy } = require('./img/proxy')
const { params } = require('./img/params')
const { statusPage } = require('./src/statusPage')

const Port = config.port || 8080

app.enable('trust proxy')

app.get('/images', params, proxy)
app.get('/img', params, proxy)

app.get('/', statusPage)

app.get('/favicon.ico', (req, res) => res.status(204).end())
app.listen(Port, () =>
  console.log(`Estou online em ${Port}`)
)
