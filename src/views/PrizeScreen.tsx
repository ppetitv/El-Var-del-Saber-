import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Gamepad2, Ticket, Clock, Info, Zap, Trophy, LogIn, Play, LockKeyhole, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import PrizeProduct from '../components/PrizeProduct';
import { ACTIVE_PRIZE, formatCountdownParts, getWeeklyClosingDate } from '../data/gameConfig';

interface PrizeScreenProps {
  onBack: () => void;
  goldenCoupons: number;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onPlayClick: () => void;
  onOpenLegal: () => void;
  initialSection?: 'overview' | 'faq';
}

export default function PrizeScreen({ onBack, goldenCoupons, isLoggedIn, onLoginClick, onPlayClick, onOpenLegal, initialSection = 'overview' }: PrizeScreenProps) {
  const closingDate = useMemo(() => getWeeklyClosingDate(), []);
  const [countdown, setCountdown] = useState(() => formatCountdownParts(closingDate));

  const faqs = [
    {
      question: '¿Cómo participo por el premio?',
      answer: 'Juega partidas, suma puntaje y regístrate para que tus Cupones Dorados queden asociados a tu cuenta.'
    },
    {
      question: '¿Puedo jugar infinitamente?',
      answer: 'No de forma libre. Cada partida consume vidas. Si te quedas sin vidas, puedes ver un video sponsor para recargar y seguir jugando.'
    },
    {
      question: '¿Para qué sirven los Cupones Dorados?',
      answer: 'Cada cupón cuenta como una participación para el sorteo semanal. Mientras más cupones acumules, más oportunidades tienes de ganar. Ten en cuenta que los cupones acumulados se resetean al entregarse el premio semanal.'
    },
    {
      question: '¿Tengo que registrarme para ganar?',
      answer: 'Sí. Puedes probar el juego sin cuenta, pero necesitas registrarte para guardar tu avance, tus cupones y participar por premios.'
    },
    {
      question: '¿Puedo participar en más premios?',
      answer: 'La mecánica actual se centra en un premio semanal activo. Si hay nuevos premios disponibles, aparecerán en esta sección.'
    },
    {
      question: '¿El ranking influye en el sorteo?',
      answer: 'El ranking mide tu rendimiento y progreso. Los premios se impulsan principalmente con tus Cupones Dorados acumulados.'
    }
  ];

  useEffect(() => {
    if (initialSection !== 'faq') return;

    window.setTimeout(() => {
      document.getElementById('faq-premios')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 120);
  }, [initialSection]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(formatCountdownParts(closingDate));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [closingDate]);

  return (
    <div className="prize-screen min-h-screen bg-stadium text-white p-3 md:p-5 font-sans max-w-4xl mx-auto pb-20 md:pb-12">
      {/* HEADER */}
      <div className="prize-header premium-panel flex items-center mb-4 md:mb-6 rounded-2xl p-3.5">
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
        className="prize-hero premium-panel premium-hero w-full rounded-3xl p-5 md:p-8 shadow-[0_0_40px_rgba(59,130,246,0.14)] relative overflow-hidden mb-5"
      >
        <div className="prize-hero-glow absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
        <Gamepad2 className="prize-hero-icon absolute -right-10 -bottom-10 text-blue-500/10 w-64 h-64 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_0.82fr] md:items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="prize-countdown inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1.5 rounded-full mb-5">
              <Clock size={16} className="text-blue-400" />
              <span className="text-blue-300 font-bold text-sm tracking-wide">CIERRA EN: {countdown}</span>
            </div>
            
            <h2 className="premium-title text-3xl md:text-6xl font-black font-montserrat text-white tracking-tighter mb-2 drop-shadow-lg">
              {ACTIVE_PRIZE.title}
            </h2>
            <p className="text-base md:text-lg text-blue-200 max-w-2xl font-medium">
              Suma Cupones Dorados con tus partidas y conviértelos en participaciones reales para el cierre semanal del sorteo.
            </p>
          </div>
          <PrizeProduct variant="hero" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* LEFT COL: USER COUPONS */}
        <div className="md:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="info-card prize-coupon-card premium-panel rounded-2xl p-6 shadow-[0_0_24px_rgba(255,224,0,0.08)] relative overflow-hidden h-full flex flex-col justify-center"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rpp-yellow to-orange-500"></div>
            
            <div className="text-center mb-6">
            <div className="premium-icon-wrap prize-coupon-icon w-14 h-14 rounded-full mx-auto mb-4 border-rpp-yellow/20 bg-rpp-yellow/10">
              <Ticket className="text-rpp-yellow" size={40} />
            </div>
              <h3 className="text-xl font-bold font-montserrat mb-1">Tus Cupones Dorados</h3>
              <p className="text-sm text-gray-400">Participaciones para el sorteo</p>
            </div>

            {isLoggedIn ? (
              <div className="text-center">
                <div className="text-6xl font-black font-montserrat text-rpp-yellow mb-5 drop-shadow-[0_0_15px_rgba(255,224,0,0.2)]">
                  {goldenCoupons}
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
                    <p className="font-bold text-slate-900">Terminar con puntaje</p>
                    <p className="text-sm text-slate-600">Si tu partida suma puntos, activas una participación base.</p>
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
                    <p className="font-bold text-slate-900">Superar 1000 puntos</p>
                    <p className="text-sm text-slate-600">Las mejores partidas reciben una recompensa premium.</p>
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
                    <p className="font-bold text-slate-900">Guardar tu cuenta</p>
                    <p className="text-sm text-slate-600">Necesitas registro para conservar el puntaje y dejar activos tus cupones.</p>
                  </div>
                </div>
                <div className="prize-reward-chip flex items-center text-slate-700 font-black text-sm bg-slate-100 px-3 py-1 rounded-lg">
                  Requisito
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.section
        id="faq-premios"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="faq-section premium-panel rounded-2xl p-5 md:p-6 mt-5"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-5">
          <div>
            <div className="premium-topline mb-2">Preguntas frecuentes</div>
            <h3 className="premium-title text-xl md:text-2xl font-black font-montserrat flex items-center">
              <HelpCircle className="mr-2 text-blue-400" size={24} />
              Mecánica de premios
            </h3>
          </div>
          <p className="text-sm text-gray-400 max-w-md">
            Todo lo importante sobre vidas, cupones, registro y sorteos.
          </p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <article key={faq.question} className="info-card faq-card">
              <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <div className="mt-8 text-center pb-4">
        <button
          onClick={onOpenLegal}
          className="text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium underline underline-offset-4"
        >
          Ver términos y condiciones
        </button>
      </div>
    </div>
  );
}
