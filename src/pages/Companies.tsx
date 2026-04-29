import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Users, Briefcase, Star, Globe, Filter, X, Building2, TrendingUp } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const sizes = ['TPE (1-10)', 'PME (10-250)', 'ETI (250-5000)', 'Grand groupe (5000+)']
const sectors = ['Technologie & Numérique', 'Banque & Finance', 'Santé & Pharmatique', 'BTP & Immobilier', 'Télécommunications', 'ONG & Humanitaire', 'Juridique & Conseil']

const companiesData = [
  { id: 1, name: 'Sonatel Digital', logo: 'https://ui-avatars.com/api/?name=Sonatel&background=2563eb&color=fff&size=128', sector: 'Télécommunications', size: 'Grand groupe (5000+)', country: 'SN', city: 'Dakar', openJobs: 8, rating: 4.7, reviews: 234, description: 'Filiale digitale du groupe Sonatel (Orange), leader des télécoms au Sénégal. Nous développons des solutions numériques innovantes pour l\'Afrique.', tags: ['Tech', 'Innovation', 'Afrique'], verified: true },
  { id: 2, name: 'Wave Mobile Money', logo: 'https://ui-avatars.com/api/?name=Wave&background=0891b2&color=fff&size=128', sector: 'Technologie & Numérique', size: 'ETI (250-5000)', country: 'SN', city: 'Dakar', openJobs: 15, rating: 4.9, reviews: 312, description: 'Wave est la super-app financière qui révolutionne les transferts d\'argent et les paiements en Afrique de l\'Ouest.', tags: ['Fintech', 'Mobile', 'Scale-up'], verified: true },
  { id: 3, name: 'Ecobank Sénégal', logo: 'https://ui-avatars.com/api/?name=Ecobank&background=7c3aed&color=fff&size=128', sector: 'Banque & Finance', size: 'Grand groupe (5000+)', country: 'SN', city: 'Dakar', openJobs: 5, rating: 4.4, reviews: 198, description: 'Ecobank est l\'une des plus grandes banques panafricaines, présente dans 33 pays africains.', tags: ['Banking', 'Finance', 'Panafricain'], verified: true },
  { id: 4, name: 'Clinique du Plateau', logo: 'https://ui-avatars.com/api/?name=Clinique&background=059669&color=fff&size=128', sector: 'Santé & Pharmatique', size: 'PME (10-250)', country: 'CI', city: 'Abidjan', openJobs: 3, rating: 4.6, reviews: 87, description: 'Établissement de santé privé de référence à Abidjan, offrant des soins de haute qualité.', tags: ['Santé', 'Clinique', 'Premium'], verified: true },
  { id: 5, name: 'Groupe Cogim', logo: 'https://ui-avatars.com/api/?name=Cogim&background=d97706&color=fff&size=128', sector: 'BTP & Immobilier', size: 'ETI (250-5000)', country: 'SN', city: 'Dakar', openJobs: 7, rating: 4.2, reviews: 143, description: 'Leader du BTP et de la promotion immobilière en Afrique de l\'Ouest.', tags: ['BTP', 'Construction', 'Immobilier'], verified: true },
  { id: 6, name: 'UNICEF Sénégal', logo: 'https://ui-avatars.com/api/?name=UNICEF&background=009edb&color=fff&size=128', sector: 'ONG & Humanitaire', size: 'Grand groupe (5000+)', country: 'SN', city: 'Dakar', openJobs: 4, rating: 4.8, reviews: 267, description: 'L\'UNICEF travaille dans 190 pays pour défendre les droits des enfants et améliorer leurs conditions de vie.', tags: ['ONG', 'Humanitaire', 'International'], verified: true },
  { id: 7, name: 'InnoTech Africa', logo: 'https://ui-avatars.com/api/?name=InnoTech&background=be185d&color=fff&size=128', sector: 'Technologie & Numérique', size: 'PME (10-250)', country: 'SN', city: 'Dakar', openJobs: 6, rating: 4.5, reviews: 92, description: 'Studio tech africain spécialisé en produits digitaux pour les marchés émergents.', tags: ['Startup', 'Design', 'Product'], verified: false },
  { id: 8, name: 'Cabinet GENI & Associés', logo: 'https://ui-avatars.com/api/?name=GENI&background=374151&color=fff&size=128', sector: 'Juridique & Conseil', size: 'PME (10-250)', country: 'SN', city: 'Dakar', openJobs: 2, rating: 4.7, reviews: 56, description: 'Cabinet d\'avocats d\'affaires de premier plan, expert en droit OHADA et transactions M&A.', tags: ['Juridique', 'OHADA', 'M&A'], verified: true },
  { id: 9, name: 'Orange Sénégal', logo: 'https://ui-avatars.com/api/?name=Orange&background=ea580c&color=fff&size=128', sector: 'Télécommunications', size: 'Grand groupe (5000+)', country: 'SN', city: 'Dakar', openJobs: 12, rating: 4.3, reviews: 445, description: 'Opérateur télécom leader au Sénégal, avec un vaste réseau 4G et des services digitaux innovants.', tags: ['Telecom', 'Digital', 'Leader'], verified: true },
  { id: 10, name: 'PricewaterhouseCoopers Dakar', logo: 'https://ui-avatars.com/api/?name=PwC&background=d03009&color=fff&size=128', sector: 'Juridique & Conseil', size: 'Grand groupe (5000+)', country: 'SN', city: 'Dakar', openJobs: 9, rating: 4.6, reviews: 312, description: 'PwC est l\'un des Big Four de l\'audit et du conseil, présent à Dakar depuis 1992.', tags: ['Audit', 'Conseil', 'BigFour'], verified: true },
  { id: 11, name: 'SAED Sénégal', logo: 'https://ui-avatars.com/api/?name=SAED&background=15803d&color=fff&size=128', sector: 'BTP & Immobilier', size: 'PME (10-250)', country: 'SN', city: 'Saint-Louis', openJobs: 3, rating: 4.1, reviews: 43, description: 'Société d\'Aménagement et d\'Exploitation des terres du Delta, spécialisée en agriculture irriguée.', tags: ['Agriculture', 'Développement', 'Rural'], verified: true },
  { id: 12, name: 'Expresso Sénégal', logo: 'https://ui-avatars.com/api/?name=Expresso&background=dc2626&color=fff&size=128', sector: 'Télécommunications', size: 'ETI (250-5000)', country: 'SN', city: 'Dakar', openJobs: 4, rating: 4.0, reviews: 128, description: 'Opérateur télécom alternatif au Sénégal, avec un réseau fibre et mobile en expansion.', tags: ['Telecom', 'Fibre', 'Mobile'], verified: true },
]

