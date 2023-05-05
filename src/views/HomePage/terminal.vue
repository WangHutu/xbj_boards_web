<template>
  <div class="terminal_wrap" ref="terminal"></div>
  <button @click="sendMessage">send</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { io } from 'socket.io-client'

var socket = io('http://localhost:5000', {
  autoConnect: false // 自动连接
})

socket.on('message', function (msg) {
  console.log('接收消息', msg)
})

const sendMessage = () => {
  console.log('发送消息')
  socket.emit('message', 'test-value', (response: any) => {
    console.log(response, '发送消息，接收发送成功响应信息')
  })
}

onMounted(() => {
  // socket.on('message', function (msg) {
  //   console.log('接收消息', msg)
  // })
  socket.connect()
})

const closeWs = () => {
  console.log('断开连接')
  socket.disconnect()
}

defineExpose({
  closeWs
})
</script>
