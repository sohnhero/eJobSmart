import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Search, ArrowLeft, CheckCheck, Paperclip, FileText, X,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { messagesService, type ConversationWithUnread } from '../../lib/services/messages'
import { uploadsService } from '../../lib/services/uploads'
import { getMessagesSocket } from '../../lib/socket'
import { useToast } from '../../components/ui/Toast'
import { extractApiErrorMessage } from '../../lib/api'
import type { Message, User } from '../../lib/types'

const FALLBACK_POLL_INTERVAL_MS = 30000

interface IncomingMessagePayload {
  conversationId: string
  message: {
    _id: string
    content: string
    attachmentUrl?: string
    sender: string
    createdAt: string
  }
}

interface MessagesProps {
  role?: 'candidate' | 'company' | 'freelance' | 'agency' | 'admin-rh' | 'admin'
}

function otherParticipant(conv: ConversationWithUnread['conversation'], selfId: string): Partial<User> | null {
  const other = conv.participants.find(p => (typeof p === 'string' ? p : p._id) !== selfId)
  if (!other || typeof other === 'string') return null
  return other
}

function displayName(user: Partial<User> | null): string {
  if (!user) return 'Utilisateur'
  return user.companyName || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Utilisateur'
}

export default function Messages({ role = 'candidate' }: MessagesProps) {
  const { user } = useAuth()
  const toast = useToast()
  const [conversations, setConversations] = useState<ConversationWithUnread[]>([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMobileList, setShowMobileList] = useState(true)
  const [pendingAttachment, setPendingAttachment] = useState<File | null>(null)
  const [uploadingAttachment, setUploadingAttachment] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeConvIdRef = useRef<string | null>(null)

  const loadConversations = useCallback(() => {
    messagesService.conversations().then(setConversations).catch(() => setConversations([])).finally(() => setLoadingConvs(false))
  }, [])

  useEffect(() => { loadConversations() }, [loadConversations])

  const loadMessages = useCallback((convId: string) => {
    messagesService.messages(convId, { limit: 100 }).then(res => setMessages(res.items)).catch(() => {})
  }, [])

  useEffect(() => { activeConvIdRef.current = activeConvId }, [activeConvId])

  useEffect(() => {
    if (!activeConvId) return
    loadMessages(activeConvId)
    void messagesService.markRead(activeConvId).then(() => {
      setConversations(prev => prev.map(c => c.conversation._id === activeConvId ? { ...c, unreadCount: 0 } : c))
    })
    const interval = setInterval(() => loadMessages(activeConvId), FALLBACK_POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [activeConvId, loadMessages])

  useEffect(() => {
    if (!user) return
    const socket = getMessagesSocket()
    if (!socket) return
    const handleNewMessage = (payload: IncomingMessagePayload) => {
      if (payload.conversationId === activeConvIdRef.current) {
        const incoming: Message = {
          _id: payload.message._id,
          conversation: payload.conversationId,
          sender: payload.message.sender,
          content: payload.message.content,
          attachmentUrl: payload.message.attachmentUrl,
          isReadByRecipient: false,
          createdAt: payload.message.createdAt,
          updatedAt: payload.message.createdAt,
        }
        setMessages(prev => [...prev, incoming])
        void messagesService.markRead(payload.conversationId)
      }
      loadConversations()
    }
    socket.on('message:new', handleNewMessage)
    return () => { socket.off('message:new', handleNewMessage) }
  }, [user, loadConversations])

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [messages])

  const filteredConvs = conversations.filter(({ conversation }) => {
    const other = otherParticipant(conversation, user?._id ?? '')
    return displayName(other).toLowerCase().includes(search.toLowerCase())
  })

  const activeEntry = conversations.find(c => c.conversation._id === activeConvId)
  const activeOther = activeEntry ? otherParticipant(activeEntry.conversation, user?._id ?? '') : null

  const selectConv = (convId: string) => {
    setActiveConvId(convId)
    setShowMobileList(false)
  }

  const sendMessage = async () => {
    if ((!message.trim() && !pendingAttachment) || !activeConvId) return
    setSending(true)
    try {
      let attachmentUrl: string | undefined
      if (pendingAttachment) {
        setUploadingAttachment(true)
        attachmentUrl = await uploadsService.uploadAttachment(pendingAttachment)
        setUploadingAttachment(false)
      }
      const sent = await messagesService.send(activeConvId, message.trim(), attachmentUrl)
      setMessages(prev => [...prev, sent])
      setMessage('')
      setPendingAttachment(null)
      loadConversations()
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer le message"))
    } finally {
      setSending(false)
      setUploadingAttachment(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPendingAttachment(file)
    e.target.value = ''
  }

  const totalUnread = conversations.reduce((a, c) => a + c.unreadCount, 0)

  return (
    <DashboardLayout role={role}>
      <div className="mb-4">
        <h1 className="text-2xl font-black text-slate-900">Messagerie</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {totalUnread > 0 ? `${totalUnread} message${totalUnread > 1 ? 's' : ''} non lu${totalUnread > 1 ? 's' : ''}` : 'Tous les messages lus'}
        </p>
      </div>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversations list */}
          <div className={`${showMobileList ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-80 border-r border-slate-200 flex-shrink-0`}>
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" placeholder="Rechercher..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 focus:border-brand-300 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <p className="p-6 text-center text-sm text-slate-400">Chargement…</p>
              ) : filteredConvs.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-400">Aucune conversation</p>
              ) : (
                filteredConvs.map(({ conversation, unreadCount }) => {
                  const other = otherParticipant(conversation, user?._id ?? '')
                  const name = displayName(other)
                  return (
                    <button
                      key={conversation._id}
                      onClick={() => selectConv(conversation._id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left ${activeConvId === conversation._id ? 'bg-brand-50 border-l-2 border-l-brand-600' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-semibold text-sm truncate ${unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>{name}</span>
                          {conversation.lastMessageAt && <span className="text-[10px] text-slate-400">{new Date(conversation.lastMessageAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs truncate flex-1 ${unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                            {conversation.lastMessagePreview || 'Nouvelle conversation'}
                          </p>
                          {unreadCount > 0 && (
                            <span className="ml-2 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!showMobileList ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-w-0`}>
            {!activeEntry ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Sélectionnez une conversation</div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={() => setShowMobileList(true)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {displayName(activeOther).charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{displayName(activeOther)}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => {
                    const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id
                    const isMe = senderId === user?._id
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 mr-2 mt-auto">
                            {displayName(activeOther).charAt(0)}
                          </div>
                        )}
                        <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}`}>
                            {msg.content && <p>{msg.content}</p>}
                            {msg.attachmentUrl && (
                              <a
                                href={msg.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-1.5 text-xs font-medium underline mt-1 ${isMe ? 'text-white' : 'text-brand-600'}`}
                              >
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" /> Pièce jointe
                              </a>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck className={`w-3 h-3 ${msg.isReadByRecipient ? 'text-brand-400' : 'text-slate-300'}`} />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 border-t border-slate-100">
                  {pendingAttachment && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-fit max-w-full">
                      <FileText className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">{pendingAttachment.name}</span>
                      <button onClick={() => setPendingAttachment(null)} className="text-slate-400 hover:text-red-500 flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAttachment}
                      className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                      title="Joindre un fichier"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && void sendMessage()}
                        className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 focus:border-brand-300 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => void sendMessage()}
                      disabled={(!message.trim() && !pendingAttachment) || sending}
                      className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
