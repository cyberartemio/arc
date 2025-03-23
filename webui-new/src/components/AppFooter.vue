<template>
  <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3" app>
    <a :href="links.github.url">{{ links.github.title }}</a> was made with <span style="color:red">♥</span> by <a :href="links.author.title" target="_blank">{{ links.author.title }}</a>
  </v-footer>
</template>

<script setup>
  const links = {
    github: {
      title: "Arc",
      url: "https://github.com/evilsocket/arc"
    },
    author: {
      title: "Simone Margaritelli",
      url: "https://evilsocket.net"
    }
  }
</script>

<style scoped lang="sass">
</style>
