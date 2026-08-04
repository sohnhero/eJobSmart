import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  User, MapPin, Upload, Plus, X, Save,
  CheckCircle, Briefcase, GraduationCap, Globe,
  Linkedin, Github, Edit3, Camera, FileText, Zap, Trash2, Shield,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import SecuritySettings from '../../components/settings/SecuritySettings'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { profilesService } from '../../lib/services/profiles'
import { authService } from '../../lib/auth-service'
import { uploadsService } from '../../lib/services/uploads'
import { extractApiErrorMessage } from '../../lib/api'
import type { Availability, ContractType, CvVisibility, ProfileEducation, ProfileExperience } from '../../lib/types'

type Tab = 'info' | 'experience' | 'skills' | 'cv' | 'security'

const availabilities: Availability[] = ['Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']
const contractTypes: ContractType[] = ['CDI', 'CDD', 'Freelance', 'Intérim', 'Stage', 'Alternance']

const LANGUAGES_LIST = [
  'Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Mandingue',
  'Pulaar', 'Sérère', 'Diola', 'Soninké', 'Bambara', 'Espagnol',
  'Allemand', 'Italien', 'Chinois', 'Japonais', 'Russe', 'Swahili',
  'Turc', 'Coréen', 'Néerlandais', 'Polonais', 'Suédois', 'Persan',
  'Hindi', 'Ourdou', 'Bengali', 'Vietnamien', 'Thaï', 'Indonésien'
].sort()

const CV_VISIBILITY_OPTIONS: { value: CvVisibility; label: string; desc: string }[] = [
  { value: 'public', label: 'Visible par toutes les entreprises', desc: 'Votre CV est accessible dans notre base de données' },
  { value: 'on_apply', label: 'Visible uniquement aux entreprises contactées', desc: 'Partagé seulement quand vous postulez' },
  { value: 'private', label: 'Confidentiel', desc: 'Non visible dans la base CV' },
]

interface ProfileForm {
  headline: string
  bio: string
  city: string
  country: string
  linkedin: string
  github: string
  portfolio: string
  availability: Availability | ''
  contractTypesSought: ContractType[]
  salaryExpectationMin: string
  salaryExpectationMax: string
  currency: string
  skills: string[]
  languages: string[]
  cvUrl: string
  cvVisibility: CvVisibility
}

const emptyForm: ProfileForm = {
  headline: '', bio: '', city: '', country: '',
  linkedin: '', github: '', portfolio: '',
  availability: '', contractTypesSought: [],
  salaryExpectationMin: '', salaryExpectationMax: '', currency: 'FCFA',
  skills: [], languages: [], cvUrl: '', cvVisibility: 'on_apply',
}

