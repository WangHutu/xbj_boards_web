<template>
  <div class="terminal_wrap" ref="terminalRef"></div>
  <button @click="sendMessage('按钮测试')">send</button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { io } from 'socket.io-client'
import 'xterm/css/xterm.css'

const terminalRef: any = ref(null)
const socketRef: any = ref(null)
const terminal: any = ref(null)
const fitAddon: any = ref(null)
const strData:any = ref('')
const sendMessage = (str: any) => {
  console.log('发送消息',  str)
  socketRef.value.emit('message', str, (response: any) => {
    console.log(response, '发送消息，接收发送成功响应信息')
  })
}
onMounted(() => {
  terminal.value = new Terminal()
  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef.value)
  terminal.value.focus()

  // http://117.50.174.56/:5000
  socketRef.value = io('/ws', {
    autoConnect: false // 自动连接
  })
  socketRef.value.on('connect', () => {
    console.log('Connected to the socket server')
  })
  socketRef.value.on('disconnect', () => {
    console.log('Disconnected from the socket server')
  })
  socketRef.value.on('message', (data: any) => {
    console.log('message', data)
    terminal.value.write(data.Data)
    console.log(terminal.value)
  })

  terminal.value.prompt = () => {
    terminal.value.write('\r\n\x1b[33m$\x1b[0m ')
    sendMessage(strData.value)
    strData.value = ''
  }

  // 添加事件监听器，支持输入方法
  terminal.value.onKey(
    (e: {
      domEvent: { altKey: any; altGraphKey: any; ctrlKey: any; metaKey: any; keyCode: number }
      key: any
    }) => {
      const printable =
        !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey
      if (e.domEvent.keyCode === 13) {
        terminal.value.prompt()
      } else if (e.domEvent.keyCode === 8) {
        // back 删除的情况
        if (terminal.value._core.buffer.x > 2) {
          terminal.value.write('\b \b')
        }
      } else if (printable) {
        terminal.value.write(e.key)
      }
      console.log(1, 'print', e.key)
    }
  )
  terminal.value.onData((key: string | any[]) => {
    strData.value += key
    console.log(strData.value)
    // 粘贴的情况
    if (key.length > 1) terminal.value.write(key)
  })

  fitAddon.value.fit()
  window.addEventListener('resize', () => fitAddon.value.fit())
  socketRef.value.connect()
})


onBeforeUnmount(() => {
  if (socketRef.value && socketRef.value.connected) {
    socketRef.value.disconnect()
  }
  window.removeEventListener('resize', () => fitAddon.value.fit())
  socketRef.value.disconnect()
})

const closeWs = () => {
  console.log('断开连接')
  socketRef.value.disconnect()
}

defineExpose({
  closeWs
})
</script>
