import React from 'react';
import { ChevronLeft, Gamepad2, Ticket, Clock, Info, Zap, Trophy, Calendar, LogIn, Play, LockKeyhole } from 'lucide-react';
import { motion } from 'motion/react';

interface PrizeScreenProps {
  onBack: () => void;
  goldenTickets: number;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onPlayClick: () => void;
}

export default function PrizeScreen({ onBack, goldenTickets, isLoggedIn, onLoginClick, onPlayClick }: PrizeScreenProps) {
  return (
    <div className="prize-screen min-h-screen bg-stadium text-white p-4 md:p-5 font-sans max-w-4xl mx-auto pb-24 md:pb-12">
      {/* HEADER */}
      <div className="prize-header premium-panel flex items-center mb-5 md:mb-6 rounded-2xl p-4">
        <button 
          onClick={onBack}
          className="premium-button-secondary w-10 h-10 rounded-full flex items-center justify-center mr-4"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <div className="premium-topline mb-2">Premio activo</div>
          <h1 className="premium-title text-xl md:text-2xl font-black font-montserrat flex items-center">
            Sorteo Semanal
          </h1>
        </div>
      </div>

      {/* HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prize-hero premium-panel premium-hero w-full rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(59,130,246,0.14)] relative overflow-hidden mb-6"
      >
        <div className="prize-hero-glow absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
        <Gamepad2 className="prize-hero-icon absolute -right-10 -bottom-10 text-blue-500/10 w-64 h-64 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="prize-countdown inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1.5 rounded-full mb-5">
            <Clock size={16} className="text-blue-400" />
            <span className="text-blue-300 font-bold text-sm tracking-wide">TERMINA EN: 2D 14H 20M</span>
          </div>
          
          <h2 className="premium-title text-4xl md:text-6xl font-black font-montserrat text-white tracking-tighter mb-3 drop-shadow-lg">
            PlayStation 5
          </h2>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl font-medium mb-6">
            Acumula Cupones Dorados jugando partidas. ¡Mientras más cupones tengas, más probabilidades tienes de ganar en el sorteo de este domingo!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* LEFT COL: USER TICKETS */}
        <div className="md:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="info-card prize-ticket-card premium-panel rounded-2xl p-6 shadow-[0_0_24px_rgba(255,224,0,0.08)] relative overflow-hidden h-full flex flex-col justify-center"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rpp-yellow to-orange-500"></div>
            
            <div className="text-center mb-6">
            <div className="premium-icon-wrap prize-ticket-icon w-14 h-14 rounded-full mx-auto mb-4 border-rpp-yellow/20 bg-rpp-yellow/10">
              <Ticket className="text-rpp-yellow" size={40} />
            </div>
              <h3 className="text-xl font-bold font-montserrat mb-1">Tus Cupones Dorados</h3>
              <p className="text-sm text-gray-400">Participaciones para el sorteo</p>
            </div>

            {isLoggedIn ? (
              <div className="text-center">
                <div className="text-6xl font-black font-montserrat text-rpp-yellow mb-5 drop-shadow-[0_0_15px_rgba(255,224,0,0.2)]">
                  {goldenTickets}
                </div>
                <button 
                  onClick={onPlayClick}
                  className="premium-button-primary w-full font-bold py-3.5 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="mr-2" size={20} fill="currentColor" /> JUGAR PARA GANAR MÁS
                </button>
              </div>
            ) : (
              <div className="text-center bg-card-light/50 p-5 rounded-xl border border-gray-700">
                <LockKeyhole className="mx-auto text-gray-500 mb-3" size={32} />
                <p className="text-sm text-gray-300 mb-4">
                  Inicia sesión o regístrate gratis para empezar a acumular cupones y participar en el sorteo.
                </p>
                <button 
                  onClick={onLoginClick}
                  className="premium-button-secondary w-full font-bold py-3 rounded-xl flex items-center justify-center transition-colors"
                >
                  <LogIn className="mr-2" size={18} /> Crear mi cuenta
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COL: HOW TO EARN */}
        <div className="md:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="info-card prize-rules-card premium-panel rounded-2xl p-6 h-full"
          >
            <h3 className="text-lg font-bold font-montserrat mb-5 flex items-center">
              <Info className="mr-2 text-blue-400" size={24} /> ¿Cómo ganar cupones?
            </h3>
            
            <div className="space-y-4">
              <div className="info-card prize-rule-row flex items-center justify-between p-3.5 bg-card-light/30 rounded-xl border border-gray-800/50">
                <div className="flex items-center">
                  <div className="prize-rule-icon prize-rule-icon-neutral w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Play className="text-gray-300" size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Jugar un partido</p>
                    <p className="text-xs text-gray-400">Ganes o pierdas, tu participación cuenta.</p>
                  </div>
                </div>
                <div className="prize-reward-chip flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +1 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="info-card prize-rule-row flex items-center justify-between p-3.5 bg-card-light/30 rounded-xl border border-gray-800/50">
                <div className="flex items-center">
                  <div className="prize-rule-icon prize-rule-icon-green w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Trophy className="text-neon-green" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Ganar un partido</p>
                    <p className="text-xs text-gray-400">Demuestra que sabes más que tu rival.</p>
                  </div>
                </div>
                <div className="prize-reward-chip flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +3 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="info-card prize-rule-row flex items-center justify-between p-3.5 bg-card-light/30 rounded-xl border border-gray-800/50">
                <div className="flex items-center">
                  <div className="prize-rule-icon prize-rule-icon-gold w-10 h-10 bg-orange-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Zap className="text-orange-500" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Racha de 3 victorias</p>
                    <p className="text-xs text-gray-400">Mantén el invicto y multiplica tus chances.</p>
                  </div>
                </div>
                <div className="prize-reward-chip flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +10 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="info-card prize-rule-row flex items-center justify-between p-3.5 bg-card-light/30 rounded-xl border border-gray-800/50">
                <div className="flex items-center">
                  <div className="prize-rule-icon prize-rule-icon-blue w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Calendar className="text-purple-400" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Jugar 5 días seguidos</p>
                    <p className="text-xs text-gray-400">Premio a la lealtad semanal.</p>
                  </div>
                </div>
                <div className="prize-reward-chip flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +50 <Ticket size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
