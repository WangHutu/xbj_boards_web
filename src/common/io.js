import io from 'socket.io-client'
const socket = io('ws://117.50.174.56:8888/', {
    query: {},
    transports: ['websocket', 'polling'],
    timeout: 5000,
})
export default socket