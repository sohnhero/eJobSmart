import { useState, useEffect } from 'react'
import {
  User, Briefcase, DollarSign, Mail, Phone, MapPin, Globe,
  Github, Linkedin, Plus, Trash2, Save, Sparkles, CheckCircle2
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

export default function FreelanceProfile() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  // Profile data state
  const [name, setName] = useState('Modou Fall')
  const [title, setTitle] = useState('Consultant Fullstack React / Node')
  const [tjm, setTjm] = useState('150000') // TJM in FCFA
  const [experience, setExperience] = useState('5 ans')
  const [email, setEmail] = useState('mfall@freelance.sn')
  const [phone, setPhone] = useState('+221 77 123 45 67')
  const [location, setLocation] = useState('Dakar, Sénégal')
  const [bio, setBio] = useState('Développeur passionné par la création de produits Web robustes et scalables. Expertise principale sur l\'écosystème JavaScript/TypeScript, React, Next.js, Node.js et les architectures cloud.')
  const [skills, setSkills] = useState<string[]>(['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS'])
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profil freelance mis à jour avec succès !')
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return
    setSkills(prev => [...prev, newSkill.trim()])
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove))
  }

  return (
    <DashboardLayout role="freelance" userName={name} userTitle="Consultant Tech">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Mon profil Freelance <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Personnalisez votre vitrine professionnelle pour attirer plus de clients</p>
      </div>

      {loading ? (
        <Skeleton variant="card" count={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Informations Professionnelles
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom Complet</label>
                    <input 
                      type="text" value={name} onChange={e => setName(e.target.value)} required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Intitulé de Poste / Spécialisation</label>
                    <input 
                      type="text" value={title} onChange={e => setTitle(e.target.value)} required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Taux Journalier Moyen (TJM) · FCFA</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" value={tjm} onChange={e => setTjm(e.target.value)} required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Années d'expérience</label>
                    <input 
                      type="text" value={experience} onChange={e => setExperience(e.target.value)} required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ville / Pays</label>
                    <input 
                      type="text" value={location} onChange={e => setLocation(e.target.value)} required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description / Présentation (Bio)</label>
                  <textarea 
                    rows={4} value={bio} onChange={e => setBio(e.target.value)} required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Skills & Links */}
          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Compétences
              </h3>
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                <input 
                  type="text" placeholder="Ajouter un tag" value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" /></button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <div key={s} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-700">{s}</span>
                    <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Liens Externes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <input type="url" placeholder="https://mon-portfolio.sn" className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-xs outline-none" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Github className="w-4 h-4 text-slate-400" />
                  <input type="url" placeholder="https://github.com/modou" className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-xs outline-none" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Linkedin className="w-4 h-4 text-slate-400" />
                  <input type="url" placeholder="https://linkedin.com/in/modou" className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-xs outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
