import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, CheckCircle2, XCircle, ChevronLeft, MonitorPlay, Heart, Clock, Zap } from 'lucide-react';
import { mockQuestions } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface MatchSummary {
  score: number;
  correctAnswers: number;
  averageTime: number;
}

const NEXT_QUESTION_DELAY_MS = 500;

interface MatchScreenProps {
  lives: number;
  onFinish: (summary: MatchSummary) => void;
  onBack: () => void;
}

export default function MatchScreen({ lives, onFinish, onBack }: MatchScreenProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalResponseTime, setTotalResponseTime] = useState(0);

  // Lifelines State
  const [lifelines, setLifelines] = useState({ var: false, hinchada: false, cambio: false });
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [audienceVotes, setAudienceVotes] = useState<Record<string, number> | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [showInstructions, setShowInstructions] = useState(() => {
    return !localStorage.getItem('varSaberMatchInstructionsSeen');
  });

  // Reserve question for "Cambio" lifeline
  const reserveQuestion = {
    id: 999,
    text: "¿Quién es el máximo goleador histórico de los mundiales?",
    options: [
      { id: 'A', label: 'Pelé' },
      { id: 'B', label: 'Miroslav Klose' },
      { id: 'C', label: 'Ronaldo Nazário' },
      { id: 'D', label: 'Lionel Messi' }
    ],
    correctAnswer: 'B'
  };

  const question = isSwapped ? reserveQuestion : mockQuestions[currentQ];

  useEffect(() => {
    if (showInstructions) return;
    if (timeLeft > 0 && !isAnswerChecked) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isAnswerChecked) {
      handleTimeOut();
    }
  }, [timeLeft, isAnswerChecked, showInstructions]);

  const handleTimeOut = () => {
    setIsAnswerChecked(true);
    const responseTime = 15;
    const nextTotalResponseTime = totalResponseTime + responseTime;
    setTotalResponseTime(nextTotalResponseTime);
    setTimeout(() => {
      nextQuestion(score, correctAnswers, nextTotalResponseTime);
    }, NEXT_QUESTION_DELAY_MS);
  };

  const handleAnswerSelect = (id: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(id);
    setIsAnswerChecked(true);

    const responseTime = 15 - timeLeft;
    const nextTotalResponseTime = totalResponseTime + responseTime;
    setTotalResponseTime(nextTotalResponseTime);

    let nextScore = score;
    let nextCorrectAnswers = correctAnswers;

    if (id === question.correctAnswer) {
      nextScore = score + 100 + (timeLeft * 10);
      nextCorrectAnswers = correctAnswers + 1;
      setScore(nextScore);
      setCorrectAnswers(nextCorrectAnswers);
    }

    setTimeout(() => {
      nextQuestion(nextScore, nextCorrectAnswers, nextTotalResponseTime);
    }, NEXT_QUESTION_DELAY_MS);
  };

  const nextQuestion = (finalScore = score, finalCorrectAnswers = correctAnswers, finalTotalResponseTime = totalResponseTime) => {
    if (currentQ < mockQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      // Reset question-specific lifeline effects
      setHiddenOptions([]);
      setAudienceVotes(null);
      setIsSwapped(false);
    } else {
      onFinish({
        score: finalScore,
        correctAnswers: finalCorrectAnswers,
        averageTime: Math.max(1, Math.round(finalTotalResponseTime / mockQuestions.length))
      });
    }
  };

  // --- LIFELINE HANDLERS ---

  const handleVar = () => {
    if (lifelines.var || isAnswerChecked) return;
    const incorrect = question.options.filter(o => o.id !== question.correctAnswer);
    const shuffled = incorrect.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0].id, shuffled[1].id]);
    setLifelines(prev => ({ ...prev, var: true }));
  };

  const handleHinchada = () => {
    if (lifelines.hinchada || isAnswerChecked) return;
    
    let remaining = 100;
    const votes: Record<string, number> = {};
    const availableOptions = question.options.filter(o => !hiddenOptions.includes(o.id));
    
    // Give correct answer a realistic majority (50-75%)
    const correctVote = Math.floor(Math.random() * 26) + 50;
    votes[question.correctAnswer] = correctVote;
    remaining -= correctVote;

    const incorrectAvailable = availableOptions.filter(o => o.id !== question.correctAnswer);
    
    incorrectAvailable.forEach((opt, index) => {
      if (index === incorrectAvailable.length - 1) {
        votes[opt.id] = remaining;
      } else {
        const vote = Math.floor(Math.random() * (remaining / 2));
        votes[opt.id] = vote;
        remaining -= vote;
      }
    });

    // Set hidden options to 0%
    hiddenOptions.forEach(id => { votes[id] = 0; });

    setAudienceVotes(votes);
    setLifelines(prev => ({ ...prev, hinchada: true }));
  };

  const handleCambio = () => {
    if (lifelines.cambio || isAnswerChecked) return;
    setIsSwapped(true);
    setLifelines(prev => ({ ...prev, cambio: true }));
    setTimeLeft(15);
    setHiddenOptions([]);
    setAudienceVotes(null);
  };

  const handleDismissInstructions = () => {
    localStorage.setItem('varSaberMatchInstructionsSeen', 'true');
    setShowInstructions(false);
  };

  return (
    <div className="match-shell min-h-screen bg-stadium text-white p-4 md:p-6 font-sans flex flex-col max-w-6xl mx-auto">
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stadium/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="premium-panel max-w-md w-full rounded-3xl p-6 md:p-8 text-center border-rpp-yellow/30 shadow-[0_0_50px_rgba(255,224,0,0.15)]"
            >

              
              <h2 className="premium-title text-2xl md:text-3xl font-black font-montserrat mb-4">Instrucciones de Juego</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">15 Segundos</p>
                    <p className="text-xs text-gray-400">Tienes tiempo limitado para responder cada pregunta.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                  <div className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="text-neon-green" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Velocidad = Bonus</p>
                    <p className="text-xs text-gray-400">Responder rápido te otorga una bonificación especial de puntaje.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismissInstructions}
                className="premium-button-primary w-full font-montserrat font-black py-4 rounded-2xl text-lg shadow-[0_10px_30px_rgba(18,200,111,0.2)]"
              >
                ¡ENTENDIDO, JUGAR!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="match-topbar match-topbar-grid mb-6 md:mb-8">
        <button
          onClick={onBack}
          className="premium-button-secondary w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          aria-label="Volver al vestuario"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="match-position text-center px-4 py-2 rounded-2xl">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-black hidden md:block mb-1">El VAR del Saber</p>
          <p className="font-black font-montserrat text-sm md:text-base text-slate-900">
            Pregunta <span>{currentQ + 1}</span> de {mockQuestions.length}
          </p>
        </div>
        <div className="match-status-cluster">
          <div
            className="match-lives-badge"
            aria-label={lives === 0 ? 'No quedan vidas para la siguiente partida' : `${lives} vidas restantes para las siguientes partidas`}
            title={lives === 0 ? 'Esta es tu ultima partida disponible por ahora' : `${lives} vidas restantes`}
          >
            <Heart size={15} fill="currentColor" />
            <span className="hidden sm:inline">Restantes</span>
            <strong>{lives}/5</strong>
          </div>
          <div className="match-timer w-12 h-12 relative flex items-center justify-center bg-card-dark rounded-full border border-gray-800 shadow-lg shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${timeLeft > 5 ? 'text-neon-green' : 'text-var-red'} transition-all duration-1000 ease-linear`}
                strokeDasharray={`${(timeLeft / 15) * 100}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-bold font-montserrat text-lg">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* PROGRESS DOTS */}
      <div className="match-progress flex justify-center space-x-2 mb-8 md:mb-12">
        {mockQuestions.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentQ ? 'w-8 md:w-12 bg-rpp-yellow shadow-[0_0_10px_rgba(255,224,0,0.5)]' : 
              idx < currentQ ? 'w-4 md:w-6 bg-gray-600' : 'w-4 md:w-6 bg-card-dark'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.12 }}
          className="match-stage flex-grow flex flex-col md:flex-row md:items-center md:gap-16"
        >
          {/* QUESTION */}
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h2 className="premium-title text-2xl md:text-3xl lg:text-4xl font-black font-montserrat leading-tight md:leading-tight lg:leading-tight">
              {question.text}
            </h2>
          </div>

          {/* OPTIONS */}
          <div className="space-y-3 md:space-y-4 flex-grow md:w-1/2">
            {question.options.map((opt, index) => {
              const isHidden = hiddenOptions.includes(opt.id);
              let buttonClass = 'match-option-idle border-gray-800 bg-card-dark hover:border-rpp-yellow/50 hover:bg-card-light text-slate-900';
              let letterClass = 'bg-gray-800 text-slate-500';
              
              if (isHidden) {
                buttonClass = 'match-option-muted border-gray-800 bg-stadium opacity-20 pointer-events-none';
              } else if (isAnswerChecked) {
                if (opt.id === question.correctAnswer) {
                  buttonClass = 'match-option-correct border-neon-green bg-neon-green/10 text-slate-900 shadow-[0_0_15px_rgba(0,255,102,0.2)]';
                  letterClass = 'bg-neon-green text-stadium';
                } else if (selectedAnswer === opt.id) {
                  buttonClass = 'match-option-wrong border-var-red bg-var-red/10 text-slate-900 shadow-[0_0_15px_rgba(255,51,51,0.2)]';
                  letterClass = 'bg-var-red text-white';
                } else {
                  buttonClass = 'match-option-muted border-gray-800 bg-stadium text-gray-500 opacity-50';
                }
              } else if (selectedAnswer === opt.id) {
                buttonClass = 'match-option-selected border-rpp-yellow bg-rpp-yellow/10 text-slate-900 shadow-[0_0_15px_rgba(255,224,0,0.2)]';
                letterClass = 'bg-rpp-yellow text-stadium';
              }

              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025, duration: 0.12 }}
                  onClick={() => handleAnswerSelect(opt.id)}
                  disabled={isAnswerChecked || isHidden}
                  className={`match-option w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all font-medium text-lg flex items-center group relative overflow-hidden ${buttonClass}`}
                >
                  {/* Audience Vote Background Bar */}
                  {audienceVotes && !isHidden && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-rpp-yellow/10 transition-all duration-1000 ease-out"
                      style={{ width: `${audienceVotes[opt.id]}%` }}
                    />
                  )}

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 shrink-0 transition-colors z-10 ${!isHidden && 'group-hover:scale-105'} ${letterClass}`}>
                    {opt.id}
                  </div>
                  <span className="flex-grow md:text-xl z-10">{opt.label}</span>
                  
                  {audienceVotes && !isHidden && (
                    <span className="z-10 ml-4 font-bold font-montserrat text-amber-600">
                      {audienceVotes[opt.id]}%
                    </span>
                  )}

                  {isAnswerChecked && opt.id === question.correctAnswer && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="z-10 ml-2">
                      <CheckCircle2 className="text-neon-green shrink-0" size={28} />
                    </motion.div>
                  )}
                  {isAnswerChecked && selectedAnswer === opt.id && opt.id !== question.correctAnswer && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="z-10 ml-2">
                      <XCircle className="text-var-red shrink-0" size={28} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LIFELINES */}
      <div className="match-lifelines grid grid-cols-3 gap-3 md:gap-6 mt-8 pb-4 md:pb-8">
        <button 
          onClick={handleVar}
          disabled={lifelines.var || isAnswerChecked}
          className={`match-lifeline flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border-2 transition-all group ${
            lifelines.var 
              ? 'border-gray-800 bg-stadium opacity-40 cursor-not-allowed' 
              : 'border-gray-800 bg-card-dark hover:border-rpp-yellow hover:bg-card-light shadow-lg'
          }`}
        >
          <MonitorPlay size={28} className={`mb-2 transition-colors ${lifelines.var ? 'text-slate-400' : 'text-slate-500 group-hover:text-rpp-yellow'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${lifelines.var ? 'text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>El VAR</span>
          <span className="text-[11px] md:text-xs text-slate-500 mt-0.5">Elimina 2 opciones</span>
        </button>

        <button 
          onClick={handleHinchada}
          disabled={lifelines.hinchada || isAnswerChecked}
          className={`match-lifeline flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border-2 transition-all group ${
            lifelines.hinchada 
              ? 'border-gray-800 bg-stadium opacity-40 cursor-not-allowed' 
              : 'border-gray-800 bg-card-dark hover:border-rpp-yellow hover:bg-card-light shadow-lg'
          }`}
        >
          <Users size={28} className={`mb-2 transition-colors ${lifelines.hinchada ? 'text-slate-400' : 'text-slate-500 group-hover:text-rpp-yellow'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${lifelines.hinchada ? 'text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>Hinchada</span>
          <span className="text-[11px] md:text-xs text-slate-500 mt-0.5">Ver porcentajes</span>
        </button>

        <button 
          onClick={handleCambio}
          disabled={lifelines.cambio || isAnswerChecked}
          className={`match-lifeline flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border-2 transition-all group ${
            lifelines.cambio 
              ? 'border-gray-800 bg-stadium opacity-40 cursor-not-allowed' 
              : 'border-gray-800 bg-card-dark hover:border-rpp-yellow hover:bg-card-light shadow-lg'
          }`}
        >
          <RefreshCw size={28} className={`mb-2 transition-colors ${lifelines.cambio ? 'text-slate-400' : 'text-slate-500 group-hover:text-rpp-yellow'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${lifelines.cambio ? 'text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>Cambio</span>
          <span className="text-[11px] md:text-xs text-slate-500 mt-0.5">Nueva pregunta</span>
        </button>
      </div>
    </div>
  );
}
