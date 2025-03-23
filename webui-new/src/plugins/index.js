/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import api from '@/api'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(api, {
      baseUrl: "https://127.0.0.1:8443",
      token: ""
    })
}
