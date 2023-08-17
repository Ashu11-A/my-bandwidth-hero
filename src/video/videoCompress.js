const { fork } = require('child_process')
const fs = require('fs')

async function videoCompress (req, res) {
  const video = req.body // O corpo da requisição contém os bytes brutos do vídeo

  if (video && video.length > 0) {
    // Crie um novo processo filho
    const child = fork('./video/ffmpeg.js')

    // Salve o vídeo em um arquivo temporário (opcional)
    // Você pode remover isso se preferir trabalhar diretamente com os bytes do vídeo
    const tempFilePath = 'video_temp.mp4'
    fs.writeFileSync(tempFilePath, video)

    // Envia a mensagem ao processo filho com o caminho do arquivo temporário e o nome do arquivo
    child.send({ tempFilePath, name: 'video.mp4' })

    // Listen for message from child process
    child.on('message', (message) => {
      const { statusCode, text } = message
      res.status(statusCode).send(text)
    })
  } else {
    res.status(400).send('No file uploaded')
  }
}
module.exports = { videoCompress }
