import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Users, FileText, BookOpen,
  MessageSquare, Bell, Settings, LogOut, Menu, X,
  ChevronRight, CreditCard, BarChart3, Search, UserCheck,
} from 'lucide-react'
import clsx from 'clsx'
import Avatar from '../ui/Avatar'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
}

const candidateNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/candidate' },
  { icon: Search, label: 'Offres recommandées', href: '/dashboard/candidate/jobs' },
  { icon: FileText, label: 'Mes candidatures', href: '/dashboard/candidate/applications', badge: 5 },
  { icon: Users, label: 'Mon profil & CV', href: '/dashboard/candidate/profile' },
  { icon: BookOpen, label: 'Mes formations', href: '/dashboard/candidate/trainings' },
  { icon: MessageSquare, label: 'Messagerie', href: '/dashboard/candidate/messages', badge: 3 },
  { icon: Bell, label: 'Alertes emploi', href: '/dashboard/candidate/alerts' },
]

const freelanceNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/freelance' },
  { icon: Search, label: 'Rechercher missions', href: '/dashboard/freelance/jobs' },
  { icon: FileText, label: 'Mes propositions', href: '/dashboard/freelance/proposals', badge: 2 },
  { icon: Users, label: 'Mon portfolio & CV', href: '/dashboard/freelance/profile' },
  { icon: BookOpen, label: 'Formations RH', href: '/dashboard/freelance/trainings' },
  { icon: MessageSquare, label: 'Messagerie', href: '/dashboard/freelance/messages', badge: 4 },
  { icon: CreditCard, label: 'Mes factures', href: '/dashboard/freelance/billing' },
]

const companyNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/company' },
  { icon: Briefcase, label: 'Mes offres', href: '/dashboard/company/jobs' },
  { icon: Users, label: 'Candidatures', href: '/dashboard/company/applications', badge: 23 },
  { icon: UserCheck, label: 'Base CV', href: '/dashboard/company/cv-database' },
  { icon: MessageSquare, label: 'Messagerie', href: '/dashboard/company/messages', badge: 7 },
  { icon: BarChart3, label: 'Statistiques', href: '/dashboard/company/analytics' },
  { icon: CreditCard, label: 'Abonnement', href: '/dashboard/company/billing' },
  { icon: Settings, label: 'Paramètres', href: '/dashboard/company/settings' },
]

const agencyNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/agency' },
  { icon: Users, label: 'Portefeuille RH', href: '/dashboard/agency/resources' },
  { icon: Briefcase, label: 'Offres placement', href: '/dashboard/agency/jobs' },
  { icon: BarChart3, label: 'Stats placement', href: '/dashboard/agency/analytics' },
  { icon: BookOpen, label: 'Formations', href: '/dashboard/agency/trainings' },
  { icon: MessageSquare, label: 'Messagerie', href: '/dashboard/agency/messages' },
  { icon: CreditCard, label: 'Facturation', href: '/dashboard/agency/billing' },
]

const adminRhNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/admin-rh' },
  { icon: UserCheck, label: 'Vivier de talents', href: '/dashboard/admin-rh/cv-database' },
  { icon: Users, label: 'Candidats inscrits', href: '/dashboard/admin-rh/candidates' },
  { icon: Briefcase, label: 'Modération offres', href: '/dashboard/admin-rh/jobs' },
  { icon: BookOpen, label: 'Gestion formations', href: '/dashboard/admin-rh/trainings' },
  { icon: MessageSquare, label: 'Messagerie Interne', href: '/dashboard/admin-rh/messages' },
]

const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Vue globale', href: '/dashboard/admin' },
  { icon: Users, label: 'Utilisateurs', href: '/dashboard/admin/users' },
  { icon: BarChart3, label: 'Analytics Plateforme', href: '/dashboard/admin/analytics' },
  { icon: CreditCard, label: 'Revenus & Plans', href: '/dashboard/admin/billing' },
  { icon: Settings, label: 'Paramétrage système', href: '/dashboard/admin/settings' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  role?: 'candidate' | 'freelance' | 'company' | 'agency' | 'admin-rh' | 'admin'
  userName?: string
  userTitle?: string
}

const roleConfig = {
  candidate: { nav: candidateNav, title: 'Espace Candidat', color: 'text-brand-600', badge: 'Candidat' },
  freelance: { nav: freelanceNav, title: 'Espace Freelance', color: 'text-blue-600', badge: 'Freelance' },
  company: { nav: companyNav, title: 'Espace Entreprise', color: 'text-purple-600', badge: 'Entreprise' },
  agency: { nav: agencyNav, title: 'Espace Cabinet RH', color: 'text-emerald-600', badge: 'Cabinet RH' },
  'admin-rh': { nav: adminRhNav, title: 'Admin RH Intern', color: 'text-amber-600', badge: 'Admin RH' },
  admin: { nav: adminNav, title: 'Super Admin', color: 'text-slate-900', badge: 'Super Admin' },
}

export default function DashboardLayout({ children, role = 'candidate', userName = 'Amadou Diallo', userTitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const config = roleConfig[role]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100">
        <Link to="/" className="flex items-center">
          <img src="/logo-eureka-job.png" alt="Eureka Job" className="h-9 w-auto object-contain" />
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
            <span className="text-xs text-slate-400">{userTitle || config.badge}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {config.nav.map(item => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={clsx('sidebar-link', isActive && 'active')}
            >
              <item.icon className="w-4.5 h-4.5 w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && !isActive && (
                <span className="w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-white border-r border-slate-200 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 flex-1">
            <span className="text-brand-600 font-medium">{config.title}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-medium">
              {config.nav.find(n => n.href === location.pathname)?.label || 'Tableau de bord'}
            </span>
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-4.5 h-4.5 w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <Avatar name={userName} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLogoutConfirm(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6 text-center animate-slide-up">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">Confirmer la déconnexion</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter de votre session ?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setShowLogoutConfirm(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-750 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
