import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowRight, Check, User, Building2, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { extractApiErrorMessage } from '../lib/api'
import { authService, type OAuthRole } from '../lib/auth-service'
import { tokenStorage } from '../lib/token-storage'
import { roleToDashboardPath } from '../lib/roles'

const roles = [
  { id: 'candidate' as OAuthRole, icon: User, title: 'Candidat / Freelance', desc: 'Je cherche un emploi ou des missions freelance' },
  { id: 'company' as OAuthRole, icon: Building2, title: 'Entreprise', desc: 'Je souhaite recruter des talents pour mon entreprise' },
  { id: 'agency' as OAuthRole, icon: Users, title: 'Cabinet RH', desc: 'Nous gérons le recrutement pour nos clients' },
]

// Cible de redirection de GET /auth/google/callback et /auth/linkedin/callback côté backend quand
// aucun compte n'existait déjà pour cet email (voir AuthController.redirectAfterOAuth) : impossible
// de deviner candidat/entreprise/cabinet RH sans lui demander, donc le compte n'est pas encore créé.
export default function OAuthChooseRole() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const toast = useToast()
  const pendingToken = searchParams.get('pendingToken')
  const [role, setRole] = useState<OAuthRole>('candidate')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!pendingToken) return
    setLoading(true)
    try {
      const { tokens } = await authService.completeOAuthSignup(pendingToken, role)
      tokenStorage.setTokens(tokens)
      const me = await refreshUser()
      navigate(roleToDashboardPath(me.role), { replace: true })
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de finaliser l'inscription"))
    } finally {
      setLoading(false)
    }
  }

  if (!pendingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <p className="text-slate-600 mb-4">Session d'inscription introuvable ou expirée.</p>
          <Link to="/register"><Button fullWidth>Revenir à l'inscription</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 max-w-md w-full">
        <h2 className="text-2xl font-heading font-bold text-slate-900 mb-1">Quel est votre profil ?</h2>
        <p className="text-slate-500 text-sm mb-6">Une dernière étape avant de créer votre compte Eureka Job.</p>
        <div className="space-y-3">
          {roles.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === r.id
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${role === r.id ? 'bg-brand-600' : 'bg-slate-100'}`}>
                <r.icon className={`w-5 h-5 ${role === r.id ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${role === r.id ? 'text-brand-700' : 'text-slate-800'}`}>{r.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${role === r.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                {role === r.id && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
            </button>
          ))}
        </div>
        <Button fullWidth size="lg" className="mt-6" loading={loading} onClick={handleConfirm} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Créer mon compte
        </Button>
      </div>
    </div>
  )
}
