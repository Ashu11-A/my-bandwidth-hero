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
                console.error(`Status: ${err.response.status} (${err.response.statusText}) host: ${err.request.host}`)
                return redirect(req, res)
            }

            const originalSize = req.params.originSize
            const compressedSize = info.size

            console.log(
                'Original: ', originalSize,
                '\nCompress: ', (compressedSize)
            );

            if (compressedSize >= originalSize) {
                console.log('Compression resulted in a larger file size. Returning the original image.')
                db.add('imagesProcessed', 1)
                res.setHeader('content-type', `image/${format}`)
                res.setHeader('content-length', originalSize)
                res.setHeader('x-original-size', originalSize)
                res.status(200)
                res.write(input)
                res.end()
            } else {
                db.add('imagesProcessed', 1)
                db.add('Entrada', originalSize)
                db.add('Saida', compressedSize)
                db.add('dataSaved', (originalSize - compressedSize))

                console.log(info);
                res.setHeader('content-type', `image/${format}`)
                res.setHeader('content-length', compressedSize)
                res.setHeader('x-original-size', originalSize)
                res.setHeader('x-bytes-saved', originalSize - compressedSize)
                res.status(200)
                res.write(output)
                res.end()
            }
        });
}

module.exports = { compress }
