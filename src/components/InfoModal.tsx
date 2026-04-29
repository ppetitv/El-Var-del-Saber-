import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  body: string[];
  onClose: () => void;
}

export default function InfoModal({ isOpen, title, body, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="premium-panel premium-hero max-w-md w-full rounded-3xl p-5 md:p-6 relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/70 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>

          <div className="pr-10">
            <div className="premium-topline mb-3">Informacion importante</div>
            <h2 className="premium-title text-2xl font-black text-slate-950 mb-3">{title}</h2>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <button
            onClick={onClose}
            className="premium-button-primary w-full mt-5 min-h-12 rounded-2xl font-black"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
