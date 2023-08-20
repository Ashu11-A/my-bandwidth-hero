import { Response } from 'express';

async function bypass(req: any, res: Response, buffer: Buffer): Promise<void> {
  res.setHeader('x-proxy-bypass', '1');
  res.setHeader('content-length', buffer.length.toString());
  res.status(200);
  res.write(buffer);
  res.end();
}

export { bypass };
