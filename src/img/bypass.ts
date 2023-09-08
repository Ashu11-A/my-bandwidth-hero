import { Response } from 'express';
import { Database } from 'simpl.db';

async function bypass(req: any, res: Response, buffer: Buffer): Promise<void> {
  try {
    const db = new Database({
      dataFile: './status.json'
    })

    res.setHeader('x-proxy-bypass', '1');
    res.setHeader('content-length', buffer.length.toString());
    res.status(200);
    res.write(buffer);
    res.end();

    db.add('ignoredImages', 1);
  } catch (err) {
    console.log("Erro no Bypass: \n" + err)
  }
}

export { bypass };
