import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Ghost } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 relative">
          <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Ghost className="w-16 h-16 text-brand-600" />
          </div>
          <p className="text-9xl font-black text-slate-200 absolute inset-0 flex items-center justify-center -z-10">404</p>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4">Oups ! Page introuvable.</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Désolé, la page que vous recherchez semble avoir disparu dans le cloud ou n'a jamais existé. 
          Vérifiez l'URL ou revenez à l'accueil.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="secondary" 
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button 
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
