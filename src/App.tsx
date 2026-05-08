import React, { useState, useEffect } from 'react';
import VestuarioScreen from './views/VestuarioScreen';
import MatchScreen from './views/MatchScreen';
import RankingScreen from './views/RankingScreen';
import PrizeScreen from './views/PrizeScreen';
import LoginModal from './components/LoginModal';
import PrizeProduct from './components/PrizeProduct';
import InfoModal from './components/InfoModal';
import { motion } from 'motion/react';
import { Trophy, Home, Ticket, Heart, Play, TrendingUp, MessageCircle, Instagram, Send, ArrowRight } from 'lucide-react';
import { mockQuestions, mockUser } from './data/mockData';
import { ACTIVE_PRIZE, getEarnedGoldenCoupons } from './data/gameConfig';

interface MatchSummary {
  score: number;
  correctAnswers: number;
  averageTime: number;
}

const MAX_LIVES = 5;
const LIFE_RECHARGE_MS = 30 * 60 * 1000;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'vestuario' | 'match' | 'result' | 'ranking' | 'prize' | 'welcome'>('vestuario');
  const [lastScore, setLastScore] = useState(0);
  const [lastCorrectAnswers, setLastCorrectAnswers] = useState(0);
  const [lastAverageTime, setLastAverageTime] = useState(0);
  const [lastEarnedCoupons, setLastEarnedCoupons] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [lifeRechargeAnchor, setLifeRechargeAnchor] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [goldenCoupons, setGoldenCoupons] = useState(0);
  const [pendingGoldenCoupons, setPendingGoldenCoupons] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [loginModalMode, setLoginModalMode] = useState<'default' | 'post-match'>('default');
  const [prizeInitialSection, setPrizeInitialSection] = useState<'overview' | 'faq'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  useEffect(() => {
    if (lives >= MAX_LIVES || lifeRechargeAnchor === null) return;

    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [lives, lifeRechargeAnchor]);

  useEffect(() => {
    if (lives >= MAX_LIVES || lifeRechargeAnchor === null) return;

    const elapsed = now - lifeRechargeAnchor;
    const recoveredLives = Math.floor(elapsed / LIFE_RECHARGE_MS);

    if (recoveredLives <= 0) return;

    setLives((prev) => {
      const nextLives = Math.min(MAX_LIVES, prev + recoveredLives);

      if (nextLives >= MAX_LIVES) {
        setLifeRechargeAnchor(null);
      } else {
        setLifeRechargeAnchor((prevAnchor) => (
          prevAnchor === null ? prevAnchor : prevAnchor + (recoveredLives * LIFE_RECHARGE_MS)
        ));
      }

      return nextLives;
    });
  }, [lives, lifeRechargeAnchor, now]);

  const handlePlay = () => {
    if (lives <= 0) {
      setCurrentScreen('vestuario');
      return;
    }
    const spentAt = Date.now();
    setNow(spentAt);
    setLives((prev) => {
      const nextLives = Math.max(0, prev - 1);

      if (prev === MAX_LIVES) {
        setLifeRechargeAnchor(spentAt);
      } else if (lifeRechargeAnchor === null && nextLives < MAX_LIVES) {
        setLifeRechargeAnchor(spentAt);
      }

      return nextLives;
    });
    setCurrentScreen('match');
  };

  const handleFinishMatch = ({ score, correctAnswers, averageTime }: MatchSummary) => {
    setLastScore(score);
    setLastCorrectAnswers(correctAnswers);
    setLastAverageTime(averageTime);
    setHasPlayed(true);
    const earnedGoldenCoupons = getEarnedGoldenCoupons(score);
    setLastEarnedCoupons(earnedGoldenCoupons);
    if (isLoggedIn) {
      setGoldenCoupons(prev => prev + earnedGoldenCoupons);
    } else {
      setPendingGoldenCoupons(prev => prev + earnedGoldenCoupons);
    }
    setCurrentScreen('result');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('vestuario');
  };

  const handleGoToRanking = () => {
    setCurrentScreen('ranking');
  };

  const handleGoToPrize = () => {
    setPrizeInitialSection('overview');
    setCurrentScreen('prize');
  };

  const handleGoToFaq = () => {
    setPrizeInitialSection('faq');
    setCurrentScreen('prize');
  };

  const handleLogin = () => {
    const shouldShowWelcome = loginModalMode === 'post-match';
    setIsLoggedIn(true);
    if (pendingGoldenCoupons > 0) {
      setGoldenCoupons(prev => prev + pendingGoldenCoupons);
      setPendingGoldenCoupons(0);
    }
    setShowLoginModal(false);
    setLoginModalMode('default');
    setCurrentScreen(shouldShowWelcome ? 'welcome' : 'vestuario');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGoldenCoupons(0);
  };

  const handleBackFromMatch = () => {
    const confirmed = window.confirm('Si sales ahora, la partida actual se perdera y la vida ya consumida no se recupera. ¿Quieres volver al vestuario?');
    if (confirmed) {
      setCurrentScreen('vestuario');
    }
  };

  const handleOpenDefaultLogin = () => {
    setLoginModalMode('default');
    setShowLoginModal(true);
  };

  const handleOpenPostMatchLogin = () => {
    setLoginModalMode('post-match');
    setShowLoginModal(true);
  };

  const getRelativeStanding = (score: number) => {
    if (score >= 1600) return { topPercent: 8, betterThan: 92 };
    if (score >= 1300) return { topPercent: 15, betterThan: 85 };
    if (score >= 1000) return { topPercent: 24, betterThan: 76 };
    if (score >= 700) return { topPercent: 39, betterThan: 61 };
    return { topPercent: 58, betterThan: 42 };
  };

  const handleShareResult = async (network: 'whatsapp' | 'instagram' | 'x') => {
    const { topPercent } = getRelativeStanding(lastScore);
    const message = `Acabo de hacer ${lastScore} puntos en El VAR del Saber y quedé en el top ${topPercent}% de hoy. ¿Puedes superarme?`;
    const encodedMessage = encodeURIComponent(message);

    if (network === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (network === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setShareFeedback('Texto copiado. Ya puedes pegarlo en Instagram.');
      window.setTimeout(() => setShareFeedback(null), 2200);
    } catch (error) {
      console.error('No se pudo copiar el resultado', error);
      setShareFeedback('No pudimos copiar el texto. Intenta de nuevo.');
      window.setTimeout(() => setShareFeedback(null), 2200);
    }
  };

  const relativeStanding = getRelativeStanding(lastScore);
  const nextLifeInMs = lives >= MAX_LIVES || lifeRechargeAnchor === null
    ? 0
    : Math.max(0, LIFE_RECHARGE_MS - (now - lifeRechargeAnchor));

  return (
    <div className="premium-shell bg-stadium min-h-screen text-white">
      {currentScreen === 'vestuario' && (
        <VestuarioScreen 
          onPlay={handlePlay} 
          lives={lives}
          nextLifeInMs={nextLifeInMs}
          goldenCoupons={goldenCoupons}
          onGoToRanking={handleGoToRanking}
          onGoToPrize={handleGoToPrize}
          onGoToFaq={handleGoToFaq}
          isLoggedIn={isLoggedIn}
          hasPlayed={hasPlayed}
          onLoginClick={handleOpenDefaultLogin}
          onLogoutClick={handleLogout}
          onOpenLegal={() => setShowLegalModal(true)}
        />
      )}
      {currentScreen === 'match' && <MatchScreen lives={lives} onFinish={handleFinishMatch} onBack={handleBackFromMatch} />}
      {currentScreen === 'ranking' && <RankingScreen onBack={handleBackToDashboard} />}
      {currentScreen === 'prize' && (
        <PrizeScreen 
          onBack={handleBackToDashboard} 
          goldenCoupons={goldenCoupons}
          lives={lives}
          nextLifeInMs={nextLifeInMs}
          isLoggedIn={isLoggedIn} 
          onLoginClick={handleOpenDefaultLogin}
          onPlayClick={handlePlay}
          onOpenLegal={() => setShowLegalModal(true)}
          initialSection={prizeInitialSection}
        />
      )}
      {currentScreen === 'welcome' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen p-4 md:p-6 font-sans flex flex-col items-center justify-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.35 }}
            className="premium-panel premium-hero w-full rounded-2xl p-4 md:p-8 relative overflow-hidden shadow-2xl text-center"
          >
            <div className="flex flex-col items-center mb-4 md:mb-8 pt-2 md:pt-4">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mb-4 border border-neon-green/30"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-neon-green"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              </motion.div>
              <div className="premium-chip mx-auto w-fit mb-2">¡Todo listo!</div>
              <h1 className="premium-title text-2xl md:text-3xl font-montserrat font-black text-slate-950">
                Cuenta activada
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-8">
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Puntaje guardado</p>
                <p className="text-3xl font-black font-montserrat text-rpp-yellow">{lastScore}</p>
              </div>
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Boletos activos</p>
                <p className="text-3xl font-black font-montserrat text-rpp-yellow">{goldenCoupons}</p>
                <p className="text-sm text-slate-500 mt-2">Boletos para el premio semanal</p>
              </div>
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Estado de hoy</p>
                <p className="text-xl font-black font-montserrat text-slate-950">Top {relativeStanding.topPercent}%</p>
              </div>
            </div>

            <div className="w-full bg-[#f6e8c8] border border-[#ead4a1] text-[#704400] rounded-xl p-3 md:p-5 flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-8 text-center md:text-left relative overflow-hidden shadow-lg">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/40 to-transparent pointer-events-none hidden md:block"></div>
              
              <div className="w-24 h-20 md:w-28 md:h-24 shrink-0 flex items-center justify-center bg-white/50 rounded-lg p-2 border border-white/80 shadow-sm relative z-10">
                <PrizeProduct variant="modal" hideLabel={true} />
              </div>
              
              <div className="relative z-10">
                <p className="font-black font-montserrat text-base md:text-lg mb-1">Ya estás dentro del premio de esta semana</p>
                <p className="text-xs md:text-sm text-amber-900/80 font-medium leading-relaxed">
                  Sigue jugando para sumar más boletos para el premio y aumentar tus probabilidades de ganar la <span className="font-bold">{ACTIVE_PRIZE.title}</span>.
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleBackToDashboard}
                className="premium-button-primary w-full font-montserrat font-black text-base py-4 rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                <Home className="mr-2" size={20} /> IR AL VESTUARIO
              </button>
              <button
                onClick={handlePlay}
                className="premium-button-secondary w-full font-montserrat font-bold text-sm py-3.5 rounded-xl flex items-center justify-center transition-colors"
              >
                <Play className="mr-2" size={18} fill="currentColor" /> JUGAR OTRA PARTIDA
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {currentScreen === 'result' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen p-2.5 md:p-5 font-sans flex flex-col items-center justify-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="result-hero-card premium-panel premium-hero w-full rounded-2xl p-3.5 md:p-6 flex flex-col items-center relative overflow-hidden shadow-2xl"
          >
            <Trophy size={42} className="text-rpp-yellow mb-3 drop-shadow-[0_0_15px_rgba(255,224,0,0.35)]" />
            
            <div className="premium-chip mb-2.5">Resultado</div>
            <h1 className="premium-title text-lg md:text-3xl font-montserrat font-black text-slate-950 mb-2 text-center">¡PARTIDO TERMINADO!</h1>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center md:justify-center md:gap-10 mb-4 md:mb-6 w-full">
              <div className="premium-soft-panel rounded-2xl p-2.5 md:bg-transparent md:border-0 md:shadow-none flex flex-col items-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.16em] font-bold mb-1.5">Puntaje final</p>
                <div className="text-[1.9rem] sm:text-4xl md:text-6xl font-montserrat font-black text-rpp-yellow drop-shadow-[0_0_24px_rgba(255,224,0,0.32)] leading-none">
                  {lastScore}
                </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-white/10"></div>

              <div className="premium-soft-panel rounded-2xl p-2.5 md:bg-transparent md:border-0 md:shadow-none flex flex-col items-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.16em] font-bold mb-1.5">Boletos ganados</p>
                <div className="flex items-center text-[1.9rem] sm:text-4xl md:text-6xl font-montserrat font-black text-slate-950 drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] leading-none">
                  <Ticket className="text-rpp-yellow mr-1.5 md:mr-3" size={20} />
                  {lastEarnedCoupons}
                </div>
              </div>
            </div>
            
            {isLoggedIn ? (
              <>
                <div className="mb-4 text-center min-h-6 flex items-center justify-center">
                  {lastScore > mockUser.pr ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/30"
                    >
                      <TrendingUp className="mr-2" size={18} /> ¡NUEVO RÉCORD! Subiste en el ranking
                    </motion.div>
                  ) : (
                    <p className="text-slate-500 font-medium">
                      ¡Uf! A solo <span className="text-slate-950 font-bold">{Math.max(0, mockUser.pr - lastScore)} pts</span> de tu récord.
                    </p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="result-prize-card flex items-center justify-center bg-gradient-to-r from-rpp-yellow/20 to-orange-500/20 border border-rpp-yellow/50 px-3 py-2 md:px-5 rounded-xl mb-4 shadow-[0_0_20px_rgba(255,224,0,0.12)]"
                >
                  <PrizeProduct variant="result" />
                  <div className="w-10 h-10 bg-rpp-yellow/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <Ticket className="text-rpp-yellow" size={22} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-rpp-yellow font-bold uppercase tracking-[0.18em] mb-0.5">Acumulas por el premio</p>
                    <p className="text-xl md:text-2xl font-black font-montserrat text-slate-950">
                      {goldenCoupons} <span className="text-sm text-slate-500 font-medium">Boletos para el premio</span>
                    </p>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                  <div className="info-card premium-soft-panel w-full rounded-2xl px-3.5 py-2.5 text-center mb-3 border-white/8">
                  {lastScore > 0 ? (
                    <>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Rendimiento de hoy</p>
                      <p className="text-2xl font-black font-montserrat text-slate-950 leading-none mb-1.5">Top {relativeStanding.topPercent}%</p>
                      <p className="text-sm text-slate-600">Mejor que {relativeStanding.betterThan} de cada 100 jugadores hoy</p>
                    </>
                  ) : (
                    <p className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                      ¡Cero puntos esta vez! Calienta un poco más y vuelve a la cancha. Marca tu primer récord y regístrate para que tus boletos para el premio no se pierdan.
                    </p>
                  )}
                </div>

                <div className="w-full grid grid-cols-2 gap-2.5 mb-3">
                  <div className="info-card premium-soft-panel rounded-xl p-2.5 text-center">
                    <p className="text-[1.7rem] font-black font-montserrat text-slate-950">{lastCorrectAnswers}/{mockQuestions.length}</p>
                    <p className="text-xs text-slate-500">correctas</p>
                  </div>
                  <div className="info-card premium-soft-panel rounded-xl p-2.5 text-center">
                    <p className="text-[1.7rem] font-black font-montserrat text-slate-950">{lastAverageTime}s</p>
                    <p className="text-xs text-slate-500">promedio/preg.</p>
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleOpenPostMatchLogin}
                  className="result-primary-cta premium-button-primary w-full font-montserrat font-black text-sm md:text-base py-3 rounded-xl mb-2.5"
                >
                  Guarda esta partida y entra al sorteo
                </motion.button>

                <p className="text-sm text-slate-600 text-center mb-3 leading-relaxed">
                  Crea tu cuenta para conservar tu resultado, tus boletos para el premio y tu progreso.
                </p>

                <div className="result-guest-prize mb-3">
                  <PrizeProduct variant="result" />
                  <div>
                    <p>Participa por la {ACTIVE_PRIZE.title}</p>
                    <span>Tus boletos para el premio cuentan al crear tu cuenta.</span>
                  </div>
                </div>

                {lastScore > 0 && (
                  <p className="text-sm text-slate-500 text-center mb-3 leading-relaxed">
                    Hoy hiciste {lastScore.toLocaleString('es-PE')} puntos y ganaste +{pendingGoldenCoupons || lastEarnedCoupons} boletos para el premio.
                  </p>
                )}

                <div className="result-share-actions w-full mb-1.5">
                  <span className="result-share-label">Compartir resultado</span>
                  <div className="result-share-list">
                    <button
                      onClick={() => handleShareResult('whatsapp')}
                      className="result-share-button"
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </button>
                    <button
                      onClick={() => handleShareResult('instagram')}
                      className="result-share-button"
                    >
                      <Instagram size={18} /> Instagram
                    </button>
                    <button
                      onClick={() => handleShareResult('x')}
                      className="result-share-button"
                    >
                      <Send size={18} /> X
                    </button>
                  </div>
                </div>
                {shareFeedback && <p className="result-share-feedback">{shareFeedback}</p>}
              </>
            )}

            <div className="result-secondary-actions w-full">
              <button 
                onClick={handlePlay}
                className={`${isLoggedIn ? 'premium-button-primary font-black text-sm md:text-lg py-3 md:py-4 rounded-xl' : 'result-replay-button'} w-full font-montserrat flex items-center justify-center transition-transform`}
              >
                {lives > 0 ? (
                  <><Play className="mr-2" fill="currentColor" size={isLoggedIn ? 24 : 18} /> JUGAR DE NUEVO {isLoggedIn ? <span className="inline-flex items-center ml-2">(<Heart className="mx-1" size={16} fill="currentColor" /> {lives})</span> : ''}</>
                ) : (
                  <><Home className="mr-2" size={isLoggedIn ? 24 : 18} /> VOLVER AL INICIO</>
                )}
              </button>
              
              <button 
                onClick={handleBackToDashboard}
                className="result-ghost-button w-full font-montserrat flex items-center justify-center transition-colors"
              >
                {isLoggedIn ? <Home className="mr-2" size={18} /> : <ArrowRight className="mr-2" size={18} />}
                {isLoggedIn ? 'VESTUARIO' : 'SEGUIR SIN CUENTA'}
              </button>
              {!isLoggedIn && (
                <p className="text-xs text-slate-500 text-center">
                  Sin cuenta esta partida no se guarda ni entra al sorteo.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin}
        mode={loginModalMode}
        pendingScore={lastScore}
        onContinueWithoutAccount={() => {
          setShowLoginModal(false);
          setLoginModalMode('default');
          setCurrentScreen('vestuario');
        }}
      />
      <InfoModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title="Terminos del sorteo semanal"
        body={[
          'Necesitas una cuenta para guardar tu puntaje, conservar tus Boletos para el premio y participar formalmente en el sorteo semanal.',
          'En esta version, una partida con puntaje te da 1 boleto para el premio y una partida de mas de 1000 puntos te da 3. Cada boleto cuenta como una participacion.',
          `El premio activo es una ${ACTIVE_PRIZE.title} y el ciclo se cierra de forma semanal. Mientras mas boletos para el premio acumules durante la semana activa, mas oportunidades tienes de ganar.`,
          'En esta version del interactivo el detalle legal completo aun no esta conectado a una fuente dinamica, asi que mostramos este resumen operativo para que la accion no quede rota.'
        ]}
      />
    </div>
  );
}
