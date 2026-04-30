import React, { useState, useEffect, useMemo } from 'react';
import { Play, Trophy, Star, Clock, Target, Flame, Ticket, Heart, X, Video, MonitorPlay, LogIn, LogOut, Gamepad2, ChevronRight, HelpCircle, Menu, UserRound } from 'lucide-react';
import { mockUser, mockNewUser, mockGuestUser, mockRanking } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import PrizeProduct from '../components/PrizeProduct';
import { ACTIVE_PRIZE, formatCountdownParts, getWeeklyClosingDate } from '../data/gameConfig';
import brandLogo from '../assets/logo_elvardelsaber.svg';
import AvatarImage from '../components/AvatarImage';

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
  onOpenLegal: () => void;
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
  onLogoutClick,
  onOpenLegal
}: VestuarioProps) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [adTimer, setAdTimer] = useState(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingTarget, setOnboardingTarget] = useState<DOMRect | null>(null);

  const currentUser = isLoggedIn ? (hasPlayed ? mockUser : mockNewUser) : mockGuestUser;
  const rankingUserAbove = mockRanking.find((user) => user.username === 'MartinG');
  const rankingUserBelow = mockRanking.find((user) => user.username === 'MuroDefensivo');
  const closingDate = useMemo(() => getWeeklyClosingDate(), []);
  const [prizeCountdown, setPrizeCountdown] = useState(() => formatCountdownParts(closingDate));
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
    const intervalId = window.setInterval(() => {
      setPrizeCountdown(formatCountdownParts(closingDate));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [closingDate]);

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

      if (isLoggedIn) {
        element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      }
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
        <div className="mb-4">
          <h3 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-xs">
            Así entras al sorteo
          </h3>
        </div>
        <div className="tutorial-info-list">
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
              <Heart className="text-blue-400" size={16} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Cada ronda empieza con 1 vida</p>
              <p className="text-sm text-slate-600 leading-relaxed">Entrar a jugar consume una vida disponible.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-orange-500/15 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="text-orange-500" size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Tus respuestas construyen tu progreso</p>
              <p className="text-sm text-slate-600 leading-relaxed">Tu puntaje y tu PR mejoran mientras juegas mejor.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-rpp-yellow/15 rounded-lg flex items-center justify-center shrink-0">
              <Trophy className="text-rpp-yellow" size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Los Cupones Dorados son tus chances reales</p>
              <p className="text-sm text-slate-600 leading-relaxed">Cada cupón suma oportunidades para ganar el premio.</p>
            </div>
          </div>
          <div className="info-card tutorial-info-card">
            <div className="tutorial-info-icon w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
              <LogIn className="text-neon-green" size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Si te registras, guardas todo y participas</p>
              <p className="text-sm text-slate-600 leading-relaxed">Necesitas una cuenta para conservar tu avance y entrar al sorteo.</p>
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
      className="prize-banner-card premium-panel w-full rounded-2xl p-4 md:p-5 cursor-pointer relative overflow-hidden group"
      data-onboarding="prize-banner"
    >
      <div className="prize-banner-haze" />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-start gap-3 md:gap-4 min-w-0">
          <div className="premium-icon-wrap prize-banner-icon shrink-0 w-10 h-10 rounded-xl mt-0.5">
            <Trophy className="text-blue-400" size={20} />
          </div>
          <div className="flex-1 min-w-0 prize-banner-copy">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="prize-banner-topline">Premio activo</span>
              <span className="prize-banner-countdown">
                <Clock size={12} className="mr-1" /> Cierra en {prizeCountdown}
              </span>
            </div>
            <h3 className="premium-title text-lg md:text-[1.45rem] font-black font-montserrat text-slate-950 tracking-tight mb-1">{ACTIVE_PRIZE.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Acumula Cupones Dorados y suma más oportunidades para quedarte con el premio semanal.
            </p>
            
            {isLoggedIn && (
              <div className="prize-banner-coupons">
                <Ticket className="text-rpp-yellow" size={14} />
                <span className="text-slate-600">Tus Cupones Dorados:</span>
                <strong>{goldenCoupons}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="prize-banner-actions">
          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto">
            <div className="flex-shrink-0 prize-banner-product">
              <PrizeProduct variant="banner" />
            </div>
            <button className="premium-button-secondary flex-1 md:flex-none font-bold py-3 px-5 rounded-xl transition-colors whitespace-nowrap min-w-[120px] text-sm">
              Ver premio
            </button>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenLegal();
            }}
            className="prize-banner-legal"
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
      className="info-card premium-panel flex items-center justify-between p-3.5 md:p-4 rounded-2xl shadow-lg"
    >
      <div className="flex items-center space-x-4">
          <div className="relative">
          <div className="w-12 h-12 bg-card-light rounded-full flex items-center justify-center text-xl border border-rpp-yellow">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
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
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Partidos</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Target size={16} className="text-neon-green mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.accuracy}%</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Precisión</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Trophy size={16} className="text-rpp-yellow mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.winRate}%</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Win rate</p>
      </div>
      <div className="info-card premium-metric-card p-3 flex flex-col items-center justify-center">
        <Clock size={16} className="text-blue-400 mb-1.5" />
        <p className="text-lg font-black font-montserrat">{currentUser.avgTime}s</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Tiempo</p>
      </div>
    </motion.div>
  );

  const renderLivesCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="info-card premium-panel p-3.5 md:p-4 rounded-2xl shadow-lg"
      data-onboarding="lives-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-[0.16em]">Vidas</p>
          <p className="font-bold font-montserrat text-base text-slate-950">Listo para seguir jugando</p>
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
      <p className="text-xs text-slate-500 mt-2.5">Si te quedas sin vidas, puedes recargarlas viendo un video sponsor.</p>
    </motion.div>
  );

  const renderProgressSnapshot = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="info-card premium-panel rounded-2xl p-4 space-y-4 md:hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center min-w-0">
          <div className="w-12 h-12 bg-card-light rounded-full flex items-center justify-center text-xl border border-rpp-yellow mr-3 shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-black mb-1">Tu progreso hoy</p>
            <h3 className="text-base font-black font-montserrat text-slate-950 truncate">{currentUser.username}</h3>
            <p className="text-sm text-slate-500">PR actual: {currentUser.pr}</p>
          </div>
        </div>
        <div className="premium-badge shrink-0">Top play</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="premium-metric-card rounded-xl p-3 text-center">
          <p className="text-lg font-black font-montserrat text-rpp-yellow">{lives}/5</p>
          <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Vidas</p>
        </div>
        <div className="premium-metric-card rounded-xl p-3 text-center">
          <p className="text-lg font-black font-montserrat text-slate-950">{currentUser.accuracy}%</p>
          <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Precisión</p>
        </div>
        <div className="premium-metric-card rounded-xl p-3 text-center">
          <p className="text-lg font-black font-montserrat text-slate-950">{currentUser.streak}</p>
          <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">Racha</p>
        </div>
      </div>

      <div>
        <div className="w-full bg-stadium rounded-full h-3 border border-gray-800">
          <div className="h-3 rounded-full bg-rpp-yellow" style={{ width: `${(lives / 5) * 100}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">Si te quedas sin vidas, puedes recargarlas viendo un video sponsor.</p>
      </div>
    </motion.div>
  );

  const renderRankingPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="info-card ranking-preview-card premium-panel rounded-2xl overflow-hidden p-0"
      data-onboarding="ranking-preview"
    >
      <div className="p-3 md:p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="font-bold font-montserrat text-sm flex items-center">
          <Flame className="mr-2 text-orange-500" size={18} /> Ranking Cercano
        </h2>
        <button onClick={onGoToRanking} className="text-xs text-rpp-yellow font-bold hover:underline flex items-center">
          Ver Ranking <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="divide-y divide-gray-800">
          <div className="ranking-preview-row p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-gray-500">#{Number(currentUser.rankingNational) - 1}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-gray-700">
              {rankingUserAbove && <AvatarImage src={rankingUserAbove.avatar} alt={rankingUserAbove.username} />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">MartinG</p>
              <p className="text-xs text-var-red">A 250 pts de distancia</p>
            </div>
          </div>
          <span className="font-bold text-xs text-slate-500 whitespace-nowrap">2,100 PR</span>
        </div>

          <div className="ranking-preview-row ranking-preview-row-current p-3.5 flex items-center justify-between gap-3 bg-rpp-yellow/10 border-l-4 border-rpp-yellow">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-rpp-yellow">#{currentUser.rankingNational}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-rpp-yellow">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-rpp-yellow text-sm">{currentUser.username} <span className="text-[11px] opacity-70">(Tú)</span></p>
              <p className="text-xs text-slate-500">Tu mejor marca actual</p>
            </div>
          </div>
          <span className="font-bold text-xs text-rpp-yellow whitespace-nowrap">{currentUser.pr} PR</span>
        </div>

          <div className="ranking-preview-row p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center">
            <span className="w-10 flex-shrink-0 text-center font-black text-xs text-gray-500">#{Number(currentUser.rankingNational) + 1}</span>
            <div className="w-9 h-9 bg-card-light rounded-full flex items-center justify-center text-base mx-3 border border-gray-700">
              {rankingUserBelow && <AvatarImage src={rankingUserBelow.avatar} alt={rankingUserBelow.username} />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">MuroDefensivo</p>
              <p className="text-xs text-neon-green">Ya lo superaste por 400 pts</p>
            </div>
          </div>
          <span className="font-bold text-xs text-slate-500 whitespace-nowrap">1,450 PR</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stadium text-white p-3 md:p-5 font-sans max-w-6xl mx-auto pb-20 md:pb-12">
      <header className="md:hidden mobile-header-shell mb-4 rounded-[24px] p-2.5">
        <div className="mobile-header-top">
          <div className="mobile-header-brand" data-onboarding="brand">
            <img src={brandLogo} alt="El VAR del Saber" className="mobile-header-logo" />
          </div>

          <div className="mobile-header-actions">
            {!isLoggedIn && (
              <button
                onClick={onLoginClick}
                data-onboarding="login-entry"
                className="mobile-header-login"
                title="Iniciar sesión"
                aria-label="Iniciar sesión"
              >
                <span>Iniciar sesión</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="mobile-header-utility"
              title={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="mobile-menu-backdrop md:hidden"
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="mobile-menu-panel md:hidden"
            >
              {!isLoggedIn ? (
                <div className="mobile-header-menu-list">
                  <button onClick={() => { closeMobileMenu(); replayOnboarding(); }} className="mobile-header-link">
                    <MonitorPlay size={16} />
                    <span>Cómo jugar</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); onGoToFaq(); }} className="mobile-header-link">
                    <HelpCircle size={16} />
                    <span>FAQ</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); onGoToPrize(); }} className="mobile-header-link">
                    <Trophy size={16} />
                    <span>Premio</span>
                  </button>
                </div>
              ) : (
                <div className="mobile-header-menu-list">
                  <button onClick={() => { closeMobileMenu(); onGoToRanking(); }} className="mobile-header-link">
                    <Flame size={16} />
                    <span>Ranking</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); onGoToPrize(); }} className="mobile-header-link">
                    <Trophy size={16} />
                    <span>Sorteo</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); onGoToFaq(); }} className="mobile-header-link">
                    <HelpCircle size={16} />
                    <span>FAQ</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); replayOnboarding(); }} className="mobile-header-link">
                    <MonitorPlay size={16} />
                    <span>Guía</span>
                  </button>
                  <button onClick={() => { closeMobileMenu(); onLogoutClick(); }} className="mobile-header-link mobile-header-link-muted">
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="hidden md:flex desktop-header-shell items-start justify-between mb-6">
        <div className="desktop-header-brand" data-onboarding="brand">
          <img src={brandLogo} alt="El VAR del Saber" className="desktop-header-logo" />
        </div>

        <div className="desktop-header-actions">
          {!isLoggedIn ? (
            <nav className="desktop-header-nav-shell">
              <div className="desktop-header-nav">
                <button onClick={replayOnboarding} className="desktop-header-link">
                  Cómo jugar
                </button>
                <button onClick={onGoToFaq} className="desktop-header-link">
                  FAQ
                </button>
                <button onClick={onGoToPrize} className="desktop-header-link">
                  Premio
                </button>
                <button onClick={onLoginClick} data-onboarding="login-entry" className="desktop-header-user">
                  <UserRound size={16} />
                  <span>Entrar</span>
                </button>
              </div>
            </nav>
          ) : (
            <nav className="desktop-header-nav-shell">
              <div className="desktop-header-nav">
                <button onClick={onGoToRanking} className="desktop-header-link">Ranking</button>
                <button onClick={onGoToPrize} className="desktop-header-link">Sorteo</button>
                <button onClick={onGoToFaq} className="desktop-header-link">FAQ</button>
                <button onClick={replayOnboarding} className="desktop-header-link">Cómo jugar</button>
                <button onClick={onLogoutClick} className="desktop-header-user desktop-header-user-icon" title="Cerrar sesión" aria-label="Cerrar sesión">
                  <LogOut size={17} />
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {!isLoggedIn && (
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-2 md:mt-8 space-y-5 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >

            <h1 className="premium-title text-2xl md:text-4xl font-black font-montserrat mb-2 px-2">
              Demuestra cuánto sabes de fútbol y <span className="text-blue-400">gana una PS5</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
              Responde trivias cortas de fútbol, acierta más que el resto y suma Cupones Dorados para el premio semanal.
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
              <p className="text-xs font-bold text-stadium/70 mt-2 relative z-10">Entra a la cancha y suma tus primeros Cupones Dorados.</p>
            </button>
          </motion.div>

          {renderTutorial()}
        </div>
      )}

      {isLoggedIn && !hasPlayed && (
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-4 md:mt-8 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="premium-chip mx-auto w-fit mb-5">Tu cuenta está lista</div>
            <div className="w-20 h-20 bg-card-light rounded-full flex items-center justify-center text-4xl border border-rpp-yellow mx-auto mb-5 shadow-[0_0_24px_rgba(255,224,0,0.18)]">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
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
                className="info-card premium-panel rounded-2xl p-3.5 md:p-5"
                data-onboarding="dashboard-summary"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="premium-topline mb-2">Tu vestuario</div>
                    <h2 className="premium-title text-2xl md:text-3xl font-black font-montserrat text-slate-950 mb-2">
                      Sigue jugando para mejorar tu PR
                    </h2>
                    <p className="text-sm text-gray-400 max-w-xl">
                      Juega otra ronda, protege tus vidas y sigue acumulando cupones para mantenerte competitivo.
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
              {renderProgressSnapshot()}

              <div className="hidden xl:block">
                {renderRankingPreview()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="hidden md:block xl:hidden">
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Tu progreso
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Hoy</span>
                </div>
              </div>

              <div className="hidden md:block">
                {renderProfileCard()}
              </div>
              <div className="hidden md:block">
                {renderLivesCard()}
              </div>

              {currentUser.streak > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="info-card premium-panel border border-orange-500/15 rounded-2xl p-3.5 flex items-center justify-between shadow-lg hidden md:flex"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mr-3">
                      <Flame className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Racha activa</p>
                      <p className="text-lg md:text-xl font-black font-montserrat text-slate-950">
                        {currentUser.streak} días seguidos
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="hidden md:block">
                {renderStatsGrid()}
              </div>

              <div className="xl:hidden pt-1">
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
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
            className={`onboarding-overlay ${!isLoggedIn ? 'onboarding-overlay-simple' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoggedIn && onboardingTarget && (
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
