import Echo from 'laravel-echo'
import { boot } from 'quasar/wrappers'
import Pusher from 'pusher-js'

window.Pusher = Pusher

import { api } from "boot/axios";

let apiUrl = ''
// if (process.env.DEV) {
//   apiUrl = `http://${process.env.VUE_APP_SERVER_IP}:8000/broadcasting/auth`
// }else{
//   apiUrl = `https://${process.env.VUE_APP_SERVER_IP}/broadcasting/auth`
// }

apiUrl = `http://${process.env.VUE_APP_SERVER_IP}:8000/broadcasting/auth`
// console.log('apiUrl :>> ', apiUrl);
const echo = window.Echo = new Echo({
  broadcaster: 'reverb',
  wsHost: process.env.VUE_APP_SERVER_IP,
  key: '83bp94w7ulcfc7okpaza',
  wsPort: 8080,
  wssPort: 8081,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  // authEndpoint: 'http://10.3.16.167:8000/broadcasting/auth', // Auth-Endpoint
  // auth: {
  //   headers: {
  //     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`, // Falls du einen Token verwendest
  //   },
  // },
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        api.post(apiUrl, {
            socket_id: socketId,
            channel_name: channel.name
        })
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            callback(true, error);
        });
      }
    };
  },
  // withCredentials: true // stellt sicher, dass Cookies gesendet werden
});

export default boot(({ app }) => {
  app.config.globalProperties.$echo = echo;
})

export { echo };