export const sectors = [
  { id: 1, name: 'Technologie & Numérique', slug: 'tech', icon: 'Laptop', count: 124, color: '#2563eb' },
  { id: 2, name: 'Banque & Finance', slug: 'finance', icon: 'Landmark', count: 86, color: '#059669' },
  { id: 3, name: 'Santé & Pharma', slug: 'sante', icon: 'Stethoscope', count: 42, color: '#dc2626' },
  { id: 4, name: 'BTP & Construction', slug: 'btp', icon: 'HardHat', count: 67, color: '#d97706' },
  { id: 5, name: 'Éducation & Formation', slug: 'education', icon: 'GraduationCap', count: 31, color: '#7c3aed' },
  { id: 6, name: 'Hôtellerie & Restauration', slug: 'hotel', icon: 'Hotel', count: 54, color: '#db2777' },
  { id: 7, name: 'Agriculture & Agro', slug: 'agro', icon: 'Sprout', count: 28, color: '#16a34a' },
  { id: 8, name: 'Transport & Logistique', slug: 'logistique', icon: 'Truck', count: 45, color: '#4b5563' },
  { id: 9, name: 'Énergie & Mines', slug: 'energie', icon: 'Zap', count: 19, color: '#ca8a04' },
  { id: 10, name: 'Marketing & Comm', slug: 'marketing', icon: 'Megaphone', count: 38, color: '#ea580c' },
  { id: 11, name: 'Ressources Humaines', slug: 'rh', icon: 'Users', count: 25, color: '#2563eb' },
  { id: 12, name: 'Vente & Commerce', slug: 'vente', icon: 'ShoppingCart', count: 72, color: '#9333ea' },
  { id: 13, name: 'Droit & Juridique', slug: 'droit', icon: 'Scale', count: 15, color: '#111827' },
  { id: 14, name: 'Artisanat & Design', slug: 'artisanat', icon: 'Palette', count: 22, color: '#ec4899' },
  { id: 15, name: 'Immobilier', slug: 'immo', icon: 'Home', count: 33, color: '#4f46e5' },
  { id: 16, name: 'Environnement', slug: 'env', icon: 'Leaf', count: 12, color: '#059669' },
  { id: 17, name: 'Sécurité', slug: 'secu', icon: 'Shield', count: 18, color: '#991b1b' },
  { id: 18, name: 'Services Publics', slug: 'public', icon: 'Building', count: 21, color: '#374151' },
]

export const getSectorBySlug = (slug: string) => sectors.find(s => s.slug === slug)
export const getSectorById = (id: number) => sectors.find(s => s.id === id)

export const sectorStats = [
  { name: 'Tech', value: 124, color: '#2563eb' },
  { name: 'Finance', value: 86, color: '#059669' },
  { name: 'BTP', value: 67, color: '#d97706' },
  { name: 'Santé', value: 42, color: '#dc2626' },
  { name: 'Autres', value: 312, color: '#94a3b8' },
]

export const popularSectors = [
  { name: 'Développement Web', slug: 'tech', icon: 'Laptop' },
  { name: 'Comptabilité', slug: 'finance', icon: 'PieChart' },
  { name: 'Ressources Humaines', slug: 'rh', icon: 'Users' },
  { name: 'Marketing Digital', slug: 'marketing', icon: 'Smartphone' },
  { name: 'Gestion de Projet', slug: 'vente', icon: 'ClipboardList' },
  { name: 'Vente B2B', slug: 'vente', icon: 'Handshake' },
]

export type Sector = typeof sectors[0]
