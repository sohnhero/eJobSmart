import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { authService } from '../lib/auth-service'
import { extractApiErrorMessage } from '../lib/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      setSuccess(true)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Lien invalide ou expiré, veuillez refaire une demande'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#011847' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <Link to="/" className="flex items-center mb-12">
            <img src="/logo-eureka-job.png" alt="Eureka Job" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>
          <h1 className="text-4xl font-heading font-black text-white leading-tight mb-4">
            Nouveau<br />mot de passe
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            Choisissez un mot de passe robuste pour sécuriser votre compte eJobSmart.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200">
          <span>&copy; {new Date().getFullYear()} Eureka Job. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link to="/legal" className="hover:underline">Mentions légales</Link>
            <Link to="/faq" className="hover:underline">Aide</Link>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-100 bg-white shadow-sm rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-100 hover:shadow transition-all duration-300 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-semibold">Retour à l'accueil</span>
            </Link>
          </div>

          {!token ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Lien invalide</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Ce lien de réinitialisation est incomplet. Refaites une demande depuis la page "Mot de passe oublié".
              </p>
              <Link to="/forgot-password">
                <Button fullWidth size="lg">Faire une nouvelle demande</Button>
              </Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Mot de passe mis à jour</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous reconnecter.
              </p>
              <Button fullWidth size="lg" onClick={() => navigate('/login')}>Se connecter</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Choisir un nouveau mot de passe</h2>
              <p className="text-slate-500 text-sm mb-8">Minimum 8 caractères</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••" minLength={8}
                      className="input-field pl-11 pr-11" required
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" minLength={8}
                      className="input-field pl-11" required
                    />
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Réinitialiser le mot de passe
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
