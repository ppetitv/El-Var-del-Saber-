import React from 'react';
import { ChevronLeft, Award, Star, Zap, BookOpen, Shield, Users, Clock, Lock } from 'lucide-react';
import { mockBadges, mockNewUserBadges } from '../data/mockData';
import { motion } from 'motion/react';

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  zap: Zap,
  book: BookOpen,
  shield: Shield,
  users: Users,
  clock: Clock
};

export default function BadgesScreen({ onBack, hasPlayed }: { onBack: () => void, hasPlayed: boolean }) {
  const currentBadges = hasPlayed ? mockBadges : mockNewUserBadges;
  const unlockedCount = currentBadges.filter(b => b.isUnlocked).length;
  const totalCount = currentBadges.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-stadium text-white p-6 font-sans max-w-5xl mx-auto pb-24 md:pb-12">
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
            <Award className="mr-2 text-rpp-yellow" size={24} /> Sala de Trofeos
          </h1>
          <p className="text-sm text-gray-400">Colecciona insignias para demostrar tu conocimiento</p>
        </div>
      </div>

      {/* PROGRESS SUMMARY */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-dark p-6 rounded-3xl border border-gray-800 shadow-lg mb-8"
      >
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Progreso Total</p>
            <p className="font-bold font-montserrat text-2xl text-white">
              {unlockedCount} <span className="text-lg text-gray-500">/ {totalCount} Insignias</span>
            </p>
          </div>
          <p className="text-sm font-bold text-rpp-yellow bg-rpp-yellow/10 px-3 py-1 rounded-lg">
            {Math.round(progressPercentage)}% Completado
          </p>
        </div>
        <div className="w-full bg-stadium rounded-full h-4 border border-gray-800 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-rpp-yellow to-orange-500 h-full rounded-full relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* BADGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBadges.map((badge, index) => {
          const IconComponent = iconMap[badge.icon] || Star;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-3xl border-2 transition-all overflow-hidden flex flex-col h-full ${
                badge.isUnlocked 
                  ? 'bg-card-dark border-gray-700 hover:border-rpp-yellow/50 shadow-lg' 
                  : 'bg-stadium border-gray-800 opacity-80 grayscale-[50%]'
              }`}
            >
              {/* Background Glow for Unlocked */}
              {badge.isUnlocked && (
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${badge.color} rounded-full blur-3xl opacity-10`} />
              )}

              <div className="flex items-start mb-4 relative z-10">
                <div className={`w-16 h-16 hexagon flex items-center justify-center shrink-0 mr-4 shadow-lg ${
                  badge.isUnlocked 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-card-light border-2 border-gray-700'
                }`}>
                  {badge.isUnlocked ? (
                    <IconComponent size={28} className="text-stadium" fill="currentColor" />
                  ) : (
                    <Lock size={24} className="text-gray-500" />
                  )}
                </div>
                
                <div>
                  <h3 className={`font-black font-montserrat text-xl mb-1 ${badge.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {badge.name}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    badge.isUnlocked ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {badge.isUnlocked ? 'Desbloqueada' : 'Bloqueada'}
                  </span>
                </div>
              </div>

              <p className={`text-sm flex-grow relative z-10 ${badge.isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                {badge.description}
              </p>

              {/* Individual Progress Bar */}
              {!badge.isUnlocked && badge.total > 1 && (
                <div className="mt-6 relative z-10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-semibold uppercase">Progreso</span>
                    <span className="text-gray-400 font-bold">{badge.progress} / {badge.total}</span>
                  </div>
                  <div className="w-full bg-card-dark rounded-full h-2 border border-gray-800">
                    <div 
                      className="bg-gray-500 h-full rounded-full" 
                      style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
