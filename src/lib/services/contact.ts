import { api } from '../api'

export interface ContactMessagePayload {
  name: string
  email: string
  company?: string
  reason: string
  message: string
}

export const contactService = {
  async submit(payload: ContactMessagePayload): Promise<void> {
    await api.post('/contact', payload)
  },
}
