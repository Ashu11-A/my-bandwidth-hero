const sharp = require('sharp')
const { redirect } = require('./redirect')

function compress(req, res, input) {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(`Alguem acessou a URL da API! IP: ${ipAddress}`)
    const format = req.params.webp ? 'webp' : 'jpeg'

    sharp(input)
        .grayscale(req.params.grayscale)
        .toFormat(format, {
            quality: req.params.quality || 80,
            progressive: true,
            optimizeScans: true,
            mozjpeg: true,
            chromaSubsampling: true,
            overshootDeringing: true,
            optimiseScans: true,
            optimiseCoding: true,
            optimizeCoding: 8,
        })
        .toBuffer((err, output, info) => {
            if (err || !info || res.headersSent) {
                console.log(err || !info || res.headersSent)
                return redirect(req, res)
            }
            console.log(req.params.originSize, (req.params.originSize - info.size))
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