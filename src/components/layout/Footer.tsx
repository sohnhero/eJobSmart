import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Globe } from 'lucide-react'

const footerLinks = {
  Plateforme: [
    { label: 'Offres d\'emploi', href: '/jobs' },
    { label: 'Formations', href: '/trainings' },
    { label: 'Base CV', href: '/cv-database' },
    { label: 'Entreprises', href: '/companies' },
    { label: 'Cabinets RH', href: '/agencies' },
  ],
  Services: [
    { label: 'Intérim & Placement', href: '/post-job' },
    { label: 'Plans & Tarifs', href: '/pricing' },
    { label: 'Conseil RH', href: '/contact' },
    { label: 'Recrutement express', href: '/express' },
    { label: 'API Partenaires', href: '/api' },
  ],
  Légal: [
    { label: 'À propos', href: '/about' },
    { label: 'CGU', href: '/legal' },
    { label: 'Confidentialité', href: '/legal' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-slate-300" style={{ backgroundColor: '#0F1E3A' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center mb-3 sm:mb-4">
              <img src="/logo-eureka-job.png" alt="Eureka Job | Talents &amp; Advisory" className="h-8 sm:h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-2 max-w-sm italic font-heading hidden sm:block" style={{ color: '#39D5F4' }}>
              "Révélateur de talents. Créateur de valeurs."
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 max-w-sm hidden sm:block">
              La marketplace RH de référence en Afrique. Nous connectons talents, entreprises et cabinets RH pour des recrutements plus intelligents.
            </p>
            <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-sm">
              <a href="mailto:bdiop@eurekajob.africa" className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                bdiop@eurekajob.africa
              </a>
              <a href="tel:+221772207515" className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                +221 77 220 75 15
              </a>
              <a href="https://www.eurekajob.africa" className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                www.eurekajob.africa
              </a>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                Dakar, Sénégal
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="font-heading font-semibold text-white text-xs sm:text-sm mb-2 sm:mb-3">{title}</h3>
              <ul className="space-y-1 sm:space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-[11px] sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors">
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
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-[9px] sm:text-xs text-slate-500 text-center sm:text-left">
            © 2026 Eureka Job | Talents & Advisory. Tous droits réservés.
          </p>
          <p className="text-[9px] sm:text-xs font-heading font-medium hidden sm:block" style={{ color: '#39D5F4' }}>
            Connecter les talents. Conseiller l'avenir.
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-xs text-slate-500">
            <Link to="/legal" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link to="/legal" className="hover:text-slate-300 transition-colors">CGU</Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
