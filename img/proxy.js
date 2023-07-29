const axios = require('axios')
const pick = require('lodash').pick
const { shouldCompress } = require('./shouldCompress')
const { redirect } = require('./redirect')
const { compress } = require('./compress')
const { bypass } = require('./bypass')
const { copyHeaders } = require('./copyHeaders')
const https = require('https')

async function proxy(req, res) {
  try {
    const response = await axios.get(req.params.url, {
      headers: {
        ...pick(req.headers, ['cookie', 'dnt', 'referer']),
        'user-agent': 'Bandwidth-Hero Compressor',
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
        via: '1.1 bandwidth-hero'
      },
      timeout: 10000,
      maxRedirects: 5,
      responseType: 'arraybuffer', // Add this to get the response as a buffer
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Add this line to disable SSL verification
      jar: true
    });

    const origin = response.data;
    const buffer = Buffer.from(origin);

    copyHeaders(response, res);
    res.setHeader('content-encoding', 'identity');
    req.params.originType = response.headers['content-type'] || '';
    req.params.originSize = buffer.length;

    if (shouldCompress(req)) {
      await compress(req, res, buffer);
    } else {
      await bypass(req, res, buffer);
    }
  } catch (err) {
    console.error(`Status: ${err?.response?.status ?? 'Error'} (${err?.response?.statusText ?? 'Error'}) host: ${err?.request?.host ?? 'Error'}`);
    return redirect(req, res);
  }
}

module.exports = { proxy };

