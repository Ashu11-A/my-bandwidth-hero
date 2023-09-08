import { Database } from 'simpl.db';
import { Request, Response } from 'express';

function formatBytes(bytes: number, decimals = 2): Object {
  if (!bytes) return { size: 0, type: 'Bytes' }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    type: sizes[i]
  }
}

async function statusPage(req: Request, res: Response): Promise<void> {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`Alguém acessou a URL da API! IP: ${ipAddress}`);

  try {
    const db: any = new Database({
      dataFile: './status.json'
    })

    const entrada = formatBytes(await db.get('Entrada') || 0) // Se o valor for nulo, defina como 0
    const saida = formatBytes(await db.get('Saida') || 0) // Se o valor for nulo, defina como 0
    const savedData = formatBytes(await db.get('dataSaved') || 0) // Se o valor for nulo, defina como 0

    const memoryUsage: any = process.memoryUsage()
    const memory: any = {}
    const memoryStats = ['rss', 'heapTotal', 'heapUsed', 'external', 'arrayBuffers'];
    memoryStats.forEach(stat => {
      const data = formatBytes(memoryUsage[stat]);
      memory[stat] = { ...data };
    });

    res.status(200).json({
      status: 200,
      processedImages: await db.get('imagesProcessed'),
      ignoredImages: await db.get('ignoredImages'),
      input: {
        ...entrada
      },
      output: {
        ...saida
      },
      savedData: {
        ...savedData
      },
      hourlyData: await db.get('hourlyData'),
      memory: {...memory}
    });
  } catch (error) {
    console.log('Erro ao acessar o SimplDB:', error);
    res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
  }
}

export { statusPage };
