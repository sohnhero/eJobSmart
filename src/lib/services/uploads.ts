import { api } from '../api'

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
}
