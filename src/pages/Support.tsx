import {
  HelpCircle, Search, MessageSquare, Mail,
  Phone, Globe, ExternalLink, ChevronRight,
  BookOpen, Video, FileText, Zap,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'

export default function Support() {
  const categories = [
    { title: 'Candidats', icon: <FileText className="w-6 h-6" />, count: 42, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Entreprises', icon: <Building2 className="w-6 h-6" />, count: 35, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Freelances', icon: <Zap className="w-6 h-6" />, count: 24, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Abonnements', icon: <Star className="w-6 h-6" />, count: 18, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const faqs = [
    'Comment créer un compte candidat ?',
    'Comment booster mon offre d\'emploi ?',
    'Quels sont les modes de paiement acceptés ?',
    'Comment obtenir mon certificat de formation ?',
    'Comment supprimer mon compte ?',
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-6">Comment pouvons-nous vous aider ?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une solution, un article..."
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white text-slate-900 text-lg shadow-2xl shadow-black/20 outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-hero-pattern" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-10 relative z-20">
        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map(cat => (
            <div key={cat.title} className="card p-8 text-center hover:-translate-y-1 transition-all cursor-pointer group">
              <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.title}</h3>
              <p className="text-sm text-slate-500">{cat.count} articles</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main: FAQs */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Questions populaires</h2>
              <div className="space-y-3">
                {faqs.map(q => (
                  <div key={q} className="card p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">{q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 border-l-4 border-l-blue-500">
                <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Guides Utilisateurs</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Découvrez toutes les fonctionnalités d'eJobSmart avec nos guides détaillés étape par étape.</p>
                <button className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">Lire les guides <ArrowRight className="w-3 h-3" /></button>
              </div>
              <div className="card p-6 border-l-4 border-l-purple-500">
                <Video className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Tutoriels Vidéo</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Apprenez en images comment optimiser votre profil ou vos recrutements sur la plateforme.</p>
                <button className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">Voir les vidéos <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          </div>

          {/* Sidebar: Contact */}
          <div className="space-y-6">
            <div className="card p-8 bg-white border-2 border-brand-100 relative overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Encore besoin d'aide ?</h3>
              <p className="text-sm text-slate-500 mb-8 relative z-10">Notre équipe support est disponible du lundi au vendredi, de 8h à 18h (GMT).</p>
              <div className="space-y-4 relative z-10">
                <Button fullWidth leftIcon={<MessageSquare className="w-4 h-4" />}>Démarrer un chat</Button>
                <Button fullWidth variant="secondary" leftIcon={<Mail className="w-4 h-4" />}>Envoyer un email</Button>
              </div>
              <HelpCircle className="absolute -bottom-8 -right-8 w-32 h-32 text-brand-50 opacity-50" />
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Nous contacter en direct</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Phone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-slate-400">Téléphone</p>
                    <p className="text-sm font-bold text-slate-800">+221 33 800 00 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-slate-400">Siège social</p>
                    <p className="text-sm font-bold text-slate-800">Dakar Plateau, Sénégal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

import { Building2, Star, ArrowRight } from 'lucide-react'
