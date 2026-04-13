import React, { useState, useEffect } from 'react';
import { Play, Trophy, Star, Zap, Clock, Target, Shield, ChevronRight, Flame, Inbox, Ticket, Share2, X, Video, BookOpen, MonitorPlay, LogIn, LogOut, Lock, Users, Gamepad2, LockKeyhole } from 'lucide-react';
import { mockUser, mockNewUser, mockGuestUser, mockRanking, mockBadges, mockNewUserBadges } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  zap: Zap,
  book: BookOpen,
  shield: Shield,
  users: Users,
  clock: Clock
};

interface VestuarioProps {
  onPlay: () => void;
  tickets: number;
  goldenTickets: number;
  onAddTickets: (amount: number) => void;
  onGoToRanking: () => void;
  onGoToBadges: () => void;
  onGoToDivisions: () => void;
  onGoToInventory: () => void;
  onGoToPrize: () => void;
  isLoggedIn: boolean;
  hasPlayed: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function VestuarioScreen({ 
  onPlay, 
  tickets, 
  goldenTickets,
  onAddTickets, 
  onGoToRanking, 
  onGoToBadges, 
  onGoToDivisions, 
  onGoToInventory,
  onGoToPrize,
  isLoggedIn,
  hasPlayed,
  onLoginClick,
  onLogoutClick
}: VestuarioProps) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [adTimer, setAdTimer] = useState(5);

