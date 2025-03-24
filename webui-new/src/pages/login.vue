<template>
  <!-- [modal] showed when there is an error during authentication -->
  <v-dialog v-model="showErrorModal" width="auto">
    <v-card max-width="400" prepend-icon="mdi-account-alert"
      text="The username or password you specified are incorrect. Try again." title="Wrong credentials">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="showErrorModal = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Main body of the page -->
  <v-container class="fill-height">
    <v-row>
      <v-col>
        <v-card class="mx-auto pa-10" elevation="8" max-width="448" rounded="lg">
          <h2 class="mb-5">Welcome back,</h2>

          <v-form fast-fail @submit.prevent>
            <!-- TODO: add empty fields checks -->
            <v-text-field prepend-inner-icon="mdi-account" v-model="auth.username" placeholder="Enter your username"
              label="Username"></v-text-field>

            <v-text-field prepend-inner-icon="mdi-lock" v-model="auth.password" placeholder="Enter your password"
              label="Password" :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visiblePassword ? 'text' : 'password'"
              @click:append-inner="visiblePassword = !visiblePassword"></v-text-field>

            <v-text-field prepend-inner-icon="mdi-folder-key" v-model="auth.encryption_password"
              placeholder="Enter your key" label="AES256 encryption key"
              :append-inner-icon="visibleKey ? 'mdi-eye-off' : 'mdi-eye'" :type="visibleKey ? 'text' : 'password'"
              @click:append-inner="visibleKey = !visibleKey"></v-text-field>

            <v-checkbox label="Remember me" v-model="rememberToken"></v-checkbox>

            <v-btn class="mt-2 bg-primary-darken-1" type="submit" block @click="login">Login</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = inject('api')
const pageTitle = inject('pageTitle')

pageTitle.value = "Login"
const auth = ref({
  username: "",
  password: "",
  encryption_password: ""
})

// TODO: redirect to main dashboard if the user is already logged in

const showErrorModal = ref(false)
const visiblePassword = ref(false)
const visibleKey = ref(false)
const rememberToken = ref(false)

const login = () => {
  api.login(auth.value.username, auth.value.password, (err, token) => {
    if (err) {
      showErrorModal.value = true
    }
    else {
      api.token = token
      // TODO: if remember me, save token into localStorage
      // TODO: set encryption key
      router.push({ path: "/" })
    }
  })
}
</script>

<route lang="yaml">
meta:
  layout: empty
</route>
