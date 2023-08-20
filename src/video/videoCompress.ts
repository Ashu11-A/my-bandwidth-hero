import { fork } from 'child_process';
import fs from 'fs';
import { Request, Response } from 'express';

async function videoCompress(req: Request, res: Response): Promise<void> {
  const video = req.body as Buffer; // O corpo da requisição contém os bytes brutos do vídeo

  if (video && video.length > 0) {
    // Crie um novo processo filho
    const child = fork('./video/ffmpeg.js');

    // Salve o vídeo em um arquivo temporário (opcional)
    // Você pode remover isso se preferir trabalhar diretamente com os bytes do vídeo
    const tempFilePath = 'video_temp.mp4';
    fs.writeFileSync(tempFilePath, video);

    // Envia a mensagem ao processo filho com o caminho do arquivo temporário e o nome do arquivo
    child.send({ tempFilePath, name: 'video.mp4' });

    // Escute a mensagem do processo filho
    child.on('message', (message) => {
      const { statusCode, text }: any = message;
      res.status(statusCode).send(text);
    });
  } else {
    res.status(400).send('No file uploaded');
  }
}

export { videoCompress };
