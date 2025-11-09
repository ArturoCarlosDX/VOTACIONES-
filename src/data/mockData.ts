export interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  image: string;
  category: 'presidencia' | 'alcaldia';
  votes: number;
}

export interface Admin {
  name: string;
  email: string;
  password: string;
}

export const initialCandidates: Candidate[] = [
  {
    id: 'p1',
    name: 'María Fernández',
    party: 'Partido Progreso Nacional',
    description: 'Abogada con 15 años de experiencia en políticas públicas. Propone modernización del estado y transparencia total.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    category: 'presidencia',
    votes: 0
  },
  {
    id: 'p2',
    name: 'Carlos Rodríguez',
    party: 'Alianza Democrática',
    description: 'Economista dedicado a la reducción de la desigualdad. Enfoque en educación y salud universal.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'presidencia',
    votes: 0
  },
  {
    id: 'p3',
    name: 'Ana Martínez',
    party: 'Unión por el Cambio',
    description: 'Ingeniera y empresaria. Promueve innovación tecnológica y desarrollo sostenible.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    category: 'presidencia',
    votes: 0
  },
  {
    id: 'a1',
    name: 'José García',
    party: 'Movimiento Ciudadano',
    description: 'Ex-concejal con experiencia en gestión municipal. Prioriza infraestructura y seguridad.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    category: 'alcaldia',
    votes: 0
  },
  {
    id: 'a2',
    name: 'Laura Sánchez',
    party: 'Juntos por la Ciudad',
    description: 'Activista comunitaria. Enfoque en espacios verdes y transporte público eficiente.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    category: 'alcaldia',
    votes: 0
  },
  {
    id: 'a3',
    name: 'Roberto Díaz',
    party: 'Frente Renovador',
    description: 'Arquitecto urbanista. Propone transformación digital y modernización de servicios.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    category: 'alcaldia',
    votes: 0
  }
];

export const initialAdmins: Admin[] = [
  {
    name: 'Admin Demo',
    email: 'admin@demo.com',
    password: 'Demo123!'
  }
];
