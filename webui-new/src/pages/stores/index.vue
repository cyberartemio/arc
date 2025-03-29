<template>
  <!-- [modal] for store creation/update -->
  <v-dialog v-model="showStoreModal" width="auto">
    <v-card rounded="lg" max-width="400" :prepend-icon="modalStoreId == -1 ? 'mdi-database-plus' : 'mdi-database-edit'"
      :title="modalStoreId == -1 ? 'Add new store' : 'Edit store'">
      <v-card-text>
        <p class="mt-1"><em>The name of the store is saved in cleartext on system disk and will be visible even
            when using different encryption keys.</em></p>
        <v-form class="mt-5">
          <!-- TODO: add empty fields checks -->
          <v-text-field min-width="300" prepend-inner-icon="mdi-database" v-model="modalStoreTitle"
            placeholder="Enter store title" label="Store title"></v-text-field>
        </v-form>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Cancel" @click="showStoreModal = false"></v-btn>
        <v-btn class="ms-auto" text="Save" @click="addNewStore()"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- [modal] for store deletion -->
  <v-dialog v-model="showDeletionConfirmationModal" width="auto">
    <v-card max-width="400" prepend-icon="mdi-database-remove"
      text="Removing the store will permanently delete it from system disk and you won't be able to recover it, unless you have backed it up on another device."
      title="Remove this store?">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Cancel" @click="showDeletionConfirmationModal = false"></v-btn>
        <v-btn class="ms-auto" text="Confirm" @click="confirmDeletion()"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- main body -->
  <v-container>
    <v-row justify="center">
      <v-col class="d-flex justify-center" cols="12">
        <v-btn color="primary" prepend-icon="mdi-database-plus" @click="editStore()">
          New store
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" lg="4" md="6" xl="3" v-for="store in stores">
        <v-card @click="goToRecordsList(store.id)" class="py-4" color="primary" :title="store.title"
          prepend-icon="mdi-database" rounded="lg">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" icon="mdi-file-document-multiple" size="small" @click="duplicateStore(store.id, $event)">
              <v-icon>mdi-file-document-multiple</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Duplicate
              </v-tooltip>
            </v-btn>
            <v-btn color="" icon="mdi-pencil" size="small" @click="editStore(store.id, $event)">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Edit
              </v-tooltip>
            </v-btn>
            <v-btn color="" icon="mdi-delete" size="small" @click="deleteStore(store.id, $event)">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Delete
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
const showStoreModal = ref(false)
const modalStoreId = ref(null)
const modalStoreTitle = ref("")
let storeInterval

const goToRecordsList = (id) => {
  router.push({ path: "/stores/" + id })
}

const duplicateStore = (id, event) => {
  event.stopPropagation()
  alert('Not available right now')
}

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
      /*
      for(const store of stores) {
        k
      }
      */
    }
  })
}

const editStore = (id, event) => {
  if (event)
    event.stopPropagation()
  if (isNaN(id)) {
    modalStoreId.value = -1
    modalStoreTitle.value = ""
  }
  else {
    modalStoreId.value = id
    modalStoreTitle.value = stores.value.filter(s => s.id == id)[0].title
  }
  showStoreModal.value = true
}

const addNewStore = () => {
  if (modalStoreId.value == -1) {
    api.addStore(modalStoreTitle.value, (err, store) => {
      if (err) {
        console.log(err)
      }
      else {
        stores.value.push(store)
        showStoreModal.value = false
        snackbarText.value = "Store added."
        showSnackbar.value = true
      }
    })
  }
  else {
    api.editStore(modalStoreId.value, modalStoreTitle.value, (err, response) => {
      if (err) {
        console.log(err)
      }
      else {
        stores.value[stores.value.map(s => s.id).indexOf(modalStoreId.value)].title = modalStoreTitle.value
        showStoreModal.value = false
        snackbarText.value = response.msg
        showSnackbar.value = true
      }
    })
  }
}

const confirmDeletion = () => {
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

const deleteStore = (id, event) => {
  event.stopPropagation()
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
