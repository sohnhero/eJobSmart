import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react'
import Logo from '../ui/Logo'

const footerLinks = {
  Platform: [
    { label: 'Offres d\'emploi', href: '/jobs' },
    { label: 'Formations RH', href: '/trainings' },
    { label: 'Base CV', href: '/cv-database' },
    { label: 'Entreprises', href: '/companies' },
    { label: 'Cabinets RH', href: '/agencies' },
  ],
  Services: [
    { label: 'Publier une offre', href: '/post-job' },
    { label: 'Plans & Tarifs', href: '/pricing' },
    { label: 'Recrutement express', href: '/express' },
    { label: 'API Partenaires', href: '/api' },
  ],
  Légal: [
    { label: 'À propos', href: '/about' },
    { label: 'CGU', href: '/terms' },
    { label: 'Confidentialité', href: '/privacy' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <Logo variant="full" size={36} inverted />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm">
              La plateforme RH & Marketplace d'Emploi de référence en Afrique de l'Ouest. Nous connectons talents, entreprises et cabinets RH pour des recrutements plus efficaces.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:contact@ejobsmart.sn" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                contact@ejobsmart.sn
              </a>
              <a href="tel:+221338600000" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +221 33 860 00 00
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Plateau, Dakar, Sénégal
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2026 eJobSmart. Tous droits réservés. Plateforme développée par INENI.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">CGU</Link>
            <Link to="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
