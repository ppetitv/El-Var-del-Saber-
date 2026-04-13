export const mockQuestions = [
  {
    id: 1,
    text: "¿Qué hizo el árbitro Horacio Elizondo tras el famoso cabezazo de Zidane a Materazzi en la final del 2006?",
    options: [
      { id: 'A', label: 'Sacó amarilla a Zidane' },
      { id: 'B', label: 'Pitó el final del partido' },
      { id: 'C', label: 'Expulsó a Zidane tras consultar con el cuarto árbitro' },
      { id: 'D', label: 'Cobró penal para Italia' }
    ],
    correctAnswer: 'C',
    difficulty: 1
  },
  {
    id: 2,
    text: "¿Con qué balón oficial se jugó la final del Mundial 2022?",
    options: [
      { id: 'A', label: 'Al Rihla' },
      { id: 'B', label: 'Al Hilm' },
      { id: 'C', label: 'Brazuca' },
      { id: 'D', label: 'Jabulani' }
    ],
    correctAnswer: 'B',
    difficulty: 2
  },
  {
    id: 3,
    text: "¿A qué leyenda peruana Pelé señaló como su sucesor después de verlo jugar en el Mundial del 70?",
    options: [
      { id: 'A', label: 'Héctor Chumpitaz' },
      { id: 'B', label: 'Hugo Sotil' },
      { id: 'C', label: 'Teófilo Cubillas' },
      { id: 'D', label: 'César Cueto' }
    ],
    correctAnswer: 'C',
    difficulty: 1
  }
];

export const mockUser = {
  username: "ElTigreGareca",
  avatar: "🐯",
  division: "El 10 de la Cancha",
  pr: 1850,
  rankingNational: 4532,
  rankingRegional: 15,
  region: "Lima",
  winRate: 68,
  accuracy: 82,
  avgTime: 4.2,
  streak: 7,
  tickets: 5,
  matchesPlayed: 142
};

export const mockNewUser = {
  username: "NovatoGol",
  avatar: "⚽",
  division: "Amateur",
  pr: 0,
  rankingNational: "-",
  rankingRegional: "-",
  region: "Lima",
  winRate: 0,
  accuracy: 0,
  avgTime: 0,
  streak: 0,
  tickets: 5,
  matchesPlayed: 0
};

export const mockGuestUser = {
  username: "Jugador Invitado",
  avatar: "👤",
  division: "Sin Clasificar",
  pr: 0,
  rankingNational: 0,
  rankingRegional: 0,
  region: "-",
  winRate: 0,
  accuracy: 0,
  avgTime: 0,
  streak: 0,
  tickets: 5,
  matchesPlayed: 0
};

export const mockRanking = [
  { id: 1, username: "ElProfe", avatar: "👨‍🏫", pr: 15420, division: "Dios del Fútbol", trend: "same" },
  { id: 2, username: "Futbolero99", avatar: "⚽", pr: 14850, division: "Dios del Fútbol", trend: "up" },
  { id: 3, username: "MartinG", avatar: "😎", pr: 14200, division: "Dios del Fútbol", trend: "down" },
  { id: 4, username: "Capi7", avatar: "©️", pr: 2300, division: "Crack Indiscutible", trend: "up" },
  { id: 5, username: "GoleadorX", avatar: "👟", pr: 2100, division: "Crack Indiscutible", trend: "same" },
  { id: 6, username: "LaAraña", avatar: "🕷️", pr: 1950, division: "El 10 de la Cancha", trend: "up" },
  { id: 7, username: "MuroDefensivo", avatar: "🧱", pr: 1450, division: "Pelotero Fino", trend: "down" },
  { id: 4532, username: "ElTigreGareca", avatar: "🐯", pr: 1850, division: "El 10 de la Cancha", trend: "up", isCurrentUser: true },
];

export const mockBadges = [
  { id: 'b1', name: 'Goleador', icon: 'star', description: 'Gana 10 partidas consecutivas.', isUnlocked: true, color: 'from-rpp-yellow to-orange-500', progress: 10, total: 10 },
  { id: 'b2', name: 'Rayo', icon: 'zap', description: 'Responde 5 preguntas en menos de 3 segundos cada una.', isUnlocked: true, color: 'from-neon-green to-emerald-600', progress: 5, total: 5 },
  { id: 'b5', name: 'Influencer', icon: 'users', description: 'Comparte tu récord o reta a amigos 5 veces.', isUnlocked: true, color: 'from-cyan-400 to-blue-500', progress: 5, total: 5 },
  { id: 'b3', name: 'Erudito', icon: 'book', description: 'Completa 50 partidas perfectas sin usar comodines.', isUnlocked: false, color: 'from-blue-400 to-blue-600', progress: 12, total: 50 },
  { id: 'b4', name: 'Invencible', icon: 'shield', description: 'Alcanza la división Leyenda en el ranking global.', isUnlocked: false, color: 'from-purple-500 to-pink-600', progress: 0, total: 1 },
  { id: 'b6', name: 'Veterano', icon: 'clock', description: 'Juega durante 30 días seguidos.', isUnlocked: false, color: 'from-gray-400 to-gray-600', progress: 14, total: 30 },
];

export const mockNewUserBadges = mockBadges.map(b => ({ ...b, isUnlocked: false, progress: 0 }));
