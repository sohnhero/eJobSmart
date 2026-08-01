import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Save, Plus, X, AlertCircle,
  Send, CheckCircle, MapPin, Clock, DollarSign,
  ClipboardList, Coins, FileText, Layout, Lightbulb, Zap, ArrowRight,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { sectorsService } from '../../lib/services/sectors'
import { jobsService } from '../../lib/services/jobs'
import { extractApiErrorMessage } from '../../lib/api'
import type { ContractType, RemoteType, ExperienceLevel, Sector, CreateJobPayload } from '../../lib/types'

interface JobFormData {
  title: string
  contractType: ContractType | ''
  sector: string
  city: string
  country: string
  remoteType: RemoteType | ''
  salaryMin: string
  salaryMax: string
  currency: string
  showSalary: boolean
  experienceLevel: ExperienceLevel | ''
  description: string
  missions: string[]
  requirements: string[]
  skills: string[]
  languages: string[]
  deadline: string
  positions: string
  benefits: string[]
}

const contractTypes: ContractType[] = ['CDI', 'CDD', 'Intérim', 'Freelance', 'Stage', 'Alternance']
const remoteModes: RemoteType[] = ['Sur site', 'Télétravail', 'Hybride']
const experienceLevels: ExperienceLevel[] = ['Junior', 'Confirmé', 'Senior', 'Expert']
const currencies = ['FCFA', 'EUR', 'USD', 'GNF', 'XOF']
const countries = ['Sénégal', "Côte d'Ivoire", 'Mali', 'Guinée', 'Burkina Faso', 'Niger', 'Togo', 'Bénin', 'Cameroun', 'Congo']

const defaultForm: JobFormData = {
  title: '', contractType: '', sector: '', city: '', country: 'Sénégal',
  remoteType: '', salaryMin: '', salaryMax: '', currency: 'FCFA', showSalary: true,
  experienceLevel: '', description: '', missions: [''], requirements: [''],
  skills: [], languages: ['Français'], deadline: '', positions: '1',
  benefits: [],
}

