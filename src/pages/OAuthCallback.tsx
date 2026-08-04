import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tokenStorage } from '../lib/token-storage'
import { roleToDashboardPath } from '../lib/roles'
import { useToast } from '../components/ui/Toast'
import { authService } from '../lib/auth-service'

// Cible de redirection de GET /auth/google/callback et /auth/linkedin/callback côté backend
// (voir AuthController.redirectAfterOAuth) : un code opaque à usage unique arrive en query param,
// à échanger immédiatement contre les vrais tokens (jamais transmis en clair dans l'URL).
export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const toast = useToast()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const code = searchParams.get('code')

    async function finish() {
      if (!code) {
        toast.error('Connexion via le fournisseur externe impossible')
        navigate('/login', { replace: true })
        return
      }
      try {
        const result = await authService.exchangeOAuthCode(code)
        if (!('tokens' in result)) {
          throw new Error('Réponse OAuth inattendue')
        }
        tokenStorage.setTokens(result.tokens)
        const me = await refreshUser()
        navigate(roleToDashboardPath(me.role), { replace: true })
      } catch {
        tokenStorage.clear()
        toast.error('Impossible de récupérer votre profil, veuillez réessayer')
        navigate('/login', { replace: true })
      }
    }

    void finish()
  }, [searchParams, navigate, refreshUser, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
