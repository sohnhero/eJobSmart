import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, Zap, CheckCircle, Trophy } from 'lucide-react'
import Button from '../components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#011847' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <Link to="/" className="flex items-center mb-12">
            <img src="/logo-eureka-job.png" alt="Eureka Job" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <h1 className="text-4xl font-heading font-black text-white leading-tight mb-4">
            Mot de passe<br />oublié ?
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            Ne vous inquiétez pas ! Saisissez votre adresse email et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe en quelques secondes.
          </p>

          {/* Interactive Graphic */}
          <div className="relative mt-12 w-full h-[320px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-35 blur-3xl bg-gradient-to-tr from-cyan-400 to-brand-500 pointer-events-none" />
            
            <div className="absolute w-72 bg-white/10 backdrop-blur-lg border border-white/15 rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition-all duration-300 select-none text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-cyan-300" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Lien de réinitialisation</h4>
              <p className="text-xs text-blue-200 leading-relaxed">
                Entrez votre adresse email de connexion pour recevoir des instructions claires et sécurisées.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200">
          <span>&copy; {new Date().getFullYear()} Eureka Job. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link to="/legal" className="hover:underline">Mentions légales</Link>
            <Link to="/faq" className="hover:underline">Aide</Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-100 bg-white shadow-sm rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-100 hover:shadow transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
          </div>

          {/* Desktop Top Link */}
          <div className="hidden lg:flex justify-between items-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 bg-white shadow-sm rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-100 hover:shadow transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
          </div>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Mot de passe oublié</h2>
              <p className="text-slate-500 text-sm mb-8">Saisissez votre email pour réinitialiser votre accès</p>

              <form onSubmit={handleResetRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Envoyer le lien de récupération
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-8">
                Vous vous en souvenez ?{' '}
                <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-800">Se connecter</Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Vérifiez vos emails</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Si un compte existe pour <span className="font-semibold text-slate-800">{email}</span>, nous y avons envoyé des instructions pour créer un nouveau mot de passe.
              </p>

              <Link to="/login">
                <Button fullWidth size="lg">
                  Retourner à la connexion
                </Button>
              </Link>

              <p className="text-xs text-slate-400 mt-6 leading-relaxed">
                Vous n'avez rien reçu ? Vérifiez votre dossier indésirable (spams) ou{' '}
                <button onClick={() => setSubmitted(false)} className="text-brand-600 hover:underline font-semibold">réessayez</button>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
