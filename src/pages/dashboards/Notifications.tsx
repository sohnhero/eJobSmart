import { useState } from 'react'
import {
  Bell, CheckCircle, MessageSquare, Briefcase,
  AlertCircle, BookOpen, UserCheck, X,
  Clock, Filter, Settings, Trash2,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function Notifications() {
  const [filter, setFilter] = useState('All')
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', title: 'Nouveau message', text: 'Seydou Barry vous a envoyé un message concernant l\'offre "Architect Cloud".', time: 'Il y a 5 min', unread: true },
    { id: 2, type: 'status', title: 'Candidature mise à jour', text: 'Votre candidature pour le poste de "Dev Frontend" chez Sonatel a été acceptée pour un entretien.', time: 'Il y a 2h', unread: true },
    { id: 3, type: 'alert', title: 'Nouvelles offres pour vous', text: '12 nouvelles offres correspondent à votre alerte "React Developer".', time: 'Hier', unread: false },
    { id: 4, type: 'training', title: 'Formation terminée', text: 'Félicitations ! Vous avez terminé le module "Fondamentaux RH". Votre certificat est disponible.', time: 'Hier', unread: false },
    { id: 5, type: 'system', title: 'Sécurité', text: 'Nouvelle connexion détectée sur votre compte depuis un nouvel appareil (Dakar, SN).', time: 'Il y a 2 jours', unread: false },
  ])

  const filteredList = notifications.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Messages' && n.type === 'message') return true
    if (filter === 'Offres' && n.type === 'alert') return true
    if (filter === 'Candidatures' && n.type === 'status') return true
    if (filter === 'Formations' && n.type === 'training') return true
    return false
  })

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  const handleDeleteOne = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />
      case 'status': return <UserCheck className="w-5 h-5 text-emerald-600" />
      case 'alert': return <Briefcase className="w-5 h-5 text-purple-600" />
      case 'training': return <BookOpen className="w-5 h-5 text-amber-600" />
      default: return <Bell className="w-5 h-5 text-slate-500" />
    }
  }

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Centre de Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">Retrouvez toute l'activité de votre compte eJobSmart</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleDeleteAll} leftIcon={<Trash2 className="w-4 h-4" />}>Tout supprimer</Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex gap-2">
            {['All', 'Messages', 'Offres', 'Candidatures', 'Formations'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                  filter === f ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {notifications.some(n => n.unread) && (
            <button 
              onClick={handleMarkAllRead} 
              className="text-xs font-bold text-brand-600 hover:underline flex-shrink-0"
            >
              Marquer tout comme lu
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-50">
          {filteredList.map(n => (
            <div 
              key={n.id} 
              onClick={() => handleNotificationClick(n.id)}
              className={`p-6 flex items-start gap-5 transition-all hover:bg-slate-50/50 cursor-pointer group relative ${n.unread ? 'bg-brand-50/30' : ''}`}
            >
              {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600" />}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.unread ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-sm ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                  <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                </div>
                <p className={`text-xs leading-relaxed ${n.unread ? 'text-slate-700' : 'text-slate-500'}`}>{n.text}</p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleDeleteOne(n.id, e)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 animate-pulse" />
              <p className="text-sm font-semibold">Aucune notification pour le moment</p>
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="px-6 py-4 bg-slate-50/50 text-center border-t border-slate-100">
            <button className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              <Clock className="w-4 h-4" /> Voir les notifications plus anciennes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
