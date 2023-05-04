<template>
  <div class="terminal_wrap" ref="terminal"></div>
  <button @click="sendMessage">close</button>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.$socket.on('connect', () => {
    console.log('socketio-connect')
  })
  proxy.$socket.on('message', (data: any) => {
    console.log(data)
  })
})
onUnmounted(() => {
  proxy.$socket.removeAllListeners('connect')
  proxy.$socket.removeAllListeners('message')
})
const sendMessage = () => {
  console.log('发送消息')
  proxy.$socket.emit('message', {
    msgContent: '你好！' + new Date()
  })
}

defineExpose({
  sendMessage
})
</script>
