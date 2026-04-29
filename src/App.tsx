import React, { useState, useEffect } from 'react';
import VestuarioScreen from './views/VestuarioScreen';
import MatchScreen from './views/MatchScreen';
import RankingScreen from './views/RankingScreen';
import PrizeScreen from './views/PrizeScreen';
import LoginModal from './components/LoginModal';
import { motion } from 'motion/react';
import { Trophy, Home, Ticket, Play, TrendingUp, MessageCircle, Instagram, Send } from 'lucide-react';
import { mockQuestions, mockUser } from './data/mockData';

interface MatchSummary {
  score: number;
  correctAnswers: number;
  averageTime: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'vestuario' | 'match' | 'result' | 'ranking' | 'prize' | 'welcome'>('vestuario');
  const [lastScore, setLastScore] = useState(0);
  const [lastCorrectAnswers, setLastCorrectAnswers] = useState(0);
  const [lastAverageTime, setLastAverageTime] = useState(0);
  const [lastEarnedTickets, setLastEarnedTickets] = useState(0);
  const [tickets, setTickets] = useState(5); // Full inventory for new users
  const [goldenTickets, setGoldenTickets] = useState(0); // Golden tickets for the weekly raffle
  const [pendingGoldenTickets, setPendingGoldenTickets] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'default' | 'post-match'>('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const handlePlay = () => {
    if (tickets <= 0) {
      setCurrentScreen('vestuario');
      return;
    }
    setTickets(prev => Math.max(0, prev - 1));
    setCurrentScreen('match');
  };

  const handleAddTickets = (amount: number) => {
    setTickets(prev => Math.min(prev + amount, 5));
  };

  const handleFinishMatch = ({ score, correctAnswers, averageTime }: MatchSummary) => {
    setLastScore(score);
    setLastCorrectAnswers(correctAnswers);
    setLastAverageTime(averageTime);
    setHasPlayed(true);
    const earnedGoldenTickets = score > 1000 ? 3 : 1;
    setLastEarnedTickets(earnedGoldenTickets);
    if (isLoggedIn) {
      setGoldenTickets(prev => prev + earnedGoldenTickets);
    } else {
      setPendingGoldenTickets(prev => prev + earnedGoldenTickets);
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
    setCurrentScreen('prize');
  };

  const handleLogin = () => {
    const shouldShowWelcome = loginModalMode === 'post-match';
    setIsLoggedIn(true);
    if (pendingGoldenTickets > 0) {
      setGoldenTickets(prev => prev + pendingGoldenTickets);
      setPendingGoldenTickets(0);
    }
    setShowLoginModal(false);
    setLoginModalMode('default');
    setCurrentScreen(shouldShowWelcome ? 'welcome' : 'vestuario');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGoldenTickets(0); // Reset golden tickets on logout for demo purposes
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
      alert('Texto listo para pegar en Instagram.');
    } catch (error) {
      console.error('No se pudo copiar el resultado', error);
    }
  };

  const relativeStanding = getRelativeStanding(lastScore);

