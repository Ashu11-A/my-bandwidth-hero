import sharp from 'sharp';
import { Request, Response } from 'express';
import { redirect } from './redirect';
import { Database } from 'simpl.db';
import { Last24H } from '@/utils/hourlyData';

async function compress(req: Request, res: Response, input: Buffer): Promise<void> {
  const db: any = new Database({
    dataFile: './status.json'
  })

  const format = req.params.webp ? 'webp' : 'jpeg';

  console.log('Iniciando compressão...');

  try {
    const output = await sharp(input)
      .grayscale(req.params.grayscale ? true : false)
      .toFormat(format, {
        quality: parseInt(req.params.quality) || 80,
        progressive: true,
        optimizeScans: true
      })
      .toBuffer();

    const originalSize = parseInt(req.params.originSize);
    const compressedSize = output.length;

    console.log(
      'Tamanho original: ', originalSize,
      '\nTamanho após compressão: ', compressedSize
    );

    if (compressedSize >= originalSize) {
      console.log(`A compressão resultou em um tamanho de arquivo maior(${compressedSize}). Retornando a imagem original.`);
      /*
       * Salvar no dados no Database
       */
      db.add('imagesProcessed', 1);
      db.add('Entrada', originalSize);
      db.add('Saida', originalSize);
      db.save()

      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', originalSize.toString());
      res.setHeader('x-original-size', originalSize.toString());
      res.status(200);
      res.send(input);
    } else {
      /*
       * Salvar no dados no Database
       */
      db.add('imagesProcessed', 1);
      db.add('Entrada', originalSize);
      db.add('Saida', compressedSize);
      db.add('dataSaved', originalSize - compressedSize);
      db.save()

      console.log('Imagem comprimida com sucesso.');
      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', compressedSize.toString());
      res.setHeader('x-original-size', originalSize.toString());
      res.setHeader('x-bytes-saved', (originalSize - compressedSize).toString());
      res.status(200);
      res.send(output);
    }

    await Last24H();
    // Liberar a memória ocupada pelo buffer com fill
    input.fill(0);
    output.fill(0);
  } catch (err:any) {
    console.error(err);
    console.error(`Status: ${err?.response?.status ?? 'Error'} (${err?.response?.statusText ?? 'Error'}) host: ${err?.request?.host ?? 'Error'}`);
    return redirect(req, res);
  }
}

export { compress };
