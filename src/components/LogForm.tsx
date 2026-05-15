import React, { useState } from "react";
import { Plus, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LogFormProps {
  onAddLog: (category: string, message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LogForm: React.FC<LogFormProps> = ({ onAddLog, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("trade");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onAddLog(category, message);
      setMessage("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-[101] md:relative md:bottom-auto md:left-auto md:right-auto md:max-w-md md:mx-auto"
          >
            <div className="bg-[#1A1C1E] hardware-border p-6 rounded-t-2xl md:rounded-2xl shadow-2xl border-t border-[#00FF9C]/20">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#00FF9C]" />
                    <span className="text-[10px] font-mono tracking-widest text-[#00FF9C] font-bold">INTERNAL_LOGGER_V1.0</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#8E9299] flex gap-2">
                    <span>SECURE</span>
                    <span>ENCRYPTED</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {['trade', 'alert', 'social'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 rounded font-mono text-[9px] uppercase tracking-wider transition-all border ${
                        category === cat 
                        ? 'bg-[#00FF9C]/10 border-[#00FF9C] text-[#00FF9C] font-bold' 
                        : 'bg-black/20 border-[#2D2F34] text-[#8E9299] hover:border-[#8E9299]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    value={message}
                    autoFocus
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ENTER LOG DATA..."
                    className="w-full bg-black/50 border border-[#2D2F34] focus:border-[#00FF9C]/50 outline-none p-4 rounded-xl text-sm min-h-[120px] font-mono placeholder:text-[#8E9299]/30 transition-all resize-none shadow-inner"
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#8E9299]/50 uppercase">
                    Ready to commit
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-[10px] font-mono font-bold text-[#8E9299] hover:bg-[#2D2F34] rounded-xl transition-all border border-[#2D2F34] uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-[#00FF9C] text-black font-black text-[10px] rounded-xl hover:bg-[#00D180] transition-all shadow-[0_0_20px_rgba(0,255,156,0.2)] uppercase tracking-widest"
                  >
                    Commit Entry &rarr;
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
