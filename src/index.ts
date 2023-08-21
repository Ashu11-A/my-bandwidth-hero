import { App } from 'app'
import config from '@/config/settings'
import { Last24H } from "@/utils/hourlyData"

new App().server.enable('trust proxy')

new App().server.listen(config.port, () => {
  console.log(`Servidor listado em http://localhost:${config.port}`)
})

Last24H(0)
setInterval(async () => {
  await Last24H(0);
}, 10 * 60 * 1000)
