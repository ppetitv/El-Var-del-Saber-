import React from 'react';
import { ChevronLeft, Trophy, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockRanking } from '../data/mockData';
import { motion } from 'motion/react';
import AvatarImage from '../components/AvatarImage';

export default function RankingScreen({ onBack }: { onBack: () => void }) {
  const top3 = mockRanking.slice(0, 3);
  const restOfRanking = mockRanking.slice(3);
  const currentUser = mockRanking.find((user) => user.isCurrentUser);

  return (
    <div className="ranking-screen min-h-screen bg-stadium text-white p-4 md:p-6 font-sans max-w-4xl mx-auto pb-24 md:pb-12">
      {/* HEADER */}
      <div className="ranking-header premium-panel flex items-center mb-8 md:mb-10 rounded-2xl p-4">
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

      {currentUser && (
        <div className="ranking-current-user premium-panel rounded-2xl p-4 mb-5 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center min-w-0">
              <div className="w-11 h-11 bg-card-light rounded-full flex items-center justify-center text-xl mr-3 shrink-0 border border-rpp-yellow">
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-black mb-1">Tu posicion</p>
                <p className="font-black text-rpp-yellow truncate">{currentUser.username}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black font-montserrat text-slate-950">#{currentUser.id}</p>
              <p className="text-xs text-slate-500">{currentUser.pr} pts.</p>
            </div>
          </div>
        </div>
      )}

      {/* PODIUM (Top 3) */}
      <div className="ranking-podium premium-panel flex justify-center items-end min-h-[18.5rem] md:min-h-[22rem] mb-8 md:mb-10 gap-2 md:gap-6 rounded-3xl px-3 md:px-8 pt-6 md:pt-8 pb-3 md:pb-4 overflow-visible">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center w-1/3 max-w-[120px]"
        >
          <div className="ranking-avatar ranking-avatar-silver w-16 h-16 bg-card-light rounded-full flex items-center justify-center text-3xl border-4 border-gray-400 z-10 relative shadow-[0_0_15px_rgba(156,163,175,0.5)] mb-2">
            <AvatarImage src={top3[1].avatar} alt={top3[1].username} />
            <div className="absolute -bottom-2 bg-gray-400 text-stadium text-xs font-black px-2 py-0.5 rounded-full">#2</div>
          </div>
          <p className="font-bold text-sm text-slate-900 truncate w-full text-center">{top3[1].username}</p>
          <p className="text-rpp-yellow font-bold text-xs mb-2">{top3[1].pr} pts.</p>
          <div className="ranking-step ranking-step-silver w-full h-20 md:h-24 bg-gradient-to-t from-card-dark to-gray-800 rounded-t-xl border-t-2 border-gray-400 flex items-start justify-center pt-4">
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
          <div className="ranking-avatar ranking-avatar-gold w-20 h-20 bg-card-light rounded-full flex items-center justify-center text-4xl border-4 border-rpp-yellow z-10 relative shadow-[0_0_25px_rgba(255,224,0,0.6)] mb-2">
            <AvatarImage src={top3[0].avatar} alt={top3[0].username} />
            <div className="absolute -bottom-2 bg-rpp-yellow text-stadium text-xs font-black px-2 py-0.5 rounded-full">#1</div>
          </div>
          <p className="font-bold text-base text-slate-900 truncate w-full text-center">{top3[0].username}</p>
          <p className="text-rpp-yellow font-black text-sm mb-2">{top3[0].pr} pts.</p>
          <div className="ranking-step ranking-step-gold w-full h-28 md:h-32 bg-gradient-to-t from-card-dark to-yellow-900/50 rounded-t-xl border-t-2 border-rpp-yellow flex items-start justify-center pt-4">
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
          <div className="ranking-avatar ranking-avatar-bronze w-16 h-16 bg-card-light rounded-full flex items-center justify-center text-3xl border-4 border-amber-700 z-10 relative shadow-[0_0_15px_rgba(180,83,9,0.5)] mb-2">
            <AvatarImage src={top3[2].avatar} alt={top3[2].username} />
            <div className="absolute -bottom-2 bg-amber-700 text-white text-xs font-black px-2 py-0.5 rounded-full">#3</div>
          </div>
          <p className="font-bold text-sm text-slate-900 truncate w-full text-center">{top3[2].username}</p>
          <p className="text-rpp-yellow font-bold text-xs mb-2">{top3[2].pr} pts.</p>
          <div className="ranking-step ranking-step-bronze w-full h-16 md:h-20 bg-gradient-to-t from-card-dark to-amber-900/30 rounded-t-xl border-t-2 border-amber-700 flex items-start justify-center pt-4">
            <Medal className="text-amber-700" size={24} />
          </div>
        </motion.div>
      </div>

      {/* LIST */}
      <div className="ranking-list space-y-3">
        {restOfRanking.map((user, index) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (index * 0.05) }}
            className={`ranking-row flex items-center p-4 rounded-2xl border ${user.isCurrentUser ? 'ranking-row-current bg-rpp-yellow/10 border-rpp-yellow shadow-[0_0_15px_rgba(255,224,0,0.1)]' : 'premium-soft-panel border-white/5'}`}
          >
            <div className="w-12 flex-shrink-0 text-center font-bold text-gray-400 mr-2">
              #{user.id}
            </div>
            <div className="w-10 h-10 bg-card-light rounded-full flex items-center justify-center text-xl mr-4 shrink-0 border border-gray-700">
              <AvatarImage src={user.avatar} alt={user.username} />
            </div>
            <div className="flex-grow min-w-0">
              <p className={`font-bold truncate ${user.isCurrentUser ? 'text-rpp-yellow' : 'text-slate-900'}`}>
                {user.username} {user.isCurrentUser && '(Tú)'}
              </p>
              <p className="text-xs text-gray-400">Mejor partida registrada</p>
            </div>
            <div className="text-right flex items-center">
              <div className="mr-4">
                <p className="font-black font-montserrat text-slate-950">{user.pr}</p>
                <p className="text-xs text-gray-400 uppercase">pts.</p>
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
