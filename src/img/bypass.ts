import { Response } from 'express';

async function bypass(req: any, res: Response, buffer: Buffer): Promise<void> {
  try {
    res.setHeader('x-proxy-bypass', '1');
    res.setHeader('content-length', buffer.length.toString());
    res.status(200);
    res.write(buffer);
    res.end();
  } catch (err) {
    console.log("Erro no Bypass: \n" + err)
  } finally {
    buffer.fill(0)
  }
}

export { bypass };
