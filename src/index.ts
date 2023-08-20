import { App } from 'app'
import config from '@/config/settings'

new App().server.enable('trust proxy')

new App().server.listen(config.port, () => {
  console.log(`Servidor listado em http://localhost:${config.port}`)
})
