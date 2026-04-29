import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Upload, Plus, X, Save,
  CheckCircle, Briefcase, GraduationCap, Star, Globe,
  Linkedin, Github, Eye, Edit3, Camera, FileText, Zap,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

type Tab = 'info' | 'experience' | 'skills' | 'cv'

const availabilities = ['Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']
const contractTypes = ['CDI', 'CDD', 'Freelance', 'Intérim', 'Stage', 'Alternance']

export default function CandidateProfile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('info')
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

  const [experiences] = useState([
    { id: 1, title: 'Senior Developer', company: 'Sonatel Digital', start: '2022-01', end: '', current: true, desc: 'Développement de microservices et APIs REST pour des millions d\'utilisateurs.' },
    { id: 2, title: 'Full Stack Developer', company: 'InnoTech Africa', start: '2020-03', end: '2021-12', current: false, desc: 'Développement d\'applications fintech mobile-first pour le marché africain.' },
    { id: 3, title: 'Développeur Junior', company: 'Agence WebCi', start: '2018-09', end: '2020-02', current: false, desc: 'Développement de sites web et applications e-commerce.' },
  ])

  const [educations] = useState([
    { id: 1, degree: 'Master en Génie Logiciel', school: 'Université Cheikh Anta Diop', year: '2018', mention: 'Mention Très Bien' },
    { id: 2, degree: 'Licence Informatique', school: 'Université de Dakar', year: '2016', mention: 'Mention Bien' },
  ])

  const completion = [
    { label: 'Photo de profil', done: true },
    { label: 'Informations personnelles', done: true },
    { label: 'Expériences', done: true },
    { label: 'CV uploadé', done: false },
    { label: 'Compétences', done: true },
    { label: 'Alertes emploi', done: false },
  ]
  const completionPct = Math.round((completion.filter(c => c.done).length / completion.length) * 100)

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {item.done
                      ? <CheckCircle className="w-3 h-3 text-emerald-600" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    }
                  </div>
                  <span className={`text-xs ${item.done ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>{item.label}</span>
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
                      <button className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800"><Plus className="w-3.5 h-3.5" />Ajouter</button>
                    </div>
                    <div className="space-y-4">
                      {experiences.map(exp => (
                        <div key={exp.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl group">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{exp.company[0]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm text-slate-900">{exp.title}</p>
                                <p className="text-xs text-slate-500">{exp.company}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {new Date(exp.start).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} — {exp.current ? 'Présent' : new Date(exp.end).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                  {exp.current && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Actuel</span>}
                                </p>
                              </div>
                              <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5 text-slate-500" /></button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-600" />Formation</h3>
                      <button className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-800"><Plus className="w-3.5 h-3.5" />Ajouter</button>
                    </div>
                    <div className="space-y-3">
                      {educations.map(edu => (
                        <div key={edu.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-purple-600" /></div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{edu.degree}</p>
                            <p className="text-xs text-slate-500">{edu.school} · {edu.year}</p>
                            {edu.mention && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{edu.mention}</span>}
                          </div>
                        </div>
                      ))}
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
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Langues</label>
                    <div className="flex flex-wrap gap-2">
                      {['Français', 'Anglais', 'Wolof', 'Arabe', 'Portugais', 'Mandingue'].map(lang => (
                        <button key={lang}
                          onClick={() => setProfile(p => ({ ...p, languages: p.languages.includes(lang) ? p.languages.filter(l => l !== lang) : [...p.languages, lang] }))}
                          className={`text-sm px-3 py-1.5 rounded-xl font-medium border transition-colors ${profile.languages.includes(lang) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                          {lang}
                        </button>
                      ))}
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
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Téléverser votre CV</h3>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer group">
                      <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
                      <p className="text-sm font-medium text-slate-600">Glissez votre CV ici</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX · Max 5 Mo</p>
                      <button className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">Parcourir les fichiers</button>
                    </div>
                  </div>
                  <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-600">PDF</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">CV_Amadou_Diallo_2026.pdf</p>
                        <p className="text-xs text-slate-400">245 Ko · Mis à jour le 15/04/2026</p>
                      </div>
                      <button className="text-xs text-brand-600 font-semibold hover:text-brand-800">Remplacer</button>
                    </div>
                  </div>
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
    </DashboardLayout>
  )
}
