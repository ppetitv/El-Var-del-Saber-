import React from 'react';
import { ChevronLeft, Trophy, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockRanking } from '../data/mockData';
import { motion } from 'motion/react';

export default function RankingScreen({ onBack }: { onBack: () => void }) {
  const top3 = mockRanking.slice(0, 3);
  const restOfRanking = mockRanking.slice(3);

  return (
    <div className="min-h-screen bg-stadium text-white p-6 font-sans max-w-4xl mx-auto pb-24 md:pb-12">
      {/* HEADER */}
      <div className="flex items-center mb-12">
        <button 
          onClick={onBack}
          className="premium-button-secondary w-10 h-10 rounded-full flex items-center justify-center mr-4"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <div className="premium-topline mb-2">Clasificación premium</div>
          <h1 className="premium-title text-2xl font-black font-montserrat flex items-center">
            <Trophy className="mr-2 text-rpp-yellow" size={24} /> Ranking Global
          </h1>
          <p className="text-sm text-gray-400">Compite por el mejor puntaje de la comunidad</p>
        </div>
      </div>

      {/* PODIUM (Top 3) */}
      <div className="flex justify-center items-end h-64 mb-12 gap-2 md:gap-6">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center w-1/3 max-w-[120px]"
        >
          <div className="w-16 h-16 bg-card-light rounded-full flex items-center justify-center text-3xl border-4 border-gray-400 z-10 relative shadow-[0_0_15px_rgba(156,163,175,0.5)] mb-2">
            {top3[1].avatar}
            <div className="absolute -bottom-2 bg-gray-400 text-stadium text-xs font-black px-2 py-0.5 rounded-full">#2</div>
          </div>
          <p className="font-bold text-sm truncate w-full text-center">{top3[1].username}</p>
          <p className="text-rpp-yellow font-bold text-xs mb-2">{top3[1].pr} PR</p>
          <div className="w-full h-24 bg-gradient-to-t from-card-dark to-gray-800 rounded-t-xl border-t-2 border-gray-400 flex items-start justify-center pt-4">
            <Medal className="text-gray-400" size={24} />
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center w-1/3 max-w-[140px] z-10"
        >
          <div className="w-20 h-20 bg-card-light rounded-full flex items-center justify-center text-4xl border-4 border-rpp-yellow z-10 relative shadow-[0_0_25px_rgba(255,224,0,0.6)] mb-2">
            {top3[0].avatar}
            <div className="absolute -bottom-2 bg-rpp-yellow text-stadium text-xs font-black px-2 py-0.5 rounded-full">#1</div>
          </div>
          <p className="font-bold text-base truncate w-full text-center">{top3[0].username}</p>
          <p className="text-rpp-yellow font-black text-sm mb-2">{top3[0].pr} PR</p>
          <div className="w-full h-32 bg-gradient-to-t from-card-dark to-yellow-900/50 rounded-t-xl border-t-2 border-rpp-yellow flex items-start justify-center pt-4">
            <Trophy className="text-rpp-yellow" size={32} />
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center w-1/3 max-w-[120px]"
        >
          <div className="w-16 h-16 bg-card-light rounded-full flex items-center justify-center text-3xl border-4 border-amber-700 z-10 relative shadow-[0_0_15px_rgba(180,83,9,0.5)] mb-2">
            {top3[2].avatar}
            <div className="absolute -bottom-2 bg-amber-700 text-white text-xs font-black px-2 py-0.5 rounded-full">#3</div>
          </div>
          <p className="font-bold text-sm truncate w-full text-center">{top3[2].username}</p>
          <p className="text-rpp-yellow font-bold text-xs mb-2">{top3[2].pr} PR</p>
          <div className="w-full h-20 bg-gradient-to-t from-card-dark to-amber-900/30 rounded-t-xl border-t-2 border-amber-700 flex items-start justify-center pt-4">
            <Medal className="text-amber-700" size={24} />
          </div>
        </motion.div>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {restOfRanking.map((user, index) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (index * 0.05) }}
            className={`flex items-center p-4 rounded-2xl border ${user.isCurrentUser ? 'bg-rpp-yellow/10 border-rpp-yellow shadow-[0_0_15px_rgba(255,224,0,0.1)]' : 'premium-soft-panel border-white/5'}`}
          >
            <div className="w-12 flex-shrink-0 text-center font-bold text-gray-400 mr-2">
              #{user.id}
            </div>
            <div className="w-10 h-10 bg-card-light rounded-full flex items-center justify-center text-xl mr-4 shrink-0 border border-gray-700">
              {user.avatar}
            </div>
            <div className="flex-grow">
              <p className={`font-bold ${user.isCurrentUser ? 'text-rpp-yellow' : 'text-white'}`}>
                {user.username} {user.isCurrentUser && '(Tú)'}
              </p>
              <p className="text-xs text-gray-400">Mejor partida registrada</p>
            </div>
            <div className="text-right flex items-center">
              <div className="mr-4">
                <p className="font-black font-montserrat text-white">{user.pr}</p>
                <p className="text-[10px] text-gray-400 uppercase">PR</p>
              </div>
              <div className="w-6 flex justify-center">
                {user.trend === 'up' && <TrendingUp size={16} className="text-neon-green" />}
                {user.trend === 'down' && <TrendingDown size={16} className="text-var-red" />}
                {user.trend === 'same' && <Minus size={16} className="text-gray-500" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Current User Sticky Bottom (if not in top list) - Simulated by just showing them at the bottom of the list for now */}
    </div>
  );
}
