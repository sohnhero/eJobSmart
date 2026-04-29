import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, Building2, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

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
  const defaultRole = (searchParams.get('type') as Role) || 'candidate'
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(defaultRole)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', company: '', sector: '', size: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    navigate(`/dashboard/${role}`)
  }

  const steps = [
    { label: 'Rôle', desc: 'Choisissez votre profil' },
    { label: 'Informations', desc: 'Vos coordonnées' },
    { label: 'Confirmation', desc: 'Vérification' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo variant="full" size={32} />
        </Link>
        <Link to="/login" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">
          Déjà un compte ? <span className="font-semibold">Se connecter</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-0">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all ${
                      step > i + 1 ? 'bg-brand-600 border-brand-600 text-white'
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
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Créer un compte</h2>
                <p className="text-slate-500 text-sm mb-6">Quel est votre profil ?</p>
                <div className="space-y-3">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        role === r.id
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

                <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(3) }}>
                  {(role === 'candidate') && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom *</label>
                        <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="Amadou" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom *</label>
                        <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Diallo" className="input-field" required />
                      </div>
                    </div>
                  )}
                  {(role === 'company' || role === 'agency') && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{role === 'company' ? 'Nom de l\'entreprise' : 'Nom du cabinet'} *</label>
                      <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder={role === 'company' ? 'Sonatel S.A.' : 'Cabinet Excellence RH'} className="input-field" required />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email professionnel *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="votre@email.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe *</label>
                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Minimum 8 caractères" className="input-field" required minLength={8} />
                    <p className="text-xs text-slate-400 mt-1">Utilisez au moins 8 caractères avec chiffres et lettres</p>
                  </div>
                  {role === 'company' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Secteur d'activité</label>
                      <select value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} className="input-field">
                        <option value="">Sélectionner un secteur</option>
                        {['Technologie & Numérique', 'Banque & Finance', 'Santé', 'BTP', 'Industrie', 'Commerce'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" required className="mt-0.5" />
                      <span className="text-xs text-slate-500">
                        J'accepte les <Link to="/terms" className="text-brand-600 hover:underline">Conditions d'utilisation</Link> et la{' '}
                        <Link to="/privacy" className="text-brand-600 hover:underline">Politique de confidentialité</Link> d'eJobSmart *
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
                      <span className="font-semibold text-slate-800">{form.email || 'demo@ejobsmart.sn'}</span>
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
    </div>
  )
}
