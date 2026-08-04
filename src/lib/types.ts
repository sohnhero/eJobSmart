export type BackendRole = 'candidate' | 'freelance' | 'company' | 'agency' | 'admin_rh' | 'super_admin' | 'trainer'

export interface User {
  _id: string
  email: string
  role: BackendRole
  firstName: string
  lastName: string
  phone?: string
  companyName?: string
  companyLogo?: string
  isActive: boolean
  isVerified: boolean
  twoFactorEnabled: boolean
  authProvider: 'local' | 'google' | 'linkedin'
  organizationOwner?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginSuccess {
  user: User
  tokens: AuthTokens
}

export interface LoginRequiresTwoFactor {
  requiresTwoFactor: true
  challengeToken: string
}

export type LoginResult = LoginSuccess | LoginRequiresTwoFactor

export function isTwoFactorChallenge(result: LoginResult): result is LoginRequiresTwoFactor {
  return 'requiresTwoFactor' in result && result.requiresTwoFactor === true
}

export interface RegisterPayload {
  email: string
  password: string
  role: 'candidate' | 'freelance' | 'company' | 'agency'
  firstName: string
  lastName: string
  phone?: string
}

export interface ApiErrorBody {
  message: string | string[]
  error?: string
  statusCode: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ---------- Vérification KYC entreprise/cabinet ----------
export type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected'

export interface CompanyVerification {
  _id?: string
  user: string | { _id: string; companyName?: string; firstName: string; lastName: string; email: string; role: BackendRole }
  status: KycStatus
  ninea?: string
  rccm?: string
  nineaDocumentUrl?: string
  rccmDocumentUrl?: string
  idDocumentUrl?: string
  submittedAt?: string
  reviewedAt?: string
  rejectionReason?: string
}

// ---------- Sectors ----------
export interface Sector {
  _id: string
  name: string
  slug: string
  icon?: string
  color?: string
  image?: string
  description?: string
  order: number
  isActive: boolean
}

// ---------- Jobs ----------
export type ContractType = 'CDI' | 'CDD' | 'Intérim' | 'Freelance' | 'Stage' | 'Alternance'
export type RemoteType = 'Sur site' | 'Télétravail' | 'Hybride'
export type ExperienceLevel = 'Junior' | 'Confirmé' | 'Senior' | 'Expert'
export type JobStatus = 'draft' | 'pending_review' | 'active' | 'suspended' | 'closed' | 'expired'
export type PublisherType = 'company' | 'agency' | 'ejobsmart'

export interface Job {
  _id: string
  title: string
  contractType: ContractType
  sector: Sector | string
  city: string
  country: string
  remoteType: RemoteType
  experienceLevel: ExperienceLevel
  requiredEducationLevel?: string
  description: string
  missions: string[]
  requirements: string[]
  skills: string[]
  languages: string[]
  benefits: string[]
  preselectQuestions: string[]
  positions: number
  salaryMin?: number
  salaryMax?: number
  currency: string
  isSalaryVisible: boolean
  status: JobStatus
  postedBy: string
  publisherType: PublisherType
  companyName: string
  companyLogo?: string
  applicantsCount: number
  isFeatured: boolean
  isBoosted: boolean
  postedAt?: string
  expiresAt?: string
  moderationNote?: string
  createdAt: string
  updatedAt: string
}

export interface CreateJobPayload {
  title: string
  contractType: ContractType
  sector: string
  city: string
  country: string
  remoteType: RemoteType
  experienceLevel: ExperienceLevel
  requiredEducationLevel?: string
  description: string
  missions: string[]
  requirements: string[]
  skills?: string[]
  languages?: string[]
  benefits?: string[]
  preselectQuestions?: string[]
  positions?: number
  salaryMin?: number
  salaryMax?: number
  currency?: string
  isSalaryVisible?: boolean
  expiresAt?: string
}

export type UpdateJobPayload = Partial<CreateJobPayload>

export interface QueryJobsParams {
  q?: string
  sector?: string[]
  contractType?: ContractType[]
  country?: string
  city?: string
  remoteType?: RemoteType
  experienceLevel?: ExperienceLevel
  publisherType?: PublisherType
  salaryMin?: number
  salaryMax?: number
  postedWithin?: '24h' | '7d' | '30d'
  sort?: 'relevance' | 'date' | 'salary' | 'popularity'
  page?: number
  limit?: number
}

// ---------- Applications ----------
export type ApplicationStatus =
  | 'Reçue'
  | "En cours d'examen"
  | 'Présélectionnée'
  | 'Entretien planifié'
  | 'Test envoyé'
  | 'Offre émise'
  | 'Acceptée'
  | 'Refusée'
  | 'Annulée'

export interface PreselectAnswer {
  question: string
  answer: string
}

export interface Application {
  _id: string
  job: Job | string
  candidate: User | string
  coverLetter?: string
  cvUrl?: string
  preselectAnswers: PreselectAnswer[]
  status: ApplicationStatus
  recruiterRating?: number
  recruiterNotes?: string
  interviewAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationPayload {
  job: string
  coverLetter?: string
  cvUrl?: string
  preselectAnswers?: PreselectAnswer[]
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus
  interviewAt?: string
  rejectionReason?: string
}

// ---------- Profiles ----------
export type Availability = 'Immédiate' | 'Préavis 1 mois' | 'Préavis 3 mois' | 'En poste'
export type ProfileStatus = 'Disponible' | 'En poste' | 'Placé' | 'Inactif'
export type CvVisibility = 'public' | 'on_apply' | 'private'

export interface ProfileExperience {
  _id?: string
  title: string
  company: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface ProfileEducation {
  _id?: string
  degree: string
  school: string
  fieldOfStudy?: string
  year: number
  mention?: string
}

export interface Profile {
  _id: string
  user: User | string
  headline?: string
  bio?: string
  city?: string
  country?: string
  sector?: Sector | string
  skills: string[]
  languages: string[]
  experiences: ProfileExperience[]
  education: ProfileEducation[]
  experienceYears?: number
  availability?: Availability
  contractTypesSought: ContractType[]
  salaryExpectationMin?: number
  salaryExpectationMax?: number
  dailyRate?: number
  currency: string
  linkedin?: string
  github?: string
  portfolio?: string
  cvUrl?: string
  cvVisibility: CvVisibility
  status: ProfileStatus
  rgpdConsent: boolean
  joinTalentPool: boolean
  internalTags?: string[]
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export type UpsertProfilePayload = Partial<Omit<Profile, '_id' | 'user' | 'createdAt' | 'updatedAt' | 'internalTags' | 'adminNotes'>>

export interface AdminUpdateProfilePayload {
  internalTags?: string[]
  adminNotes?: string
  status?: ProfileStatus
}

// ---------- Trainings ----------
export type TrainingFormat = 'online' | 'in_person' | 'hybrid'
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced'
export type TrainingStatus = 'draft' | 'published' | 'archived'
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'cancelled'

export interface TrainingModule {
  _id?: string
  title: string
  description?: string
  order: number
  contentUrl?: string
}

export interface Training {
  _id: string
  title: string
  description: string
  sectors: (Sector | string)[]
  targetAudience: string[]
  format: TrainingFormat
  level: TrainingLevel
  durationHours: number
  modules: TrainingModule[]
  instructorName: string
  instructorBio?: string
  prerequisites: string[]
  price: number
  currency: string
  languages: string[]
  certificateAwarded: boolean
  capacity?: number
  sessionDate?: string
  coverImage?: string
  status: TrainingStatus
  createdBy: string
  enrollmentsCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateTrainingPayload {
  title: string
  description: string
  sectors?: string[]
  targetAudience?: string[]
  format: TrainingFormat
  level: TrainingLevel
  durationHours: number
  modules: TrainingModule[]
  instructorName: string
  instructorBio?: string
  prerequisites?: string[]
  price?: number
  currency?: string
  languages?: string[]
  certificateAwarded?: boolean
  capacity?: number
  sessionDate?: string
  coverImage?: string
}

export type UpdateTrainingPayload = Partial<CreateTrainingPayload>

export interface TrainingEnrollment {
  _id: string
  training: Training | string
  candidate: User | string
  status: EnrollmentStatus
  progressPercent: number
  completedModuleIds: string[]
  certificateUrl?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

// ---------- Messages ----------
export interface Conversation {
  _id: string
  participants: (User | string)[]
  application: Application | string
  lastMessageAt?: string
  lastMessagePreview?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  conversation: string
  sender: User | string
  content: string
  attachmentUrl?: string
  isReadByRecipient: boolean
  createdAt: string
  updatedAt: string
}

// ---------- Notifications ----------
export type NotificationType =
  | 'application_received'
  | 'application_status_changed'
  | 'job_match'
  | 'job_expiring_soon'
  | 'training_enrolled'
  | 'training_completed'
  | 'new_message'
  | 'job_alert_match'
  | 'resource_proposal_received'
  | 'resource_proposal_answered'

export interface AppNotification {
  _id: string
  recipient: string
  type: NotificationType
  title: string
  message: string
  link?: string
  relatedJob?: string
  relatedApplication?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// ---------- Matching ----------
export interface JobMatch {
  job: Job
  score: number
}

export interface CandidateMatch {
  profile: Profile
  score: number
}

// ---------- Talent pool ----------
export type TalentPoolRequestStatus = 'pending' | 'approved' | 'rejected'

export interface TalentPoolRequest {
  _id: string
  candidate: User | string
  requestedBy: User | string
  message?: string
  status: TalentPoolRequestStatus
  reviewedBy?: string
  reviewNote?: string
  reviewedAt?: string
  createdAt: string
}

// ---------- Agency resources (portefeuille cabinet) ----------
export interface AgencyResource {
  _id: string
  agency: string
  linkedUser?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  headline?: string
  skills: string[]
  experienceYears?: number
  availability?: Availability
  sector?: Sector | string
  status: ProfileStatus
  notes?: string
  resumeUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAgencyResourcePayload {
  linkedUser?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  headline?: string
  skills?: string[]
  experienceYears?: number
  availability?: Availability
  sector?: string
  status?: ProfileStatus
  notes?: string
  resumeUrl?: string
}

export type UpdateAgencyResourcePayload = Partial<CreateAgencyResourcePayload>

export type ProposalStatus = 'pending' | 'accepted' | 'declined'

export interface ResourceProposal {
  _id: string
  resource: AgencyResource | string
  job: Job | string
  agency: string
  message?: string
  status: ProposalStatus
  respondedBy?: string
  reviewNote?: string
  respondedAt?: string
  createdAt: string
}

// ---------- Job alerts ----------
export interface JobAlert {
  _id: string
  candidate: string
  name?: string
  keywords?: string
  sectors: (Sector | string)[]
  contractTypes: ContractType[]
  city?: string
  country?: string
  remoteType?: RemoteType
  experienceLevel?: ExperienceLevel
  salaryMin?: number
  salaryMax?: number
  isActive: boolean
  lastNotifiedAt?: string
  createdAt: string
}

export interface CreateJobAlertPayload {
  name?: string
  keywords?: string
  sectors?: string[]
  contractTypes?: ContractType[]
  city?: string
  country?: string
  remoteType?: RemoteType
  experienceLevel?: ExperienceLevel
  salaryMin?: number
  salaryMax?: number
}

export interface UpdateJobAlertPayload extends Partial<CreateJobAlertPayload> {
  isActive?: boolean
}

// ---------- Reports ----------
export type ReportStatus = 'pending' | 'resolved' | 'dismissed'

export interface Report {
  _id: string
  job: Job | string
  reportedBy: User | string
  reason: string
  status: ReportStatus
  resolvedBy?: string
  resolutionNote?: string
  resolvedAt?: string
  createdAt: string
}

// ---------- Platform settings ----------
export interface MatchingWeights {
  skills: number
  sector: number
  experience: number
  location: number
  education: number
  salary: number
}

export interface PlatformSettings {
  jobModerationEnabled: boolean
  matchingWeights: MatchingWeights
}

// ---------- Admin dashboard ----------
export interface AdminDashboardOverview {
  usersByRole: Record<string, number>
  jobsByStatus: Record<string, number>
  applicationsByStatus: Record<string, number>
  totalJobs: number
  totalApplications: number
  conversionRate: number
  topSectors: { sector: string; count: number }[]
}
