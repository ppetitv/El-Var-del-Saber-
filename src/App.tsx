import React, { useState, useEffect } from 'react';
import VestuarioScreen from './views/VestuarioScreen';
import MatchScreen from './views/MatchScreen';
import RankingScreen from './views/RankingScreen';
import BadgesScreen from './views/BadgesScreen';
import DivisionsScreen from './views/DivisionsScreen';
import InventoryScreen from './views/InventoryScreen';
import PrizeScreen from './views/PrizeScreen';
import LoginModal from './components/LoginModal';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Share2, Home, RotateCcw, Ticket, X, Play, TrendingUp } from 'lucide-react';
import { mockUser } from './data/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'vestuario' | 'match' | 'result' | 'ranking' | 'badges' | 'divisions' | 'inventory' | 'prize'>('vestuario');
  const [lastScore, setLastScore] = useState(0);
  const [lastEarnedTickets, setLastEarnedTickets] = useState(0);
  const [tickets, setTickets] = useState(5); // Full inventory for new users
  const [goldenTickets, setGoldenTickets] = useState(0); // Golden tickets for the weekly raffle
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingChallenge, setPendingChallenge] = useState<{challenger: string, score: number} | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  useEffect(() => {
    // Parse URL for viral challenges
    const params = new URLSearchParams(window.location.search);
    const challenger = params.get('challenger');
    const score = params.get('score');
    
    if (challenger && score) {
      setPendingChallenge({ challenger, score: parseInt(score, 10) });
      // Clean the URL so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleShareChallenge = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('challenger', mockUser.username);
    url.searchParams.set('score', lastScore.toString());
    
    const shareData = {
      title: '¡Te reto en El VAR del Saber!',
      text: `¡He sacado ${lastScore} puntos en El VAR del Saber! ¿Te atreves a superarme?`,
      url: url.toString()
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('¡Enlace de reto copiado al portapapeles!');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // El usuario canceló el diálogo de compartir, no hacemos nada
        return;
      }
      // Si falla por otra razón (ej. iframe sin permisos), intentamos copiar al portapapeles
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('¡Enlace de reto copiado al portapapeles!');
      } catch (clipboardErr) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handlePlay = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (tickets <= 0) {
      setCurrentScreen('inventory');
      return;
    }
    setTickets(prev => Math.max(0, prev - 1));
    setCurrentScreen('match');
  };

  const handleAddTickets = (amount: number) => {
    setTickets(prev => Math.min(prev + amount, 5));
  };

  const handleFinishMatch = (score: number) => {
    setLastScore(score);
    setHasPlayed(true);
    // Simulate earning golden tickets: +1 for playing, +2 extra if score is high (win simulation)
    const earnedGoldenTickets = score > 1000 ? 3 : 1;
    setLastEarnedTickets(earnedGoldenTickets);
    setGoldenTickets(prev => prev + earnedGoldenTickets);
    setCurrentScreen('result');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('vestuario');
  };

  const handleGoToRanking = () => {
    setCurrentScreen('ranking');
  };

  const handleGoToBadges = () => {
    setCurrentScreen('badges');
  };

  const handleGoToDivisions = () => {
    setCurrentScreen('divisions');
  };

  const handleGoToInventory = () => {
    setCurrentScreen('inventory');
  };

  const handleGoToPrize = () => {
    setCurrentScreen('prize');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGoldenTickets(0); // Reset golden tickets on logout for demo purposes
  };

  return (
    <div className="bg-stadium min-h-screen text-white">
      {currentScreen === 'vestuario' && (
        <VestuarioScreen 
          onPlay={handlePlay} 
          tickets={tickets} 
          goldenTickets={goldenTickets}
          onAddTickets={handleAddTickets}
          onGoToRanking={handleGoToRanking}
          onGoToBadges={handleGoToBadges}
          onGoToDivisions={handleGoToDivisions}
          onGoToInventory={handleGoToInventory}
          onGoToPrize={handleGoToPrize}
          isLoggedIn={isLoggedIn}
          hasPlayed={hasPlayed}
          onLoginClick={() => setShowLoginModal(true)}
          onLogoutClick={handleLogout}
        />
      )}
      {currentScreen === 'match' && <MatchScreen onFinish={handleFinishMatch} />}
      {currentScreen === 'ranking' && <RankingScreen onBack={handleBackToDashboard} />}
      {currentScreen === 'badges' && <BadgesScreen onBack={handleBackToDashboard} hasPlayed={hasPlayed} />}
      {currentScreen === 'divisions' && <DivisionsScreen onBack={handleBackToDashboard} />}
      {currentScreen === 'inventory' && (
        <InventoryScreen 
          onBack={handleBackToDashboard} 
          tickets={tickets} 
          onAddTickets={handleAddTickets} 
        />
      )}
      {currentScreen === 'prize' && (
        <PrizeScreen 
          onBack={handleBackToDashboard} 
          goldenTickets={goldenTickets} 
          isLoggedIn={isLoggedIn} 
          onLoginClick={() => setShowLoginModal(true)}
          onPlayClick={handlePlay}
        />
      )}
      {currentScreen === 'result' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen p-6 font-sans flex flex-col items-center justify-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-card-dark w-full rounded-3xl p-8 md:p-16 flex flex-col items-center border border-gray-800 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-rpp-yellow"></div>
            <Trophy size={80} className="text-rpp-yellow mb-6 drop-shadow-[0_0_15px_rgba(255,224,0,0.5)]" />
            
            <h1 className="text-3xl md:text-5xl font-montserrat font-black text-white mb-2 text-center">¡PARTIDO TERMINADO!</h1>
            <p className="text-gray-400 mb-8 text-sm md:text-base uppercase tracking-widest font-semibold">Puntaje Final</p>
            
            <div className="text-8xl md:text-9xl font-montserrat font-black text-rpp-yellow mb-2 drop-shadow-[0_0_30px_rgba(255,224,0,0.4)]">
              {lastScore}
            </div>
            
            {/* CONDITIONAL FEEDBACK (PR / RANKING) */}
            <div className="mb-8 text-center h-8 flex items-center justify-center">
              {lastScore > mockUser.pr ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/30"
                >
                  <TrendingUp className="mr-2" size={18} /> ¡NUEVO RÉCORD! Subiste en el ranking 🚀
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
              className="flex items-center justify-center bg-gradient-to-r from-rpp-yellow/20 to-orange-500/20 border border-rpp-yellow/50 px-6 py-4 md:px-8 md:py-4 rounded-2xl mb-12 shadow-[0_0_20px_rgba(255,224,0,0.2)]"
            >
              <div className="w-12 h-12 bg-rpp-yellow/20 rounded-full flex items-center justify-center mr-4 shrink-0">
                <Ticket className="text-rpp-yellow" size={28} />
              </div>
              <div className="text-left">
                <p className="text-xs text-rpp-yellow font-bold uppercase tracking-wider mb-0.5">Recompensa Semanal</p>
                <p className="text-2xl md:text-3xl font-black font-montserrat text-white">
                  +{lastEarnedTickets} <span className="text-lg text-gray-300 font-medium">Cupones Dorados</span>
                </p>
              </div>
            </motion.div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handlePlay}
                className="w-full bg-rpp-yellow text-stadium font-montserrat font-black text-xl py-5 rounded-xl shadow-[0_0_20px_rgba(255,224,0,0.3)] flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                {tickets > 0 ? (
                  <><Play className="mr-2" fill="currentColor" size={24} /> JUGAR DE NUEVO (🎟️ {tickets})</>
                ) : (
                  <><Ticket className="mr-2" size={24} /> CONSEGUIR TICKETS</>
                )}
              </button>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={handleShareChallenge}
                  className="w-1/2 bg-transparent border-2 border-rpp-yellow text-rpp-yellow font-montserrat font-bold text-sm md:text-base py-4 rounded-xl flex items-center justify-center hover:bg-rpp-yellow/10 transition-colors"
                >
                  <Share2 className="mr-2" size={18} /> RETAR AMIGO
                </button>
                
                <button 
                  onClick={handleBackToDashboard}
                  className="w-1/2 bg-card-light text-white font-montserrat font-bold text-sm md:text-base py-4 rounded-xl border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <Home className="mr-2" size={18} /> VESTUARIO
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={() => {
          setIsLoggedIn(true);
          setShowLoginModal(false);
        }} 
      />

      {/* VIRAL CHALLENGE MODAL */}
      <AnimatePresence>
        {pendingChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card-dark border border-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setPendingChallenge(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-20 h-20 bg-rpp-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-rpp-yellow/50">
                <Trophy className="text-rpp-yellow" size={40} />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black font-montserrat mb-2 text-white uppercase tracking-tight">
                ¡Te han retado!
              </h3>
              
              <p className="text-gray-300 mb-8 text-lg">
                <span className="font-bold text-rpp-yellow">{pendingChallenge.challenger}</span> te ha retado a superar sus <span className="font-black text-white">{pendingChallenge.score} puntos</span> en El VAR del Saber. ¿Aceptas el desafío?
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setPendingChallenge(null);
                    handlePlay();
                  }}
                  className="w-full bg-rpp-yellow text-stadium font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,224,0,0.3)]"
                >
                  <Play className="mr-2" size={20} fill="currentColor" /> ACEPTAR RETO
                </button>
                <button 
                  onClick={() => setPendingChallenge(null)}
                  className="w-full bg-transparent border border-gray-700 text-gray-400 font-bold py-4 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
                >
                  IGNORAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
