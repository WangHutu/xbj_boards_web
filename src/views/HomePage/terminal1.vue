<template>
  <div class="terminal_wrap" ref="terminal"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

const terminal = ref()



onMounted(async () => {
  const term:any = new Terminal({
    cursorBlink: true
  })

  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  //   const attachAddon = new AttachAddon(new WebSocket('ws://117.50.174.56:8999/shellinabox/'))
  const attachAddon: any = new AttachAddon(new WebSocket('ws://localhost:8888'))
  term.loadAddon(attachAddon)

  //   term.write('Hello, world!')

  fitAddon.fit()
  term.open(terminal.value)
  //   term.addEventListener('message', (event) => {
  //     term.write(event.data)
  //   })
  //   term.onData((data) => {
  //     socket.send(data)
  //   })
  terminal.value.addEventListener('open', () => {
    term.attach(attachAddon)
  })
})
</script>
