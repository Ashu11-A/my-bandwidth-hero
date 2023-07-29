const sharp = require('sharp')
const { redirect } = require('./redirect')
const SimplDB = require('simpl.db')

function compress(req, res, input) {
    const db = new SimplDB({
        dataFile: './status.json'
      })
    const format = req.params.webp ? 'webp' : 'jpeg'

    sharp(input)
        .grayscale(req.params.grayscale)
        .toFormat(format, {
            quality: req.params.quality || 80,
            progressive: true,
            optimizeScans: true,
        })
        .toBuffer((err, output, info) => {
            if (err || !info || res.headersSent) {
                console.log(err || !info || res.headersSent)
                return redirect(req, res)
            }
            db.add('imagesProcessed', 1)
            db.add('Entrada', req.params.originSize)
            db.add('Saida', info.size)
            db.add('dataSaved', (req.params.originSize - info.size))
            console.log(info)
            console.log(
                'Origem: ', req.params.originSize,
                '\nbytes-saved: ', (req.params.originSize - info.size)
            )
            res.setHeader('content-type', `image/${format}`)
            res.setHeader('content-length', info.size)
            res.setHeader('x-original-size', req.params.originSize)
            res.setHeader('x-bytes-saved', req.params.originSize - info.size)
            res.status(200)
            res.write(output)
            res.end()
        })
}

module.exports = { compress }