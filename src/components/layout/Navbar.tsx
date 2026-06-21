import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'
import clsx from 'clsx'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const navLinks = [
  { label: 'Offres d\'emploi', href: '/jobs' },
  { label: 'Formations', href: '/trainings' },
  { label: 'Entreprises', href: '/companies' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

interface NavbarProps {
  isLoggedIn?: boolean
  userRole?: 'candidate' | 'company' | 'agency' | 'admin'
  userName?: string
}

export default function Navbar({ isLoggedIn, userRole, userName = 'Amadou Diallo' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const dashboardPath = {
    candidate: '/dashboard/candidate',
    company: '/dashboard/company',
    agency: '/dashboard/agency',
    admin: '/dashboard/admin',
  }

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
                <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
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
                        onClick={() => { navigate(dashboardPath[userRole || 'candidate']); setProfileOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Tableau de bord
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <User className="w-4 h-4 text-slate-400" />
                        Mon profil
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => navigate('/')}
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
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50',
                  location.pathname === link.href && 'text-brand-600 bg-brand-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Button variant="secondary" fullWidth size="sm" onClick={() => { navigate('/login'); setMobileOpen(false) }}>
                Se connecter
              </Button>
              <Button fullWidth size="sm" onClick={() => { navigate('/register'); setMobileOpen(false) }}>
                Créer un compte
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
