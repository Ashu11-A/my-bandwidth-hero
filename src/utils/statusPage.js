const SimplDB = require('simpl.db')

function formatBytes (bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function statusPage (req, res) {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(`Alguém acessou a URL da API! IP: ${ipAddress}`)

  const db = new SimplDB({
    dataFile: './status.json'
  })

  res.status(200).json({
    status: 200,
    imgProcessed: db.get('imagesProcessed'),
    entrada: formatBytes(db.get('Entrada')),
    saida: formatBytes(db.get('Saida')),
    saveData: formatBytes(db.get('dataSaved')),
    hourlyData: db.get('hourlyData'),
    memory: {
      rss: formatBytes(process.memoryUsage().rss),
      heapTotal: formatBytes(process.memoryUsage().heapTotal),
      heapUsed: formatBytes(process.memoryUsage().heapUsed),
      external: formatBytes(process.memoryUsage().external),
      arrayBuffers: formatBytes(process.memoryUsage().arrayBuffers)
    }
  })
}

module.exports = { statusPage }