  return (
    <div className="premium-shell bg-stadium min-h-screen text-white">
      {currentScreen === 'vestuario' && (
        <VestuarioScreen 
          onPlay={handlePlay} 
          tickets={tickets} 
          goldenTickets={goldenTickets}
          onAddTickets={handleAddTickets}
          onGoToRanking={handleGoToRanking}
          onGoToPrize={handleGoToPrize}
          isLoggedIn={isLoggedIn}
          hasPlayed={hasPlayed}
          onLoginClick={handleOpenDefaultLogin}
          onLogoutClick={handleLogout}
        />
      )}
      {currentScreen === 'match' && <MatchScreen onFinish={handleFinishMatch} />}
      {currentScreen === 'ranking' && <RankingScreen onBack={handleBackToDashboard} />}
      {currentScreen === 'prize' && (
        <PrizeScreen 
          onBack={handleBackToDashboard} 
          goldenTickets={goldenTickets} 
          isLoggedIn={isLoggedIn} 
          onLoginClick={handleOpenDefaultLogin}
          onPlayClick={handlePlay}
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
            className="premium-panel premium-hero w-full rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-rpp-yellow/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-rpp-yellow/30">
              <Trophy className="text-rpp-yellow" size={38} />
            </div>

            <div className="premium-chip mx-auto w-fit mb-4">Cuenta activada</div>
            <h1 className="premium-title text-2xl md:text-4xl font-montserrat font-black text-white mb-3">
              ¡Bienvenido a la cancha!
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Tu cuenta ya está lista y tu partida quedó guardada. Desde ahora compites con tu PR, acumulas cupones y ya estás participando por los premios semanales.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Puntaje guardado</p>
                <p className="text-3xl font-black font-montserrat text-rpp-yellow">{lastScore}</p>
              </div>
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Cupones activos</p>
                <p className="text-3xl font-black font-montserrat text-rpp-yellow">{goldenTickets}</p>
                <p className="text-xs text-gray-500 mt-2">Participaciones para el premio semanal</p>
              </div>
              <div className="info-card premium-soft-panel rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Estado de hoy</p>
                <p className="text-xl font-black font-montserrat text-white">Top {relativeStanding.topPercent}%</p>
              </div>
            </div>

            <div className="w-full bg-[#f6e8c8] border border-[#ead4a1] text-[#704400] rounded-xl px-4 py-3 text-center mb-6">
              <p className="font-black font-montserrat text-base mb-1">Ya estás dentro del premio de esta semana</p>
              <p className="text-xs md:text-sm">Sigue jugando para sumar más cupones y aumentar tus probabilidades.</p>
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
          className="min-h-screen p-4 md:p-6 font-sans flex flex-col items-center justify-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="result-hero-card premium-panel premium-hero w-full rounded-2xl p-6 md:p-8 flex flex-col items-center relative overflow-hidden shadow-2xl"
          >
            <Trophy size={58} className="text-rpp-yellow mb-5 drop-shadow-[0_0_15px_rgba(255,224,0,0.35)]" />
            
            <div className="premium-chip mb-4">Resultado</div>
            <h1 className="premium-title text-2xl md:text-4xl font-montserrat font-black text-white mb-2 text-center">¡PARTIDO TERMINADO!</h1>
            <p className="text-gray-400 mb-6 text-[11px] md:text-sm uppercase tracking-[0.22em] font-semibold">Puntaje Final</p>
            
            <div className="text-6xl md:text-7xl font-montserrat font-black text-rpp-yellow mb-2 drop-shadow-[0_0_24px_rgba(255,224,0,0.32)]">
              {lastScore}
            </div>
            
            {isLoggedIn ? (
              <>
                <div className="mb-8 text-center h-8 flex items-center justify-center">
                  {lastScore > mockUser.pr ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/30"
                    >
                      <TrendingUp className="mr-2" size={18} /> ¡NUEVO RÉCORD! Subiste en el ranking
                    </motion.div>
                  ) : (
                    <p className="text-gray-400 font-medium">
                      ¡Uf! A solo <span className="text-white font-bold">{Math.max(0, mockUser.pr - lastScore)} pts</span> de tu récord.
                    </p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center bg-gradient-to-r from-rpp-yellow/20 to-orange-500/20 border border-rpp-yellow/50 px-4 py-3 md:px-6 rounded-xl mb-8 shadow-[0_0_20px_rgba(255,224,0,0.12)]"
                >
                  <div className="w-10 h-10 bg-rpp-yellow/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <Ticket className="text-rpp-yellow" size={22} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-rpp-yellow font-bold uppercase tracking-[0.18em] mb-0.5">Recompensa Semanal</p>
                    <p className="text-xl md:text-2xl font-black font-montserrat text-white">
                      +{lastEarnedTickets} <span className="text-sm text-gray-300 font-medium">Cupones Dorados</span>
                    </p>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <div className="info-card premium-soft-panel w-full rounded-xl px-4 py-3 text-center mb-5 border-white/8">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Rendimiento de hoy</p>
                  <p className="text-2xl font-black font-montserrat text-white leading-none mb-1.5">Top {relativeStanding.topPercent}%</p>
                  <p className="text-sm text-gray-300">Mejor que {relativeStanding.betterThan} de cada 100 jugadores hoy</p>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                  <div className="info-card premium-soft-panel rounded-xl p-4 text-center">
                    <p className="text-3xl font-black font-montserrat text-white">{lastCorrectAnswers}/{mockQuestions.length}</p>
                    <p className="text-sm text-gray-400">correctas</p>
                  </div>
                  <div className="info-card premium-soft-panel rounded-xl p-4 text-center">
                    <p className="text-3xl font-black font-montserrat text-white">{lastAverageTime}s</p>
                    <p className="text-sm text-gray-400">promedio/preg.</p>
                  </div>
                </div>

                <div className="result-share-actions w-full mb-4">
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

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleOpenPostMatchLogin}
                  className="result-primary-cta premium-button-primary w-full font-montserrat font-black text-base py-4 rounded-xl mb-3"
                >
                  Regístrate y compite por el premio
                </motion.button>

                <p className="text-xs md:text-sm text-gray-400 text-center mb-6 leading-relaxed">
                  Tus {lastScore.toLocaleString('es-PE')} puntos y +{pendingGoldenTickets || lastEarnedTickets} cupones quedan esperando si creas tu cuenta ahora.
                </p>
              </>
            )}

            <div className="result-secondary-actions w-full">
              <button 
                onClick={handlePlay}
                className={`${isLoggedIn ? 'premium-button-primary font-black text-base md:text-lg py-4 rounded-xl' : 'result-replay-button'} w-full font-montserrat flex items-center justify-center transition-transform`}
              >
                {tickets > 0 ? (
                  <><Play className="mr-2" fill="currentColor" size={isLoggedIn ? 24 : 18} /> JUGAR DE NUEVO {isLoggedIn ? `(🎟️ ${tickets})` : ''}</>
                ) : (
                  <><Ticket className="mr-2" size={isLoggedIn ? 24 : 18} /> VOLVER AL INICIO</>
                )}
              </button>
              
              <button 
                onClick={handleBackToDashboard}
                className="result-ghost-button w-full font-montserrat flex items-center justify-center transition-colors"
              >
                <Home className="mr-2" size={18} /> {isLoggedIn ? 'VESTUARIO' : 'SEGUIR SIN CUENTA'}
              </button>
              {!isLoggedIn && (
                <p className="text-xs text-gray-500 text-center">
                  Sin cuenta no participas en el premio semanal.
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
    </div>
  );
}
