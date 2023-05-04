<template>
  <div class="terminal_wrap" ref="terminal"></div>
  <iframe ref="myIframe"></iframe>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const myIframe = ref()
const openLink = () => {
  const url = 'http://117.50.174.56:8888/'
  myIframe.value.src = url
}
onMounted(() => {
  openLink
})
</script>
