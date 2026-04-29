import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Save, MonitorPlay } from 'lucide-react';
import PrizeProduct from './PrizeProduct';
import { ACTIVE_PRIZE, getEarnedGoldenCoupons } from '../data/gameConfig';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  mode?: 'default' | 'post-match';
  pendingScore?: number;
  onContinueWithoutAccount?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  mode = 'default',
  pendingScore = 0,
  onContinueWithoutAccount
}: LoginModalProps) {
  if (!isOpen) return null;

  const isPostMatch = mode === 'post-match';
  const pendingCoupons = getEarnedGoldenCoupons(pendingScore);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="auth-modal-card premium-panel premium-hero rounded-2xl p-5 md:p-6 max-w-sm w-full relative overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="modal-close-button absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-card-light/50 p-2 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Header / Logo */}
          <div className="flex flex-col items-center mb-6 md:mb-8 mt-2 md:mt-4">

            <h2 className="premium-title text-2xl font-black font-montserrat text-center tracking-tight">
              {isPostMatch ? <>GUARDA TUS <span className="text-rpp-yellow">PUNTOS</span></> : <>ÚNETE A LA <span className="text-rpp-yellow">CANCHA</span></>}
            </h2>
            <p className="text-gray-400 text-center mt-2 text-sm">
              {isPostMatch
                ? 'Regístrate ahora para guardar esta partida y activar tu participación en el premio semanal.'
                : 'Inicia sesión para desbloquear la experiencia completa de El VAR del Saber.'}
            </p>
          </div>

          {isPostMatch && (
            <div className="auth-prize-reminder">
              <PrizeProduct variant="modal" />
              <div>
                <p>Juegas por una {ACTIVE_PRIZE.title}</p>
                <span>
                  {pendingCoupons >= 3
                    ? "Tienes 3 cupones dorados esperando ser guardados."
                    : (pendingCoupons > 0 
                      ? "Tienes un cupón dorado esperando ser guardado." 
                      : "Regístrate para participar en el sorteo en tu siguiente partida.")
                  }
                </span>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
            <div className="info-card premium-soft-panel flex items-center p-3 rounded-xl">
              <div className="auth-benefit-icon auth-benefit-icon-gold w-10 h-10 bg-rpp-yellow/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                <Trophy className="text-rpp-yellow" size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">{isPostMatch ? 'Compite con tu resultado de hoy' : 'Compite en el Ranking'}</p>
                <p className="text-xs text-gray-400">
                  {isPostMatch ? 'Tu partida queda guardada y puedes entrar al ranking semanal.' : 'Mejora tu puntaje y demuestra quién sabe más.'}
                </p>
              </div>
            </div>
            <div className="info-card premium-soft-panel flex items-center p-3 rounded-xl">
              <div className="auth-benefit-icon auth-benefit-icon-green w-10 h-10 bg-neon-green/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                <Save className="text-neon-green" size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">{isPostMatch ? 'Activa tus premios' : 'Guarda tu Progreso'}</p>
                <p className="text-xs text-gray-400">
                  {isPostMatch ? 'Tus cupones quedan asociados a tu cuenta para entrar al sorteo semanal.' : 'Tus estadísticas y vidas seguras en la nube.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="auth-actions">
            <button 
              onClick={onLogin}
              className="auth-primary-button w-full bg-white text-gray-900 font-black py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shadow-[0_14px_28px_rgba(255,255,255,0.06)]"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continuar con Google</span>
            </button>
            <button 
              onClick={onLogin}
              className="auth-secondary-button premium-button-secondary w-full font-black py-3.5 rounded-xl flex items-center justify-center transition-colors border-2 border-blue-500/30"
            >
              <span className="auth-facebook-icon">f</span>
              Continuar con Facebook
            </button>
          </div>

          {isPostMatch && (
            <>
              <div className="auth-action-divider w-full h-px bg-gray-800 my-5" />
              <button
                onClick={onContinueWithoutAccount ?? onClose}
                className="auth-tertiary-button w-full text-gray-300 font-semibold py-2 rounded-xl hover:text-white transition-colors"
              >
                No, seguir sin cuenta
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Sin cuenta no guardas tu partida ni participas en el premio semanal.
              </p>
            </>
          )}
          
          <p className="text-center text-xs text-gray-500 mt-4 md:mt-6">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
