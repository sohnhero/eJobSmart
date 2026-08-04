import { api } from '../api'

// Les endpoints d'upload restent sous /api/v1 (baseURL par défaut d'`api`), mais les fichiers
// eux-mêmes sont servis par FilesController sur /uploads/... hors du préfixe /api/v1 (pour ne
// pas casser les URLs déjà en base) — d'où cette origine dérivée en retirant le suffixe /api/v1.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
)

export const uploadsService = {
  async uploadCv(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<{ url: string }>('/uploads/cv', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },
  async uploadAttachment(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<{ url: string }>('/uploads/attachment', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },
  async uploadKycDocument(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<{ url: string }>('/uploads/kyc-document', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },

  // CV, pièces jointes, justificatifs KYC, attestations : plus servis en public, il faut le
  // token d'auth pour les récupérer — impossible d'attacher un header à une simple navigation
  // <a href>, donc on les télécharge en Blob puis on les ouvre localement dans un nouvel onglet.
  async openFile(url: string): Promise<void> {
    const { data } = await api.get<Blob>(url, {
      baseURL: API_ORIGIN,
      responseType: 'blob',
    })
    const objectUrl = URL.createObjectURL(data)
    window.open(objectUrl, '_blank', 'noopener')
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
  },
}
