import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Users, Briefcase, Star, Globe,
  Building2, Calendar, Mail, Phone, ExternalLink,
  ChevronRight, Share2, Heart, ShieldCheck,
  CheckCircle, ArrowLeft, Instagram, Linkedin, Twitter,
  Facebook, Camera, MessageCircle, Plus, Bell
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge, { ContractBadge } from '../components/ui/Badge'
import { jobs } from '../data/jobs'

const companiesData = [
  { 
    id: 1, 
    name: 'Sonatel Digital', 
    logo: 'https://ui-avatars.com/api/?name=Sonatel&background=2563eb&color=fff&size=200',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    sector: 'Télécommunications', 
    size: 'Grand groupe (5000+)', 
    founded: 1985,
    country: 'SN', 
    city: 'Dakar', 
    address: '64 Voie de Dégagement Nord, Dakar',
    openJobs: 8, 
    rating: 4.7, 
    reviews: 234, 
    website: 'https://www.sonatel.sn',
    description: 'Filiale digitale du groupe Sonatel (Orange), leader des télécoms au Sénégal. Nous développons des solutions numériques innovantes pour l\'Afrique. Acteur majeur de l\'écosystème numérique, Sonatel Digital accompagne la transformation digitale des entreprises et des administrations à travers des solutions de Cloud, Cybersécurité, IoT et Big Data.',
    fullAbout: "Sonatel Digital est au cœur de la stratégie d'innovation du Groupe Sonatel. Notre mission est d'inventer les services de demain pour nos clients particuliers et entreprises. Nous cultivons un environnement de travail agile, créatif et tourné vers l'excellence technique.\n\nRejoindre Sonatel Digital, c'est participer à des projets d'envergure internationale tout en ayant un impact direct sur le développement numérique du Sénégal et de la sous-région. Nous valorisons l'apprentissage continu, la diversité des talents et l'esprit entrepreneurial.",
    tags: ['Tech', 'Innovation', 'Afrique', 'Agile', 'Cloud'], 
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  { 
    id: 2, 
    name: 'Wave Mobile Money', 
    logo: 'https://ui-avatars.com/api/?name=Wave&background=0891b2&color=fff&size=200',
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200',
    sector: 'Technologie & Numérique', 
    size: 'ETI (250-5000)', 
    founded: 2018,
    country: 'SN', 
    city: 'Dakar', 
    address: 'Point E, Boulevard de l\'Est, Dakar',
    openJobs: 15, 
    rating: 4.9, 
    reviews: 312, 
    website: 'https://www.wave.com',
    description: 'Wave est la super-app financière qui révolutionne les transferts d\'argent et les paiements en Afrique de l\'Ouest.',
    fullAbout: "Wave est en train de construire le premier réseau financier sans frais pour l'Afrique. Nous utilisons la technologie pour rendre les services financiers radicalement abordables et accessibles à tous. Notre équipe est composée de passionnés qui croient que l'accès aux services financiers est un droit fondamental.\n\nDepuis notre lancement en 2018, nous avons connu une croissance fulgurante, devenant la première 'licorne' d'Afrique francophone. Nous recherchons des talents exceptionnels pour nous aider à étendre notre impact sur tout le continent.",
    tags: ['Fintech', 'Mobile', 'Scale-up', 'Impact'], 
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
    ]
  }
]

