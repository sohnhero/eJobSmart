import { useEffect, useState } from 'react'
import { Upload, ShieldCheck, ShieldAlert, Clock, ShieldX } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { uploadsService } from '../../lib/services/uploads'
import { companyVerificationService } from '../../lib/services/company-verification'
import { extractApiErrorMessage } from '../../lib/api'
import type { CompanyVerification as CompanyVerificationData } from '../../lib/types'

function openDocument(url: string, onError: (message: string) => void) {
  uploadsService.openFile(url).catch((err) => onError(extractApiErrorMessage(err, "Impossible d'ouvrir le document")))
}

interface Props {
  role: 'company' | 'agency'
}

const STATUS_META = {
  not_submitted: { label: 'Non soumis', color: 'text-slate-500', bg: 'bg-slate-100', icon: ShieldAlert },
  pending: { label: 'En cours de vérification', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  approved: { label: 'Compte vérifié', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: ShieldCheck },
  rejected: { label: 'Rejeté — à corriger', color: 'text-red-700', bg: 'bg-red-100', icon: ShieldX },
} as const

function Dropzone({ label, hint, url, uploading, onFile }: {
  label: string
  hint: string
  url?: string
  uploading: boolean
  onFile: (file: File | null) => void
}) {
  const toast = useToast()
  return (
    <div>
      <h3 className="font-semibold text-slate-900 mb-2 text-sm">{label}</h3>
      {!url ? (
        <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer group block">
          <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={e => onFile(e.target.files?.[0] ?? null)} />
          <Upload className="w-8 h-8 text-slate-300 group-hover:text-brand-400 mx-auto mb-2 transition-colors" />
          <p className="text-sm font-medium text-slate-600">{uploading ? 'Téléversement en cours…' : 'Glissez le document ici'}</p>
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-brand-600">Parcourir les fichiers</span>
        </label>
      ) : (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{url.split('/').pop()}</p>
            <button type="button" onClick={() => openDocument(url, toast.error)} className="text-xs text-brand-600 hover:underline">Voir le fichier</button>
          </div>
          <label className="text-xs text-brand-600 font-semibold hover:text-brand-800 cursor-pointer flex-shrink-0">
            {uploading ? 'Envoi…' : 'Remplacer'}
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={e => onFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      )}
    </div>
  )
}

export default function CompanyVerification({ role }: Props) {
  const { user } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [record, setRecord] = useState<CompanyVerificationData | null>(null)

  const [ninea, setNinea] = useState('')
  const [rccm, setRccm] = useState('')
  const [nineaDocumentUrl, setNineaDocumentUrl] = useState('')
  const [rccmDocumentUrl, setRccmDocumentUrl] = useState('')
  const [idDocumentUrl, setIdDocumentUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    companyVerificationService.findMine()
      .then(data => {
        if (cancelled) return
        setRecord(data)
        setNinea(data.ninea ?? '')
        setRccm(data.rccm ?? '')
        setNineaDocumentUrl(data.nineaDocumentUrl ?? '')
        setRccmDocumentUrl(data.rccmDocumentUrl ?? '')
        setIdDocumentUrl(data.idDocumentUrl ?? '')
      })
      .catch(err => toast.error(extractApiErrorMessage(err, 'Impossible de charger votre dossier de vérification')))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toast n'est pas stable entre renders
    // (nouvel objet à chaque toast affiché ailleurs dans l'app) ; le re-déclencher ré-écraserait
    // les documents tout juste uploadés avec le dernier état sauvegardé côté serveur.
  }, [])

  const handleUpload = (field: 'ninea' | 'rccm' | 'id', setUrl: (url: string) => void) => async (file: File | null) => {
    if (!file) return
    setUploadingField(field)
    try {
      const url = await uploadsService.uploadKycDocument(file)
      setUrl(url)
      toast.success('Document téléversé avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de téléverser le document'))
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async () => {
    if (!nineaDocumentUrl || !rccmDocumentUrl) {
      toast.error('Le NINEA et le RCCM sont obligatoires pour soumettre votre dossier')
      return
    }
    setSaving(true)
    try {
      const updated = await companyVerificationService.submitMine({
        ninea: ninea || undefined,
        rccm: rccm || undefined,
        nineaDocumentUrl,
        rccmDocumentUrl,
        idDocumentUrl: idDocumentUrl || undefined,
      })
      setRecord(updated)
      toast.success('Dossier envoyé — notre équipe le vérifie sous peu.')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer le dossier"))
    } finally {
      setSaving(false)
    }
  }

  const status = record?.status ?? 'not_submitted'
  const meta = STATUS_META[status]
  const canEdit = status !== 'approved' && status !== 'pending'

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <p className="text-sm text-slate-400 text-center py-16">Chargement…</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={role}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Vérification du compte</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Justifiez que {user?.companyName || 'votre organisation'} est en règle pour lever les limites appliquées aux comptes non vérifiés.
        </p>
      </div>

      <div className={`card p-4 mb-6 flex items-center gap-3 ${meta.bg}`}>
        <meta.icon className={`w-5 h-5 flex-shrink-0 ${meta.color}`} />
        <div>
          <p className={`text-sm font-semibold ${meta.color}`}>{meta.label}</p>
          {status === 'rejected' && record?.rejectionReason && (
            <p className="text-xs text-red-700 mt-0.5">Motif : {record.rejectionReason}</p>
          )}
          {status === 'approved' && (
            <p className="text-xs text-emerald-700 mt-0.5">Vous pouvez publier autant d'offres que nécessaire.</p>
          )}
          {status === 'pending' && (
            <p className="text-xs text-amber-700 mt-0.5">Votre dossier est en cours d'examen par notre équipe.</p>
          )}
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Numéro NINEA</label>
            <input disabled={!canEdit} value={ninea} onChange={e => setNinea(e.target.value)} placeholder="ex: 004521587" className="input-field disabled:bg-slate-50 disabled:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Numéro RCCM</label>
            <input disabled={!canEdit} value={rccm} onChange={e => setRccm(e.target.value)} placeholder="ex: SN.DKR.2020.A.1234" className="input-field disabled:bg-slate-50 disabled:text-slate-400" />
          </div>
        </div>

        {canEdit ? (
          <>
            <Dropzone label="Justificatif NINEA *" hint="PDF, DOC, PNG, JPEG · Max 10 Mo" url={nineaDocumentUrl} uploading={uploadingField === 'ninea'} onFile={handleUpload('ninea', setNineaDocumentUrl)} />
            <Dropzone label="Justificatif RCCM *" hint="PDF, DOC, PNG, JPEG · Max 10 Mo" url={rccmDocumentUrl} uploading={uploadingField === 'rccm'} onFile={handleUpload('rccm', setRccmDocumentUrl)} />
            <Dropzone label="Pièce d'identité du représentant légal (optionnel)" hint="PDF, DOC, PNG, JPEG · Max 10 Mo" url={idDocumentUrl} uploading={uploadingField === 'id'} onFile={handleUpload('id', setIdDocumentUrl)} />
            <Button loading={saving} onClick={handleSubmit}>
              {status === 'rejected' ? 'Renvoyer le dossier' : 'Soumettre pour vérification'}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Justificatif NINEA', url: nineaDocumentUrl },
              { label: 'Justificatif RCCM', url: rccmDocumentUrl },
              ...(idDocumentUrl ? [{ label: "Pièce d'identité", url: idDocumentUrl }] : []),
            ].map(doc => (
              <div key={doc.label} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <span className="text-sm text-slate-700">{doc.label}</span>
                <button type="button" onClick={() => openDocument(doc.url, toast.error)} className="text-xs text-brand-600 font-semibold hover:underline">Voir le fichier</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
