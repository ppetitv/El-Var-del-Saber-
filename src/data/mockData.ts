import { getDicebearAvatar } from '../lib/avatar';

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
  avatar: getDicebearAvatar("ElTigreGareca"),
  pr: 1850,
  totalScore: 18450,
  rankingNational: 4532,
  rankingRegional: 15,
  region: "Lima",
  winRate: 68,
  accuracy: 82,
  avgTime: 4.2,
  streak: 7,
  lives: 5,
  matchesPlayed: 142
};

export const mockNewUser = {
  username: "NovatoGol",
  avatar: getDicebearAvatar("NovatoGol"),
  pr: 0,
  totalScore: 0,
  rankingNational: "-",
  rankingRegional: "-",
  region: "Lima",
  winRate: 0,
  accuracy: 0,
  avgTime: 0,
  streak: 0,
  lives: 5,
  matchesPlayed: 0
};

export const mockGuestUser = {
  username: "Jugador Invitado",
  avatar: getDicebearAvatar("Jugador Invitado"),
  pr: 0,
  totalScore: 0,
  rankingNational: 0,
  rankingRegional: 0,
  region: "-",
  winRate: 0,
  accuracy: 0,
  avgTime: 0,
  streak: 0,
  lives: 5,
  matchesPlayed: 0
};

export const mockRanking = [
  { id: 1, username: "ElProfe", avatar: getDicebearAvatar("ElProfe"), pr: 15420, trend: "same" },
  { id: 2, username: "Futbolero99", avatar: getDicebearAvatar("Futbolero99"), pr: 14850, trend: "up" },
  { id: 3, username: "MartinG", avatar: getDicebearAvatar("MartinG"), pr: 14200, trend: "down" },
  { id: 4, username: "Capi7", avatar: getDicebearAvatar("Capi7"), pr: 2300, trend: "up" },
  { id: 5, username: "GoleadorX", avatar: getDicebearAvatar("GoleadorX"), pr: 2100, trend: "same" },
  { id: 6, username: "LaAraña", avatar: getDicebearAvatar("LaAraña"), pr: 1950, trend: "up" },
  { id: 7, username: "MuroDefensivo", avatar: getDicebearAvatar("MuroDefensivo"), pr: 1450, trend: "down" },
  { id: 4532, username: "ElTigreGareca", avatar: getDicebearAvatar("ElTigreGareca"), pr: 1850, trend: "up", isCurrentUser: true },
];
