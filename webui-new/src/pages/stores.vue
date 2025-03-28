<template>
  <!-- [modal] for store deletion -->
  <v-dialog v-model="showDeletionConfirmationModal" width="auto">
    <v-card max-width="400" prepend-icon="mdi-alert"
      text="Removing the store will permanently delete it from system disk and you won't be able to recover it, unless you have backed it up on another device."
      title="Remove this store?">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Cancel" @click="showDeletionConfirmationModal = false"></v-btn>
        <v-btn class="ms-auto" text="Confirm" @click="deleteStore()"></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-container class="fill-height">
    <v-row>
      <v-col sm="12" lg="4" md="6" v-for="store in stores">
        <v-card class="py-4" color="primary" :title="store.title" prepend-icon="mdi-database" rounded="lg">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" icon="mdi-pencil" size="small">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Edit
              </v-tooltip>
            </v-btn>
            <v-btn color="" icon="mdi-delete" size="small" @click="confirmDeletion(store.id)">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Delete
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col> </v-row> </v-container>

</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const api = inject('api')
const showSnackbar = inject('showSnackbar')
const snackbarText = inject('snackbarText')

const pageTitle = inject('pageTitle')
pageTitle.value = "Stores"

const stores = ref([])
const showDeletionConfirmationModal = ref(false)
const storeToDelete = ref(-1)
let storeInterval

const getStores = () => {
  api.getStores((err, data) => {
    if (err) {
      latency.value = "-"
      if (err.status == 403)
        router.push({ path: "/login" })
      else {
        // TODO: show error message with button to redo the request
      }
    }
    else {
      stores.value = data
      console.log(data)
      /*
      for(const store of stores) {
        k
      }
      */
    }
  })
}

const addNewStore = () => {

}

const deleteStore = () => {
  api.deleteStore(storeToDelete.value, (err, response) => {
    if (err) {
      console.log(err)
      console.log("error while deleting store")
    }
    else {
      const elementIndex = stores.value.map(s => s.id).indexOf(storeToDelete.value)
      stores.value.splice(elementIndex, 1)
      showDeletionConfirmationModal.value = false
      snackbarText.value = response.msg
      showSnackbar.value = true
    }
  })
}

const confirmDeletion = (id) => {
  showDeletionConfirmationModal.value = true
  storeToDelete.value = id
}

onMounted(() => {
  getStores()
  storeInterval = setInterval(getStores, 5000)
})

onUnmounted(() => {
  clearInterval(storeInterval)
})
</script>
