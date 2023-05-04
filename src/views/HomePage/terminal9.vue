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
const term: any = new Terminal({
  cursorBlink: true
})
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)
const socket = new WebSocket('ws://117.50.174.56:8888/terminal')

const wsInit = () => {
  socket.close()
}

defineExpose({
  wsInit
})

// 添加事件监听器，支持输入方法
term.onKey((e: { domEvent: { altKey: any; altGraphKey: any; ctrlKey: any; metaKey: any; keyCode: number }; key: any }) => {
  const printable =
    !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey
  if (e.domEvent.keyCode === 13) {
    term.prompt()
  } else if (e.domEvent.keyCode === 8) {
    // back 删除的情况
    if (term._core.buffer.x > 2) {
      term.write('\b \b')
    }
  } else if (printable) {
    term.write(e.key)
  }
  console.log(1, 'print', e.key)
})
term.onData((key: string | any[]) => {
  // 粘贴的情况
  if (key.length > 1) term.write(key)
})

onMounted(async () => {
  socket.addEventListener('open', () => {
    const attachAddon: any = new AttachAddon(socket)
    term.loadAddon(attachAddon)

    // 前端输入数据时发送到后端
    term.onData((data: any) => {
      socket.send(data)
    })

    // 接收后端传来的数据并显示在终端中
    socket.addEventListener('message', (event) => {
      term.write(event.data)
    })
  })

  fitAddon.fit()
  term.open(terminal.value)
  term.focus()
})
</script>
