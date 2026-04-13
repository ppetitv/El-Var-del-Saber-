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
    <div className="min-h-screen bg-stadium text-white p-4 md:p-6 font-sans max-w-4xl mx-auto pb-24 md:pb-12">
      {/* HEADER */}
      <div className="flex items-center mb-6 md:mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-card-dark rounded-full flex items-center justify-center border border-gray-800 hover:bg-card-light transition-colors mr-4"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-black font-montserrat flex items-center">
            Sorteo Semanal
          </h1>
        </div>
      </div>

      {/* HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black rounded-3xl p-8 md:p-12 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden mb-8"
      >
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
        <Gamepad2 className="absolute -right-10 -bottom-10 text-blue-500/10 w-64 h-64 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-2 rounded-full mb-6">
            <Clock size={16} className="text-blue-400" />
            <span className="text-blue-300 font-bold text-sm tracking-wide">TERMINA EN: 2D 14H 20M</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black font-montserrat text-white tracking-tighter mb-4 drop-shadow-lg">
            PlayStation 5
          </h2>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl font-medium mb-8">
            Acumula Cupones Dorados jugando partidas. ¡Mientras más cupones tengas, más probabilidades tienes de ganar en el sorteo de este domingo!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COL: USER TICKETS */}
        <div className="md:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card-dark rounded-3xl p-8 border border-rpp-yellow/30 shadow-[0_0_30px_rgba(255,224,0,0.1)] relative overflow-hidden h-full flex flex-col justify-center"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rpp-yellow to-orange-500"></div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-rpp-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rpp-yellow/20">
                <Ticket className="text-rpp-yellow" size={40} />
              </div>
              <h3 className="text-xl font-bold font-montserrat mb-1">Tus Cupones Dorados</h3>
              <p className="text-sm text-gray-400">Participaciones para el sorteo</p>
            </div>

            {isLoggedIn ? (
              <div className="text-center">
                <div className="text-7xl font-black font-montserrat text-rpp-yellow mb-6 drop-shadow-[0_0_15px_rgba(255,224,0,0.3)]">
                  {goldenTickets}
                </div>
                <button 
                  onClick={onPlayClick}
                  className="w-full bg-rpp-yellow text-stadium font-bold py-4 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="mr-2" size={20} fill="currentColor" /> JUGAR PARA GANAR MÁS
                </button>
              </div>
            ) : (
              <div className="text-center bg-card-light/50 p-6 rounded-2xl border border-gray-700">
                <LockKeyhole className="mx-auto text-gray-500 mb-3" size={32} />
                <p className="text-sm text-gray-300 mb-4">
                  Inicia sesión o regístrate gratis para empezar a acumular cupones y participar en el sorteo.
                </p>
                <button 
                  onClick={onLoginClick}
                  className="w-full bg-stadium text-white border border-gray-600 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
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
            className="bg-card-dark rounded-3xl p-8 border border-gray-800 h-full"
          >
            <h3 className="text-xl font-bold font-montserrat mb-6 flex items-center">
              <Info className="mr-2 text-blue-400" size={24} /> ¿Cómo ganar cupones?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card-light/30 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Play className="text-gray-300" size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Jugar un partido</p>
                    <p className="text-xs text-gray-400">Ganes o pierdas, tu participación cuenta.</p>
                  </div>
                </div>
                <div className="flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +1 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card-light/30 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Trophy className="text-neon-green" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Ganar un partido</p>
                    <p className="text-xs text-gray-400">Demuestra que sabes más que tu rival.</p>
                  </div>
                </div>
                <div className="flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +3 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card-light/30 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Zap className="text-orange-500" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Racha de 3 victorias</p>
                    <p className="text-xs text-gray-400">Mantén el invicto y multiplica tus chances.</p>
                  </div>
                </div>
                <div className="flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
                  +10 <Ticket size={16} className="ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card-light/30 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Calendar className="text-purple-400" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Jugar 5 días seguidos</p>
                    <p className="text-xs text-gray-400">Premio a la lealtad semanal.</p>
                  </div>
                </div>
                <div className="flex items-center text-rpp-yellow font-black text-lg bg-rpp-yellow/10 px-3 py-1 rounded-lg">
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
