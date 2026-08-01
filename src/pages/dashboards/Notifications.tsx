import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, MessageSquare, Briefcase,
  BookOpen, UserCheck, X,
  Clock, AlertTriangle,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { notificationsService } from '../../lib/services/notifications'
import { timeAgo } from '../../lib/format'
import type { AppNotification, NotificationType } from '../../lib/types'

type FilterKey = 'All' | 'Messages' | 'Offres' | 'Candidatures' | 'Formations'

const FILTER_TYPES: Record<Exclude<FilterKey, 'All'>, NotificationType[]> = {
  Messages: ['new_message'],
  Offres: ['job_match', 'job_alert_match', 'job_expiring_soon'],
  Candidatures: ['application_received', 'application_status_changed', 'resource_proposal_received', 'resource_proposal_answered'],
  Formations: ['training_enrolled', 'training_completed'],
}

function getIcon(type: NotificationType) {
  if (type === 'new_message') return <MessageSquare className="w-5 h-5 text-blue-600" />
  if (type === 'application_status_changed' || type === 'application_received') return <UserCheck className="w-5 h-5 text-emerald-600" />
  if (type === 'job_match' || type === 'job_alert_match' || type === 'resource_proposal_received' || type === 'resource_proposal_answered') return <Briefcase className="w-5 h-5 text-purple-600" />
  if (type === 'training_enrolled' || type === 'training_completed') return <BookOpen className="w-5 h-5 text-amber-600" />
  if (type === 'job_expiring_soon') return <AlertTriangle className="w-5 h-5 text-red-600" />
  return <Bell className="w-5 h-5 text-slate-500" />
}

interface NotificationsProps {
  role?: 'candidate' | 'freelance' | 'company' | 'agency' | 'admin-rh' | 'admin'
}

export default function Notifications({ role = 'candidate' }: NotificationsProps) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterKey>('All')
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const load = (targetPage: number, append: boolean) => {
    setLoading(!append)
    notificationsService.list({ page: targetPage, limit: 20 }).then((res) => {
      setNotifications(prev => append ? [...prev, ...res.items] : res.items)
      setHasMore(res.page < res.totalPages)
      setPage(res.page)
    }).catch(() => { if (!append) setNotifications([]) }).finally(() => setLoading(false))
  }

  useEffect(() => { load(1, false) }, [])

  const filteredList = notifications.filter(n => {
    if (filter === 'All') return true
    return FILTER_TYPES[filter].includes(n.type)
  })

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await notificationsService.remove(id)
    setNotifications(prev => prev.filter(n => n._id !== id))
  }

  const handleNotificationClick = async (n: AppNotification) => {
    if (!n.isRead) {
      await notificationsService.markRead(n._id)
      setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item))
    }
    if (n.link) navigate(n.link)
  }

  return (
    <DashboardLayout role={role}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Centre de Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">Retrouvez toute l'activité de votre compte eJobSmart</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex gap-2">
            {(['All', 'Messages', 'Offres', 'Candidatures', 'Formations'] as FilterKey[]).map(f => (
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
          {notifications.some(n => !n.isRead) && (
            <button onClick={handleMarkAllRead} className="text-xs font-bold text-brand-600 hover:underline flex-shrink-0">
              Marquer tout comme lu
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Chargement…</div>
          ) : (
            <>
              {filteredList.map(n => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-6 flex items-start gap-5 transition-all hover:bg-slate-50/50 cursor-pointer group relative ${!n.isRead ? 'bg-brand-50/30' : ''}`}
                >
                  {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600" />}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold text-sm ${!n.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                      <span className="text-[10px] font-medium text-slate-400">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-slate-700' : 'text-slate-500'}`}>{n.message}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleDeleteOne(n._id, e)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredList.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold">Aucune notification pour le moment</p>
                </div>
              )}
            </>
          )}
        </div>

        {hasMore && (
          <div className="px-6 py-4 bg-slate-50/50 text-center border-t border-slate-100">
            <button onClick={() => load(page + 1, true)} className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              <Clock className="w-4 h-4" /> Voir les notifications plus anciennes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
