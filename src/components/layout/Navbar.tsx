import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'
import clsx from 'clsx'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { notificationsService } from '../../lib/services/notifications'
import type { BackendRole } from '../../lib/types'

const navLinks = [
  { label: 'Offres d\'emploi', href: '/jobs' },
  { label: 'Formations', href: '/trainings' },
  { label: 'Entreprises', href: '/companies' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

const dashboardPath: Record<BackendRole, string> = {
  candidate: '/dashboard/candidate',
  freelance: '/dashboard/freelance',
  company: '/dashboard/company',
  agency: '/dashboard/agency',
  admin_rh: '/dashboard/admin-rh',
  super_admin: '/dashboard/admin',
  trainer: '/dashboard/candidate',
}

// Candidat/freelance gèrent leur profil/CV sur une page dédiée ; entreprise/cabinet/admin n'ont
// pas de "profil" séparé, leurs informations vivent dans Paramètres.
const profilePath: Record<BackendRole, string> = {
  candidate: '/dashboard/candidate/profile',
  freelance: '/dashboard/freelance/profile',
  company: '/dashboard/company/settings',
  agency: '/dashboard/agency/settings',
  admin_rh: '/dashboard/admin-rh/settings',
  super_admin: '/dashboard/admin/settings',
  trainer: '/dashboard/candidate/profile',
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isLoggedIn = isAuthenticated
  const userRole = user?.role
  const userName = user ? (user.companyName || `${user.firstName} ${user.lastName}`) : ''
  const dashboardHome = dashboardPath[userRole || 'candidate']
  const myProfilePath = profilePath[userRole || 'candidate']

  const [unreadNotifications, setUnreadNotifications] = useState(0)
  useEffect(() => {
    if (!isAuthenticated) { setUnreadNotifications(0); return }
    let cancelled = false
    const load = () => {
      notificationsService.unreadCount()
        .then(count => { if (!cancelled) setUnreadNotifications(count) })
        .catch(() => {})
    }
    load()
    const interval = setInterval(load, 30000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [isAuthenticated])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale Eureka Job">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="Accueil Eureka Job">
            <img
              src="/logo-eureka-job.png"
              alt="Eureka Job | Talents & Advisory"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'nav-link px-3 py-2 rounded-lg',
                  location.pathname === link.href && 'text-brand-600 bg-brand-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate(`${dashboardHome}/notifications`)}
                  className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Avatar name={userName} size="sm" />
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-slate-800 leading-none">{userName}</p>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">{userRole}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-lg py-1 z-50">
                      <button
                        onClick={() => { navigate(dashboardHome); setProfileOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Tableau de bord
                      </button>
                      <button
                        onClick={() => { navigate(myProfilePath); setProfileOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Mon profil
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Se connecter</Button>
                <Button size="sm" onClick={() => navigate('/register')} className="bg-brand-600 hover:bg-brand-700">Créer un compte</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 focus:outline-none z-[110]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <div className="relative w-5 h-3.5 flex flex-col justify-between items-center">
              <span className={clsx(
                "w-5 h-0.5 bg-slate-600 rounded-full transition-all duration-300 transform origin-center",
                mobileOpen && "translate-y-[6px] rotate-45"
              )} />
              <span className={clsx(
                "w-5 h-0.5 bg-slate-600 rounded-full transition-all duration-300",
                mobileOpen && "opacity-0"
              )} />
              <span className={clsx(
                "w-5 h-0.5 bg-slate-600 rounded-full transition-all duration-300 transform origin-center",
                mobileOpen && "-translate-y-[6px] -rotate-45"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile menu backdrop */}
        {mobileOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile menu drawer */}
        <div className={clsx(
          "md:hidden fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-screen bg-white/95 backdrop-blur-2xl border-l border-slate-200/80 shadow-2xl z-[100] transition-transform duration-300 ease-out transform flex flex-col justify-between p-6 pt-24",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Top user profile card or guest heading */}
          <div>
            {isLoggedIn ? (
              <div className="bg-gradient-to-r from-brand-50 to-blue-50/50 border border-brand-100/50 rounded-2xl p-4 mb-8">
                <div className="flex items-center gap-3">
                  <Avatar name={userName} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-heading font-black text-slate-800 truncate">{userName}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-heading font-bold uppercase tracking-wider mt-1">
                      {userRole}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-1 text-center">
                <p className="text-sm text-slate-500 mb-2 font-medium">Rejoignez la communauté Eureka Job</p>
                <div className="h-0.5 bg-gradient-to-r from-brand-500/20 to-cyan-500/20 rounded-full" />
              </div>
            )}

            {/* Navigation links */}
            <div className="space-y-4">
              <p className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest mb-2">Navigation</p>
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "flex items-center justify-between py-2 border-b border-slate-50 text-slate-600 hover:text-brand-600 transition-colors group",
                    location.pathname === link.href && "text-brand-600 font-bold border-brand-100"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300 group-hover:text-brand-400 transition-colors">0{i+1}.</span>
                    <span className="text-lg font-heading font-black tracking-tight">{link.label}</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-brand-500 -rotate-90 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom actions & contact metadata */}
          <div className="space-y-6">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => { navigate(dashboardHome); setMobileOpen(false) }}
                  className="rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </Button>
                <button
                  onClick={() => { setShowLogoutConfirm(true); setMobileOpen(false) }}
                  className="w-full py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => { navigate('/login'); setMobileOpen(false) }}
                  className="rounded-xl"
                >
                  Se connecter
                </Button>
                <Button
                  fullWidth
                  onClick={() => { navigate('/register'); setMobileOpen(false) }}
                  className="bg-brand-600 hover:bg-brand-700 rounded-xl"
                >
                  Créer un compte
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Dakar, Sénégal</span>
              <a href="mailto:bdiop@eurekajob.africa" className="hover:text-brand-600 transition-colors">bdiop@eurekajob.africa</a>
            </div>
          </div>
        </div>
      </nav>

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
                  void logout()
                  setShowLogoutConfirm(false)
                  navigate('/')
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-750 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
