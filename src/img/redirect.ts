import { Request, Response } from 'express';

function redirect(req: Request, res: Response): void {
  if (res.headersSent) return;

  res.setHeader('content-length', '0');
  res.removeHeader('cache-control');
  res.removeHeader('expires');
  res.removeHeader('date');
  res.removeHeader('etag');
  res.setHeader('location', encodeURI(req.params.url));
  res.status(302).end();
}

export { redirect };
