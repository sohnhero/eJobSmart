import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, TrendingUp, Users, Briefcase, Award,
  ArrowRight, CheckCircle, Star, Building2, GraduationCap,
  Zap, Shield, Clock, ChevronRight, Laptop, Landmark,
  Stethoscope, HardHat, Sprout, Hotel, Truck, Megaphone,
  ShoppingCart, Scale, Palette, Home, Leaf, Building, User,
  Handshake, BarChart3, Globe, BookOpen
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { ContractBadge } from '../components/ui/Badge'
import { sectors } from '../data/sectors'
import { jobs } from '../data/jobs'
import { trainings } from '../data/trainings'
import { platformStats } from '../data/stats'

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [start, target, duration])
  return count
}

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(value, 1800, visible)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-heading font-black text-white">
        {count.toLocaleString('fr-FR')}{suffix}
      </p>
      <p className="text-sm mt-1 font-medium" style={{ color: '#39D5F4' }}>{label}</p>
    </div>
  )
}

const testimonials = [
  {
    name: 'Fatou Mbaye', role: 'DRH, Sonatel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    text: "Eureka Job a transformé notre processus de recrutement. Nous avons réduit notre délai moyen d'embauche de 45 à 18 jours grâce au matching intelligent et à la réactivité des équipes.",
    stars: 5, color: '#39D5F4'
  },
  {
    name: 'Ibrahima Diop', role: 'Développeur Senior, Dakar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    text: "J'ai trouvé mon poste de Lead Dev en moins de 2 semaines. Les recommandations personnalisées de l'algorithme sont d'une pertinence incroyable par rapport à mon profil.",
    stars: 5, color: '#2563EB'
  },
  {
    name: 'Aminata Sow', role: 'Directrice, Cabinet RH Excellence',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    text: "La marketplace nous permet de gérer efficacement nos viviers de candidats et de répondre rapidement aux besoins de nos clients entreprises avec des profils pré-qualifiés.",
    stars: 5, color: '#10B981'
  },
]

const features = [
  {
    icon: Zap, title: 'Matching Intelligent', color: 'text-brand-600', bg: 'bg-brand-50', borderColor: 'border-brand-100',
    gradient: 'from-brand-500/10 to-blue-500/10',
    desc: 'Notre algorithme analyse 6 critères pour calculer un score de compatibilité entre votre profil et les offres disponibles.',
  },
  {
    icon: Shield, title: 'Profils vérifiés', color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    desc: 'Chaque entreprise et cabinet RH est vérifié manuellement (NINEA, RC, agréments) avant de pouvoir publier des offres.',
  },
  {
    icon: Clock, title: 'Recrutement rapide', color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-100',
    gradient: 'from-purple-500/10 to-pink-500/10',
    desc: 'Délai moyen de placement de 18 jours. Notifications en temps réel à chaque étape du processus de recrutement.',
  },
  {
    icon: Handshake, title: 'Conseil RH Expert', color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-100',
    gradient: 'from-amber-500/10 to-orange-500/10',
    desc: 'Des experts RH vous accompagnent : audit, stratégie de recrutement, conformité droit du travail sénégalais.',
  },
]

// 6 lignes de service prioritaires Eureka Job
const services = [
  {
    icon: Briefcase, title: 'Agence Intérim', desc: 'Placement de travailleurs temporaires dans le BTP, hôtellerie, industrie et services.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Globe, title: 'Marketplace RH', desc: 'Plateforme multi-acteurs : entreprises, cabinets, freelances et candidats sur un seul espace.',
    gradient: 'from-brand-500 to-blue-700',
  },
  {
    icon: Search, title: 'Offres d\'Emploi', desc: 'CDI, CDD, interim, freelance, stage et alternance. La source d\'offres la plus complète du Sénégal.',
    gradient: 'from-blue-500 to-brand-700',
  },
  {
    icon: Users, title: 'Base CV & Talents', desc: 'Vivier de 500 000+ profils vérifiés. Recherche et filtrage avancés pour les recruteurs.',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    icon: BookOpen, title: 'Formation & E-Learning', desc: 'Programmes certifiants en RH, management et compétences numériques pour booster l\'employabilité.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: BarChart3, title: 'Conseil RH', desc: 'Missions de conseil, audit organisationnel et accompagnement stratégique des DRH.',
    gradient: 'from-slate-500 to-slate-700',
  },
]

