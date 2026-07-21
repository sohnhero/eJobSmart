import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Upload, Plus, X, Save,
  CheckCircle, Briefcase, GraduationCap, Star, Globe,
  Linkedin, Github, Eye, Edit3, Camera, FileText, Zap, Trash2,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'

type Tab = 'info' | 'experience' | 'skills' | 'cv'

const availabilities = ['Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']
const contractTypes = ['CDI', 'CDD', 'Freelance', 'Intérim', 'Stage', 'Alternance']

const LANGUAGES_LIST = [
  'Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Mandingue',
  'Pulaar', 'Sérère', 'Diola', 'Soninké', 'Bambara', 'Espagnol',
  'Allemand', 'Italien', 'Chinois', 'Japonais', 'Russe', 'Swahili',
  'Turc', 'Coréen', 'Néerlandais', 'Polonais', 'Suédois', 'Persan',
  'Hindi', 'Ourdou', 'Bengali', 'Vietnamien', 'Thaï', 'Indonésien'
].sort()

export default function CandidateProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    return (location.state as any)?.activeTab || 'info'
  })
  const [saved, setSaved] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const [profile, setProfile] = useState({
    firstName: 'Amadou', lastName: 'Diallo',
    headline: 'Développeur Full Stack React/Node.js — 6 ans d\'expérience',
    email: 'amadou.diallo@email.com', phone: '+221 77 123 45 67',
    city: 'Dakar', country: 'Sénégal',
    linkedin: 'linkedin.com/in/amadoudiallo', github: 'github.com/amadoudiallo',
    portfolio: 'amadoudiallo.dev',
    bio: 'Développeur passionné avec 6 ans d\'expérience en développement web full stack. Spécialisé dans les écosystèmes React et Node.js, j\'ai contribué à des projets pour des startups et des entreprises établies en Afrique de l\'Ouest.',
    availability: 'Immédiate',
    selectedContracts: ['CDI', 'Freelance'],
    salaryMin: '1000000', salaryMax: '1500000', currency: 'FCFA',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Redis'],
    languages: ['Français', 'Anglais', 'Wolof'],
  })

  // Experiences state
  const [experiences, setExperiences] = useState([
    { id: 1, title: 'Senior Developer', company: 'Sonatel Digital', start: '2022-01', end: '', current: true, desc: 'Développement de microservices et APIs REST pour des millions d\'utilisateurs.' },
    { id: 2, title: 'Full Stack Developer', company: 'InnoTech Africa', start: '2020-03', end: '2021-12', current: false, desc: 'Développement d\'applications fintech mobile-first pour le marché africain.' },
    { id: 3, title: 'Développeur Junior', company: 'Agence WebCi', start: '2018-09', end: '2020-02', current: false, desc: 'Développement de sites web et applications e-commerce.' },
  ])

  // Educations state
  const [educations, setEducations] = useState([
    { id: 1, degree: 'Master en Génie Logiciel', school: 'Université Cheikh Anta Diop', year: '2018', mention: 'Mention Très Bien' },
    { id: 2, degree: 'Licence Informatique', school: 'Université de Dakar', year: '2016', mention: 'Mention Bien' },
  ])

  // Modal control states
  const [showExpModal, setShowExpModal] = useState(false)
  const [editingExp, setEditingExp] = useState<any | null>(null)
  
  const [showEduModal, setShowEduModal] = useState(false)
  const [editingEdu, setEditingEdu] = useState<any | null>(null)

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

  // Open experience modal for addition
  const handleAddExpOpen = () => {
    setEditingExp(null)
    setExpTitle('')
    setExpCompany('')
    setExpStart('')
    setExpEnd('')
    setExpCurrent(false)
    setExpDesc('')
    setShowExpModal(true)
  }

  // Open experience modal for editing
  const handleEditExpOpen = (exp: any) => {
    setEditingExp(exp)
    setExpTitle(exp.title)
    setExpCompany(exp.company)
    setExpStart(exp.start)
    setExpEnd(exp.end || '')
    setExpCurrent(exp.current)
    setExpDesc(exp.desc)
    setShowExpModal(true)
  }

  // Handle saving experience
  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expTitle.trim() || !expCompany.trim()) return

    if (editingExp) {
      // Modify
      setExperiences(prev => prev.map(exp => exp.id === editingExp.id ? {
        ...exp,
        title: expTitle,
        company: expCompany,
        start: expStart,
        end: expCurrent ? '' : expEnd,
        current: expCurrent,
        desc: expDesc
      } : exp))
      toast.success('Expérience modifiée avec succès !')
    } else {
      // Add
      const newExp = {
        id: Date.now(),
        title: expTitle,
        company: expCompany,
        start: expStart || new Date().toISOString().substring(0, 7),
        end: expCurrent ? '' : expEnd,
        current: expCurrent,
        desc: expDesc
      }
      setExperiences(prev => [...prev, newExp])
      toast.success('Expérience ajoutée avec succès !')
    }
    setShowExpModal(false)
  }

  // Handle deleting experience
  const handleDeleteExp = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id))
    toast.success('Expérience supprimée.')
  }

  // Open education modal for addition
  const handleAddEduOpen = () => {
    setEditingEdu(null)
    setEduDegree('')
    setEduSchool('')
    setEduYear('')
    setEduMention('')
    setShowEduModal(true)
  }

  // Open education modal for editing
  const handleEditEduOpen = (edu: any) => {
    setEditingEdu(edu)
    setEduDegree(edu.degree)
    setEduSchool(edu.school)
    setEduYear(edu.year)
    setEduMention(edu.mention || '')
    setShowEduModal(true)
  }

  // Handle saving education
  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eduDegree.trim() || !eduSchool.trim()) return

    if (editingEdu) {
      // Modify
      setEducations(prev => prev.map(edu => edu.id === editingEdu.id ? {
        ...edu,
        degree: eduDegree,
        school: eduSchool,
        year: eduYear,
        mention: eduMention
      } : edu))
      toast.success('Formation modifiée avec succès !')
    } else {
      // Add
      const newEdu = {
        id: Date.now(),
        degree: eduDegree,
        school: eduSchool,
        year: eduYear || new Date().getFullYear().toString(),
        mention: eduMention
      }
      setEducations(prev => [...prev, newEdu])
      toast.success('Formation ajoutée avec succès !')
    }
    setShowEduModal(false)
  }

  // Handle deleting education
  const handleDeleteEdu = (id: number) => {
    setEducations(prev => prev.filter(edu => edu.id !== id))
    toast.success('Formation supprimée.')
  }

  const [cvUploaded, setCvUploaded] = useState(() => {
    return localStorage.getItem('cv_uploaded') === 'true'
  })
  
  const [alertsConfigured, setAlertsConfigured] = useState(() => {
    return localStorage.getItem('alerts_configured') !== 'false'
  })

  const completion = [
    { label: 'Photo de profil', done: true },
    { label: 'Informations personnelles', done: true },
    { label: 'Expériences', done: true },
    { label: 'CV uploadé', done: cvUploaded },
    { label: 'Compétences', done: true },
    { label: 'Alertes emploi', done: alertsConfigured },
  ]
  const completionPct = Math.round((completion.filter(c => c.done).length / completion.length) * 100)

  const handleCompletionClick = (itemLabel: string) => {
    switch (itemLabel) {
      case 'Photo de profil':
      case 'Informations personnelles':
      case 'Informations':
        setActiveTab('info')
        break
      case 'Expériences':
      case 'Expériences professionnelles':
        setActiveTab('experience')
        break
      case 'CV uploadé':
        setActiveTab('cv')
        break
      case 'Compétences':
      case 'Compétences renseignées':
        setActiveTab('skills')
        break
      case 'Alertes emploi':
      case 'Alertes emploi configurées':
        navigate('/dashboard/candidate/alerts')
        break
      default:
        break
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      toast.success('Profil mis à jour avec succès !')
    }, 2000)
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'experience', label: 'Parcours', icon: Briefcase },
    { id: 'skills', label: 'Compétences', icon: Zap },
    { id: 'cv', label: 'CV & Documents', icon: FileText },
  ]

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mon Profil & CV</h1>
          <p className="text-slate-500 text-sm mt-0.5">Complétude : <span className="font-bold text-brand-600">{completionPct}%</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>Aperçu public</Button>
          <Button size="sm" loading={saved} leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-black">AD</div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-brand-50 transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
            <h2 className="font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{profile.headline}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />{profile.city}, {profile.country}
            </div>
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
                      <input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                      <input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre professionnel</label>
                    <input value={profile.headline} onChange={e => setProfile(p => ({ ...p, headline: e.target.value }))} className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone</label>
                      <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biographie</label>
                    <textarea rows={4} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Disponibilité</label>
                    <div className="flex flex-wrap gap-2">
                      {availabilities.map(a => (
                        <button key={a} onClick={() => setProfile(p => ({ ...p, availability: a }))}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${profile.availability === a ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
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
                          onClick={() => setProfile(p => ({
                            ...p,
                            selectedContracts: p.selectedContracts.includes(ct)
                              ? p.selectedContracts.filter(c => c !== ct)
                              : [...p.selectedContracts, ct]
                          }))}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${profile.selectedContracts.includes(ct) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                          {ct}
                        </button>
                      ))}
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
                      {experiences.map(exp => {
                        const startFormatted = exp.start.includes('-') ? new Date(exp.start + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : exp.start;
                        const endFormatted = exp.current ? 'Présent' : (exp.end && exp.end.includes('-') ? new Date(exp.end + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : exp.end);
                        return (
                          <div key={exp.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl group relative">
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
                                  <button onClick={() => handleEditExpOpen(exp)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all" title="Modifier">
                                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  </button>
                                  <button onClick={() => handleDeleteExp(exp.id)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                              {exp.desc && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.desc}</p>}
                            </div>
                          </div>
                        );
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
                      {educations.map(edu => (
                        <div key={edu.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl group relative">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-purple-600" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm text-slate-900">{edu.degree}</p>
                                <p className="text-xs text-slate-500">{edu.school} · {edu.year}</p>
                                {edu.mention && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{edu.mention}</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleEditEduOpen(edu)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all" title="Modifier">
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                                <button onClick={() => handleDeleteEdu(edu.id)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
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
                      {profile.skills.map(s => (
                        <span key={s} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl border border-brand-100 font-medium">
                          {s}
                          <button onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Ajouter une compétence..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="input-field flex-1" />
                      <Button size="sm" variant="secondary" onClick={addSkill}>Ajouter</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">Langues parlées</label>
                    
                    {/* Selected languages as tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.languages.map(lang => (
                        <span key={lang} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium">
                          {lang}
                          <button 
                            type="button"
                            onClick={() => setProfile(p => ({ ...p, languages: p.languages.filter(l => l !== lang) }))} 
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {profile.languages.length === 0 && (
                        <span className="text-xs text-slate-400 italic">Aucune langue sélectionnée</span>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                      {/* Dropdown for all languages */}
                      <div className="w-full md:w-64">
                        <select 
                          onChange={(e) => {
                            const val = e.target.value
                            if (val && !profile.languages.includes(val)) {
                              setProfile(p => ({ ...p, languages: [...p.languages, val] }))
                            }
                            e.target.value = ""
                          }}
                          className="input-field cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Ajouter une langue --</option>
                          {LANGUAGES_LIST.map(lang => (
                            <option key={lang} value={lang} disabled={profile.languages.includes(lang)}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Suggestions :</span>
                        {['Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Mandingue'].map(lang => {
                          const isSelected = profile.languages.includes(lang)
                          if (isSelected) return null
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setProfile(p => ({ ...p, languages: [...p.languages, lang] }))}
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
                        <input value={profile.linkedin} onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))} placeholder="linkedin.com/in/..." className="input-field" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Github className="w-4 h-4 text-slate-700 flex-shrink-0" />
                        <input value={profile.github} onChange={e => setProfile(p => ({ ...p, github: e.target.value }))} placeholder="github.com/..." className="input-field" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input value={profile.portfolio} onChange={e => setProfile(p => ({ ...p, portfolio: e.target.value }))} placeholder="monportfolio.com" className="input-field" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV TAB */}
              {activeTab === 'cv' && (
                <div className="space-y-5">
                  {!cvUploaded ? (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Téléverser votre CV</h3>
                      <div 
                        onClick={() => {
                          localStorage.setItem('cv_uploaded', 'true')
                          setCvUploaded(true)
                          toast.success('Votre CV a été téléversé avec succès !')
                        }}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer group"
                      >
                        <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
                        <p className="text-sm font-medium text-slate-600">Glissez votre CV ici</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX · Max 5 Mo</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            localStorage.setItem('cv_uploaded', 'true')
                            setCvUploaded(true)
                            toast.success('Votre CV a été téléversé avec succès !')
                          }}
                          className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                        >
                          Parcourir les fichiers
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-red-600">PDF</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">CV_Amadou_Diallo_2026.pdf</p>
                          <p className="text-xs text-slate-400">245 Ko · Mis à jour à l'instant</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              localStorage.setItem('cv_uploaded', 'true')
                              setCvUploaded(true)
                              toast.success('Votre CV a été remplacé avec succès !')
                            }}
                            className="text-xs text-brand-600 font-semibold hover:text-brand-800"
                          >
                            Remplacer
                          </button>
                          <button 
                            onClick={() => {
                              localStorage.setItem('cv_uploaded', 'false')
                              setCvUploaded(false)
                              toast.info('Votre CV a été supprimé.')
                            }}
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
                      {[
                        { label: 'Visible par toutes les entreprises', desc: 'Votre CV est accessible dans notre base de données', active: true },
                        { label: 'Visible uniquement aux entreprises contactées', desc: 'Partagé seulement quand vous postulez', active: false },
                        { label: 'Confidentiel', desc: 'Non visible dans la base CV', active: false },
                      ].map((opt, i) => (
                        <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${opt.active ? 'border-brand-600' : 'border-slate-300'}`}>
                            {opt.active && <div className="w-2 h-2 bg-brand-600 rounded-full" />}
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
                {editingExp ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
              </h3>
              <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveExp} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du poste *</label>
                <input 
                  type="text" 
                  required 
                  value={expTitle} 
                  onChange={e => setExpTitle(e.target.value)} 
                  placeholder="ex: Senior React Developer" 
                  className="input-field" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Entreprise *</label>
                <input 
                  type="text" 
                  required 
                  value={expCompany} 
                  onChange={e => setExpCompany(e.target.value)} 
                  placeholder="ex: Sonatel" 
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de début *</label>
                  <input 
                    type="month" 
                    required 
                    value={expStart} 
                    onChange={e => setExpStart(e.target.value)} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de fin</label>
                  <input 
                    type="month" 
                    disabled={expCurrent} 
                    required={!expCurrent} 
                    value={expEnd} 
                    onChange={e => setExpEnd(e.target.value)} 
                    className="input-field disabled:bg-slate-50 disabled:text-slate-400" 
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input 
                  type="checkbox" 
                  checked={expCurrent} 
                  onChange={e => setExpCurrent(e.target.checked)} 
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
                />
                <span className="text-sm font-semibold text-slate-700">C'est mon poste actuel</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  rows={4} 
                  value={expDesc} 
                  onChange={e => setExpDesc(e.target.value)} 
                  placeholder="Décrivez vos missions et réalisations..." 
                  className="input-field resize-none" 
                />
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
                {editingEdu ? 'Modifier la formation' : 'Ajouter une formation'}
              </h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdu} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diplôme / Certification *</label>
                <input 
                  type="text" 
                  required 
                  value={eduDegree} 
                  onChange={e => setEduDegree(e.target.value)} 
                  placeholder="ex: Master en Génie Logiciel" 
                  className="input-field" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Établissement *</label>
                <input 
                  type="text" 
                  required 
                  value={eduSchool} 
                  onChange={e => setEduSchool(e.target.value)} 
                  placeholder="ex: Université Cheikh Anta Diop" 
                  className="input-field" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Année d'obtention *</label>
                <input 
                  type="number" 
                  min="1950" 
                  max="2100" 
                  required 
                  value={eduYear} 
                  onChange={e => setEduYear(e.target.value)} 
                  placeholder="ex: 2018" 
                  className="input-field" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mention (optionnel)</label>
                <input 
                  type="text" 
                  value={eduMention} 
                  onChange={e => setEduMention(e.target.value)} 
                  placeholder="ex: Mention Très Bien" 
                  className="input-field" 
                />
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