export default function Companies() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    return companiesData.filter(c => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.sector.toLowerCase().includes(query.toLowerCase())) return false
      if (selectedSector && c.sector !== selectedSector) return false
      if (selectedSize && c.size !== selectedSize) return false
      if (verifiedOnly && !c.verified) return false
      return true
    })
  }, [query, selectedSector, selectedSize, verifiedOnly])

  const totalJobs = companiesData.reduce((a, c) => a + c.openJobs, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-700 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-blue-300 tracking-wider uppercase">Entreprises</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-3">
            Les meilleures entreprises recrutent ici
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            {companiesData.length}+ entreprises vérifiées · {totalJobs} postes ouverts
          </p>
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-lg mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text" placeholder="Entreprise, secteur..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
              {query && <button onClick={() => setQuery('')}><X className="w-4 h-4 text-slate-400" /></button>}
            </div>
            <Button size="sm" className="rounded-xl">Rechercher</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Secteur :</span>
            <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none">
              <option value="">Tous</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Taille :</span>
            <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none">
              <option value="">Toutes</option>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <div
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-9 h-5 rounded-full transition-colors relative ${verifiedOnly ? 'bg-brand-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">Vérifiées seulement</span>
          </label>
        </div>

        {/* Results */}
        <p className="text-sm text-slate-500 mb-5">
          <span className="font-semibold text-slate-900">{filtered.length}</span> entreprise{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(company => (
            <div
              key={company.id}
              className="card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200 group"
              onClick={() => navigate(`/jobs?company=${company.name}`)}
            >
              <div className="flex items-start gap-3 mb-4">
                <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors truncate">{company.name}</h3>
                    {company.verified && (
                      <span className="text-brand-600 flex-shrink-0" title="Entreprise vérifiée">
                        <svg className="w-4 h-4 fill-brand-600" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none" /><circle cx="12" cy="12" r="12" className="fill-brand-600" /><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{company.sector}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{company.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {company.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{t}</span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Briefcase className="w-3 h-3 text-brand-600" />
                    <span className="text-sm font-bold text-slate-900">{company.openJobs}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">postes</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{company.rating}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{company.reviews} avis</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{company.country}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{company.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mb-2">Aucune entreprise trouvée</h3>
            <p className="text-sm text-slate-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-center text-white">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Vous êtes une entreprise qui recrute ?</h2>
          <p className="text-blue-200 text-sm mb-5">Rejoignez eJobSmart et accédez à notre vivier de 34 000+ candidats qualifiés.</p>
          <Button variant="white" size="lg" onClick={() => navigate('/register?type=company')}>
            Inscrire mon entreprise gratuitement
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