export default function CandidateProfile() {
  const location = useLocation()
  const toast = useToast()
  const { user, refreshUser } = useAuth()

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    return (location.state as { activeTab?: Tab } | null)?.activeTab || 'info'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCv, setUploadingCv] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [experiences, setExperiences] = useState<ProfileExperience[]>([])
  const [educations, setEducations] = useState<ProfileEducation[]>([])

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setPhone(user.phone ?? '')
    }
  }, [user])

  useEffect(() => {
    let cancelled = false
    profilesService
      .me()
      .then((profile) => {
        if (cancelled) return
        setForm({
          headline: profile.headline ?? '',
          bio: profile.bio ?? '',
          city: profile.city ?? '',
          country: profile.country ?? '',
          linkedin: profile.linkedin ?? '',
          github: profile.github ?? '',
          portfolio: profile.portfolio ?? '',
          availability: profile.availability ?? '',
          contractTypesSought: profile.contractTypesSought ?? [],
          salaryExpectationMin: profile.salaryExpectationMin?.toString() ?? '',
          salaryExpectationMax: profile.salaryExpectationMax?.toString() ?? '',
          currency: profile.currency ?? 'FCFA',
          skills: profile.skills ?? [],
          languages: profile.languages ?? [],
          cvUrl: profile.cvUrl ?? '',
          cvVisibility: profile.cvVisibility ?? 'on_apply',
        })
        setExperiences(profile.experiences ?? [])
        setEducations(profile.education ?? [])
      })
      .catch(() => {
        // Pas encore de profil créé — le formulaire reste vide, la première sauvegarde le créera
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Modal control states
  const [showExpModal, setShowExpModal] = useState(false)
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null)

  const [showEduModal, setShowEduModal] = useState(false)
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null)

  // Form states for Experience
  const [expTitle, setExpTitle] = useState('')
  const [expCompany, setExpCompany] = useState('')
  const [expStart, setExpStart] = useState('')
  const [expEnd, setExpEnd] = useState('')
  const [expCurrent, setExpCurrent] = useState(false)
  const [expDesc, setExpDesc] = useState('')

  // Form states for Education
  const [eduDegree, setEduDegree] = useState('')
  const [eduSchool, setEduSchool] = useState('')
  const [eduYear, setEduYear] = useState('')
  const [eduMention, setEduMention] = useState('')

  const handleAddExpOpen = () => {
    setEditingExpIndex(null)
    setExpTitle(''); setExpCompany(''); setExpStart(''); setExpEnd(''); setExpCurrent(false); setExpDesc('')
    setShowExpModal(true)
  }

  const handleEditExpOpen = (exp: ProfileExperience, index: number) => {
    setEditingExpIndex(index)
    setExpTitle(exp.title)
    setExpCompany(exp.company)
    setExpStart(exp.startDate.slice(0, 7))
    setExpEnd(exp.endDate?.slice(0, 7) ?? '')
    setExpCurrent(exp.current)
    setExpDesc(exp.description ?? '')
    setShowExpModal(true)
  }

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expTitle.trim() || !expCompany.trim() || !expStart) return

    const entry: ProfileExperience = {
      title: expTitle,
      company: expCompany,
      startDate: `${expStart}-01`,
      endDate: expCurrent ? undefined : (expEnd ? `${expEnd}-01` : undefined),
      current: expCurrent,
      description: expDesc || undefined,
    }

    if (editingExpIndex !== null) {
      setExperiences(prev => prev.map((exp, i) => (i === editingExpIndex ? entry : exp)))
    } else {
      setExperiences(prev => [...prev, entry])
    }
    setShowExpModal(false)
  }

  const handleDeleteExp = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddEduOpen = () => {
    setEditingEduIndex(null)
    setEduDegree(''); setEduSchool(''); setEduYear(''); setEduMention('')
    setShowEduModal(true)
  }

  const handleEditEduOpen = (edu: ProfileEducation, index: number) => {
    setEditingEduIndex(index)
    setEduDegree(edu.degree)
    setEduSchool(edu.school)
    setEduYear(edu.year.toString())
    setEduMention(edu.mention ?? '')
    setShowEduModal(true)
  }

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eduDegree.trim() || !eduSchool.trim() || !eduYear) return

    const entry: ProfileEducation = {
      degree: eduDegree,
      school: eduSchool,
      year: Number(eduYear),
      mention: eduMention || undefined,
    }

    if (editingEduIndex !== null) {
      setEducations(prev => prev.map((edu, i) => (i === editingEduIndex ? entry : edu)))
    } else {
      setEducations(prev => [...prev, entry])
    }
    setShowEduModal(false)
  }

  const handleDeleteEdu = (index: number) => {
    setEducations(prev => prev.filter((_, i) => i !== index))
  }

  const completion = [
    { label: 'Informations personnelles', done: !!form.headline },
    { label: 'Expériences', done: experiences.length > 0 },
    { label: 'CV uploadé', done: !!form.cvUrl },
    { label: 'Compétences', done: form.skills.length > 0 },
  ]
  const completionPct = Math.round((completion.filter(c => c.done).length / completion.length) * 100)

  const handleCompletionClick = (itemLabel: string) => {
    switch (itemLabel) {
      case 'Informations personnelles': setActiveTab('info'); break
      case 'Expériences': setActiveTab('experience'); break
      case 'CV uploadé': setActiveTab('cv'); break
      case 'Compétences': setActiveTab('skills'); break
      default: break
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleCvFileChange = async (file: File | null) => {
    if (!file) return
    setUploadingCv(true)
    try {
      const url = await uploadsService.uploadCv(file)
      setForm(p => ({ ...p, cvUrl: url }))
      toast.success('Votre CV a été téléversé avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de téléverser le CV"))
    } finally {
      setUploadingCv(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await Promise.all([
        authService.updateMe({ firstName, lastName, phone: phone || undefined }),
        profilesService.updateMe({
          headline: form.headline || undefined,
          bio: form.bio || undefined,
          city: form.city || undefined,
          country: form.country || undefined,
          linkedin: form.linkedin || undefined,
          github: form.github || undefined,
          portfolio: form.portfolio || undefined,
          availability: form.availability || undefined,
          contractTypesSought: form.contractTypesSought,
          salaryExpectationMin: form.salaryExpectationMin ? Number(form.salaryExpectationMin) : undefined,
          salaryExpectationMax: form.salaryExpectationMax ? Number(form.salaryExpectationMax) : undefined,
          currency: form.currency,
          skills: form.skills,
          languages: form.languages,
          cvUrl: form.cvUrl || undefined,
          cvVisibility: form.cvVisibility,
          experiences,
          education: educations,
        }),
      ])
      await refreshUser()
      toast.success('Profil mis à jour avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de sauvegarder le profil'))
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'experience', label: 'Parcours', icon: Briefcase },
    { id: 'skills', label: 'Compétences', icon: Zap },
    { id: 'cv', label: 'CV & Documents', icon: FileText },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ]

  if (loading) {
    return (
      <DashboardLayout role="candidate">
        <p className="text-sm text-slate-400 text-center py-16">Chargement du profil…</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="candidate">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mon Profil & CV</h1>
          <p className="text-slate-500 text-sm mt-0.5">Complétude : <span className="font-bold text-brand-600">{completionPct}%</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" loading={saving} leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-black">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-brand-50 transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
            <h2 className="font-bold text-slate-900">{firstName} {lastName}</h2>
            {form.headline && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{form.headline}</p>}
            {(form.city || form.country) && (
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />{[form.city, form.country].filter(Boolean).join(', ')}
              </div>
            )}
          </div>

          {/* Completion */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Complétude du profil</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-brand-600 h-full rounded-full" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-xs font-bold text-brand-600">{completionPct}%</span>
            </div>
            <div className="space-y-2">
              {completion.map(item => (
                <div
                  key={item.label}
                  onClick={() => handleCompletionClick(item.label)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors group"
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {item.done
                      ? <CheckCircle className="w-3 h-3 text-emerald-600" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    }
                  </div>
                  <span className={`text-xs transition-colors group-hover:text-brand-600 ${item.done ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: tabs */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-3.5 text-xs font-semibold transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom</label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre professionnel</label>
                    <input value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} placeholder="ex: Développeur Full Stack React/Node.js" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input type="email" value={user?.email ?? ''} disabled className="input-field bg-slate-50 text-slate-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ville</label>
                      <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pays</label>
                      <input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biographie</label>
                    <textarea rows={4} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Disponibilité</label>
                    <div className="flex flex-wrap gap-2">
                      {availabilities.map(a => (
                        <button key={a} onClick={() => setForm(p => ({ ...p, availability: a }))}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${form.availability === a ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Types de contrats souhaités</label>
                    <div className="flex flex-wrap gap-2">
                      {contractTypes.map(ct => (
                        <button key={ct}
                          onClick={() => setForm(p => ({
                            ...p,
                            contractTypesSought: p.contractTypesSought.includes(ct)
                              ? p.contractTypesSought.filter(c => c !== ct)
                              : [...p.contractTypesSought, ct]
                          }))}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${form.contractTypesSought.includes(ct) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                          {ct}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prétention salariale min.</label>
                      <input type="number" value={form.salaryExpectationMin} onChange={e => setForm(p => ({ ...p, salaryExpectationMin: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prétention salariale max.</label>
                      <input type="number" value={form.salaryExpectationMax} onChange={e => setForm(p => ({ ...p, salaryExpectationMax: e.target.value }))} className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCE TAB */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-600" />Expériences professionnelles</h3>
                      <button onClick={handleAddExpOpen} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800"><Plus className="w-3.5 h-3.5" />Ajouter</button>
                    </div>
                    <div className="space-y-4">
                      {experiences.map((exp, index) => {
                        const startFormatted = new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
                        const endFormatted = exp.current ? 'Présent' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : '')
                        return (
                          <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-xl group relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{exp.company[0]}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-sm text-slate-900">{exp.title}</p>
                                  <p className="text-xs text-slate-500">{exp.company}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {startFormatted} — {endFormatted}
                                    {exp.current && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Actuel</span>}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleEditExpOpen(exp, index)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all" title="Modifier">
                                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  </button>
                                  <button onClick={() => handleDeleteExp(index)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                              {exp.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.description}</p>}
                            </div>
                          </div>
                        )
                      })}
                      {experiences.length === 0 && (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                          Aucune expérience enregistrée. Cliquez sur "Ajouter" pour commencer.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-600" />Formation</h3>
                      <button onClick={handleAddEduOpen} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800"><Plus className="w-3.5 h-3.5" />Ajouter</button>
                    </div>
                    <div className="space-y-3">
                      {educations.map((edu, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-xl group relative">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-purple-600" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm text-slate-900">{edu.degree}</p>
                                <p className="text-xs text-slate-500">{edu.school} · {edu.year}</p>
                                {edu.mention && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{edu.mention}</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleEditEduOpen(edu, index)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all" title="Modifier">
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                                <button onClick={() => handleDeleteEdu(index)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {educations.length === 0 && (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                          Aucune formation enregistrée. Cliquez sur "Ajouter" pour commencer.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Compétences techniques</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.skills.map(s => (
                        <span key={s} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl border border-brand-100 font-medium">
                          {s}
                          <button onClick={() => setForm(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Ajouter une compétence..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input-field flex-1" />
                      <Button size="sm" variant="secondary" onClick={addSkill}>Ajouter</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">Langues parlées</label>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.languages.map(lang => (
                        <span key={lang} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium">
                          {lang}
                          <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, languages: p.languages.filter(l => l !== lang) }))}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {form.languages.length === 0 && (
                        <span className="text-xs text-slate-400 italic">Aucune langue sélectionnée</span>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                      <div className="w-full md:w-64">
                        <select
                          onChange={(e) => {
                            const val = e.target.value
                            if (val && !form.languages.includes(val)) {
                              setForm(p => ({ ...p, languages: [...p.languages, val] }))
                            }
                            e.target.value = ""
                          }}
                          className="input-field cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Ajouter une langue --</option>
                          {LANGUAGES_LIST.map(lang => (
                            <option key={lang} value={lang} disabled={form.languages.includes(lang)}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Suggestions :</span>
                        {['Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Mandingue'].map(lang => {
                          const isSelected = form.languages.includes(lang)
                          if (isSelected) return null
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setForm(p => ({ ...p, languages: [...p.languages, lang] }))}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-colors text-slate-600 font-medium"
                            >
                              + {lang}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Liens & Portfolio</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <input value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="linkedin.com/in/..." className="input-field" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Github className="w-4 h-4 text-slate-700 flex-shrink-0" />
                        <input value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} placeholder="github.com/..." className="input-field" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input value={form.portfolio} onChange={e => setForm(p => ({ ...p, portfolio: e.target.value }))} placeholder="monportfolio.com" className="input-field" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV TAB */}
              {activeTab === 'cv' && (
                <div className="space-y-5">
                  {!form.cvUrl ? (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Téléverser votre CV</h3>
                      <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer group block">
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => void handleCvFileChange(e.target.files?.[0] ?? null)} />
                        <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
                        <p className="text-sm font-medium text-slate-600">{uploadingCv ? 'Téléversement en cours…' : 'Glissez votre CV ici'}</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX · Max 5 Mo</p>
                        <span className="mt-4 inline-block text-sm font-semibold text-brand-600">Parcourir les fichiers</span>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-red-600">CV</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{form.cvUrl.split('/').pop()}</p>
                          <button type="button" onClick={() => uploadsService.openFile(form.cvUrl).catch(err => toast.error(extractApiErrorMessage(err, "Impossible d'ouvrir le CV")))} className="text-xs text-brand-600 hover:underline">Voir le fichier</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-brand-600 font-semibold hover:text-brand-800 cursor-pointer">
                            {uploadingCv ? 'Envoi…' : 'Remplacer'}
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => void handleCvFileChange(e.target.files?.[0] ?? null)} />
                          </label>
                          <button
                            onClick={() => setForm(p => ({ ...p, cvUrl: '' }))}
                            className="text-xs text-red-600 font-semibold hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-semibold text-slate-900 mb-3">Visibilité du CV</h3>
                    <div className="space-y-3">
                      {CV_VISIBILITY_OPTIONS.map((opt) => (
                        <label key={opt.value} onClick={() => setForm(p => ({ ...p, cvVisibility: opt.value }))} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${form.cvVisibility === opt.value ? 'border-brand-600' : 'border-slate-300'}`}>
                            {form.cvVisibility === opt.value && <div className="w-2 h-2 bg-brand-600 rounded-full" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                            <p className="text-xs text-slate-400">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && <SecuritySettings />}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingExpIndex !== null ? "Modifier l'expérience" : 'Ajouter une expérience'}
              </h3>
              <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveExp} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du poste *</label>
                <input type="text" required value={expTitle} onChange={e => setExpTitle(e.target.value)} placeholder="ex: Senior React Developer" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Entreprise *</label>
                <input type="text" required value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="ex: Sonatel" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de début *</label>
                  <input type="month" required value={expStart} onChange={e => setExpStart(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de fin</label>
                  <input type="month" disabled={expCurrent} required={!expCurrent} value={expEnd} onChange={e => setExpEnd(e.target.value)} className="input-field disabled:bg-slate-50 disabled:text-slate-400" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" checked={expCurrent} onChange={e => setExpCurrent(e.target.checked)} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-semibold text-slate-700">C'est mon poste actuel</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={4} value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Décrivez vos missions et réalisations..." className="input-field resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowExpModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingEduIndex !== null ? 'Modifier la formation' : 'Ajouter une formation'}
              </h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdu} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diplôme / Certification *</label>
                <input type="text" required value={eduDegree} onChange={e => setEduDegree(e.target.value)} placeholder="ex: Master en Génie Logiciel" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Établissement *</label>
                <input type="text" required value={eduSchool} onChange={e => setEduSchool(e.target.value)} placeholder="ex: Université Cheikh Anta Diop" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Année d'obtention *</label>
                <input type="number" min="1950" max="2100" required value={eduYear} onChange={e => setEduYear(e.target.value)} placeholder="ex: 2018" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mention (optionnel)</label>
                <input type="text" value={eduMention} onChange={e => setEduMention(e.target.value)} placeholder="ex: Mention Très Bien" className="input-field" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowEduModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
