import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Linkedin, Trophy, Building2, Zap, User, Settings } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (role: 'candidate' | 'company' | 'admin') => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate(`/dashboard/${role}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <Link to="/" className="flex items-center mb-12">
            <img src="/eurekaLogo.png" alt="Eureka Job" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <h1 className="text-4xl font-heading font-black text-white leading-tight mb-4">
            Bienvenue<br />sur Eureka Job
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            La marketplace RH qui connecte les meilleurs talents aux meilleures opportunités en Afrique — Révélateur de talents, créateur de valeurs.
          </p>

          <div className="space-y-4">
            {[
              { icon: Trophy, title: '+34 000 candidats', desc: 'Profils vérifiés et qualifiés', color: 'text-amber-400' },
              { icon: Building2, title: '+847 entreprises', desc: 'Recrutent activement', color: 'text-blue-400' },
              { icon: Zap, title: '18 jours', desc: 'Délai moyen de recrutement', color: 'text-emerald-400' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/5">
                <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-xs text-blue-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-blue-300">© 2026 Eureka Job | Talents & Advisory</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center mb-8 lg:hidden">
            <img src="/eurekaLogo.png" alt="Eureka Job" className="h-10 w-auto object-contain" />
          </Link>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Connexion</h2>
          <p className="text-slate-500 text-sm mb-8">Accédez à votre espace personnel</p>

          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 mb-3">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              Accès démo rapide
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Candidat', role: 'candidate' as const, icon: User },
                { label: 'Entreprise', role: 'company' as const, icon: Building2 },
                { label: 'Admin', role: 'admin' as const, icon: Settings },
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => handleLogin(item.role)}
                  className="flex flex-col items-center gap-1.5 text-[10px] font-bold text-brand-700 bg-white border border-brand-200 rounded-xl py-2.5 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all group"
                >
                  <item.icon className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-medium text-slate-700">LinkedIn</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou par email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={e => { e.preventDefault(); handleLogin('candidate') }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 w-4 h-4 text-slate-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-800">Mot de passe oublié ?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-800">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