export default function PostJob() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState<JobFormData>(defaultForm)
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [sectors, setSectors] = useState<Sector[]>([])

  const totalSteps = 4

  useEffect(() => {
    void sectorsService.list().then(setSectors).catch(() => setSectors([]))
  }, [])

  const updateField = <K extends keyof JobFormData>(key: K, value: JobFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const updateListItem = (key: 'missions' | 'requirements', index: number, value: string) =>
    updateField(key, form[key].map((item, i) => i === index ? value : item))

  const addListItem = (key: 'missions' | 'requirements') =>
    updateField(key, [...form[key], ''])

  const removeListItem = (key: 'missions' | 'requirements', index: number) =>
    updateField(key, form[key].filter((_, i) => i !== index))

  const toggleBenefit = (b: string) =>
    updateField('benefits', form.benefits.includes(b) ? form.benefits.filter(x => x !== b) : [...form.benefits, b])

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      updateField('skills', [...form.skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const buildPayload = (): CreateJobPayload => ({
    title: form.title,
    contractType: form.contractType as ContractType,
    sector: form.sector,
    city: form.city,
    country: form.country,
    remoteType: form.remoteType as RemoteType,
    experienceLevel: form.experienceLevel as ExperienceLevel,
    description: form.description,
    missions: form.missions.filter(Boolean),
    requirements: form.requirements.filter(Boolean),
    skills: form.skills,
    languages: form.languages,
    benefits: form.benefits,
    positions: form.positions ? Number(form.positions) : 1,
    salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
    currency: form.currency,
    isSalaryVisible: form.showSalary,
    expiresAt: form.deadline || undefined,
  })

  const isFormValid = !!(form.title && form.contractType && form.sector && form.city && form.remoteType && form.experienceLevel && form.description && form.missions.some(Boolean) && form.requirements.some(Boolean))

  const handleSaveDraft = async () => {
    setSavingDraft(true)
    try {
      await jobsService.create(buildPayload())
      toast.success('Brouillon enregistré')
      navigate('/dashboard/company/jobs')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'enregistrer le brouillon"))
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async () => {
    if (!isFormValid) {
      toast.error('Complétez tous les champs requis avant de publier')
      return
    }
    setLoading(true)
    try {
      const created = await jobsService.create(buildPayload())
      await jobsService.publish(created._id)
      setPublished(true)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de publier l'offre"))
    } finally {
      setLoading(false)
    }
  }

  const completionPercent = Math.round(
    ([form.title, form.contractType, form.sector, form.city, form.remoteType, form.experienceLevel, form.description].filter(Boolean).length / 7) * 100
  )

  if (published) {
    return (
      <DashboardLayout role="company">
        <div className="max-w-lg mx-auto py-16 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Offre publiée !</h1>
          <p className="text-slate-500 mb-6">
            Votre offre <strong>"{form.title || 'Nouvelle offre'}"</strong> est maintenant active et visible par les candidats.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-4 text-center text-sm">
            <div><p className="font-bold text-brand-600">0</p><p className="text-slate-400">Candidatures</p></div>
            <div><p className="font-bold text-slate-900">{form.positions || 1}</p><p className="text-slate-400">Poste{Number(form.positions) > 1 ? 's' : ''}</p></div>
            <div><p className="font-bold text-amber-600">{form.deadline ? new Date(form.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}</p><p className="text-slate-400">Expire</p></div>
          </div>
          <div className="flex flex-col gap-3">
            <Button fullWidth onClick={() => navigate('/dashboard/company')}>
              Voir mon tableau de bord
            </Button>
            <Button fullWidth variant="secondary" onClick={() => { setForm(defaultForm); setStep(1); setPublished(false) }}>
              Publier une autre offre
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="company">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-slate-900">Publier une offre d'emploi</h1>
          <p className="text-sm text-slate-400">Étape {step}/{totalSteps}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" loading={savingDraft} leftIcon={<Save className="w-3.5 h-3.5" />} onClick={handleSaveDraft}>
            Sauvegarder brouillon
          </Button>
          {step < totalSteps && (
              <Button size="sm" onClick={() => setStep(s => s + 1 as typeof s)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Suivant
              </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors cursor-pointer ${i + 1 <= step ? 'bg-brand-600' : 'bg-slate-200'}`}
            onClick={() => setStep(i + 1)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-600" /> Informations essentielles
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du poste *</label>
                <input
                  type="text" placeholder="ex: Développeur Full Stack Senior"
                  value={form.title} onChange={e => updateField('title', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type de contrat *</label>
                  <select value={form.contractType} onChange={e => updateField('contractType', e.target.value as ContractType)} className="input-field">
                    <option value="">Sélectionner</option>
                    {contractTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Secteur d'activité *</label>
                  <select value={form.sector} onChange={e => updateField('sector', e.target.value)} className="input-field">
                    <option value="">Sélectionner</option>
                    {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ville *</label>
                  <input type="text" placeholder="Dakar" value={form.city} onChange={e => updateField('city', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pays *</label>
                  <select value={form.country} onChange={e => updateField('country', e.target.value)} className="input-field">
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mode de travail *</label>
                  <select value={form.remoteType} onChange={e => updateField('remoteType', e.target.value as RemoteType)} className="input-field">
                    <option value="">Sélectionner</option>
                    {remoteModes.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Niveau d'expérience *</label>
                  <select value={form.experienceLevel} onChange={e => updateField('experienceLevel', e.target.value as ExperienceLevel)} className="input-field">
                    <option value="">Sélectionner</option>
                    {experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre de postes à pourvoir</label>
                <input type="number" min="1" max="99" value={form.positions} onChange={e => updateField('positions', e.target.value)} className="input-field w-24" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date limite de candidature</label>
                <input type="date" value={form.deadline} onChange={e => updateField('deadline', e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {/* Step 2: Salary & Benefits */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" /> Rémunération & Avantages
              </h2>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">Fourchette salariale</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => updateField('showSalary', !form.showSalary)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${form.showSalary ? 'bg-brand-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.showSalary ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs text-slate-500">Visible aux candidats</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="Min" value={form.salaryMin} onChange={e => updateField('salaryMin', e.target.value)} className="input-field flex-1" />
                  <span className="text-slate-400">—</span>
                  <input type="number" placeholder="Max" value={form.salaryMax} onChange={e => updateField('salaryMax', e.target.value)} className="input-field flex-1" />
                  <select value={form.currency} onChange={e => updateField('currency', e.target.value)} className="input-field w-28">
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Avantages supplémentaires</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Mutuelle santé', 'Véhicule de fonction', 'Logement', 'Téléphone', 'Prime annuelle', 'Formation continue', 'Tickets repas'].map(b => (
                    <button
                      key={b}
                      onClick={() => toggleBenefit(b)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${form.benefits.includes(b) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Langues requises</label>
                <div className="flex flex-wrap gap-2">
                  {['Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => updateField('languages', form.languages.includes(lang) ? form.languages.filter(l => l !== lang) : [...form.languages, lang])}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${form.languages.includes(lang) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="card p-6 space-y-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Description du poste
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description générale *</label>
                <textarea
                  rows={5} placeholder="Décrivez le contexte du poste, l'équipe, les enjeux..."
                  value={form.description} onChange={e => updateField('description', e.target.value)}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Missions & Responsabilités *</label>
                  <button onClick={() => addListItem('missions')} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {form.missions.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{i + 1}.</span>
                      <input
                        type="text" placeholder={`Mission ${i + 1}`}
                        value={m} onChange={e => updateListItem('missions', i, e.target.value)}
                        className="input-field flex-1"
                      />
                      {form.missions.length > 1 && (
                        <button onClick={() => removeListItem('missions', i)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Profil & Prérequis *</label>
                  <button onClick={() => addListItem('requirements')} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {form.requirements.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">•</span>
                      <input
                        type="text" placeholder={`Prérequis ${i + 1}`}
                        value={r} onChange={e => updateListItem('requirements', i, e.target.value)}
                        className="input-field flex-1"
                      />
                      {form.requirements.length > 1 && (
                        <button onClick={() => removeListItem('requirements', i)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Compétences requises</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.skills.map(s => (
                    <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg border border-brand-100 font-medium">
                      {s}
                      <button onClick={() => updateField('skills', form.skills.filter(sk => sk !== s))} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="Ajouter une compétence..."
                    value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                    className="input-field flex-1"
                  />
                  <Button size="sm" variant="secondary" onClick={addSkill}>Ajouter</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview & Publish */}
          {step === 4 && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5 text-purple-600" /> Aperçu & Publication
              </h2>

              {/* Preview card */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-6 border-2 border-dashed border-slate-300">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(user?.companyName ?? user?.firstName ?? '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{form.title || 'Titre du poste'}</h3>
                    <p className="text-sm text-slate-500">{user?.companyName ?? `${user?.firstName} ${user?.lastName}`}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {form.contractType && <span className="text-xs px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full font-semibold">{form.contractType}</span>}
                  {form.remoteType && <span className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full font-semibold">{form.remoteType}</span>}
                  {form.experienceLevel && <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{form.experienceLevel}</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500">
                  {form.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{form.city}, {form.country}</span>}
                  {form.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Expire {new Date(form.deadline).toLocaleDateString('fr-FR')}</span>}
                  {(form.salaryMin || form.salaryMax) && form.showSalary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {form.salaryMin || '?'}—{form.salaryMax || '?'} {form.currency}
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 mb-6">
                {[
                  { label: 'Titre du poste', done: !!form.title },
                  { label: 'Type de contrat', done: !!form.contractType },
                  { label: "Secteur d'activité", done: !!form.sector },
                  { label: 'Localisation', done: !!form.city },
                  { label: 'Mode de travail', done: !!form.remoteType },
                  { label: 'Description du poste', done: !!form.description },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100' : 'bg-amber-50 border border-amber-200'}`}>
                      {item.done
                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      }
                    </div>
                    <span className={`text-sm ${item.done ? 'text-slate-600' : 'text-amber-700 font-medium'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" loading={savingDraft} leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveDraft}>
                  Enregistrer brouillon
                </Button>
                <Button size="lg" loading={loading} rightIcon={<Send className="w-4 h-4" />} onClick={handlePublish} className="flex-1">
                  Publier l'offre
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1) as typeof s)} disabled={step === 1}>
              ← Précédent
            </Button>
            {step < totalSteps && (
              <Button onClick={() => setStep(s => s + 1 as typeof s)}>
                Suivant →
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Completion */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Complétude de l'offre</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-brand-600 h-full rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
              </div>
              <span className="text-sm font-bold text-brand-600">{completionPercent}%</span>
            </div>
            <p className="text-xs text-slate-400">
              {completionPercent < 70 ? 'Complétez les champs requis pour publier' : 'Offre prête à être publiée'}
            </p>
          </div>

          {/* Tips */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Conseils
            </h3>
            <ul className="space-y-2">
              {[
                'Un titre précis attire 3× plus de candidats qualifiés',
                'Mentionnez la fourchette salariale pour +40% de candidatures',
                "Décrivez la culture d'entreprise pour réduire le turnover",
                'Listez 5-8 missions, pas plus',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                  <span className="text-brand-400 font-bold flex-shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Boost option */}
          <div className="card p-5 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-semibold text-slate-900">Booster l'offre</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">Mettez votre offre en avant pour plus de visibilité. Disponible depuis "Mes offres" une fois l'offre publiée et active.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