export default function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews' | 'photos'>('about')
  const [isFollowing, setIsFollowing] = useState(false)

  // Find company by ID (fallback to Sonatel if not found)
  const company = companiesData.find(c => c.id === Number(id)) || companiesData[0]
  const companyJobs = jobs.filter(j => j.company === company.name)

  const tabs = [
    { id: 'about', label: 'À propos', icon: Building2 },
    { id: 'jobs', label: `Offres (${companyJobs.length})`, icon: Briefcase },
    { id: 'reviews', label: 'Avis', icon: MessageCircle },
    { id: 'photos', label: 'Culture & Photos', icon: Camera },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header / Cover */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img 
          src={company.cover} 
          alt={company.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-2 shadow-xl relative z-10 border-4 border-white overflow-hidden">
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-white leading-none">{company.name}</h1>
                  {company.verified && <ShieldCheck className="w-6 h-6 text-brand-400 fill-brand-400/20" />}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-blue-100 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {company.sector}</span>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {company.city}, {company.country}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isFollowing 
                  ? 'bg-white/20 text-white backdrop-blur-md border border-white/30' 
                  : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {isFollowing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isFollowing ? 'Suivi' : 'Suivre'}
              </button>
              <button className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/companies')}
          className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-all border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'border-brand-600 text-brand-600 bg-brand-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="card p-8">
                  <h2 className="text-xl font-black text-slate-900 mb-6">À propos de {company.name}</h2>
                  <div className="prose prose-slate max-w-none">
                    {company.fullAbout.split('\n\n').map((para, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed mb-4">{para}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-8">
                    {company.tags.map(tag => (
                      <Badge key={tag} variant="slate" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="card p-8">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Détails de l'entreprise</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taille</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">{company.size}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fondée en</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">{company.founded}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siège social</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">{company.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Note moyenne</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">{company.rating} / 5 ({company.reviews} avis)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900">{companyJobs.length} Offres d'emploi actuelles</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Trier par :</span>
                    <select className="bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 outline-none">
                      <option>Plus récentes</option>
                      <option>Salaire élevé</option>
                    </select>
                  </div>
                </div>
                {companyJobs.map(job => (
                  <Link 
                    key={job.id} 
                    to={`/jobs/${job.id}`}
                    className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.city}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {job.applicants} candidats</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <ContractBadge type={job.contractType} />
                      <Badge variant="blue" className="bg-blue-50 text-blue-600 border-none">{job.experienceLevel}</Badge>
                      <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>
                ))}
                {companyJobs.length === 0 && (
                  <div className="card p-12 text-center text-slate-500 bg-white/50 border-dashed">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Aucune offre d'emploi n'est disponible actuellement.</p>
                    <button className="text-brand-600 font-bold mt-2 hover:underline">Créer une alerte pour cette entreprise</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {company.gallery.map((img, i) => (
                  <div key={i} className={`card overflow-hidden group cursor-pointer ${i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="card p-8 flex flex-col md:flex-row items-center gap-10">
                  <div className="text-center">
                    <p className="text-6xl font-black text-slate-900">{company.rating}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-3 uppercase tracking-widest">{company.reviews} avis vérifiés</p>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 w-4">{stars}</span>
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-400 h-full rounded-full" 
                            style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 w-8">{stars === 5 ? '75%' : stars === 4 ? '20%' : '5%'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example reviews */}
                {[1, 2].map(i => (
                  <div key={i} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                          {i === 1 ? 'AD' : 'SK'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{i === 1 ? 'Amadou Diallo' : 'Safiétou Kane'}</p>
                          <p className="text-[10px] text-slate-400">Poste : {i === 1 ? 'Développeur Fullstack' : 'Chef de projet Marketing'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "Environnement de travail exceptionnel. Les équipes sont passionnées et la hiérarchie est très à l'écoute. Les opportunités d'apprentissage sont réelles et encouragées."
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Website & Social */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-6 text-base">Liens & Réseaux</h3>
              <div className="space-y-4">
                <a 
                  href={company.website} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-all border border-transparent hover:border-brand-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Site officiel</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Linkedin, color: 'hover:text-[#0077b5]' },
                    { icon: Twitter, color: 'hover:text-[#1da1f2]' },
                    { icon: Instagram, color: 'hover:text-[#e4405f]' },
                    { icon: Facebook, color: 'hover:text-[#1877f2]' },
                  ].map((soc, i) => (
                    <button key={i} className={`p-3 rounded-xl bg-slate-50 text-slate-400 transition-all border border-transparent hover:border-slate-200 hover:bg-white ${soc.color}`}>
                      <soc.icon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-6 text-base">Contact</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email recrutement</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">jobs@sonatel.sn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">+221 33 839 00 00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter / Alerte */}
            <div className="card p-6 bg-gradient-to-br from-brand-900 to-brand-700 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bell className="w-16 h-16" />
              </div>
              <h3 className="font-bold text-white mb-3 relative z-10">Ne manquez rien !</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-6 relative z-10">
                Recevez une alerte dès que {company.name} publie une nouvelle offre d'emploi.
              </p>
              <div className="relative z-10">
                <Button fullWidth variant="white" size="sm" leftIcon={<Bell className="w-4 h-4" />}>
                  Créer une alerte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
