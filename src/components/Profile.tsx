import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Wallet, Shield, Bell, Star, LogOut, ChevronRight, User } from "lucide-react";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  isWalletConnected: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ isOpen, onClose, walletAddress, isWalletConnected }) => {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
          />
          
          {/* Profile Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111214] border-l border-[#2D2F34] shadow-2xl z-50 p-6 flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white tracking-tight">Profile</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#1A1C1E] rounded-full text-[#8E9299] transition-colors"
                id="close-profile-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div className="flex flex-col items-center gap-3 py-6 bg-[#1A1C1E]/50 rounded-2xl border border-[#2D2F34] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 bg-[#00FF9C]/10 rounded-full flex items-center justify-center border-2 border-[#00FF9C]/20 relative z-10">
                  <User className="w-10 h-10 text-[#00FF9C]" />
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#00FF9C] rounded-full border-2 border-[#111214] flex items-center justify-center">
                    <Shield className="w-2 h-2 text-black" />
                  </div>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-white font-bold text-lg">{isWalletConnected ? "Verified Operator" : "Incognito Mode"}</p>
                  <p className="text-[#8E9299] text-xs font-mono tracking-wider">{walletAddress || "OFFLINE_ACCESS"}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1A1C1E] border border-[#2D2F34] rounded-xl">
                  <p className="text-[#8E9299] text-[10px] font-mono mb-1">REPUTATION</p>
                  <p className="text-white font-black text-xl">1,240 <span className="text-[10px] text-[#00FF9C]">XP</span></p>
                </div>
                <div className="p-4 bg-[#1A1C1E] border border-[#2D2F34] rounded-xl">
                  <p className="text-[#8E9299] text-[10px] font-mono mb-1">NETWORK</p>
                  <p className="text-white font-black text-xl">BASE</p>
                </div>
              </div>

              {/* Menu Sections */}
              <div className="space-y-2">
                <p className="text-[#8E9299] text-[10px] font-mono font-bold tracking-widest uppercase mb-3 ml-1">Account Actions</p>
                
                <button className="w-full flex items-center justify-between p-4 bg-[#1A1C1E] border border-[#2D2F34] hover:border-[#00FF9C]/50 rounded-xl transition-all group shadow-sm hover:shadow-[#00FF9C]/5" id="profile-wallet-btn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00FF9C]/10 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#00FF9C]" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-[#00FF9C] transition-colors">Wallet Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E9299]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1A1C1E] border border-[#2D2F34] hover:border-blue-500/50 rounded-xl transition-all group shadow-sm" id="profile-notif-btn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-blue-500 transition-colors">Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E9299]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1A1C1E] border border-[#2D2F34] hover:border-yellow-500/50 rounded-xl transition-all group shadow-sm" id="profile-pro-btn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-yellow-500 transition-colors uppercase">PREMIUM</span>
                  </div>
                  <div className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter">NEW</div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#2D2F34]">
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm tracking-wide" id="profile-logout-btn">
                <LogOut className="w-4 h-4" />
                DISCONNECT SESSION
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
