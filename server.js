const config = require('./config.json')
const app = require('express')()

const Port = config.port || 8080

app.enable('trust proxy')
app.listen(Port, () =>
    console.log(`Estou online em ${Port}`)
)