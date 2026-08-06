import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Headphones, Building2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { contactService } from '../lib/services/contact'
import { extractApiErrorMessage } from '../lib/api'

const contactReasons = [
  'Demande d\'information générale',
  'Problème technique',
  'Demande de partenariat',
  'Signaler un contenu',
  'Facturation / Abonnement',
  'Autre',
]

const contactChannels = [
  {
    icon: Mail,
    title: 'Email',
    desc: 'contact@eureka-jobs.com',
    action: 'Envoyer un email',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    desc: '+221 33 860 00 00',
    action: 'Appeler maintenant',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: Headphones,
    title: 'Support dédié',
    desc: 'Pour les comptes Premium & Entreprise',
    action: 'Accéder au support',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
]

export default function Contact() {
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', company: '', reason: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChannelClick = (title: string) => {
    switch (title) {
      case 'Email':
        window.location.href = 'mailto:contact@eureka-jobs.com'
        break
      case 'Téléphone':
        window.location.href = 'tel:+221338600000'
        break
      case 'Support dédié':
        navigate('/support')
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await contactService.submit(form)
      setSent(true)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer votre message. Réessayez ou contactez-nous par téléphone."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #0F1E3A 0%, #0F3B95 60%, #2563EB 100%)' }}>
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: '#39D5F4' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: '#2563EB' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border border-cyan-400/30" style={{ backgroundColor: 'rgba(57,213,244,0.1)', color: '#39D5F4' }}>
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mt-4 mb-4 tracking-tight">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
            Notre équipe est disponible du lundi au vendredi, de 8h à 18h (GMT). Choisissez le canal qui vous convient.
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0 pointer-events-none">
          <svg className="w-full block" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC" stroke="#F8FAFC" strokeWidth="1" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {contactChannels.map(ch => (
            <button
              key={ch.title}
              type="button"
              onClick={() => handleChannelClick(ch.title)}
              className={`card p-5 border-2 ${ch.border} hover:-translate-y-1 transition-all duration-200 cursor-pointer group text-left w-full`}
            >
              <div className={`w-11 h-11 rounded-2xl ${ch.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <ch.icon className={`w-5 h-5 ${ch.color}`} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{ch.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{ch.desc}</p>
              <span className={`text-xs font-semibold ${ch.color}`}>{ch.action} →</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Envoyer un message</h2>
              <p className="text-sm text-slate-500 mb-6">Remplissez le formulaire, nous répondons sous 24h ouvrées.</p>

              {sent ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Message envoyé !</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                  </p>
                  <Button variant="secondary" onClick={() => setSent(false)}>Envoyer un autre message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom complet *</label>
                      <input
                        type="text" required
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Amadou Diallo"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                      <input
                        type="email" required
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="amadou@email.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Entreprise / Organisation</label>
                    <input
                      type="text"
                      value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                      placeholder="Nom de votre entreprise (optionnel)"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Objet de votre demande *</label>
                    <select required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="input-field">
                      <option value="">Sélectionner un objet</option>
                      {contactReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      required rows={5}
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Décrivez votre demande en détail..."
                      className="input-field resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" fullWidth loading={loading} rightIcon={<Send className="w-4 h-4" />}>
                    Envoyer le message
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Info sidebar */}
          <div className="space-y-5">
            {/* Office info */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-brand-600" />
                <h3 className="font-semibold text-slate-900">Siège social</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Plateau, Dakar</p>
                    <p className="text-slate-400">Avenue Léopold Sédar Senghor<br />BP 3456, Dakar, Sénégal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="tel:+221338600000" className="hover:text-brand-600 transition-colors">+221 33 860 00 00</a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="mailto:contact@eureka-jobs.com" className="hover:text-brand-600 transition-colors">contact@eureka-jobs.com</a>
                </div>
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Heures d'ouverture</p>
                    <p className="text-slate-400">Lun–Ven : 8h00–18h00 GMT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="card overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Plateau, Dakar, Sénégal</p>
                  <p className="text-xs text-slate-400 mt-1">Carte interactive</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="https://maps.google.com/?q=Plateau,Dakar,Senegal"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-brand-600 font-medium hover:text-brand-800 transition-colors"
                >
                  Ouvrir dans Google Maps →
                </a>
              </div>
            </div>

            {/* FAQ CTA */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-1">Consultez notre FAQ</h3>
              <p className="text-sm text-blue-200 mb-4">Trouvez des réponses aux questions les plus fréquentes.</p>
              <Button variant="white" size="sm" fullWidth onClick={() => window.open('/faq')}>
                Accéder à la FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
