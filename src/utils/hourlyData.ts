import { Database } from 'simpl.db';

async function Last24H() {
  try {
    /**
      * Removi o simpl.db pq ele é preto
      */
    const db: any = new Database({
      dataFile: './status.json'
    })

    function formatBytes(bytes: number, decimals = 2): Object {
      if (!bytes) return [0, 'Bytes'];
    
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    
      const i = Math.floor(Math.log(bytes) / Math.log(k));
    
      return {
        size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
        sizeType: sizes[i]
      };
    }
    

    const currentHour = new Date().getHours();
    const entradaData = await db.get('Entrada') || 0;
    const saidaData = await db.get('Saida') || 0;
    const hourlyData = await db.get('hourlyData') || [];
    const dataSaved = await db.get('dataSaved') || 0;

    const existingEntryIndex = hourlyData.findIndex((entry: any) => entry.time === `${currentHour}h`);

    const memoryStats = [
      { type: 'Entrada', data: entradaData },
      { type: 'Saida', data: saidaData },
      { type: 'Salvado', data: dataSaved }
    ];
    
    if (existingEntryIndex !== -1) {
      memoryStats.forEach((stat, index) => {
        hourlyData[existingEntryIndex + index] = {
          time: `${currentHour}h`,
          type: stat.type,
          ...formatBytes(stat.data)
        };
      });
    
      hourlyData[existingEntryIndex + 3].imagesProcessed += 1;
    } else {
      memoryStats.forEach(stat => {
        hourlyData.push({
          time: `${currentHour}h`,
          type: stat.type,
          ...formatBytes(stat.data)
        });
      });
    
      hourlyData.push({
        time: `${currentHour}h`,
        type: 'images_Processed',
        imagesProcessed: 1
      });
    }
    

    const maxEntries = 96;
    if (hourlyData.length > maxEntries) {
      hourlyData.splice(0, hourlyData.length - maxEntries);
    }
    

    db.set('hourlyData', hourlyData);
    db.save()
    console.log('Dados salvos com sucesso:', hourlyData);
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}

export { Last24H };
