<template>
  <v-container>
    <div class="text-h4">Store {{ route.params.id }}</div>
  </v-container>
</template>

<script setup>
import { inject, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const api = inject('api')

</script>
