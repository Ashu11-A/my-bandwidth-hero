import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

if (process.send) { // Verifica se process.send está definido
  process.on('message', (payload: { tempFilePath: string; name: string }) => {
    const { tempFilePath, name } = payload;

    const endProcess = (endPayload: { statusCode: number; text: string }) => {
      const { statusCode = 500, text = 'Desconhecido' } = endPayload;

      /**
       * os process.send estão com erro. porem não sei o que é
       */
      // Remove temp file
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          // process.send({ statusCode: 500, text: err?.message });
        }
      });

      // Format response so it fits the api response
      // process.send({ statusCode, text });

      // End process
      process.exit();
    };

    // Process video and send back the result
    ffmpeg(tempFilePath)
      .fps(24)
      .addOptions(['-crf 28'])
      .on('end', () => {
        endProcess({ statusCode: 200, text: 'Success' });
      })
      .on('error', (err) => {
        endProcess({ statusCode: 500, text: err.message });
      })
      .save(`./temp/${name}`);
  });
} else {
  console.error('Cannot use process.send outside of a child process context');
}
