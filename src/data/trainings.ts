export interface Training {
  id: number
  title: string
  instructor: string
  instructorAvatar: string
  sector: string
  format: 'En ligne' | 'Présentiel' | 'Hybride' | 'Webinaire'
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  duration: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  enrolledCount: number
  description: string
  modules: string[]
  tags: string[]
  isFeatured: boolean
  hasCertificate: boolean
  thumbnail: string
  language: string
  nextSession?: string
}

export const trainings: Training[] = [
  {
    id: 1,
    title: 'Recrutement Digital & Sourcing Avancé',
    instructor: 'Dr. Fatou Diallo',
    instructorAvatar: 'https://ui-avatars.com/api/?name=FD&background=7c3aed&color=fff&size=128',
    sector: 'Ressources Humaines',
    format: 'En ligne',
    level: 'Intermédiaire',
    duration: '24h',
    price: 75000,
    currency: 'FCFA',
    rating: 4.8,
    reviewCount: 312,
    enrolledCount: 1847,
    description: 'Maîtrisez les techniques modernes de recrutement digital : LinkedIn Recruiter, ATS, employer branding et sourcing de talents rares.',
    modules: ['Introduction au recrutement digital', 'LinkedIn Recruiter avancé', 'ATS et workflow', 'Entretiens vidéo', 'Employer branding', 'Analytics RH'],
    tags: ['RH', 'Recrutement', 'Digital', 'LinkedIn'],
    isFeatured: true,
    hasCertificate: true,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
    language: 'Français',
  },
  {
    id: 2,
    title: 'Leadership & Management d\'Équipes',
    instructor: 'Moussa Sy',
    instructorAvatar: 'https://ui-avatars.com/api/?name=MS&background=059669&color=fff&size=128',
    sector: 'Management',
    format: 'Hybride',
    level: 'Avancé',
    duration: '32h',
    price: 120000,
    currency: 'FCFA',
    rating: 4.9,
    reviewCount: 187,
    enrolledCount: 923,
    description: 'Développez vos compétences en leadership situationnel, gestion de conflits et pilotage de la performance d\'équipes multiculturelles.',
    modules: ['Les styles de leadership', 'Motivation et engagement', 'Gestion de conflits', 'Communication assertive', 'Pilotage de la performance', 'Gestion du changement'],
    tags: ['Leadership', 'Management', 'Soft Skills', 'Performance'],
    isFeatured: true,
    hasCertificate: true,
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop',
    language: 'Français',
    nextSession: '2026-05-10',
  },
  {
    id: 3,
    title: 'Droit du Travail Sénégalais — Pratique',
    instructor: 'Me Aminata Touré',
    instructorAvatar: 'https://ui-avatars.com/api/?name=AT&background=374151&color=fff&size=128',
    sector: 'Juridique',
    format: 'En ligne',
    level: 'Intermédiaire',
    duration: '20h',
    price: 90000,
    currency: 'FCFA',
    rating: 4.7,
    reviewCount: 234,
    enrolledCount: 1203,
    description: 'Comprendre et appliquer le Code du Travail sénégalais : contrats, rupture, congés, procédures disciplinaires et contentieux prud\'homal.',
    modules: ['Les contrats de travail', 'Durée du travail et congés', 'Procédures disciplinaires', 'Rupture du contrat', 'Contentieux et TASS', 'Actualités jurisprudentielles'],
    tags: ['Droit du travail', 'RH', 'Juridique', 'Sénégal'],
    isFeatured: false,
    hasCertificate: true,
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop',
    language: 'Français',
  },
  {
    id: 4,
    title: 'Excel & Power BI pour les RH',
    instructor: 'Ibrahima Fall',
    instructorAvatar: 'https://ui-avatars.com/api/?name=IF&background=2563eb&color=fff&size=128',
    sector: 'Ressources Humaines',
    format: 'En ligne',
    level: 'Débutant',
    duration: '18h',
    price: 45000,
    currency: 'FCFA',
    rating: 4.6,
    reviewCount: 456,
    enrolledCount: 3214,
    description: 'Maîtrisez Excel avancé et Power BI pour créer des tableaux de bord RH impactants : turnover, masse salariale, absentéisme, pyramide des âges.',
    modules: ['Excel avancé pour les RH', 'Tableaux croisés dynamiques', 'Introduction à Power BI', 'Modélisation des données RH', 'Visualisations et dashboards', 'Automatisation avec Power Query'],
    tags: ['Excel', 'Power BI', 'Analytics', 'Dashboard'],
    isFeatured: true,
    hasCertificate: false,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    language: 'Français',
  },
  {
    id: 5,
    title: 'Développement Personnel & Employabilité',
    instructor: 'Aïda Ndiaye',
    instructorAvatar: 'https://ui-avatars.com/api/?name=AN&background=be185d&color=fff&size=128',
    sector: 'Développement Personnel',
    format: 'En ligne',
    level: 'Débutant',
    duration: '12h',
    price: 0,
    currency: 'FCFA',
    rating: 4.5,
    reviewCount: 892,
    enrolledCount: 8743,
    description: 'Boostez votre employabilité : CV percutant, pitch professionnel, entretiens d\'embauche, négociation salariale et personal branding LinkedIn.',
    modules: ['CV et lettre de motivation', 'Profil LinkedIn optimisé', 'Préparer ses entretiens', 'Négociation salariale', 'Personal branding', 'Réseautage professionnel'],
    tags: ['Employabilité', 'CV', 'Entretien', 'LinkedIn', 'Gratuit'],
    isFeatured: true,
    hasCertificate: false,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop',
    language: 'Français',
  },
  {
    id: 6,
    title: 'Gestion de la Paie — SYSCOHADA',
    instructor: 'Oumar Kouyaté',
    instructorAvatar: 'https://ui-avatars.com/api/?name=OK&background=d97706&color=fff&size=128',
    sector: 'Finance / RH',
    format: 'Présentiel',
    level: 'Intermédiaire',
    duration: '40h',
    price: 150000,
    currency: 'FCFA',
    rating: 4.8,
    reviewCount: 145,
    enrolledCount: 678,
    description: 'Formation complète sur la gestion de la paie en Afrique Occidentale : bulletin de paie, cotisations sociales, IPRES, CSS, déclarations fiscales.',
    modules: ['Fondamentaux de la paie', 'Cotisations sociales (IPRES/CSS)', 'Impôt sur le revenu', 'Bulletin de paie SYSCOHADA', 'Logiciels de paie (Sage Paie)', 'Déclarations et contrôles'],
    tags: ['Paie', 'SYSCOHADA', 'Finance', 'IPRES', 'CSS'],
    isFeatured: false,
    hasCertificate: true,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    language: 'Français',
    nextSession: '2026-05-15',
  },
]
