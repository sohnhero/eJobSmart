import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, TrendingUp, Users, Briefcase, Award,
  ArrowRight, CheckCircle, Star, Building2, GraduationCap,
  Zap, Shield, Clock, ChevronRight, Play, Laptop, Landmark,
  Stethoscope, HardHat, Sprout, Hotel, Truck, Megaphone,
  ShoppingCart, Scale, Palette, Home, Leaf, Building, User
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
      <p className="text-3xl md:text-4xl font-black text-white">
        {count.toLocaleString('fr-FR')}{suffix}
      </p>
      <p className="text-sm text-blue-200 mt-1 font-medium">{label}</p>
    </div>
  )
}

const testimonials = [
  {
    name: 'Fatou Mbaye', role: 'DRH, Sonatel', avatar: 'FM',
    text: 'eJobSmart a transformé notre processus de recrutement. Nous avons réduit notre délai moyen d\'embauche de 45 à 18 jours grâce au matching intelligent.',
    stars: 5, color: 'bg-brand-600',
  },
  {
    name: 'Ibrahima Diop', role: 'Développeur Senior', avatar: 'ID',
    text: 'J\'ai trouvé mon poste actuel en moins de 2 semaines. Les recommandations personnalisées sont vraiment pertinentes par rapport à mon profil.',
    stars: 5, color: 'bg-purple-600',
  },
  {
    name: 'Aminata Sow', role: 'Directrice, Cabinet RH Excellence', avatar: 'AS',
    text: 'La plateforme nous permet de gérer efficacement notre portefeuille de 200+ candidats et de répondre rapidement aux offres de nos clients entreprises.',
    stars: 5, color: 'bg-emerald-600',
  },
]

const features = [
  {
    icon: Zap, title: 'Matching Intelligent', color: 'text-amber-500', bg: 'bg-amber-50',
    desc: 'Notre algorithme analyse 6 critères pour calculer un score de compatibilité entre votre profil et les offres.',
  },
  {
    icon: Shield, title: 'Profils vérifiés', color: 'text-brand-600', bg: 'bg-brand-50',
    desc: 'Chaque entreprise et cabinet RH est vérifié manuellement (NINEA, RC, agréments) avant de pouvoir publier.',
  },
  {
    icon: Clock, title: 'Recrutement rapide', color: 'text-emerald-600', bg: 'bg-emerald-50',
    desc: 'Délai moyen de placement de 18 jours. Notifications en temps réel à chaque étape du processus.',
  },
  {
    icon: GraduationCap, title: 'Formations certifiantes', color: 'text-purple-600', bg: 'bg-purple-50',
    desc: 'Un catalogue de formations RH et métiers pour booster votre employabilité ou former vos équipes.',
  },
]

