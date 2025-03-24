<template>
  <NavBar></NavBar>
  <v-main>
    <v-container>
      <v-sheet class="pa-5" rounded="lg">
        <div class="text-h6">{{ pageTitle }}</div>
        <router-view />
      </v-sheet>
    </v-container>
  </v-main>

  <AppFooter />
</template>

<script setup>
import { inject } from 'vue'
const pageTitle = inject('pageTitle')
</script>
