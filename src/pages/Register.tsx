import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, Building2, Users, Trophy, Zap, Linkedin } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { extractApiErrorMessage } from '../lib/api'
import { authService } from '../lib/auth-service'
import { roleToDashboardPath } from '../lib/roles'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

type Role = 'candidate' | 'company' | 'agency'
type Step = 1 | 2 | 3

const roles = [
  { id: 'candidate' as Role, icon: User, title: 'Candidat / Freelance', desc: 'Je cherche un emploi ou des missions freelance', color: 'brand' },
  { id: 'company' as Role, icon: Building2, title: 'Entreprise', desc: 'Je souhaite recruter des talents pour mon entreprise', color: 'purple' },
  { id: 'agency' as Role, icon: Users, title: 'Cabinet RH', desc: 'Nous gérons le recrutement pour nos clients', color: 'emerald' },
]

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const toast = useToast()
  const defaultRole = (searchParams.get('type') as Role) || 'candidate'
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(defaultRole)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', company: '', sector: '', size: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const user = await register({
        email: form.email,
        password: form.password,
        role,
        firstName: form.firstName,
        lastName: form.lastName,
      })
      if ((role === 'company' || role === 'agency') && form.company) {
        await authService.updateMe({ companyName: form.company })
      }
      navigate(roleToDashboardPath(user.role))
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de créer le compte"))
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthRegister = (provider: 'google' | 'linkedin') => {
    window.location.href = `${API_URL}/auth/${provider}?role=${role}`
  }

  const steps = [
    { label: 'Rôle', desc: 'Choisissez votre profil' },
    { label: 'Informations', desc: 'Vos coordonnées' },
    { label: 'Confirmation', desc: 'Vérification' },
  ]

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Right panel (now on the left) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 overflow-y-auto h-full my-auto">
        <div className="w-full max-w-lg my-auto py-4">
          {/* Mobile logo & Top Link */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-100 bg-white shadow-sm rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-100 hover:shadow transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
            <Link to="/login" className="text-xs text-slate-500 hover:text-brand-600 transition-colors">
              Déjà inscrit ? <span className="font-semibold">Se connecter</span>
            </Link>
          </div>

          {/* Desktop Top Link */}
          <div className="hidden lg:flex justify-between items-center mb-4 text-xs sm:text-sm text-slate-500">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 bg-white shadow-sm rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-100 hover:shadow transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
            <span>
              Déjà inscrit ? &nbsp;<Link to="/login" className="font-semibold text-brand-600 hover:underline">Se connecter</Link>
            </span>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-0">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all ${step > i + 1 ? 'bg-brand-600 border-brand-600 text-white'
                      : step === i + 1 ? 'border-brand-600 text-brand-600'
                        : 'border-slate-200 text-slate-400'
                      }`}>
                      {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <p className="text-[10px] font-medium mt-1 text-slate-500">{s.label}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-2 mb-4 ${step > i + 1 ? 'bg-brand-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-1">Créer un compte</h2>
                <p className="text-slate-500 text-sm mb-6">Bienvenue sur Eureka Job. Quel est votre profil ?</p>
                <div className="space-y-3">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === r.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${role === r.id ? 'bg-brand-600' : 'bg-slate-100'}`}>
                        <r.icon className={`w-5 h-5 ${role === r.id ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${role === r.id ? 'text-brand-700' : 'text-slate-800'}`}>{r.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${role === r.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                        {role === r.id && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
                <Button fullWidth size="lg" className="mt-6" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continuer
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-5 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Vos informations</h2>
                <p className="text-slate-500 text-sm mb-6">Compte {roles.find(r => r.id === role)?.title}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button type="button" onClick={() => handleOAuthRegister('google')} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    <span className="text-sm font-medium text-slate-700">Google</span>
                  </button>
                  <button type="button" onClick={() => handleOAuthRegister('linkedin')} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                  </button>
                </div>

                {(role === 'company' || role === 'agency') && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-5">
                    Avec Google/LinkedIn, vous complèterez le nom {role === 'company' ? "de l'entreprise" : 'du cabinet'} juste après, dans Paramètres.
                  </p>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">ou par email</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                 <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(3) }}>
                  {/* Candidate Fields (Prénom & Nom side-by-side, Email & Mot de passe side-by-side) */}
                  {role === 'candidate' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom *</label>
                          <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Amadou" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom *</label>
                          <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Diallo" className="input-field" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email professionnel *</label>
                          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe *</label>
                          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 caractères" className="input-field" required minLength={8} />
                          <p className="text-xs text-slate-400 mt-1">Utilisez au moins 8 caractères avec chiffres et lettres</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Company Fields (Nom & Secteur side-by-side, Email & Mot de passe side-by-side) */}
                  {role === 'company' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom du contact *</label>
                          <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Moussa" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du contact *</label>
                          <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Sow" className="input-field" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom de l'entreprise *</label>
                          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Sonatel S.A." className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Secteur d'activité</label>
                          <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} className="input-field">
                            <option value="">Sélectionner un secteur</option>
                            {['Technologie & Numérique', 'Banque & Finance', 'Santé', 'BTP', 'Industrie', 'Commerce'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email professionnel *</label>
                          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe *</label>
                          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 caractères" className="input-field" required minLength={8} />
                          <p className="text-xs text-slate-400 mt-1">Utilisez au moins 8 caractères avec chiffres et lettres</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Agency Fields (Nom & Email side-by-side, Mot de passe full-width) */}
                  {role === 'agency' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom du contact *</label>
                          <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Aïcha" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du contact *</label>
                          <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Ba" className="input-field" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du cabinet *</label>
                          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Cabinet Excellence RH" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email professionnel *</label>
                          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className="input-field" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe *</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 caractères" className="input-field" required minLength={8} />
                        <p className="text-xs text-slate-400 mt-1">Utilisez au moins 8 caractères avec chiffres et lettres</p>
                      </div>
                    </>
                  )}

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" required className="mt-0.5" />
                      <span className="text-xs text-slate-500">
                        J'accepte les <Link to="/legal" className="text-brand-600 hover:underline">Conditions d'utilisation</Link> et la{' '}
                        <Link to="/legal" className="text-brand-600 hover:underline">Politique de confidentialité</Link> d'Eureka Job *
                      </span>
                    </label>
                  </div>
                  <Button type="submit" fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continuer
                  </Button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-brand-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Presque terminé !</h2>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                    Vérifiez les informations et cliquez sur "Créer mon compte" pour finaliser votre inscription.
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Type de compte</span>
                      <span className="font-semibold text-slate-800">{roles.find(r => r.id === role)?.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Email</span>
                      <span className="font-semibold text-slate-800">{form.email || 'demo@eurekajob.africa'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Plan</span>
                      <span className="font-semibold text-emerald-600">Gratuit</span>
                    </div>
                  </div>
                  <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
                    Créer mon compte gratuitement
                  </Button>
                  <button onClick={() => setStep(2)} className="mt-3 text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                    <ArrowLeft className="w-3.5 h-3.5" /> Modifier mes informations
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Left panel (now on the right) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 relative overflow-hidden p-12 flex-col justify-between h-full">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#011847' }} />

        <div className="relative">
          <Link to="/" className="flex items-center mb-12">
            <img src="/logo-eureka-job.png" alt="Eureka Job" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <h1 className="text-4xl font-heading font-black text-white leading-tight mb-4">
            Révélez votre<br />potentiel sur Eureka Job
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            Créez votre profil en quelques clics et rejoignez la marketplace RH leader en Afrique de l'Ouest. Accédez aux meilleures opportunités de recrutement et formations certifiantes.
          </p>

          {/* Organic Dashboard Preview */}
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
    </div>
  )
}
