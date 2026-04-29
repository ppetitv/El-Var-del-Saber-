import React, { useState, useEffect, useMemo } from 'react';
import { Play, Trophy, Star, Clock, Target, Flame, Ticket, Heart, X, Video, MonitorPlay, LogIn, LogOut, Gamepad2, ChevronRight } from 'lucide-react';
import { mockUser, mockNewUser, mockGuestUser } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import PrizeProduct from '../components/PrizeProduct';

interface VestuarioProps {
  onPlay: () => void;
  lives: number;
  goldenCoupons: number;
  onAddLives: (amount: number) => void;
  onGoToRanking: () => void;
  onGoToPrize: () => void;
  onGoToFaq: () => void;
  isLoggedIn: boolean;
  hasPlayed: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function VestuarioScreen({
  onPlay,
  lives,
  goldenCoupons,
  onAddLives,
  onGoToRanking,
  onGoToPrize,
  onGoToFaq,
  isLoggedIn,
  hasPlayed,
  onLoginClick,
  onLogoutClick
}: VestuarioProps) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [adTimer, setAdTimer] = useState(5);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingTarget, setOnboardingTarget] = useState<DOMRect | null>(null);

  const currentUser = isLoggedIn ? (hasPlayed ? mockUser : mockNewUser) : mockGuestUser;
  const onboardingSteps = useMemo(() => {
    const introStep = {
      target: 'brand',
      title: 'Así funciona el juego',
      body: 'Juegas trivias cortas de fútbol, sumas puntaje y avanzas en una dinámica de vidas, PR, cupones y premios.'
    };
    const playStep = {
      target: 'primary-play',
      title: 'Cada partida consume 1 vida',
      body: 'Presiona jugar para iniciar una ronda. Si tienes vidas disponibles, entras al cuestionario y compites por mejorar tu puntaje.'
    };
    const tipsStep = {
      target: 'tutorial',
      title: 'Responde mejor para subir tu PR',
      body: 'Tu PR refleja tu mejor rendimiento. Responder rápido, acertar más y usar comodines te ayuda a mejorar tu posición.'
    };
    const registrationStep = {
      target: 'login-entry',
      title: 'Regístrate para participar por premios',
      body: 'Puedes probar sin cuenta, pero necesitas registrarte para guardar tu avance, conservar cupones y entrar a sorteos.'
    };
    const prizeStep = {
      target: 'prize-banner',
      title: 'Los Cupones Dorados son tus oportunidades',
      body: 'Cada cupón cuenta como una participación para el sorteo semanal. Mientras más acumules, más oportunidades tienes.'
    };

    if (!isLoggedIn) {
      return [
        introStep,
        playStep,
        tipsStep,
        registrationStep
      ];
    }

    if (!hasPlayed) {
      return [
        introStep,
        prizeStep,
        playStep,
        tipsStep
      ];
    }

    return [
      {
        target: 'dashboard-summary',
        title: 'Tu vestuario resume qué hacer ahora',
        body: 'Desde aquí decides si juegas otra ronda, revisas tus vidas, miras el ranking o sigues acumulando cupones.'
      },
      {
        target: 'lives-card',
        title: 'Tus vidas controlan las partidas',
        body: 'Cada partida consume 1 vida. Si te quedas sin vidas, puedes recargar viendo un video sponsor.'
      },
      prizeStep,
      {
        target: 'ranking-preview',
        title: 'Ranking y PR',
        body: 'El ranking compara tu rendimiento con otros jugadores. Tu PR es la referencia de tu mejor marca.'
      },
      {
        target: 'primary-play',
        title: 'Sigue jugando para aumentar tus opciones',
        body: 'Más partidas significan más oportunidades de mejorar tu PR y sumar cupones para el premio semanal.'
      }
    ];
  }, [hasPlayed, isLoggedIn]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adState === 'playing' && adTimer > 0) {
      timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
    } else if (adState === 'playing' && adTimer === 0) {
      setAdState('finished');
      onAddLives(2);
    }
    return () => clearTimeout(timer);
  }, [adState, adTimer, onAddLives]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // No sale automáticamente si no está logueado
    if (!isLoggedIn) return;
    // Solo sale automáticamente una vez
    if (window.localStorage.getItem('varSaberOnboardingSeen') === 'true') return;

    const timer = window.setTimeout(() => setShowOnboarding(true), 700);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!showOnboarding) return;
    let targetTimer: number | undefined;

    const findVisibleTarget = (target: string) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(`[data-onboarding="${target}"]`));
      return elements.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    };

    const syncTarget = () => {
      const current = onboardingSteps[onboardingStep];
      const element = current ? findVisibleTarget(current.target) : null;

      if (!element) {
        setOnboardingTarget(null);
        return;
      }

      setOnboardingTarget(element.getBoundingClientRect());
    };

    const moveToTarget = () => {
      const current = onboardingSteps[onboardingStep];
      const element = current ? findVisibleTarget(current.target) : null;

      if (!element) {
        setOnboardingTarget(null);
        return;
      }

      element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      targetTimer = window.setTimeout(syncTarget, 260);
    };

    moveToTarget();
    window.addEventListener('resize', syncTarget);
    window.addEventListener('scroll', syncTarget, true);

    return () => {
      if (targetTimer) window.clearTimeout(targetTimer);
      window.removeEventListener('resize', syncTarget);
      window.removeEventListener('scroll', syncTarget, true);
    };
  }, [onboardingStep, onboardingSteps, showOnboarding]);

  const completeOnboarding = () => {
    // Solo guardamos que ya lo vio si está logueado, para que el del vestuario salga auto
    if (isLoggedIn) {
      window.localStorage.setItem('varSaberOnboardingSeen', 'true');
    }
    setShowOnboarding(false);
  };

  const replayOnboarding = () => {
    setOnboardingStep(0);
    setShowOnboarding(true);
  };

  const goToNextOnboardingStep = () => {
    if (onboardingStep >= onboardingSteps.length - 1) {
      completeOnboarding();
      return;
    }

    setOnboardingStep(prev => prev + 1);
  };

  const handlePlayClick = () => {
    if (lives > 0) {
      onPlay();
      return;
    }
    setShowAdModal(true);
  };

  const handleWatchAd = () => {
    setAdState('playing');
    setAdTimer(5);
  };

  const closeAdModal = () => {
    setShowAdModal(false);
    setTimeout(() => setAdState('idle'), 300);
  };

  const renderTutorial = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full pb-24 md:pb-0"
      data-onboarding="tutorial"
    >
      <div className="info-card premium-soft-panel rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs">
            Cómo se juega
          </h3>
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.18em]">Mecánica base</span>
        </div>
        <div className="tutorial-info-list">
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
              <Heart className="text-blue-400" size={16} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1">Usa vidas</p>
              <p className="text-xs text-gray-400 leading-relaxed">Cada partida consume 1 vida.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-orange-500/15 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="text-orange-500" size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1">Juega trivias cortas</p>
              <p className="text-xs text-gray-400 leading-relaxed">Responde rápido para mejorar tu PR.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-rpp-yellow/15 rounded-lg flex items-center justify-center shrink-0">
              <Trophy className="text-rpp-yellow" size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1">Gana cupones</p>
              <p className="text-xs text-gray-400 leading-relaxed">Son oportunidades para el sorteo.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
              <LogIn className="text-neon-green" size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1">Registra tu avance</p>
              <p className="text-xs text-gray-400 leading-relaxed">Necesitas cuenta para participar.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPrizeBanner = () => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onGoToPrize}
      className="prize-banner-card premium-panel w-full rounded-2xl p-4 border border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.08)] cursor-pointer relative overflow-hidden group"
      data-onboarding="prize-banner"
    >
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-500/12 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="premium-icon-wrap shrink-0 bg-blue-500/10 border-blue-400/20 w-10 h-10 rounded-xl">
            <Trophy className="text-blue-400" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-blue-500 text-white text-[9px] font-bold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full">Sorteo semanal</span>
              <span className="text-blue-300 text-xs font-semibold flex items-center">
                <Clock size={12} className="mr-1" /> Termina en 2d 14h
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="premium-title text-lg md:text-xl font-black font-montserrat text-white tracking-tight">PlayStation 5</h3>
              {isLoggedIn && (
                <div className="bg-rpp-yellow/10 px-2 py-1 rounded-lg border border-rpp-yellow/20 flex items-center gap-2 shadow-sm">
                  <Ticket className="text-rpp-yellow" size={14} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#d09b00' }}>Mis Cupones:</span>
                    <span className="text-xs font-black text-rpp-yellow leading-none">{goldenCoupons}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
            <PrizeProduct variant="banner" />
            <button className="premium-button-secondary text-white font-bold py-2.5 px-6 rounded-xl transition-colors whitespace-nowrap min-w-[120px] text-sm">
              Ver Detalles
            </button>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Acción para T&C
            }}
            className="text-[10px] text-gray-500 hover:text-blue-400 transition-colors font-medium underline underline-offset-4"
          >
            Ver términos y condiciones
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderProfileCard = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="info-card premium-panel flex items-center justify-between p-4 rounded-2xl shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-card-light rounded-full flex items-center justify-center text-xl border border-rpp-yellow">
            {currentUser.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rpp-yellow text-stadium text-xs font-bold px-2 py-0.5 rounded-full">
            PR
          </div>
        </div>
        <div>
          <h1 className="text-base font-bold font-montserrat">{currentUser.username}</h1>
          <p className="text-gray-400 text-xs">@{currentUser.username.toLowerCase()}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end space-x-1 mb-1 text-rpp-yellow">
          <Star size={14} fill="currentColor" />
          <span className="font-bold font-montserrat text-sm">{currentUser.pr}</span>
        </div>
        <p className="text-xs text-gray-400">Mejor Puntaje</p>
      </div>
    </motion.div>
  );

  const renderStatsGrid = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-2.5"
    >
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Gamepad2 size={16} className="text-purple-400 mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.matchesPlayed}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Partidos</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Target size={16} className="text-neon-green mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.accuracy}%</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Precisión</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Trophy size={16} className="text-rpp-yellow mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.winRate}%</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Win Rate</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Clock size={16} className="text-blue-400 mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.avgTime}s</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Tiempo</p>
      </div>
    </motion.div>
  );

  const renderLivesCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="info-card premium-panel p-4 rounded-2xl shadow-lg"
      data-onboarding="lives-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-[0.16em]">Vidas</p>
          <p className="font-bold font-montserrat text-base text-white">Listo para seguir jugando</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black font-montserrat text-rpp-yellow inline-flex items-center justify-end gap-1">
            <Heart size={18} fill="currentColor" />
            {lives}<span className="text-base text-gray-500">/5</span>
          </p>
          <p className="text-[11px] text-gray-400">Recarga por tiempo</p>
        </div>
      </div>
      <div className="w-full bg-stadium rounded-full h-3 border border-gray-800">
        <div className="h-3 rounded-full bg-rpp-yellow" style={{ width: `${(lives / 5) * 100}%` }} />
      </div>
      <p className="text-[11px] text-gray-500 mt-2.5">Si te quedas sin vidas, puedes recargarlas viendo un video sponsor.</p>
    </motion.div>
  );

  const renderRankingPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="info-card ranking-preview-card premium-panel rounded-2xl overflow-hidden"
      data-onboarding="ranking-preview"
    >
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="font-bold font-montserrat text-sm flex items-center">
          <Flame className="mr-2 text-orange-500" size={18} /> Ranking Cercano
        </h2>
        <button onClick={onGoToRanking} className="text-xs text-rpp-yellow font-bold hover:underline flex items-center">
          Ver Ranking <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="divide-y divide-gray-800">
          <div className="ranking-preview-row p-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-gray-500">#{Number(currentUser.rankingNational) - 1}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-gray-700">
              😎
            </div>
            <div>
              <p className="font-bold text-white text-sm">MartinG</p>
              <p className="text-[11px] text-var-red">A 250 pts de distancia</p>
            </div>
          </div>
          <span className="font-bold text-xs text-gray-300">2,100 PR</span>
        </div>

          <div className="ranking-preview-row ranking-preview-row-current p-3.5 flex items-center justify-between bg-rpp-yellow/10 border-l-4 border-rpp-yellow">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-rpp-yellow">#{currentUser.rankingNational}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-rpp-yellow">
              {currentUser.avatar}
            </div>
            <div>
              <p className="font-bold text-rpp-yellow text-sm">{currentUser.username} <span className="text-[11px] opacity-70">(Tú)</span></p>
              <p className="text-[11px] text-gray-400">Tu mejor marca actual</p>
            </div>
          </div>
          <span className="font-bold text-xs text-rpp-yellow">{currentUser.pr} PR</span>
        </div>

          <div className="ranking-preview-row p-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-gray-500">#{Number(currentUser.rankingNational) + 1}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-gray-700">
              🧱
            </div>
            <div>
              <p className="font-bold text-white text-sm">MuroDefensivo</p>
              <p className="text-[11px] text-neon-green">Ya lo superaste por 400 pts</p>
            </div>
          </div>
          <span className="font-bold text-xs text-gray-300">1,450 PR</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stadium text-white p-4 md:p-5 font-sans max-w-6xl mx-auto pb-24 md:pb-12">
      <header className={`premium-panel ${isLoggedIn ? 'flex-col md:flex-row gap-3 md:gap-0' : 'flex-row'} flex justify-between items-center mb-5 md:mb-6 p-3 rounded-2xl shadow-lg`}>
        <div className={`flex items-center justify-between ${isLoggedIn ? 'w-full md:w-auto' : 'w-full'}`}>
          <div className="flex items-center" data-onboarding="brand">
            <div className="w-8 h-8 bg-rpp-yellow rounded-lg flex items-center justify-center mr-3 shadow-[0_0_12px_rgba(255,224,0,0.24)]">
              <MonitorPlay className="text-stadium" size={18} />
            </div>
            <div>
              <span className="premium-topline">Quiz en vivo</span>
              <span className="premium-title block font-black font-montserrat text-base md:text-lg tracking-tight text-white">
                EL VAR <span className="text-rpp-yellow">DEL SABER</span>
              </span>
            </div>
          </div>

          <div className={isLoggedIn ? 'md:hidden' : 'block'}>
            {isLoggedIn ? (
              <button onClick={onLogoutClick} className="p-2 rounded-xl text-gray-500 hover:text-var-red hover:bg-var-red/10 transition-colors" title="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={replayOnboarding} className="premium-nav-btn px-3 py-2 rounded-xl text-sm font-bold">
                  Cómo jugar
                </button>
                <button onClick={onGoToFaq} className="premium-nav-btn px-3 py-2 rounded-xl text-sm font-bold">
                  FAQ
                </button>
                <button onClick={onLoginClick} data-onboarding="login-entry" className="premium-button-primary px-3.5 py-2 rounded-xl text-sm font-bold flex items-center">
                  <LogIn size={16} className="mr-2" /> Entrar
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <nav className="flex space-x-1 md:space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar justify-start md:justify-end items-center">
            <button onClick={onGoToRanking} className="premium-nav-btn whitespace-nowrap">Ranking</button>
            <button onClick={onGoToPrize} className="premium-nav-btn whitespace-nowrap">Sorteo</button>
            <button onClick={onGoToFaq} className="premium-nav-btn whitespace-nowrap">FAQ</button>
            <button onClick={replayOnboarding} className="premium-nav-btn whitespace-nowrap">Cómo jugar</button>

            <div className="w-px h-6 bg-gray-800 mx-2 hidden md:block"></div>

            <div className="hidden md:block">
              <button onClick={onLogoutClick} className="p-2 rounded-xl text-gray-500 hover:text-var-red hover:bg-var-red/10 transition-colors ml-2" title="Cerrar Sesión">
                <LogOut size={20} />
              </button>
            </div>
          </nav>
        )}
      </header>

      {!isLoggedIn && (
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-4 md:mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-card-light rounded-full flex items-center justify-center mb-5 mx-auto shadow-[0_0_24px_rgba(255,224,0,0.14)] border border-gray-800">
              <Trophy className="text-rpp-yellow" size={40} />
            </div>
            <h1 className="premium-title text-3xl md:text-4xl font-black font-montserrat mb-3">
              Demuestra cuánto sabes de fútbol y <span className="text-blue-400">gana una PS5</span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Trivia deportiva de partidas cortas. Juega gratis, mejora tu mejor puntaje y compite en el ranking global.
            </p>
            <div className="flex justify-center mb-4">
              <PrizeProduct variant="hero" />
            </div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full max-w-lg hidden md:block"
          >
            <button
              onClick={handlePlayClick}
              data-onboarding="primary-play"
              className="premium-button-primary w-full font-montserrat font-black text-xl md:text-2xl py-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-[0_0_40px_rgba(255,224,0,0.35)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <div className="flex items-center relative z-10">
                <Play className="mr-3" fill="currentColor" size={28} /> COMENZAR A JUGAR
              </div>
              <p className="text-xs font-bold text-stadium/70 mt-2 relative z-10">Juega primero, regístrate después si quieres guardar tu avance</p>
            </button>
          </motion.div>

          {renderTutorial()}
        </div>
      )}

      {isLoggedIn && !hasPlayed && (
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-6 md:mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="premium-chip mx-auto w-fit mb-5">Tu cuenta está lista</div>
            <div className="w-20 h-20 bg-card-light rounded-full flex items-center justify-center text-4xl border border-rpp-yellow mx-auto mb-5 shadow-[0_0_24px_rgba(255,224,0,0.18)]">
              {currentUser.avatar}
            </div>
            <h1 className="premium-title text-3xl md:text-4xl font-black font-montserrat mb-3">
              ¡Bienvenido a la cancha, <span className="text-rpp-yellow">{currentUser.username}</span>!
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Empieza con una partida, marca tu primer PR y participa en el ranking global.
            </p>
          </motion.div>

          {renderPrizeBanner()}

          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full max-w-lg hidden md:block"
          >
            <button
              onClick={handlePlayClick}
              data-onboarding="primary-play"
              className="premium-button-primary w-full font-montserrat font-black text-xl md:text-2xl py-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-[0_0_40px_rgba(255,224,0,0.35)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <div className="flex items-center relative z-10">
                <Play className="mr-3" fill="currentColor" size={28} /> JUGAR MI PRIMER PARTIDO
              </div>
              <p className="text-xs font-bold text-stadium/70 mt-2 relative z-10 flex items-center">
                <Ticket size={16} className="mr-1" /> Gana tu primer Cupón Dorado para la PS5
              </p>
            </button>
          </motion.div>

          {renderTutorial()}
        </div>
      )}

      {isLoggedIn && hasPlayed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="info-card premium-panel rounded-2xl p-4 md:p-5"
                data-onboarding="dashboard-summary"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="premium-topline mb-2">Tu vestuario</div>
                    <h2 className="premium-title text-2xl md:text-3xl font-black font-montserrat text-white mb-2">
                      Sigue jugando para mejorar tu PR
                    </h2>
                    <p className="text-sm text-gray-400 max-w-xl">
                      Tu progreso hoy depende de tres cosas: jugar otra ronda, cuidar tus vidas y sumar cupones para el premio semanal.
                    </p>
                  </div>
                  <button
                    onClick={handlePlayClick}
                    data-onboarding="primary-play"
                    className="premium-button-primary w-full md:w-auto font-montserrat font-black text-sm md:text-base py-3.5 px-5 rounded-xl flex items-center justify-center whitespace-nowrap"
                  >
                    <Play className="mr-2" fill="currentColor" size={20} /> JUGAR PARTIDO
                  </button>
                </div>
              </motion.div>

              {renderPrizeBanner()}

              <div className="hidden xl:block">
                {renderRankingPreview()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="xl:hidden">
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Tu progreso
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Hoy</span>
                </div>
              </div>

              {renderProfileCard()}
              {renderLivesCard()}

              {currentUser.streak > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="info-card premium-panel border border-orange-500/15 rounded-2xl p-3.5 flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mr-3">
                      <Flame className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Racha activa</p>
                      <p className="text-lg md:text-xl font-black font-montserrat text-white">
                        {currentUser.streak} días seguidos
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {renderStatsGrid()}

              <div className="xl:hidden pt-1">
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Tu posición
                  </h3>
                </div>
                {renderRankingPreview()}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stadium via-stadium to-stadium/90 backdrop-blur-sm z-50 pb-6">
        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={(!isLoggedIn || !hasPlayed) ? { scale: [1, 1.02, 1] } : {}}
            transition={(!isLoggedIn || !hasPlayed) ? { repeat: Infinity, duration: 2 } : {}}
            onClick={handlePlayClick}
            data-onboarding="primary-play"
            className="premium-button-primary w-full font-montserrat font-black py-4 rounded-2xl flex flex-col items-center justify-center"
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

      <AnimatePresence>
        {showOnboarding && onboardingSteps[onboardingStep] && (
          <motion.div
            className="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {onboardingTarget && (
              <div
                className="onboarding-spotlight"
                style={{
                  width: onboardingTarget.width + 18,
                  height: onboardingTarget.height + 18,
                  transform: `translate(${onboardingTarget.left - 9}px, ${onboardingTarget.top - 9}px)`
                }}
              />
            )}
            <motion.div
              className="onboarding-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              key={onboardingStep}
            >
              <span className="onboarding-guide-label">Tutorial rápido</span>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="onboarding-kicker">Paso {onboardingStep + 1} de {onboardingSteps.length}</span>
                <button onClick={completeOnboarding} className="onboarding-skip">
                  Omitir
                </button>
              </div>
              <h3>{onboardingSteps[onboardingStep].title}</h3>
              <p>{onboardingSteps[onboardingStep].body}</p>
              <div className="onboarding-progress" aria-hidden="true">
                {onboardingSteps.map((step, index) => (
                  <span key={step.target + index} className={index <= onboardingStep ? 'is-active' : ''} />
                ))}
              </div>
              <button onClick={goToNextOnboardingStep} className="onboarding-next">
                {onboardingStep === onboardingSteps.length - 1 ? 'Entendido' : 'Siguiente'}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {showAdModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="confirmation-modal-card premium-panel rounded-2xl p-5 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
            >
              {adState === 'idle' && (
                <button onClick={closeAdModal} className="modal-close-button absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              )}

              {adState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="ad-empty-icon w-16 h-16 bg-var-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-var-red" size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black font-montserrat mb-2">¡Sin vidas!</h3>
                  <p className="text-gray-400 mb-6">Te has quedado sin vidas para jugar. Mira un video corto de nuestro sponsor y obtén 2 vidas extra al instante.</p>
                  <button
                    onClick={handleWatchAd}
                    className="confirmation-primary-button confirmation-primary-button-gold w-full bg-rpp-yellow text-white font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Video className="mr-2" size={20} /> VER VIDEO SPONSOR
                  </button>
                </motion.div>
              )}

              {adState === 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <div className="w-full aspect-video bg-stadium rounded-xl border border-gray-800 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                    <div className="sponsor-ad-badge absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                      Publicidad
                    </div>
                    <Star className="text-gray-600 mb-2" size={40} />
                    <p className="font-bold text-gray-500">SPONSOR OFICIAL</p>
                    <div className="absolute bottom-0 left-0 h-1 bg-rpp-yellow transition-all duration-1000 ease-linear" style={{ width: `${((5 - adTimer) / 5) * 100}%` }} />
                  </div>
                  <p className="font-bold font-montserrat text-xl">El video termina en {adTimer}s...</p>
                </motion.div>
              )}

              {adState === 'finished' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <div className="ad-success-icon w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-neon-green" size={40} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black font-montserrat mb-2 text-neon-green">¡Vidas recargadas!</h3>
                  <p className="text-gray-400 mb-6">Has recibido 2 vidas extra. ¡Vuelve a la cancha!</p>
                  <button
                    onClick={() => {
                      closeAdModal();
                      onPlay();
                    }}
                    className="confirmation-primary-button confirmation-primary-button-green w-full bg-neon-green text-white font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
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
