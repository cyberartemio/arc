<template>
</template>

<script setup>
import { inject } from 'vue'
const pageTitle = inject('pageTitle')
pageTitle.value = "Settings"
</script>
