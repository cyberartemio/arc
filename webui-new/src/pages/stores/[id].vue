<template>
  <v-container>
    <v-text-field bg-color="surface-light" v-model="search" label="Search" hide-details prepend-inner-icon="mdi-magnify"
      density="compact" variant="solo" single-line></v-text-field>

    <v-data-table :headers="headers" :items="records" :search="search">
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <div>
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click=""></v-icon>
            <v-tooltip activator="parent" location="bottom">
              Edit
            </v-tooltip>
          </div>
          <div>
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click=""></v-icon>
            <v-tooltip activator="parent" location="bottom">
              Delete
            </v-tooltip>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()

const api = inject('api')
const pageTitle = inject('pageTitle')
pageTitle.value = "Store " + route.params.id

const records = ref([])
const search = ref('')

const headers = [
  {
    align: 'start',
    key: 'id',
    sortable: true,
    title: 'ID'
  },
  {
    key: 'title', title: 'Name'
  },
  {
    key: 'created_at', title: 'Created on'
  },
  {
    key: 'updated_at', title: 'Last update'
  },
  {
    key: 'size', title: 'Size'
  },
  {
    key: 'expired_at', title: 'Expires at'
  },
  {
    key: 'actions', title: "Actions", align: 'end', sortable: false
  }
]

const getRecords = () => {
  api.getRecords(route.params.id, (err, data) => {
    if (err) {
      if (err.status == 403)
        router.push({ path: "/login" })
      else {
        // TODO: show error message with button to redo the request
      }
    }
    else {
      records.value = data
      console.log(data)
    }
  })
}

onMounted(() => {
  getRecords()
})
</script>
