const SimplDB = require('simpl.db')

function Last24H () {
  try {
    const db = new SimplDB({
      dataFile: './status.json'
    })
    function formatBytes (bytes, decimals = 2) {
      if (!+bytes) return '0 Bytes'

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      // const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) // ${sizes[i]
    }
    const currentHour = new Date().getHours()
    const entradaData = db.get('Entrada') || 0
    const saidaData = db.get('Saida') || 0
    const hourlyData = db.get('hourlyData') || []

    // Verifica se os dados já foram adicionados para a hora atual
    const existingEntryIndex = hourlyData.findIndex(entry => entry.time === `${currentHour}h`)

    if (existingEntryIndex !== -1) {
      // Sobrescreve os dados existentes para a hora atual
      hourlyData[existingEntryIndex] = {
        time: `${currentHour}h`,
        type: 'Entrada',
        dados: formatBytes(entradaData)
      }

      hourlyData[existingEntryIndex + 1] = {
        time: `${currentHour}h`,
        type: 'Saida',
        dados: formatBytes(saidaData)
      }
    } else {
      hourlyData.push({
        time: `${currentHour}h`,
        type: 'Entrada',
        dados: formatBytes(entradaData)
      })

      hourlyData.push({
        time: `${currentHour}h`,
        type: 'Saida',
        dados: formatBytes(saidaData)
      })
    }

    // Manter apenas as últimas 24 entradas de dados
    const maxEntries = 24
    while (hourlyData.length > maxEntries) {
      hourlyData.shift()
    }

    db.set('hourlyData', hourlyData)
    db.save()
    console.log('Dados salvos com sucesso:', hourlyData) // Verifique se os dados são exibidos corretamente
  } catch (error) {
    console.error('Erro ao salvar os dados:', error)
  }
}

module.exports = { Last24H }