const howItWorks = {
  candidate: [
    { step: '01', title: 'Créez votre profil', desc: 'Inscription en 3 minutes, importez votre LinkedIn ou CV PDF. Identité vérifiée.' },
    { step: '02', title: 'Recevez des recommandations', desc: 'L\'algorithme vous propose les offres les plus adaptées à votre profil et vos critères.' },
    { step: '03', title: 'Postulez en 1 clic', desc: 'Suivez vos candidatures en temps réel et échangez directement avec les recruteurs.' },
  ],
  company: [
    { step: '01', title: 'Publiez votre offre', desc: 'Formulaire complet en 10 minutes, diffusion immédiate sur toute la plateforme.' },
    { step: '02', title: 'Recevez les meilleurs profils', desc: 'Les candidats sont scorés automatiquement selon vos critères de recrutement.' },
    { step: '03', title: 'Gérez le recrutement', desc: 'Kanban des candidatures, messagerie intégrée, planification d\'entretiens simplifiée.' },
  ],
}

const IconMap: Record<string, any> = {
  Laptop, Landmark, Stethoscope, HardHat, Sprout, Hotel,
  Truck, Zap, Megaphone, Users, ShoppingCart, Scale,
  Palette, Home, Leaf, Shield, Building
}

function SectorIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = IconMap[name] || Briefcase
  return <Icon className={className} style={style} />
}

