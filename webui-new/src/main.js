/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
const pageTitle = ref("")
const showSnackbar = ref(false)
const snackbarText = ref("")
registerPlugins(app)

app.provide('pageTitle', pageTitle)
app.provide('showSnackbar', showSnackbar)
app.provide('snackbarText', snackbarText)

app.mount('#app')
