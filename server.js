const config = require('./config.json')
const app = require('express')()
const { proxy } = require('./src/proxy')
const { params } = require('./src/params')

const Port = config.port || 8080

app.enable('trust proxy')
app.get('/', params, proxy)
app.get('/favicon.ico', (req, res) => res.status(204).end())
app.listen(Port, () =>
  console.log(`Estou online em ${Port}`)
)
