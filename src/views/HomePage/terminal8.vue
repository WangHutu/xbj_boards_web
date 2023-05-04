<template>
  <div class="terminal_wrap" ref="terminal"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { AttachAddon } from 'xterm-addon-attach'
import 'xterm/css/xterm.css'

const terminal = ref()
const term = new Terminal({
  cursorBlink: true,
  allowTransparency: true
})
const fitAddon = new FitAddon()
const webLinksAddon = new WebLinksAddon()
term.loadAddon(fitAddon)
term.loadAddon(webLinksAddon)

let socket:any = null

const startTtyd = async () => {
  // 向后端发送请求，获取 ttyd 的 WebSocket 地址
  const res = await fetch('http://localhost:5000/start-ttyd')
  const url = await res.text()

  // 创建 WebSocket 连接
  socket = new WebSocket(url)

  socket.addEventListener('open', () => {
    // 将前端输入数据发送到后端
    term.onData((data) => {
      socket.send(data)
    })

    // 接收后端传来的数据并显示在终端中
    socket.addEventListener('message', (event: { data: string | Uint8Array }) => {
      term.write(event.data)
    })
  })
}

onMounted(async () => {
  await startTtyd()

  fitAddon.fit()
  term.open(terminal.value)
})
</script>
