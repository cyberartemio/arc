<template>
  <v-app-bar extended>
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
      <v-btn v-if="unreadNotifications > 0" icon="mdi-bell-outline" @click.stop="toggleEventsDrawer">
        <v-badge color="error" :content="unreadNotifications < 10 ? unreadNotifications : '9+'">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-btn v-else icon="mdi-bell-outline" @click.stop="toggleEventsDrawer"></v-btn>

      <v-btn icon="mdi-logout" @click="logout"></v-btn>
    </template>
  </v-app-bar>

  <!-- events drawer  -->
  <v-navigation-drawer :width="400" v-model="eventsDrawer" :location="$vuetify.display.mobile ? 'bottom' : 'right'"
    temporary>
    <v-container class="pa-4">
      <v-list class="pa-0 mb-4" lines="two">
        <v-list-subheader style="padding-left: 0!important;">Events</v-list-subheader>

        <v-virtual-scroll :items="notifications">
          <template v-slot:default="{ item }">
            <v-list-item class="px-0">
              <v-list-item-title>{{ item.Title }}</v-list-item-title>
              <v-list-item-subtitle><span v-html="item.Description"></span></v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-container>
  </v-navigation-drawer>
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
const eventsDrawer = ref(false)

const logout = () => {
  router.push({ path: "/login" })
  api.token = ""
}

const toggleEventsDrawer = () => {
  if (eventsDrawer.value)
    eventsDrawer.value = false
  else {
    eventsDrawer.value = true
    unreadNotifications.value = false
  }
}

let statusInterval

onMounted(() => {
  // /status interval
  statusInterval = setInterval(() => {
    const timecheck = Date.now()

    api.getStatus((err, data) => {
      if (err) {
        latency.value = "-"
        if (err.status == 403)
          router.push({ path: "/login" })
        else {
          // TODO: show offline banner
        }
      }
      else {
        latency.value = Date.now() - timecheck
        for (let notification of data.events) {
          if (!notifications.value.some(n => n.Name == notification.Name && n.Time == notification.Time)) {
            if (!eventsDrawer.value)
              unreadNotifications.value = unreadNotifications.value + 1
            else
              unreadNotifications.value = 0

            notifications.value.push(notification)
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
