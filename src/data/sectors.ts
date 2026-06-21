export const sectors = [
  { id: 1, name: 'Technologie & Numérique', slug: 'tech', icon: 'Laptop', count: 124, color: '#2563eb', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Banque & Finance', slug: 'finance', icon: 'Landmark', count: 86, color: '#059669', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Santé & Pharma', slug: 'sante', icon: 'Stethoscope', count: 42, color: '#dc2626', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'BTP & Construction', slug: 'btp', icon: 'HardHat', count: 67, color: '#d97706', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600' },
  { id: 5, name: 'Éducation & Formation', slug: 'education', icon: 'GraduationCap', count: 31, color: '#7c3aed', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600' },
  { id: 6, name: 'Hôtellerie & Restauration', slug: 'hotel', icon: 'Hotel', count: 54, color: '#db2777', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600' },
  { id: 7, name: 'Agriculture & Agro', slug: 'agro', icon: 'Sprout', count: 28, color: '#16a34a', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600' },
  { id: 8, name: 'Transport & Logistique', slug: 'logistique', icon: 'Truck', count: 45, color: '#4b5563', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600' },
  { id: 9, name: 'Énergie & Mines', slug: 'energie', icon: 'Zap', count: 19, color: '#ca8a04', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600' },
  { id: 10, name: 'Marketing & Comm', slug: 'marketing', icon: 'Megaphone', count: 38, color: '#ea580c', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
  { id: 11, name: 'Ressources Humaines', slug: 'rh', icon: 'Users', count: 25, color: '#2563eb', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600' },
  { id: 12, name: 'Vente & Commerce', slug: 'vente', icon: 'ShoppingCart', count: 72, color: '#9333ea', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600' },
  { id: 13, name: 'Droit & Juridique', slug: 'droit', icon: 'Scale', count: 15, color: '#111827', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600' },
  { id: 14, name: 'Artisanat & Design', slug: 'artisanat', icon: 'Palette', count: 22, color: '#ec4899', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600' },
  { id: 15, name: 'Immobilier', slug: 'immo', icon: 'Home', count: 33, color: '#4f46e5', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600' },
  { id: 16, name: 'Environnement', slug: 'env', icon: 'Leaf', count: 12, color: '#059669', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600' },
  { id: 17, name: 'Sécurité', slug: 'secu', icon: 'Shield', count: 18, color: '#991b1b', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600' },
  { id: 18, name: 'Services Publics', slug: 'public', icon: 'Building', count: 21, color: '#374151', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600' },
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
