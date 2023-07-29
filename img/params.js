const DEFAULT_QUALITY = 40

function params (req, res, next) {
  let url = req.query.url
  if (Array.isArray(url)) url = url.join('&url=')
  if (!url) return res.send('bandwidth-hero-proxy').status(404).json({ status: 404, message: 'Não foi possiver encontrar a variavel URl', app: 'bandwidth-hero-proxy', version: '1.0.0', maintainer: 'Ashu-11a' })
  url = url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://')
  req.params.url = url
  req.params.webp = !req.query.jpeg
  req.params.grayscale = req.query.bw !== 0
  req.params.quality = parseInt(req.query.l, 10) || DEFAULT_QUALITY
  next()
}

module.exports = { params }
