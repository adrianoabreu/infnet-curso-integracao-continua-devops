export interface StudyItem {
  id: string
  subject: string
  category?: string
  duration: string
  periodicity: string
  status: "concluido" | "pendente" | "aguardando"
  observation?: string
  institution?: string
  otherInstitution?: string
  reference?: string
  studyLinks?: string
  pdfBase64?: string
  pdfFileName?: string
  completed: boolean
  createdAt: string
  updatedAt?: string
}

