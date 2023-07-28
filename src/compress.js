const sharp = require('sharp')

function compress (req, res, file) {

    const format = req.params.webp ? 'webp' : 'jpeg'

    sharp(file)
      .grayscale(req.params.grayscale)
      .toFormat(format, {
        quality: req.params.quality,
        progressive: true,
        optimizeScans: true
      })
      .toBuffer((err, output, info) => {
        if (err || !info || res.headersSent) return redirect(req, res)
  
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