import { io, type Socket } from 'socket.io-client'
import { tokenStorage } from './token-storage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
// Le gateway WebSocket est monté à la racine du serveur (namespace /messages), pas sous le préfixe REST /api/v1
const WS_BASE = API_URL.replace(/\/api\/v1\/?$/, '')

let messagesSocket: Socket | null = null

export function getMessagesSocket(): Socket | null {
  const token = tokenStorage.getAccessToken()
  if (!token) return null

  if (!messagesSocket) {
    messagesSocket = io(`${WS_BASE}/messages`, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    })
  } else if (!messagesSocket.connected) {
    messagesSocket.auth = { token }
    messagesSocket.connect()
  }
  return messagesSocket
}

export function disconnectMessagesSocket(): void {
  messagesSocket?.disconnect()
  messagesSocket = null
}
