import { useState } from 'react'
import { Save, ShieldCheck, X } from 'lucide-react'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../lib/auth-service'
import { extractApiErrorMessage } from '../../lib/api'

export default function SecuritySettings() {
  const toast = useToast()
  const { user, refreshUser } = useAuth()

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  // 2FA
  const [enable2FAFlow, setEnable2FAFlow] = useState<{ qrCodeDataUrl: string } | null>(null)
  const [disable2FAFlow, setDisable2FAFlow] = useState(false)
  const [twoFaCode, setTwoFaCode] = useState('')
  const [twoFaPassword, setTwoFaPassword] = useState('')
  const [twoFaBusy, setTwoFaBusy] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas')
      return
    }
    setSavingPassword(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      toast.success('Mot de passe changé avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Mot de passe actuel incorrect'))
    } finally {
      setSavingPassword(false)
    }
  }

  const startEnable2FA = async () => {
    setTwoFaBusy(true)
    try {
      const res = await authService.setupTwoFactor()
      setEnable2FAFlow({ qrCodeDataUrl: res.qrCodeDataUrl })
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setTwoFaBusy(false)
    }
  }

  const confirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setTwoFaBusy(true)
    try {
      await authService.enableTwoFactor(twoFaCode)
      await refreshUser()
      setEnable2FAFlow(null)
      setTwoFaCode('')
      toast.success('Double authentification activée !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Code invalide'))
    } finally {
      setTwoFaBusy(false)
    }
  }

  const confirmDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setTwoFaBusy(true)
    try {
      await authService.disableTwoFactor(twoFaCode, twoFaPassword || undefined)
      await refreshUser()
      setDisable2FAFlow(false)
      setTwoFaCode(''); setTwoFaPassword('')
      toast.success('Double authentification désactivée.')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Code ou mot de passe invalide'))
    } finally {
      setTwoFaBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password change — comptes locaux uniquement, les comptes OAuth n'ont pas de mot de passe */}
      {user?.authProvider === 'local' && (
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Mot de passe</h2>
            <p className="text-sm text-slate-500 mt-0.5">Modifiez votre mot de passe pour sécuriser l'accès</p>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Mot de passe actuel</label>
              <input
                type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nouveau mot de passe</label>
                <input
                  type="password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Confirmer le nouveau mot de passe</label>
                <input
                  type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" loading={savingPassword} leftIcon={<Save className="w-4 h-4" />}>
                Mettre à jour le mot de passe
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Two Factor Auth */}
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Authentification à deux facteurs (2FA)</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sécurisez davantage votre compte en exigeant un code de validation à chaque connexion.
            </p>
          </div>
          <label className="flex items-center cursor-pointer flex-shrink-0">
            <div
              onClick={() => { user?.twoFactorEnabled ? setDisable2FAFlow(true) : void startEnable2FA() }}
              className={`w-11 h-6 rounded-full transition-colors relative ${user?.twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${user?.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Enable 2FA Modal */}
      {enable2FAFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEnable2FAFlow(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            <form onSubmit={confirmEnable2FA} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Activer le 2FA</h3>
                <button type="button" onClick={() => setEnable2FAFlow(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-slate-500">Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy...).</p>
              <img src={enable2FAFlow.qrCodeDataUrl} alt="QR Code 2FA" className="mx-auto w-40 h-40" />
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Code à 6 chiffres</label>
                <input type="text" inputMode="numeric" maxLength={6} required value={twoFaCode} onChange={e => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-[0.3em] font-bold outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <Button type="submit" fullWidth loading={twoFaBusy}>Confirmer et activer</Button>
            </form>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {disable2FAFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDisable2FAFlow(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            <form onSubmit={confirmDisable2FA} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900">Désactiver le 2FA</h3>
                <button type="button" onClick={() => setDisable2FAFlow(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Code à 6 chiffres</label>
                <input type="text" inputMode="numeric" maxLength={6} required value={twoFaCode} onChange={e => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-[0.3em] font-bold outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              {user?.authProvider === 'local' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mot de passe</label>
                  <input type="password" required value={twoFaPassword} onChange={e => setTwoFaPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
              )}
              <Button type="submit" variant="secondary" fullWidth loading={twoFaBusy}>Confirmer et désactiver</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
