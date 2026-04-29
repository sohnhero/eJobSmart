export interface Candidate {
  id: number
  firstName: string
  lastName: string
  headline: string
  avatar: string
  location: string
  skills: string[]
  experienceYears: number
  availability: 'Immédiate' | 'Préavis 1 mois' | 'Préavis 3 mois' | 'En poste'
  contractTypes: string[]
  salaryExpectation: number
  currency: string
  matchScore?: number
  sector: string
  status: 'Disponible' | 'En poste' | 'Placé' | 'Inactif'
}

export const candidates: Candidate[] = [
  {
    id: 1,
    firstName: 'Amadou',
    lastName: 'Diallo',
    headline: 'Développeur Full Stack React/Node.js — 6 ans d\'expérience',
    avatar: 'https://ui-avatars.com/api/?name=Amadou+Diallo&background=2563eb&color=fff&size=128',
    location: 'Dakar, Sénégal',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    experienceYears: 6,
    availability: 'Immédiate',
    contractTypes: ['CDI', 'Freelance'],
    salaryExpectation: 1200000,
    currency: 'FCFA',
    matchScore: 94,
    sector: 'Technologie & Numérique',
    status: 'Disponible',
  },
  {
    id: 2,
    firstName: 'Mariame',
    lastName: 'Konaté',
    headline: 'Responsable RH & Développement des Compétences',
    avatar: 'https://ui-avatars.com/api/?name=Mariame+Konaté&background=7c3aed&color=fff&size=128',
    location: 'Abidjan, Côte d\'Ivoire',
    skills: ['Recrutement', 'SIRH', 'Formation', 'Droit du travail', 'GPEC'],
    experienceYears: 8,
    availability: 'Préavis 1 mois',
    contractTypes: ['CDI'],
    salaryExpectation: 1000000,
    currency: 'FCFA',
    matchScore: 87,
    sector: 'Ressources Humaines',
    status: 'En poste',
  },
  {
    id: 3,
    firstName: 'Ousmane',
    lastName: 'Sarr',
    headline: 'Ingénieur Data Science & Machine Learning',
    avatar: 'https://ui-avatars.com/api/?name=Ousmane+Sarr&background=059669&color=fff&size=128',
    location: 'Dakar, Sénégal',
    skills: ['Python', 'TensorFlow', 'SQL', 'Spark', 'Power BI'],
    experienceYears: 4,
    availability: 'Immédiate',
    contractTypes: ['CDI', 'CDD', 'Freelance'],
    salaryExpectation: 1500000,
    currency: 'FCFA',
    matchScore: 91,
    sector: 'Technologie & Numérique',
    status: 'Disponible',
  },
  {
    id: 4,
    firstName: 'Aissatou',
    lastName: 'Ba',
    headline: 'Directrice Administrative & Financière',
    avatar: 'https://ui-avatars.com/api/?name=Aissatou+Ba&background=be185d&color=fff&size=128',
    location: 'Dakar, Sénégal',
    skills: ['Finance', 'SYSCOHADA', 'SAP', 'Gestion budgétaire', 'Audit'],
    experienceYears: 12,
    availability: 'Préavis 3 mois',
    contractTypes: ['CDI'],
    salaryExpectation: 2500000,
    currency: 'FCFA',
    matchScore: 85,
    sector: 'Banque & Finance',
    status: 'En poste',
  },
  {
    id: 5,
    firstName: 'Cheikh',
    lastName: 'Ndiaye',
    headline: 'UX/UI Designer — Spécialiste Applications Mobile Africaines',
    avatar: 'https://ui-avatars.com/api/?name=Cheikh+Ndiaye&background=d97706&color=fff&size=128',
    location: 'Dakar, Sénégal',
    skills: ['Figma', 'Adobe XD', 'Design System', 'User Research', 'Prototypage'],
    experienceYears: 5,
    availability: 'Immédiate',
    contractTypes: ['CDI', 'Freelance'],
    salaryExpectation: 900000,
    currency: 'FCFA',
    matchScore: 88,
    sector: 'Technologie & Numérique',
    status: 'Disponible',
  },
]

export const myApplications = [
  {
    id: 1,
    jobTitle: 'Développeur Full Stack Senior',
    company: 'Sonatel Digital',
    appliedAt: '2026-04-20',
    status: 'Présélectionnée',
    statusColor: 'blue',
    matchScore: 89,
    nextStep: 'Entretien technique prévu le 02/05/2026',
  },
  {
    id: 2,
    jobTitle: 'Data Scientist / ML Engineer',
    company: 'Wave Mobile Money',
    appliedAt: '2026-04-22',
    status: 'En cours d\'examen',
    statusColor: 'amber',
    matchScore: 94,
    nextStep: 'En attente de retour recruteur',
  },
  {
    id: 3,
    jobTitle: 'Ingénieur Backend Node.js',
    company: 'Orange Digital Center',
    appliedAt: '2026-04-18',
    status: 'Entretien planifié',
    statusColor: 'green',
    matchScore: 92,
    nextStep: 'Entretien RH le 30/04/2026 à 10h00',
  },
  {
    id: 4,
    jobTitle: 'Tech Lead Frontend',
    company: 'InnoTech Africa',
    appliedAt: '2026-04-10',
    status: 'Refusée',
    statusColor: 'red',
    matchScore: 76,
    nextStep: 'Profil non retenu — expérience insuffisante',
  },
  {
    id: 5,
    jobTitle: 'CTO / Directeur Technique',
    company: 'FinTech Startup',
    appliedAt: '2026-04-25',
    status: 'Reçue',
    statusColor: 'slate',
    matchScore: 81,
    nextStep: 'Candidature reçue, en cours de traitement',
  },
]
