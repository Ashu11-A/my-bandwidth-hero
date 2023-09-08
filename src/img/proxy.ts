import axios, { AxiosResponse } from 'axios';
import { pick } from 'lodash';
import { shouldCompress } from '../img/shouldCompress';
import { redirect } from '../img/redirect';
import { compress } from '../img/compress';
import { bypass } from '../img/bypass';
import { copyHeaders } from '../img/copyHeaders';
import https from 'https';
import { Request, Response } from 'express';

async function proxy(req: Request, res: Response) {
  try {
    console.log('Iniciando a requisição para:', req.params.url);

    const response: AxiosResponse<ArrayBuffer> = await axios.get(req.params.url, {
      headers: {
        ...pick(req.headers, ['cookie', 'dnt', 'referer']),
        'user-agent': 'Bandwidth-Hero Compressor',
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
        via: '1.1 bandwidth-hero'
      },
      timeout: 10000,
      maxRedirects: 5,
      responseType: 'arraybuffer',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    const buffer = Buffer.from(response.data);

    // Criar um objeto falso do tipo IncomingMessage
    const fakeIncomingMessage: any = {
      headers: response.headers,
    };

    copyHeaders(fakeIncomingMessage, res);
    res.setHeader('content-encoding', 'identity');
    req.params.originType = response.headers['content-type'] || '';
    req.params.originSize = buffer.length.toString();

    if (shouldCompress(req)) {
      await compress(req, res, buffer);
    } else {
      await bypass(req, res, buffer);
    }
  } catch (err: any) {
    console.log(err)
    console.log(`Status: ${err?.response?.status ?? 'Error'} (${err?.response?.statusText ?? 'Error'}) host: ${err?.request?.host ?? 'Error'}`);
    return redirect(req, res);
  }
}

export { proxy };