const howItWorks = {
  candidate: [
    { step: '01', title: 'Créez votre profil', desc: 'Inscription en 3 minutes, importez votre LinkedIn ou CV PDF' },
    { step: '02', title: 'Recevez des recommandations', desc: 'L\'algorithme vous propose les offres les plus adaptées à votre profil' },
    { step: '03', title: 'Postulez en 1 clic', desc: 'Suivez vos candidatures en temps réel et échangez avec les recruteurs' },
  ],
  company: [
    { step: '01', title: 'Publiez votre offre', desc: 'Formulaire complet en 10 minutes, diffusion immédiate sur la plateforme' },
    { step: '02', title: 'Recevez les meilleurs profils', desc: 'Les candidats sont scorés automatiquement selon vos critères' },
    { step: '03', title: 'Gérez le recrutement', desc: 'Kanban des candidatures, messagerie intégrée, planification d\'entretiens' },
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
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-blue-200 border border-white/10">
              La plateforme RH #1 en Afrique de l'Ouest
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Connectez talents &amp;
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                opportunités
              </span>
              {' '}en Afrique
            </h1>
            <p className="mt-5 text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
              Marketplace RH qui réunit entreprises, cabinets de recrutement et talents.
              Trouvez le bon poste ou le bon profil en quelques clics.
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
                  className="flex-1 text-slate-800 placeholder-slate-400 outline-none text-sm"
                />
              </div>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-l border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ville ou pays..."
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="w-36 text-slate-800 placeholder-slate-400 outline-none text-sm"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="rounded-xl">
                Rechercher
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
              <span className="text-xs text-blue-300">Tendances :</span>
              {['React Developer', 'DRH', 'Data Analyst', 'Chef de projet', 'Télétravail'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setSearchQuery(tag); handleSearch() }}
                  className="text-xs px-3 py-1.5 bg-white/10 text-blue-200 rounded-full hover:bg-white/20 transition-colors border border-white/10"
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

      {/* ========== SECTORS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Secteurs</span>
            <h2 className="section-title mt-2">Explorez par secteur d'activité</h2>
            <p className="section-subtitle">18 secteurs d'activité couverts à travers toute l'Afrique de l'Ouest</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topSectors.map(sector => (
              <button
                key={sector.id}
                onClick={() => navigate(`/jobs?sector=${sector.slug}`)}
                className="group card card-premium card-hover-premium p-4 text-center cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: sector.color + '15' }}
                >
                  <SectorIcon name={sector.icon} className="w-6 h-6" style={{ color: sector.color }} />
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{sector.name}</p>
                <p className="text-xs text-slate-400 mt-1">{sector.count} offres</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="secondary" onClick={() => navigate('/jobs')}>
              Voir toutes les offres <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ========== FEATURED JOBS ========== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Offres vedettes</span>
              <h2 className="section-title mt-2">Opportunités en vedette</h2>
              <p className="section-subtitle">Sélectionnées par notre équipe pour leur qualité et leur pertinence</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/jobs')} className="hidden md:flex">
              Toutes les offres <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="card card-premium card-hover-premium p-6 cursor-pointer relative group"
              >
                {/* Featured Badge */}
                {job.isBoosted && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="amber" size="sm" className="bg-amber-50 text-amber-700 border border-amber-100/50 backdrop-blur-sm flex items-center gap-1.5 px-3 shadow-sm">
                      <Zap className="w-3 h-3 fill-amber-500" /> En vedette
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2.5 flex-shrink-0 group-hover:shadow-md transition-shadow">
                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                  </div>
                  <div className={`min-w-0 pt-1 ${job.isBoosted ? 'pr-20' : ''}`}>
                    <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <ContractBadge type={job.contractType} />
                  <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100">{job.remoteType}</Badge>
                  <Badge variant="blue" className="bg-blue-50 text-blue-600 border border-blue-100">{job.experienceLevel}</Badge>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium truncate">{job.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{job.applicants} candidats</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-50 relative">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salaire annuel</p>
                    <p className="text-sm font-bold text-slate-900">
                      {job.salaryMin.toLocaleString('fr-FR')} — {job.salaryMax.toLocaleString('fr-FR')} <span className="text-slate-400 text-[10px] font-medium">{job.currency}</span>
                    </p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Pourquoi eJobSmart</span>
            <h2 className="section-title mt-2">La plateforme conçue pour l'Afrique</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Des fonctionnalités pensées pour les réalités du marché du travail africain, avec une technologie de niveau international.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6 group hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Fonctionnement</span>
            <h2 className="section-title mt-2">Simple, rapide, efficace</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {(['candidate', 'company'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                  }`}
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
                <div className="card p-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-black text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
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
      <section className="py-16 bg-gradient-to-r from-brand-700 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
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
              <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Formations</span>
              <h2 className="section-title mt-2">Formations RH & Métiers</h2>
              <p className="section-subtitle">Développez vos compétences avec nos experts certifiés</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/trainings')} className="hidden md:flex">
              Voir le catalogue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <span className="text-xs font-bold text-white drop-shadow-md">{training.instructor}</span>
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
                    <Badge variant="slate" size="sm" className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                      {training.level}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RH & Management</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {training.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-900 ml-1">{training.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">({training.reviewCount})</span>
                    </div>
                    <div className="text-right">
                      {training.price === 0 ? (
                        <span className="text-sm font-black text-emerald-600">Gratuit</span>
                      ) : (
                        <span className="text-sm font-black text-slate-900">
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

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase">Témoignages</span>
            <h2 className="section-title mt-2">Ils nous font confiance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Prêt à transformer votre parcours professionnel ?
          </h2>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Rejoignez 34 000+ professionnels qui font confiance à eJobSmart pour leurs recrutements et leur développement de carrière.
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
            <Button
              size="xl"
              className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20"
              onClick={() => navigate('/register?type=company')}
            >
              <Briefcase className="w-5 h-5" />
              Je recrute
            </Button>
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
