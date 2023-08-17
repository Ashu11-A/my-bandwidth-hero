import { App } from "app"
import { port } from "./config.json"

new App().server.enable('trust proxy')

new App().server.listen(port, () => {
    console.log(`Servidor listado em http://localhost:${port}`)
})