  const currentUser = isLoggedIn ? (hasPlayed ? mockUser : mockNewUser) : mockGuestUser;
  const currentBadges = isLoggedIn ? (hasPlayed ? mockBadges : mockNewUserBadges) : mockBadges;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adState === 'playing' && adTimer > 0) {
      timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
    } else if (adState === 'playing' && adTimer === 0) {
      setAdState('finished');
      onAddTickets(2);
    }
    return () => clearTimeout(timer);
  }, [adState, adTimer, onAddTickets]);

  const handlePlayClick = () => {
    if (tickets > 0) {
      onPlay();
    } else {
      setShowAdModal(true);
    }
  };

  const handleWatchAd = () => {
    setAdState('playing');
    setAdTimer(5);
  };

  const closeAdModal = () => {
    setShowAdModal(false);
    setTimeout(() => setAdState('idle'), 300);
  };

  const renderDailyMissions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-card-dark rounded-3xl border border-gray-800 overflow-hidden shadow-lg w-full"
    >
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-card-light/20">
        <h2 className="font-bold font-montserrat text-lg flex items-center">
          <Target className="mr-2 text-neon-green" size={20} /> Misiones Diarias
        </h2>
        <span className="text-xs text-gray-400 font-bold bg-gray-800 px-2 py-1 rounded-md">24h</span>
      </div>
      <div className="p-5 flex flex-col gap-5">
        {/* Mission 1 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-white">Juega 3 partidos hoy</p>
            <span className="text-xs font-bold text-rpp-yellow">1/3</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-rpp-yellow h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>
        {/* Mission 2 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-white">Acierta 10 preguntas</p>
            <span className="text-xs font-bold text-rpp-yellow">0/10</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-rpp-yellow h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
        {/* Mission 3 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-white">Supera 2,000 pts</p>
            <span className="text-xs font-bold text-gray-500">0/1</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gray-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTutorial = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full pb-24 md:pb-0"
    >
      <h3 className="text-center text-white font-bold uppercase tracking-widest mb-6 text-sm md:text-base">
        ¿Cómo dominar la cancha?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-dark border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Clock className="text-blue-400" size={24} />
          </div>
          <p className="font-bold text-white mb-2">El reloj es tu rival</p>
          <p className="text-xs text-gray-400">Responde rápido. Cada segundo que pasa, pierdes puntos potenciales.</p>
        </div>
        <div className="bg-card-dark border border-orange-500/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <Zap className="text-orange-500" size={24} />
          </div>
          <p className="font-bold text-white mb-2">Usa tus comodines</p>
          <p className="text-xs text-gray-400">¿Dudas? Usa el VAR o la Hinchada para asegurar tu respuesta correcta.</p>
        </div>
        <div className="bg-card-dark border border-rpp-yellow/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,224,0,0.1)]">
          <div className="w-12 h-12 bg-rpp-yellow/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="text-rpp-yellow" size={24} />
          </div>
          <p className="font-bold text-white mb-2">Precisión = Premios</p>
          <p className="text-xs text-gray-400">Respuestas correctas y rachas te dan más Cupones Dorados para el sorteo.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderPrizeBanner = () => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onGoToPrize}
      className="w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 rounded-3xl p-6 md:p-8 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer relative overflow-hidden group mb-8"
    >
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
      <div className="absolute -right-4 -bottom-8 text-blue-500/10 w-48 h-48 transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Sorteo Semanal</span>
              <span className="text-blue-300 text-xs font-semibold flex items-center"><Clock size={12} className="mr-1"/> Termina en 2d 14h</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-montserrat text-white tracking-tight">PlayStation 5</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {isLoggedIn && (
            <div className="bg-black/40 px-4 py-2 rounded-xl border border-gray-700 flex items-center">
              <Ticket className="text-rpp-yellow mr-2" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Mis Cupones</span>
                <span className="text-lg font-black text-rpp-yellow leading-none">{goldenTickets}</span>
              </div>
            </div>
          )}
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap flex-grow md:flex-grow-0 text-center shadow-lg">
            Ver Detalles
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stadium text-white p-4 md:p-6 font-sans max-w-7xl mx-auto pb-24 md:pb-12">
      
      {/* GLOBAL HEADER */}
      <header className={`flex ${isLoggedIn ? 'flex-col md:flex-row gap-3 md:gap-0' : 'flex-row'} justify-between items-center mb-6 md:mb-8 bg-card-dark p-3 md:p-4 rounded-2xl border border-gray-800 shadow-lg`}>
        <div className={`flex items-center justify-between ${isLoggedIn ? 'w-full md:w-auto' : 'w-full'}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-rpp-yellow rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(255,224,0,0.4)]">
              <MonitorPlay className="text-stadium" size={20} />
            </div>
            <span className="font-black font-montserrat text-lg md:text-xl tracking-tight text-white">
              EL VAR <span className="text-rpp-yellow">DEL SABER</span>
            </span>
          </div>
          
          {/* Auth button on mobile (or always for guests) */}
          <div className={isLoggedIn ? "md:hidden" : "block"}>
            {isLoggedIn ? (
              <button onClick={onLogoutClick} className="p-2 rounded-xl text-gray-500 hover:text-var-red hover:bg-var-red/10 transition-colors" title="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            ) : (
              <button onClick={onLoginClick} className="px-4 py-2 rounded-xl text-sm font-bold bg-rpp-yellow text-stadium hover:bg-yellow-400 transition-colors flex items-center shadow-lg">
                <LogIn size={16} className="mr-2" /> Entrar
              </button>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <nav className="flex space-x-1 md:space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar justify-start md:justify-end items-center">
            <button onClick={onGoToRanking} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-gray-400 hover:text-white hover:bg-card-light transition-colors whitespace-nowrap">Ranking</button>
            <button onClick={onGoToDivisions} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-gray-400 hover:text-white hover:bg-card-light transition-colors whitespace-nowrap">Divisiones</button>
            <button onClick={onGoToInventory} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-gray-400 hover:text-white hover:bg-card-light transition-colors whitespace-nowrap">Inventario</button>
            <button onClick={onGoToBadges} className="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-gray-400 hover:text-white hover:bg-card-light transition-colors whitespace-nowrap">Trofeos</button>
            
            <div className="w-px h-6 bg-gray-800 mx-2 hidden md:block"></div>
            
            {/* Auth button on desktop (only for logged in) */}
            <div className="hidden md:block">
              <button onClick={onLogoutClick} className="p-2 rounded-xl text-gray-500 hover:text-var-red hover:bg-var-red/10 transition-colors ml-2" title="Cerrar Sesión">
                <LogOut size={20} />
              </button>
            </div>
          </nav>
        )}
      </header>

      {!isLoggedIn && (
        /* GUEST FUNNEL VIEW */
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-4 md:mt-12 space-y-12">
          {/* Clean Pitch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-card-light rounded-full flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(255,224,0,0.2)] border-4 border-gray-800">
              <Trophy className="text-rpp-yellow" size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-montserrat mb-4">
              Demuestra cuánto sabes de fútbol y <span className="text-blue-400">gana una PS5</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pon a prueba tus conocimientos en la trivia definitiva. Juega gratis, domina el ranking y participa por fabulosos premios todas las semanas.
            </p>
          </motion.div>

          {/* Main CTA (Desktop only, mobile uses sticky bottom) */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full max-w-xl hidden md:block"
          >
            <button
              onClick={handlePlayClick}
              className="w-full bg-rpp-yellow text-stadium font-montserrat font-black text-2xl md:text-3xl py-8 rounded-3xl shadow-[0_0_40px_rgba(255,224,0,0.5)] flex flex-col items-center justify-center hover:shadow-[0_0_60px_rgba(255,224,0,0.7)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <div className="flex items-center relative z-10">
                <Play className="mr-3" fill="currentColor" size={36} /> COMENZAR A JUGAR
              </div>
              <p className="text-sm font-bold text-stadium/70 mt-2 relative z-10 flex items-center">
                Regístrate gratis y asegura tu lugar en el ranking
              </p>
            </button>
          </motion.div>

          {/* Quick-Start Tutorial */}
          {renderTutorial()}
        </div>
      )}

      {isLoggedIn && !hasPlayed && (
        /* NEW ONBOARDING VIEW */
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-8 md:mt-12 space-y-12">
          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-card-light rounded-full flex items-center justify-center text-5xl border-4 border-rpp-yellow mx-auto mb-6 shadow-[0_0_30px_rgba(255,224,0,0.3)]">
              {currentUser.avatar}
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-montserrat mb-4">
              ¡Bienvenido a la cancha, <span className="text-rpp-yellow">{currentUser.username}</span>!
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tu carrera hacia la gloria comienza aquí. Estás a un partido de desbloquear tu potencial.
            </p>
          </motion.div>

          {/* Main CTA (Desktop only, mobile uses sticky bottom) */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full max-w-xl hidden md:block"
          >
            <button
              onClick={handlePlayClick}
              className="w-full bg-rpp-yellow text-stadium font-montserrat font-black text-2xl md:text-3xl py-8 rounded-3xl shadow-[0_0_40px_rgba(255,224,0,0.5)] flex flex-col items-center justify-center hover:shadow-[0_0_60px_rgba(255,224,0,0.7)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <div className="flex items-center relative z-10">
                <Play className="mr-3" fill="currentColor" size={36} /> JUGAR MI PRIMER PARTIDO
              </div>
              <p className="text-sm font-bold text-stadium/70 mt-2 relative z-10 flex items-center">
                <Ticket size={16} className="mr-1" /> Gana tu primer Cupón Dorado para la PS5
              </p>
            </button>
          </motion.div>

          {/* Quick-Start Tutorial */}
          {renderTutorial()}
        </div>
      )}

      {isLoggedIn && hasPlayed && (
        /* LOGGED IN GRID VIEW */
        <>
          {/* WEEKLY PRIZE BANNER */}
          {renderPrizeBanner()}

          <div className="md:grid md:grid-cols-12 md:gap-8">
            
            {/* LEFT COLUMN (Profile & Stats) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
            {/* HEADER: User Info */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-card-dark p-6 rounded-3xl border border-gray-800 shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`w-16 h-16 bg-card-light rounded-full flex items-center justify-center text-3xl border-2 z-10 relative border-rpp-yellow`}>
                    {currentUser.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-rpp-yellow text-stadium text-xs font-bold px-2 py-0.5 rounded-full z-20">
                    Lvl 12
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold font-montserrat">{currentUser.username}</h1>
                  <p className="text-gray-400 text-sm">@{currentUser.username.toLowerCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center justify-end space-x-1 mb-1 text-rpp-yellow`}>
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold font-montserrat">{currentUser.pr}</span>
                </div>
                <p className="text-xs text-gray-400">Puntos</p>
              </div>
            </motion.div>

            {/* LEVEL PROGRESS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-card-dark p-6 rounded-3xl border border-gray-800 shadow-lg relative overflow-hidden group transition-colors cursor-pointer hover:border-rpp-yellow/50`}
              onClick={onGoToDivisions}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-rpp-yellow" />
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">División Actual</p>
                  <p className={`font-bold font-montserrat text-xl text-white`}>{currentUser.division}</p>
                </div>
                <p className="text-sm font-bold text-rpp-yellow bg-rpp-yellow/10 px-3 py-1 rounded-lg">Top #{currentUser.rankingNational}</p>
              </div>
              <div className="w-full bg-stadium rounded-full h-3 border border-gray-800 mb-2">
                <div className={`h-3 rounded-full relative bg-rpp-yellow`} style={{ width: '68%' }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,224,0,0.8)]"></div>
                </div>
              </div>
              <p className={`text-xs text-center font-semibold uppercase tracking-wider mt-4 transition-colors text-gray-500 group-hover:text-rpp-yellow`}>
                Ver Sistema de Divisiones
              </p>
            </motion.div>

            {/* STATS GRID */}
            {hasPlayed ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 relative"
              >
                <div className={`bg-card-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-800 transition-colors hover:border-rpp-yellow/50`}>
                  <Gamepad2 size={20} className="text-purple-400 mb-2" />
                  <p className="text-2xl font-black font-montserrat">{currentUser.matchesPlayed}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Partidos</p>
                </div>
                <div className={`bg-card-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-800 transition-colors hover:border-rpp-yellow/50`}>
                  <Target size={20} className="text-neon-green mb-2" />
                  <p className="text-2xl font-black font-montserrat">{currentUser.accuracy}%</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Precisión</p>
                </div>
                <div className={`bg-card-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-800 transition-colors hover:border-rpp-yellow/50`}>
                  <Trophy size={20} className="text-rpp-yellow mb-2" />
                  <p className="text-2xl font-black font-montserrat">{currentUser.winRate}%</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Win Rate</p>
                </div>
                <div className={`bg-card-dark rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-800 transition-colors hover:border-rpp-yellow/50`}>
                  <Clock size={20} className="text-blue-400 mb-2" />
                  <p className="text-2xl font-black font-montserrat">{currentUser.avgTime}s</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Tiempo</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card-dark rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-800 border-dashed"
              >
                <Target size={24} className="text-gray-600 mb-2" />
                <p className="text-sm font-bold text-gray-500">Estadísticas Ocultas</p>
                <p className="text-xs text-gray-600 text-center mt-1">Juega tu primer partido para revelar tu precisión y win rate.</p>
              </motion.div>
            )}

            {/* DAILY MISSIONS */}
            {renderDailyMissions()}

            {/* DESKTOP CTA */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlayClick}
              className="hidden md:flex w-full bg-rpp-yellow text-stadium font-montserrat font-black text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(255,224,0,0.3)] items-center justify-center hover:shadow-[0_0_40px_rgba(255,224,0,0.5)] transition-shadow"
            >
              <Play className="mr-2" fill="currentColor" size={24} /> JUGAR PARTIDO
            </motion.button>
          </div>

          {/* RIGHT COLUMN (Activity & Inventory) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8 mt-8 md:mt-0">
            
            {/* STREAK BANNER */}
            {currentUser.streak > 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card-dark border border-orange-500/30 rounded-3xl p-4 md:p-6 flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mr-4">
                    <Flame className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">¡Estás en racha!</p>
                    <p className="text-xl md:text-2xl font-black font-montserrat text-white">
                      {currentUser.streak} Victorias
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card-dark border border-gray-800 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between shadow-lg"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                    <Flame className="text-gray-500" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Racha de Victorias</p>
                    <p className="text-sm font-medium text-gray-500">
                      Juega tu primer partido para iniciar tu racha.
                    </p>
                  </div>
                </div>
                <button onClick={handlePlayClick} className="text-rpp-yellow text-sm font-bold bg-rpp-yellow/10 px-4 py-2 rounded-xl hover:bg-rpp-yellow/20 transition-colors whitespace-nowrap">
                  Jugar Ahora
                </button>
              </motion.div>
            )}

            {/* BADGES & INVENTORY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BADGES */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`bg-card-dark p-6 rounded-3xl border border-gray-800 relative overflow-hidden group transition-colors cursor-pointer hover:border-rpp-yellow/50`}
                onClick={onGoToBadges}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="text-rpp-yellow" />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold font-montserrat text-lg flex items-center">
                    <Shield className="mr-2 text-rpp-yellow" size={20} /> Mis Insignias
                  </h2>
                </div>
                <div className="flex space-x-6 overflow-x-auto pb-2 hide-scrollbar">
                  {currentBadges.slice(0, 3).map((badge) => {
                    const IconComponent = iconMap[badge.icon] || Star;
                    return (
                      <div key={badge.id} className="flex flex-col items-center min-w-[80px]">
                        <div className={`w-16 h-16 hexagon flex items-center justify-center mb-3 shadow-lg ${
                          badge.isUnlocked 
                            ? `bg-gradient-to-br ${badge.color}` 
                            : 'bg-card-light border-2 border-gray-700 opacity-50'
                        }`}>
                          <IconComponent size={24} className={badge.isUnlocked ? "text-stadium" : "text-gray-600"} fill={badge.isUnlocked ? "currentColor" : "none"} />
                        </div>
                        <p className={`text-xs font-semibold text-center ${badge.isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                          {badge.isUnlocked ? badge.name : 'Bloqueado'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className={`text-xs text-center font-semibold uppercase tracking-wider mt-4 transition-colors text-gray-500 group-hover:text-rpp-yellow`}>
                  Ver sala de trofeos
                </p>
              </motion.div>

              {/* INVENTORY */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`bg-card-dark p-6 rounded-3xl border border-gray-800 flex flex-col justify-center relative overflow-hidden ${hasPlayed ? 'group cursor-pointer hover:border-rpp-yellow/50 transition-colors' : ''}`}
                onClick={hasPlayed ? onGoToInventory : undefined}
              >
                {hasPlayed && (
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="text-rpp-yellow" />
                  </div>
                )}
                 <h2 className="font-bold font-montserrat text-lg flex items-center mb-6">
                    <Ticket className="mr-2 text-rpp-yellow" size={20} /> Inventario
                  </h2>
                <div className="flex justify-between items-center bg-stadium p-4 rounded-2xl border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-rpp-yellow/10 rounded-xl flex items-center justify-center mr-4">
                      <Ticket className="text-rpp-yellow" size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Tickets Diarios</p>
                      <p className="text-xs text-gray-400">Se recargan en 4h 20m</p>
                    </div>
                  </div>
                  <div className="text-3xl font-black font-montserrat text-rpp-yellow">
                    {tickets}<span className="text-lg text-gray-500">/5</span>
                  </div>
                </div>
                <p className={`text-xs text-center font-semibold uppercase tracking-wider mt-4 ${hasPlayed ? 'text-gray-500 group-hover:text-rpp-yellow transition-colors' : 'text-neon-green'}`}>
                  {hasPlayed ? 'Ver detalles y recargar' : 'Inventario Lleno - ¡Listo para jugar!'}
                </p>
              </motion.div>
            </div>

            {/* ASCENSION ZONE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card-dark rounded-3xl border border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="font-bold font-montserrat text-lg flex items-center">
                  <Flame className="mr-2 text-orange-500" size={20} /> Tu Zona de Ascenso
                </h2>
                <button onClick={onGoToRanking} className="text-xs text-rpp-yellow font-bold hover:underline flex items-center">
                  Ver Ranking <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
              
              {hasPlayed ? (
                <div className="divide-y divide-gray-800">
                  {/* Rival Above */}
                  <div className="p-4 md:p-6 flex items-center justify-between hover:bg-card-light/30 transition-colors">
                    <div className="flex items-center">
                      <span className="w-12 flex-shrink-0 text-center font-black text-sm text-gray-500">#{Number(currentUser.rankingNational) - 1}</span>
                      <div className="w-10 h-10 bg-card-light rounded-full flex items-center justify-center text-lg mx-3 border border-gray-700">
                        😎
                      </div>
                      <div>
                        <p className="font-bold text-white">MartinG</p>
                        <p className="text-xs text-var-red">A 250 pts de distancia</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-300">2,100 PR</span>
                  </div>
                  
                  {/* Current User */}
                  <div className="p-4 md:p-6 flex items-center justify-between bg-rpp-yellow/10 border-l-4 border-rpp-yellow">
                    <div className="flex items-center">
                      <span className="w-12 flex-shrink-0 text-center font-black text-sm text-rpp-yellow">#{currentUser.rankingNational}</span>
                      <div className="w-10 h-10 bg-card-light rounded-full flex items-center justify-center text-lg mx-3 border border-rpp-yellow">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-rpp-yellow">{currentUser.username} <span className="text-xs opacity-70">(Tú)</span></p>
                        <p className="text-xs text-gray-400">{currentUser.division}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-rpp-yellow">{currentUser.pr} PR</span>
                  </div>

                  {/* Rival Below */}
                  <div className="p-4 md:p-6 flex items-center justify-between hover:bg-card-light/30 transition-colors">
                    <div className="flex items-center">
                      <span className="w-12 flex-shrink-0 text-center font-black text-sm text-gray-500">#{Number(currentUser.rankingNational) + 1}</span>
                      <div className="w-10 h-10 bg-card-light rounded-full flex items-center justify-center text-lg mx-3 border border-gray-700">
                        🧱
                      </div>
                      <div>
                        <p className="font-bold text-white">MuroDefensivo</p>
                        <p className="text-xs text-neon-green">Superado por 400 pts</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-300">1,450 PR</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-card-light rounded-full flex items-center justify-center mb-4">
                    <Trophy className="text-gray-500" size={32} />
                  </div>
                  <p className="font-bold text-lg mb-2">Sin Clasificar</p>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Juega tu primer partido para entrar al ranking y ver a tus rivales directos.
                  </p>
                </div>
              )}
            </motion.div>

          </div>
          </div>
        </>
      )}

      {/* MOBILE FIXED BOTTOM CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stadium via-stadium to-stadium/90 backdrop-blur-sm z-50 pb-6">
        <div className="max-w-md mx-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={(!isLoggedIn || !hasPlayed) ? { scale: [1, 1.02, 1] } : {}}
            transition={(!isLoggedIn || !hasPlayed) ? { repeat: Infinity, duration: 2 } : {}}
            onClick={handlePlayClick}
            className="w-full bg-rpp-yellow text-stadium font-montserrat font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(255,224,0,0.3)] flex flex-col items-center justify-center"
          >
            <div className="flex items-center text-lg">
              <Play className="mr-2" fill="currentColor" size={20} /> 
              {!isLoggedIn ? 'COMENZAR A JUGAR' : (hasPlayed ? 'JUGAR PARTIDO' : 'JUGAR MI PRIMER PARTIDO')}
            </div>
            {(!isLoggedIn || !hasPlayed) && (
              <p className="text-xs font-bold text-stadium/80 mt-1 flex items-center">
                {!isLoggedIn ? 'Regístrate gratis' : <><Ticket size={14} className="mr-1" /> Gana tu primer Cupón Dorado</>}
              </p>
            )}
          </motion.button>
        </div>
      </div>

      {/* AD MODAL */}
      <AnimatePresence>
        {showAdModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card-dark border border-gray-800 rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
            >
              {adState === 'idle' && (
                <button onClick={closeAdModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              )}

              {adState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-16 h-16 bg-var-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="text-var-red" size={32} />
                  </div>
                  <h3 className="text-2xl font-black font-montserrat mb-2">¡Sin Tickets!</h3>
                  <p className="text-gray-400 mb-6">Te has quedado sin tickets para jugar. Mira un video corto de nuestro sponsor y obtén 2 tickets extra al instante.</p>
                  <button 
                    onClick={handleWatchAd}
                    className="w-full bg-rpp-yellow text-stadium font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Video className="mr-2" size={20} /> VER VIDEO SPONSOR
                  </button>
                </motion.div>
              )}

              {adState === 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <div className="w-full aspect-video bg-stadium rounded-xl border border-gray-800 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                      Publicidad
                    </div>
                    <Star className="text-gray-600 mb-2" size={40} />
                    <p className="font-bold text-gray-500">SPONSOR OFICIAL</p>
                    
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-rpp-yellow transition-all duration-1000 ease-linear" style={{ width: `${((5 - adTimer) / 5) * 100}%` }} />
                  </div>
                  <p className="font-bold font-montserrat text-xl">El video termina en {adTimer}s...</p>
                </motion.div>
              )}

              {adState === 'finished' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="text-neon-green" size={40} />
                  </div>
                  <h3 className="text-2xl font-black font-montserrat mb-2 text-neon-green">¡Tickets Recargados!</h3>
                  <p className="text-gray-400 mb-6">Has recibido 2 tickets extra. ¡Vuelve a la cancha!</p>
                  <button 
                    onClick={() => {
                      closeAdModal();
                      onPlay();
                    }}
                    className="w-full bg-neon-green text-stadium font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Play className="mr-2" size={20} fill="currentColor" /> JUGAR AHORA
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
