<template>
  <v-toolbar extended>
    <v-toolbar-title text="Arc">
      <div class="ml-3 d-sm-inline text-caption">(latency {{ latency }}ms)</div>
    </v-toolbar-title>

    <template v-slot:extension>
      <v-tabs>
        <RouterLink to="/"><v-tab prepend-icon="mdi-home" text="Dashboard"></v-tab></RouterLink>
        <RouterLink to="/stores"><v-tab prepend-icon="mdi-database" text="Stores"></v-tab></RouterLink>
        <RouterLink to="/settings"><v-tab prepend-icon="mdi-cog" text="Settings"></v-tab></RouterLink>
      </v-tabs>
    </template>
    <template v-slot:append>
      <v-btn v-if="unreadNotifications > 0" icon="mdi-bell-outline">
        <v-badge color="error" :content="unreadNotifications < 10 ? unreadNotifications : '9+'">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-btn v-else icon="mdi-bell-outline"></v-btn>

      <v-btn icon="mdi-logout" @click="logout"></v-btn>
    </template>
  </v-toolbar>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const api = inject('api')

const statusCheckInterval = 1 * 1000 // check status every 1s
const latency = ref("-")
const unreadNotifications = ref(0)
const notifications = ref([])

const logout = () => {
  router.push({ path: "/login" })
  api.token = ""
}

let statusInterval

onMounted(() => {
  // /status interval
  statusInterval = setInterval(() => {
    const timecheck = Date.now()

    api.getStatus((err, data) => {
      if (err) {
        latency.value = "-"
        if (err.code == 403)
          router.push({ path: "/login" })
        else {
          // TODO: show offline banner
        }
      }
      else {
        latency.value = Date.now() - timecheck
        for (let notification of data.events) {
          if (!notifications.value.some(n => n.Name == notification.Name && n.Time == notification.Time)) {
            notifications.value.push(notification)
            unreadNotifications.value = unreadNotifications.value + 1
          }
        }
      }
    })
  }, statusCheckInterval);
})
onUnmounted(() => {
  clearInterval(statusInterval)
})
</script>
