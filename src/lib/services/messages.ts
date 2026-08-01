import { api } from '../api'
import type { Conversation, Message, Paginated } from '../types'

export interface ConversationWithUnread {
  conversation: Conversation
  unreadCount: number
}

export const messagesService = {
  async startConversation(applicationId: string): Promise<Conversation> {
    const { data } = await api.post<Conversation>('/messages/conversations', { applicationId })
    return data
  },
  async conversations(): Promise<ConversationWithUnread[]> {
    const { data } = await api.get<ConversationWithUnread[]>('/messages/conversations')
    return data
  },
  async messages(conversationId: string, params: { page?: number; limit?: number } = {}): Promise<Paginated<Message>> {
    const { data } = await api.get<Paginated<Message>>(`/messages/conversations/${conversationId}/messages`, { params })
    return data
  },
  async send(conversationId: string, content: string, attachmentUrl?: string): Promise<Message> {
    const { data } = await api.post<Message>(`/messages/conversations/${conversationId}/messages`, {
      content,
      attachmentUrl,
    })
    return data
  },
  async markRead(conversationId: string): Promise<void> {
    await api.patch(`/messages/conversations/${conversationId}/read`)
  },
}
