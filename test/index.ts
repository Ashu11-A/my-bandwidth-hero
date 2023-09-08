import axios from 'axios';
import config from '@/config/settings';

setInterval(() => {

const urlToFetch = `http://localhost:${config.port}/public/img-3227984.jpg`; // Substitua pela URL desejada
const queryParameters = {
  url: urlToFetch,
  jpeg: false,
  bw: '1',
  l: '80',
}

axios.get(`http://localhost:${config.port}/img`, { params: queryParameters })
  .then((response) => {
    // Aqui você pode lidar com a resposta da sua aplicação Node.js
    console.log(response.headers)
  })
  .catch((error: any) => {
    // Lidar com erros, se houver algum
    console.log(error)
  })
}, 400)
