import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Linkedin, Trophy, Building2, Zap, User, Settings } from 'lucide-react'
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
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#011847' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <Link to="/" className="flex items-center mb-12">
            <img src="/logo-eureka-job.png" alt="Eureka Job" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <h1 className="text-4xl font-heading font-black text-white leading-tight mb-4">
            Bienvenue<br />sur Eureka Job
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            La marketplace RH qui connecte les meilleurs talents aux meilleures opportunités en Afrique — Révélateur de talents, créateur de valeurs.
          </p>

          {/* Organic Dashboard Preview (Replaces the stats card) */}
          <div className="relative mt-12 w-full h-[340px] flex items-center justify-center">
            {/* Glowing background circles for visual depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-35 blur-3xl bg-gradient-to-tr from-cyan-400 to-brand-500 pointer-events-none" />
            
            {/* Interactive Element 1: Candidate Card */}
            <div className="absolute left-0 top-4 z-20 w-64 bg-white/10 backdrop-blur-lg border border-white/15 rounded-2xl p-4 shadow-2xl -rotate-3 hover:-rotate-1 hover:scale-[1.02] transition-all duration-300 select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-heading font-bold text-white text-sm shadow-md">
                  AD
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white leading-none">Amadou Diallo</h4>
                  <p className="text-[10px] text-cyan-200 mt-1">Développeur Fullstack React/Node</p>
                </div>
                {/* Match Ring */}
                <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="16" cy="16" r="13" className="text-white/10" strokeWidth="2.5" stroke="currentColor" fill="transparent" />
                    <circle cx="16" cy="16" r="13" className="text-cyan-400" strokeWidth="2.5" strokeDasharray="81.6" strokeDashoffset="8.1" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                  </svg>
                  <span className="absolute text-[8px] font-black text-white">90%</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-200 font-sans font-medium">TypeScript</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-200 font-sans font-medium">React</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-200 font-sans font-medium">Node.js</span>
              </div>
            </div>

            {/* Interactive Element 2: Job Match Card */}
            <div className="absolute right-0 bottom-6 z-10 w-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl rotate-3 hover:rotate-1 hover:scale-[1.02] transition-all duration-300 select-none">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-heading font-black text-xs text-white">
                    SD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Sonatel Digital</h4>
                    <p className="text-[10px] text-blue-200">Dakar, Sénégal · Hybride</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-[8px] font-heading font-bold uppercase tracking-wider">
                  Actif
                </span>
              </div>
              <h5 className="text-xs font-heading font-black text-white mt-3 leading-snug">Tech Lead JavaScript / Cloud</h5>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-300">
                <span className="font-semibold text-white">1.2M - 1.8M FCFA</span>
                <span className="text-[9px] text-slate-400">il y a 2h</span>
              </div>
            </div>

            {/* Interactive Element 3: Floating Stats Pill 1 (Top Right) */}
            <div className="absolute right-6 top-0 z-30 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-3 h-3 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white leading-none">+34k</p>
                <p className="text-[8px] text-slate-300 leading-none mt-0.5">Candidats</p>
              </div>
            </div>

            {/* Interactive Element 4: Floating Stats Pill 2 (Left Bottom) */}
            <div className="absolute left-6 bottom-0 z-30 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3 h-3 text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white leading-none">+847</p>
                <p className="text-[8px] text-slate-300 leading-none mt-0.5">Recruteurs</p>
              </div>
            </div>

            {/* Interactive Element 5: Floating Speed Stat Banner (Center overlapping) */}
            <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-cyan-500 to-brand-600 border border-cyan-400/30 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform duration-300 max-w-[180px]">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-bold text-cyan-100 uppercase tracking-widest leading-none">Délai moyen</p>
                <p className="text-xs font-black text-white leading-tight mt-0.5">18 jours</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-blue-300 text-right">© 2026 Eureka Job | Talents & Advisory</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
            <Link to="/register" className="text-xs text-slate-500 hover:text-brand-600 transition-colors">
              Nouveau ? <span className="font-semibold">S'inscrire</span>
            </Link>
          </div>

          {/* Desktop Top Link */}
          <div className="hidden lg:flex justify-between items-center mb-8 text-xs sm:text-sm text-slate-500">
            <Link to="/" className="flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
            <span>
              Nouveau ? &nbsp;
              <Link to="/register" className="font-semibold text-brand-600 hover:underline">S'inscrire</Link>
            </span>
          </div>

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
