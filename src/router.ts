import express, { Router } from "express";

import { params } from '@/img/params';
import { proxy } from '@/img/proxy';
import { statusPage } from '@/utils/statusPage';
import { videoCompress } from '@/video/videoCompress';

const router: Router = Router()

router.get('/images', params, proxy)
router.get('/img', params, proxy)

router.get('/', statusPage)

router.use(express.raw({ type: 'video/*', limit: '100mb' }))
router.post('/compress-video', videoCompress)



export { router }