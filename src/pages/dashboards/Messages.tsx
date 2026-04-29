import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, Search, Phone, Video, MoreVertical, Paperclip,
  Smile, ArrowLeft, Circle, Star, Archive, Trash2, CheckCheck, Pin,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Avatar from '../../components/ui/Avatar'

interface Message {
  id: number
  text: string
  sender: 'me' | 'them'
  time: string
  read: boolean
}

interface Conversation {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  starred: boolean
  jobTitle: string
}

const conversations: Conversation[] = [
  {
    id: 1, name: 'Fatou Mbaye', role: 'DRH', company: 'Sonatel Digital', avatar: 'FM',
    lastMessage: 'Bonjour ! Pouvez-vous nous confirmer votre disponibilité pour l\'entretien ?',
    lastTime: '10:32', unread: 2, online: true, starred: true,
    jobTitle: 'Développeur Full Stack Senior',
  },
  {
    id: 2, name: 'Ibrahima Sow', role: 'Recruteur', company: 'Wave Mobile Money', avatar: 'IS',
    lastMessage: 'Votre profil correspond très bien à nos attentes pour le poste de Data Scientist.',
    lastTime: '09:15', unread: 0, online: false, starred: false,
    jobTitle: 'Data Scientist / ML Engineer',
  },
  {
    id: 3, name: 'Aminata Diallo', role: 'RH Manager', company: 'Ecobank', avatar: 'AD',
    lastMessage: 'Merci pour votre candidature. Nous vous recontactons sous 48h.',
    lastTime: 'Hier', unread: 0, online: false, starred: false,
    jobTitle: 'Analyste Financier',
  },
  {
    id: 4, name: 'Cabinet Excellence RH', role: 'Cabinet RH', company: 'Excellence RH', avatar: 'CE',
    lastMessage: 'Nous avons plusieurs opportunités qui pourraient vous intéresser.',
    lastTime: 'Lun.', unread: 1, online: true, starred: false,
    jobTitle: 'Proposition de mission',
  },
  {
    id: 5, name: 'Moussa Traoré', role: 'Directeur Technique', company: 'InnoTech Africa', avatar: 'MT',
    lastMessage: 'Excellent entretien ! Nous vous faisons un retour d\'ici vendredi.',
    lastTime: 'Dim.', unread: 0, online: false, starred: true,
    jobTitle: 'Tech Lead Frontend',
  },
]

const messageHistory: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Bonjour Amadou, nous avons bien reçu votre candidature pour le poste de Développeur Full Stack Senior.', sender: 'them', time: '09:00', read: true },
    { id: 2, text: 'Votre profil est très intéressant et correspond bien à nos attentes.', sender: 'them', time: '09:01', read: true },
    { id: 3, text: 'Bonjour Madame Mbaye, merci pour votre retour. Je suis très intéressé par cette opportunité.', sender: 'me', time: '09:30', read: true },
    { id: 4, text: 'Nous souhaiterions organiser un premier entretien technique. Êtes-vous disponible cette semaine ?', sender: 'them', time: '09:45', read: true },
    { id: 5, text: 'Tout à fait ! Je suis disponible jeudi ou vendredi matin.', sender: 'me', time: '10:00', read: true },
    { id: 6, text: 'Parfait ! Je vous propose jeudi 2 mai à 10h00 en vidéoconférence. Voici le lien Zoom.', sender: 'them', time: '10:20', read: true },
    { id: 7, text: 'Bonjour ! Pouvez-vous nous confirmer votre disponibilité pour l\'entretien ?', sender: 'them', time: '10:32', read: false },
  ],
  2: [
    { id: 1, text: 'Bonjour ! Votre profil correspond très bien à nos attentes pour le poste de Data Scientist.', sender: 'them', time: '09:15', read: true },
    { id: 2, text: 'Nous aimerions en savoir plus sur votre expérience avec TensorFlow.', sender: 'them', time: '09:16', read: true },
  ],
}

export default function Messages({ role = 'candidate' }: { role?: 'candidate' | 'company' | 'freelance' | 'agency' | 'admin-rh' | 'admin' }) {
  const navigate = useNavigate()
  const [activeConv, setActiveConv] = useState<Conversation>(conversations[0])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(messageHistory[1] || [])
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMobileList, setShowMobileList] = useState(true)

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(search.toLowerCase())
  )

  const selectConv = (conv: Conversation) => {
    setActiveConv(conv)
    setMessages(messageHistory[conv.id] || [
      { id: 1, text: conv.lastMessage, sender: 'them', time: conv.lastTime, read: true }
    ])
    setShowMobileList(false)
  }

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }])
    setMessage('')
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0)

  return (
    <DashboardLayout 
      role={role} 
      userName={
        role === 'company' ? 'Sonatel Digital' : 
        role === 'agency' ? 'Cabinet Excellence RH' :
        role === 'admin' || role === 'admin-rh' ? 'Administrateur' :
        'Amadou Diallo'
      } 
      userTitle={
        role === 'company' ? 'Compte Entreprise' : 
        role === 'agency' ? 'Cabinet RH' :
        role === 'admin' ? 'Super Admin' :
        role === 'admin-rh' ? 'Admin RH Interne' :
        'Candidat'
      }
    >
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
            {/* Search */}
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

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => selectConv(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left ${activeConv.id === conv.id ? 'bg-brand-50 border-l-2 border-l-brand-600' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                      {conv.avatar}
                    </div>
                    {conv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-semibold text-sm truncate ${conv.unread > 0 ? 'text-slate-900' : 'text-slate-700'}`}>{conv.name}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {conv.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        <span className="text-[10px] text-slate-400">{conv.lastTime}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{conv.role} · {conv.company}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs truncate flex-1 ${conv.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!showMobileList ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-w-0`}>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <button onClick={() => setShowMobileList(true)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                  {activeConv.avatar}
                </div>
                {activeConv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900">{activeConv.name}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  {activeConv.online ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-emerald-600 font-medium">En ligne</span>
                    </>
                  ) : 'Hors ligne'} · {activeConv.company}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Job context */}
            <div className="px-4 py-2.5 bg-brand-50 border-b border-brand-100">
              <p className="text-xs text-brand-600 font-medium flex items-center gap-2">
                <Pin className="w-3 h-3" /> Concernant : <span className="font-semibold">{activeConv.jobTitle}</span>
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'them' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 mr-2 mt-auto">
                      {activeConv.avatar}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-brand-400' : 'text-slate-300'}`} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 focus:border-brand-300 transition-colors pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