export default function Landing() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [activeTab, setActiveTab] = useState<'candidate' | 'company'>('candidate')
  const featuredJobs = jobs.filter(j => j.isFeatured).slice(0, 6)
  const featuredTrainings = trainings.filter(t => t.isFeatured).slice(0, 3)
  const topSectors = sectors.slice(0, 12)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchLocation) params.set('location', searchLocation)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1E3A 0%, #0F3B95 60%, #2563EB 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ background: '#39D5F4' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: '#2563EB' }} />

        {/* Neon Strings Background Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <filter id="neon-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur1" />
                <feGaussianBlur stdDeviation="3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Radial gradient to fade out lines in the center content area */}
              <radialGradient id="center-fade" cx="50%" cy="45%" r="45%">
                <stop offset="0%" stop-color="#000" stop-opacity="1" />
                <stop offset="55%" stop-color="#000" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#000" stop-opacity="0" />
              </radialGradient>

              {/* Mask that applies the fade out */}
              <mask id="neon-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
                <rect x="0" y="0" width="100%" height="100%" fill="url(#center-fade)" />
              </mask>
            </defs>

            {/* Glowing neon strings - Masked to fade in the center */}
            <g mask="url(#neon-mask)">
              {/* Main sweeping base lines */}
              <path
                d="M-100,220 C350,450 800,100 1600,300"
                stroke="#39D5F4"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-string-1"
              />
              <path
                d="M-100,380 C400,150 900,600 1600,200"
                stroke="#39D5F4"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-string-2"
              />

              {/* Flowing animated pulse lines on top of the paths */}
              <path
                d="M-100,220 C350,450 800,100 1600,300"
                stroke="#39D5F4"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-flow-string-1"
                opacity="0.8"
              />
              <path
                d="M-100,380 C400,150 900,600 1600,200"
                stroke="#39D5F4"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-flow-string-2"
                opacity="0.8"
              />

              {/* Fine background details */}
              <path
                d="M-100,120 C500,400 1000,50 1600,480"
                stroke="#39D5F4"
                strokeWidth="1"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-string-2"
                opacity="0.4"
              />
              <path
                d="M-100,550 C300,700 950,250 1600,600"
                stroke="#39D5F4"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#neon-glow-cyan)"
                className="animate-neon-string-1"
                opacity="0.5"
              />
            </g>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-heading font-medium border" style={{ backgroundColor: 'rgba(57,213,244,0.1)', borderColor: 'rgba(57,213,244,0.3)', color: '#39D5F4' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#39D5F4' }} />
              La marketplace RH #1 en Afrique de l'Ouest
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white leading-tight tracking-tight">
              Révélateur de talents.{' '}
              <br className="hidden sm:block" />
              <span style={{ color: '#39D5F4' }}>Créateur de valeurs.</span>
            </h1>
            <p className="mt-6 text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
              Connectez entreprises, cabinets de recrutement et talents africains sur une plateforme
              numérique intelligente. Recrutez mieux. Évoluez plus vite.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Titre du poste, compétences, entreprise..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1 text-slate-800 placeholder-slate-400 outline-none text-sm font-sans"
                />
              </div>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-l border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ville ou pays..."
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="w-36 text-slate-800 placeholder-slate-400 outline-none text-sm font-sans"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="rounded-xl">
                Rechercher
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
              <span className="text-xs" style={{ color: 'rgba(57,213,244,0.8)' }}>Tendances :</span>
              {['DRH', 'Data Analyst', 'Chef de projet', 'Ingénieur BTP', 'Télétravail'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setSearchQuery(tag); handleSearch() }}
                  className="text-xs px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#C7DEFF', borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <AnimatedStat value={platformStats.totalJobs} label="Offres actives" suffix="+" />
            <AnimatedStat value={platformStats.activeCompanies} label="Entreprises" suffix="+" />
            <AnimatedStat value={platformStats.totalCandidates} label="Candidats inscrits" suffix="+" />
            <AnimatedStat value={platformStats.successfulPlacements} label="Placements réussis" suffix="+" />
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ========== SERVICES (nouvelles lignes Eureka Job) ========== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.025)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
              Nos Services
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
              L'écosystème RH{' '}
              <span style={{ color: '#2563EB' }}>Eureka Job</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              10 lignes de service pour couvrir tous vos besoins en ressources humaines, du recrutement à la formation en passant par le conseil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="group service-card cursor-pointer relative overflow-hidden">
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-heading font-bold text-slate-900 text-base leading-tight group-hover:text-brand-700 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-heading font-semibold text-brand-600 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTORS ========== */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 40%, #EEF2F6 100%)' }}>
        {/* Custom Brand Pattern (Connecting Arcs & RH Nodes) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.18 }} viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Sweeping advisory arcs */}
          <path d="M-100,200 C300,500 800,100 1600,400" stroke="#2563EB" strokeWidth="2" />
          <path d="M-100,215 C300,515 800,115 1600,415" stroke="#2563EB" strokeWidth="1" />
          <path d="M-100,230 C300,530 800,130 1600,430" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5, 10" />
          
          <path d="M-100,500 C400,200 1000,550 1600,150" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M-100,515 C400,215 1000,565 1600,165" stroke="#2563EB" strokeWidth="1" />

          {/* Connection Nodes (representing companies, candidates and cabinets) */}
          <circle cx="250" cy="380" r="6" fill="#2563EB" />
          <circle cx="250" cy="380" r="16" stroke="#2563EB" strokeWidth="1" opacity="0.5" />
          
          <circle cx="850" cy="240" r="8" fill="#2563EB" />
          <circle cx="850" cy="240" r="22" stroke="#2563EB" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 6" />

          <circle cx="1150" cy="420" r="4" fill="#2563EB" />
          <circle cx="1150" cy="420" r="12" stroke="#2563EB" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Soft glowing ambient spots */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-35 blur-[100px] pointer-events-none" style={{ backgroundColor: '#E6F2FF' }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-40 blur-[100px] pointer-events-none" style={{ backgroundColor: '#E6F2FF' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
              Secteurs d'activité
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
              Trouvez votre <span style={{ color: '#2563EB' }}>voie</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Explorez des opportunités dans 18 secteurs d'activité couverts à travers toute l'Afrique de l'Ouest.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topSectors.map(sector => (
              <button
                key={sector.id}
                onClick={() => navigate(`/jobs?sector=${sector.slug}`)}
                className="group relative h-44 w-full rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(15,30,58,0.3)] border border-slate-100 flex flex-col justify-end p-4 text-left"
              >
                {/* Background Image */}
                <img
                  src={sector.image}
                  alt={sector.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent transition-opacity duration-300 group-hover:from-slate-950/95" />

                {/* Content */}
                <div className="relative z-10 w-full">
                  <h3 className="text-xs sm:text-[13px] font-heading font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors drop-shadow-sm">
                    {sector.name}
                  </h3>
                  <span className="inline-block mt-1 text-[9px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
                    {sector.count} offres
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-2 font-heading font-semibold text-brand-600 hover:text-brand-800 transition-all group py-2 px-4 rounded-xl hover:bg-brand-50"
            >
              Voir tous les secteurs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ========== FEATURED JOBS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest" style={{ color: '#2563EB' }}>Offres vedettes</span>
              <h2 className="section-title mt-2">Opportunités en vedette</h2>
              <p className="section-subtitle">Sélectionnées par notre équipe pour leur qualité et leur pertinence</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/jobs')} className="hidden md:flex">
              Toutes les offres <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="card card-premium card-hover-premium p-6 cursor-pointer relative group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2.5 flex-shrink-0 group-hover:shadow-md transition-shadow">
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 pt-1">
                      <h3 className="font-heading font-bold text-slate-900 text-base leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                      </p>
                    </div>
                  </div>
                  {job.isBoosted && (
                    <div className="flex-shrink-0 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold shadow-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                        <Zap className="w-2.5 h-2.5" style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                        En vedette
                      </span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <ContractBadge type={job.contractType} />
                  <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100">{job.remoteType}</Badge>
                  <Badge variant="blue" className="bg-blue-50 text-blue-600 border border-blue-100">{job.experienceLevel}</Badge>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium truncate">{job.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium">{job.applicants} candidats</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-0.5">Salaire annuel</p>
                    <p className="text-sm font-heading font-bold text-slate-900">
                      {job.salaryMin.toLocaleString('fr-FR')} — {job.salaryMax.toLocaleString('fr-FR')} <span className="text-slate-400 text-[10px] font-medium">{job.currency}</span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="secondary" onClick={() => navigate('/jobs')}>
              Voir toutes les offres <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#F2F4F7' }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: '#E6F2FF' }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: '#C7E8FF' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
              L'Excellence Eureka Job
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 mt-2 tracking-tight">
              La plateforme conçue pour{' '}
              <span style={{ background: 'linear-gradient(90deg, #2563EB, #39D5F4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                l'Afrique
              </span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Des fonctionnalités innovantes pensées pour les réalités du marché local, propulsées par une technologie de pointe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white p-8 rounded-[32px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(15,30,58,0.08)] cursor-pointer flex flex-col justify-between"
                style={{ borderColor: '#E6F2FF' }}
              >

                <div>
                  {/* Glowing Icon Container */}
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative`}>
                    {/* Inner glass overlay */}
                    <div className="absolute inset-0.5 rounded-xl bg-white opacity-80" />
                    <feature.icon className={`w-6 h-6 ${feature.color} relative z-10`} />
                  </div>

                  <h3 className="text-base font-heading font-black text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>

                {/* Sleek bottom interactive link */}
                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between text-xs font-heading font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                  <span>En savoir plus</span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-heading font-bold uppercase tracking-widest" style={{ color: '#2563EB' }}>Fonctionnement</span>
            <h2 className="section-title mt-2">Simple, rapide, efficace</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {(['candidate', 'company'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all ${activeTab === tab
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                  }`}
                style={activeTab === tab ? { backgroundColor: '#2563EB' } : {}}
              >
                {tab === 'candidate' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {tab === 'candidate' ? 'Je cherche un emploi' : 'Je recrute'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {howItWorks[activeTab].map((step, i) => (
              <div key={step.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-brand-200 to-transparent -translate-x-4 z-0" />
                )}
                <div className="card p-6 relative z-10 hover:shadow-card-hover transition-shadow">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-heading font-black text-lg mb-4" style={{ background: 'linear-gradient(135deg, #2563EB, #0F1E3A)' }}>
                    {step.step}
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => navigate(activeTab === 'candidate' ? '/register?type=candidate' : '/register?type=company')}
            >
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ========== STATS BAND ========== */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1E3A 0%, #1A4FC0 100%)' }}>
        <div className="absolute inset-0 bg-hero-pattern" />
        {/* Cyan wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #39D5F4, transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: platformStats.avgTimeToHire, label: 'Jours pour recruter en moyenne', suffix: ' j' },
              { value: platformStats.totalAgencies, label: 'Cabinets RH partenaires', suffix: '+' },
              { value: platformStats.satisfactionRate, label: 'Taux de satisfaction client', suffix: '%' },
              { value: platformStats.totalTrainings, label: 'Formations disponibles', suffix: '+' },
            ].map((stat) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== TRAININGS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest" style={{ color: '#2563EB' }}>Formations</span>
              <h2 className="section-title mt-2">Formations RH & Métiers</h2>
              <p className="section-subtitle">Développez vos compétences avec nos experts certifiés</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/trainings')} className="hidden md:flex">
              Voir le catalogue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrainings.map(training => (
              <div
                key={training.id}
                onClick={() => navigate(`/trainings/${training.id}`)}
                className="card card-premium card-hover-premium overflow-hidden cursor-pointer group"
              >
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${training.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge variant={training.format === 'En ligne' ? 'blue' : training.format === 'Hybride' ? 'purple' : 'amber'} className="backdrop-blur-md bg-white/20 text-white border-white/30">
                      {training.format}
                    </Badge>
                    {training.price === 0 && (
                      <Badge variant="green" className="backdrop-blur-md bg-emerald-500/80 text-white border-emerald-400/50">
                        Gratuit
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden shadow-md">
                        <img src={`https://ui-avatars.com/api/?name=${training.instructor}&background=random`} alt={training.instructor} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-heading font-bold text-white drop-shadow-md">{training.instructor}</span>
                    </div>
                  </div>

                  {training.hasCertificate && (
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/30 shadow-lg">
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-heading font-bold uppercase tracking-wider border border-slate-100">
                      {training.level}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">•</span>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">RH & Management</span>
                  </div>

                  <h3 className="font-heading font-bold text-slate-900 text-base leading-snug mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {training.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-heading font-bold text-slate-900">{training.rating}</span>
                      <span className="text-xs text-slate-400">({training.reviewCount})</span>
                    </div>
                    <div className="text-right">
                      {training.price === 0 ? (
                        <span className="text-sm font-heading font-black text-emerald-600">Gratuit</span>
                      ) : (
                        <span className="text-sm font-heading font-black text-slate-900">
                          {training.price.toLocaleString('fr-FR')} <span className="text-[10px] font-bold text-slate-400">FCFA</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS (Dribbble/Behance Premium Light Showcase) ========== */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)' }}>
        {/* Soft glowing ambient spots */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-30 blur-[100px] pointer-events-none" style={{ backgroundColor: '#E6F2FF' }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-35 blur-[100px] pointer-events-none" style={{ backgroundColor: '#E6F2FF' }} />

        {/* Custom brand vector lines in background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100,300 C400,100 900,500 1600,200" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 8" />
          <path d="M-100,315 C400,115 900,515 1600,215" stroke="#39D5F4" strokeWidth="1.5" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
              Témoignages
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
              Ils bâtissent l'avenir avec <span style={{ color: '#2563EB' }}>nous</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base">
              Découvrez les retours d'expérience des talents, recruteurs et cabinets qui utilisent notre marketplace au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div 
                key={t.name} 
                className="group relative bg-white border border-slate-100 rounded-[32px] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(15,30,58,0.08)] flex flex-col justify-between"
              >
                {/* Large decorative quotation mark */}
                <span className="absolute top-4 right-6 text-7xl font-serif text-slate-100 group-hover:text-brand-100/40 select-none pointer-events-none transition-colors duration-300">
                  ”
                </span>

                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-[14px] sm:text-base text-slate-600 leading-relaxed mb-8 font-sans">
                    "{t.text}"
                  </p>
                </div>

                {/* User Info block */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-brand-500/50 flex-shrink-0 transition-colors duration-300">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-slate-900 text-[15px] truncate flex items-center gap-1.5">
                      {t.name}
                      <span className="inline-flex w-3.5 h-3.5 rounded-full bg-brand-50 text-brand-600 items-center justify-center text-[8px] font-bold">✓</span>
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0F1E3A 100%)' }}>
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#39D5F4' }} />
        <div className="absolute bottom-0 left-0 h-1 right-0" style={{ background: 'linear-gradient(90deg, #39D5F4, transparent)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
            Bâtissons l'avenir du travail{' '}
            <span style={{ color: '#39D5F4' }}>en Afrique</span>
          </h2>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Rejoignez 34 000+ professionnels qui font confiance à Eureka Job pour leurs recrutements et leur développement de carrière.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              variant="white"
              onClick={() => navigate('/register?type=candidate')}
            >
              <GraduationCap className="w-5 h-5" />
              Je cherche un emploi
            </Button>
            <button
              onClick={() => navigate('/register?type=company')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-semibold text-white transition-all duration-200 hover:bg-white/20 border-2"
              style={{ borderColor: 'rgba(57,213,244,0.5)', backgroundColor: 'rgba(57,213,244,0.1)' }}
            >
              <Briefcase className="w-5 h-5" />
              Je recrute
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-5 text-sm text-blue-200">
            {['Inscription gratuite', 'Aucune carte requise', 'Accès immédiat'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
