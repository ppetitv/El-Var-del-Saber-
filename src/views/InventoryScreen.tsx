import React, { useState, useEffect } from 'react';
import { ChevronLeft, Ticket, Video, Clock, MonitorPlay, Users, RefreshCw, Star, Play, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  onBack: () => void;
  tickets: number;
  onAddTickets: (amount: number) => void;
}

export default function InventoryScreen({ onBack, tickets, onAddTickets }: InventoryProps) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [adTimer, setAdTimer] = useState(5);

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

  const handleWatchAd = () => {
    setAdState('playing');
    setAdTimer(5);
  };

  const closeAdModal = () => {
    setShowAdModal(false);
    setTimeout(() => setAdState('idle'), 300);
  };

  return (
    <div className="min-h-screen bg-stadium text-white p-6 font-sans max-w-3xl mx-auto pb-24 md:pb-12">
      {/* HEADER */}
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-card-dark rounded-full flex items-center justify-center border border-gray-800 hover:bg-card-light transition-colors mr-4"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black font-montserrat flex items-center">
            <Ticket className="mr-2 text-rpp-yellow" size={24} /> Inventario
          </h1>
          <p className="text-sm text-gray-400">Gestiona tus recursos y ayudas</p>
        </div>
      </div>

      {/* TICKETS SECTION */}
      <div className="mb-8">
        <h2 className="text-lg font-bold font-montserrat mb-4 flex items-center text-white">
          Tus Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card-dark to-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 opacity-10">
              <Ticket size={120} />
            </div>
            <p className="text-sm text-gray-400 mb-2 relative z-10">Balance Actual</p>
            <div className="flex items-baseline mb-2 relative z-10">
              <span className="text-5xl font-black font-montserrat text-rpp-yellow">{tickets}</span>
              <span className="text-xl text-gray-500 font-bold ml-1">/ 5</span>
            </div>
            <div className="flex items-center text-xs text-gray-400 bg-stadium/50 inline-flex px-3 py-1.5 rounded-lg border border-gray-800 relative z-10">
              <Clock size={14} className="mr-1.5 text-blue-400" />
              Recarga completa en 4h 20m
            </div>
          </motion.div>

          {/* Get More Tickets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card-dark p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center"
          >
            <p className="text-sm font-bold mb-4">¿Necesitas más tickets?</p>
            <button 
              onClick={() => setShowAdModal(true)}
              className="w-full bg-rpp-yellow text-stadium font-bold py-3.5 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,224,0,0.2)] mb-3"
            >
              <Video className="mr-2" size={18} /> VER SPONSOR (+2)
            </button>
            <div className="text-xs text-gray-500 flex items-start">
              <Info size={14} className="mr-1.5 shrink-0 mt-0.5" />
              <p>Recibes 5 tickets gratis cada 24 horas. Puedes tener un máximo de 5 tickets acumulados por tiempo.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LIFELINES SECTION */}
      <div>
        <h2 className="text-lg font-bold font-montserrat mb-4 flex items-center text-white">
          Comodines (Ayudas)
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Los comodines son gratuitos pero solo puedes usar <strong className="text-white">uno de cada tipo por partida</strong>. Úsalos sabiamente para asegurar tu victoria.
        </p>
        
        <div className="space-y-3">
          {/* VAR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card-dark p-4 rounded-2xl border border-gray-800 flex items-center"
          >
            <div className="w-12 h-12 bg-stadium rounded-xl flex items-center justify-center border border-gray-700 mr-4 shrink-0">
              <MonitorPlay size={24} className="text-rpp-yellow" />
            </div>
            <div>
              <h3 className="font-bold text-white">El VAR (50/50)</h3>
              <p className="text-xs text-gray-400 mt-0.5">El árbitro revisa la jugada y elimina 2 opciones incorrectas, dejándote solo con 2 posibles respuestas.</p>
            </div>
          </motion.div>

          {/* Hinchada */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card-dark p-4 rounded-2xl border border-gray-800 flex items-center"
          >
            <div className="w-12 h-12 bg-stadium rounded-xl flex items-center justify-center border border-gray-700 mr-4 shrink-0">
              <Users size={24} className="text-rpp-yellow" />
            </div>
            <div>
              <h3 className="font-bold text-white">El Clamor Popular</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pregunta a la hinchada. Verás los porcentajes de votación del público para cada opción. ¡Suelen tener la razón!</p>
            </div>
          </motion.div>

          {/* Cambio */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card-dark p-4 rounded-2xl border border-gray-800 flex items-center"
          >
            <div className="w-12 h-12 bg-stadium rounded-xl flex items-center justify-center border border-gray-700 mr-4 shrink-0">
              <RefreshCw size={24} className="text-rpp-yellow" />
            </div>
            <div>
              <h3 className="font-bold text-white">Cambio de Jugador</h3>
              <p className="text-xs text-gray-400 mt-0.5">¿No te sabes la respuesta? Cambia la pregunta actual por una nueva y reinicia el temporizador a 15 segundos.</p>
            </div>
          </motion.div>
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
                  <div className="w-16 h-16 bg-rpp-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="text-rpp-yellow" size={32} />
                  </div>
                  <h3 className="text-2xl font-black font-montserrat mb-2">Recarga Rápida</h3>
                  <p className="text-gray-400 mb-6">Mira un video corto de nuestro sponsor y obtén 2 tickets extra al instante para seguir jugando.</p>
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
                  <p className="text-gray-400 mb-6">Has recibido 2 tickets extra. ¡Ya puedes volver a la cancha!</p>
                  <button 
                    onClick={closeAdModal}
                    className="w-full bg-neon-green text-stadium font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <ChevronLeft className="mr-2" size={20} /> VOLVER AL INVENTARIO
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
