import React from 'react';
import { ChevronLeft, Crown, Flame, Shirt, Footprints, Calculator, Info } from 'lucide-react';
import { mockUser } from '../data/mockData';
import { motion } from 'motion/react';

const divisions = [
  {
    id: 'dios',
    name: 'Dios del Fútbol',
    range: '+2,500 PR',
    minPr: 2501,
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/50',
    gradient: 'from-yellow-400/20 to-transparent'
  },
  {
    id: 'crack',
    name: 'Crack Indiscutible',
    range: '2,001 - 2,500 PR',
    minPr: 2001,
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    gradient: 'from-orange-500/20 to-transparent'
  },
  {
    id: 'el10',
    name: 'El 10 de la Cancha',
    range: '1,501 - 2,000 PR',
    minPr: 1501,
    icon: Shirt,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/50',
    gradient: 'from-cyan-400/20 to-transparent'
  },
  {
    id: 'fino',
    name: 'Pelotero Fino',
    range: '1,201 - 1,500 PR',
    minPr: 1201,
    icon: Footprints,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    gradient: 'from-green-500/20 to-transparent'
  },
  {
    id: 'losa',
    name: 'Jugador de Losa',
    range: '0 - 1,200 PR',
    minPr: 0,
    icon: Footprints, // Using footprints for both, but styled differently
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/50',
    gradient: 'from-gray-400/20 to-transparent'
  }
];

export default function DivisionsScreen({ onBack }: { onBack: () => void }) {
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
            Divisiones de Prestigio
          </h1>
          <p className="text-sm text-gray-400">Sistema de clasificación ELO</p>
        </div>
      </div>

      {/* ELO MATH EXPLANATION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-dark p-6 rounded-3xl border border-gray-800 shadow-lg mb-8 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 text-gray-800 opacity-50">
          <Calculator size={100} />
        </div>
        <h2 className="font-bold font-montserrat text-lg flex items-center mb-4 text-rpp-yellow relative z-10">
          <Info className="mr-2" size={20} /> Matemática ELO
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="bg-stadium p-3 rounded-xl border border-gray-800 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Base Inicial</p>
            <p className="font-black font-montserrat text-xl">1,000 <span className="text-sm text-gray-500">PR</span></p>
          </div>
          <div className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30 text-center">
            <p className="text-xs text-neon-green uppercase tracking-wider mb-1">Victoria</p>
            <p className="font-black font-montserrat text-xl text-neon-green">+25 <span className="text-sm opacity-70">PR</span></p>
          </div>
          <div className="bg-gray-500/10 p-3 rounded-xl border border-gray-500/30 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Empate</p>
            <p className="font-black font-montserrat text-xl text-gray-300">+5 <span className="text-sm opacity-70">PR</span></p>
          </div>
          <div className="bg-var-red/10 p-3 rounded-xl border border-var-red/30 text-center">
            <p className="text-xs text-var-red uppercase tracking-wider mb-1">Derrota</p>
            <p className="font-black font-montserrat text-xl text-var-red">-15 <span className="text-sm opacity-70">PR</span></p>
          </div>
        </div>
      </motion.div>

      {/* DIVISIONS PYRAMID LIST */}
      <div className="space-y-4 relative">
        {/* Connecting line behind */}
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-800 rounded-full hidden md:block"></div>

        {divisions.map((div, index) => {
          const isCurrentDivision = mockUser.division === div.name;
          const Icon = div.icon;

          return (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className={`relative flex items-center p-4 md:p-6 rounded-3xl border-2 transition-all overflow-hidden ${
                isCurrentDivision 
                  ? `bg-gradient-to-r ${div.gradient} ${div.border} shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02]` 
                  : 'bg-card-dark border-gray-800 opacity-80'
              }`}
            >
              {/* Current Division Indicator */}
              {isCurrentDivision && (
                <div className="absolute top-0 right-0 bg-rpp-yellow text-stadium text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Tu División
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mr-4 md:mr-6 z-10 ${div.bg} ${div.color}`}>
                <Icon size={32} />
              </div>

              {/* Info */}
              <div className="flex-grow z-10">
                <h3 className={`font-black font-montserrat text-xl md:text-2xl mb-1 ${isCurrentDivision ? 'text-white' : 'text-gray-300'}`}>
                  {div.name}
                </h3>
                <p className={`font-bold ${div.color}`}>
                  {div.range}
                </p>
              </div>

              {/* Progress Bar (Only for current division) */}
              {isCurrentDivision && index > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                  <div 
                    className={`h-full ${div.bg.replace('/10', '')}`} 
                    style={{ 
                      width: `${Math.min(100, Math.max(0, ((mockUser.pr - div.minPr) / (divisions[index - 1].minPr - div.minPr)) * 100))}%` 
                    }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
