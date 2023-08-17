const DEFAULT_QUALITY = 40

import {Response, NextFunction } from "express"

interface MyParams{
  query: any
  params: {
    url?: string | string[]
    webp?: boolean
    grayscale?: boolean
    quality?: number
  }
}

function params (req: MyParams, res: Response, next: NextFunction) {
  let url: any = req.query.url
  if (Array.isArray(url)) {
    url = url.join('&url=')
  }
  
  if (!url) return res.send('bandwidth-hero-proxy').status(404)
  url = url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://')
  req.params.url = url
  req.params.webp = !req.query.jpeg
  req.params.grayscale = req.query.bw !== 0
  req.params.quality = parseInt(req.query.l, 10) || DEFAULT_QUALITY
  next()
}

export { params }