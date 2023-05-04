<template>
  <div class="terminal_wrap" ref="terminal"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import 'xterm/css/xterm.css'

const terminal = ref()

onMounted(async () => {
  const term: any = new Terminal({
    cursorBlink: true
  })

  term.open(terminal.value)

  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  const attachAddon: any = new AttachAddon(new WebSocket('ws://117.50.174.56:8888/ws'))

  term.loadAddon(attachAddon)

  attachAddon.addEventListener('open', () => {
    term.attach(attachAddon)
  })

  fitAddon.fit()
})
</script>
