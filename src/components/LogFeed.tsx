import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Tag, AlignJustify, Search, Copy, Check, ChevronDown, ChevronUp, Cpu, Hash, FileCode } from "lucide-react";

export interface Log {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: number;
  contractAddress?: string;
}

interface LogFeedProps {
  logs: Log[];
  isConnected: boolean;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-[#00FF9C]/20 rounded transition-colors group/copy"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-2.5 h-2.5 text-[#00FF9C]" />
      ) : (
        <Copy className="w-2.5 h-2.5 text-[#8E9299] group-hover/copy:text-[#00FF9C] transition-colors" />
      )}
    </button>
  );
};

const CHAIN_ICONS: Record<string, string> = {
  BASE: "🔵",
};

export const LogFeed: React.FC<LogFeedProps> = ({ logs, isConnected }) => {
  const [filter, setFilter] = useState("trade");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter(log => {
    const matchesCategory = filter === "all" || log.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(["trade", "alert", "social", ...logs.map(l => l.category.toLowerCase())]))
    .filter(cat => cat !== "general");

  const getFilterLabel = (cat: string) => {
    const icon = CHAIN_ICONS[cat.toUpperCase()];
    return icon ? <span className="flex items-center gap-1.5"><span>{icon}</span> {cat}</span> : cat;
  };

  const CategoryButton = ({ cat }: { cat: string; key?: string }) => (
    <button
      onClick={() => setFilter(cat)}
      className={`whitespace-nowrap px-3 py-2 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all border flex items-center justify-between gap-1.5 ${
        filter === cat
          ? "bg-[#00FF9C]/10 border-[#00FF9C] text-[#00FF9C] shadow-[0_0_10px_rgba(0,255,156,0.1)]"
          : "bg-black/20 border-[#2D2F34] text-[#8E9299] hover:border-[#8E9299]/50"
      }`}
    >
      {getFilterLabel(cat)}
      {filter === cat && <div className="w-1 h-1 bg-[#00FF9C] rounded-full animate-pulse" />}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-[#8E9299]">
          LIVE EVENT LOG
        </h2>
        <div className="flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00FF9C] animate-pulse' : 'bg-red-500'}`} />
           <span className="text-[10px] font-mono text-[#8E9299]">
            {isConnected ? 'NODE CONNECTED' : 'DISCONNECTED'}
           </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative group px-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-[#8E9299] group-focus-within:text-[#00FF9C] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="SEARCH EVENTS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1C1E]/50 border border-[#2D2F34] focus:border-[#00FF9C] rounded-lg py-2 pl-10 pr-4 text-[10px] font-mono text-white placeholder:text-[#8E9299]/50 transition-all outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 px-1">
        <div className="flex items-center gap-2 px-1">
          <AlignJustify className="w-3 h-3 text-[#8E9299]" />
          <span className="text-[9px] font-mono text-[#8E9299] uppercase tracking-tighter">FILTERS</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <CategoryButton key={cat} cat={cat} />
          ))}
          {categories.length === 0 && (
            <div className="px-3 py-2 rounded-md text-[9px] font-mono text-[#8E9299]/40 border border-[#2D2F34] border-dashed flex items-center gap-2 grow">
              <span className="animate-pulse">_</span> NO ACTIVE FILTERS
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredLogs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </AnimatePresence>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[#2D2F34] rounded-lg">
            <p className="text-xs font-mono text-[#8E9299]">
              {searchQuery 
                ? `NO RESULTS FOR "${searchQuery.toUpperCase()}"`
                : filter === "all" ? "NO EVENTS LOGGED" : `NO ${filter.toUpperCase()} EVENTS FOUND`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  trade: "bg-gradient-to-br from-[#00FF9C]/5 via-transparent to-transparent",
  alert: "bg-gradient-to-br from-red-500/5 via-transparent to-transparent",
  social: "bg-gradient-to-br from-blue-500/5 via-transparent to-transparent",
  base: "bg-gradient-to-br from-blue-400/5 via-transparent to-transparent",
};

const LogItem: React.FC<{ log: Log }> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = log.txHash || log.gasUsed || log.contractAddress;
  const categoryKey = log.category.toLowerCase();
  const gradientClass = CATEGORY_GRADIENTS[categoryKey] || "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      className={`bg-[#1A1C1E]/40 border border-[#2D2F34] transition-all duration-300 p-3 rounded flex flex-col gap-2 group relative overflow-hidden ${gradientClass} ${
        hasDetails ? "cursor-pointer hover:bg-[#1A1C1E] hover:border-[#00FF9C]/40 hover:shadow-[0_0_25px_rgba(0,255,156,0.04)]" : ""
      }`}
    >
      {/* Subtle hardware accent on hover */}
      <div className={`absolute top-0 left-0 w-1 transition-all duration-500 bg-[#00FF9C] ${
        isExpanded ? "h-full" : "h-0 group-hover:h-full"
      }`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Clock className={`w-3 h-3 text-[#00FF9C] ${isExpanded ? "animate-pulse" : "group-hover:animate-pulse"}`} />
          <span className="text-[10px] font-mono text-[#8E9299] group-hover:text-[#00FF9C]/70 transition-colors">
            {log.timestamp}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#2D2F34] px-2 py-0.5 rounded transition-all duration-200 group-hover:bg-[#00FF9C]/20 group/tag border border-transparent hover:border-[#00FF9C]/30">
            <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider group-hover/tag:text-[#00FF9C] transition-colors flex items-center gap-1.5">
              {CHAIN_ICONS[log.category.toUpperCase()] && (
                <span className="text-[10px]">{CHAIN_ICONS[log.category.toUpperCase()]}</span>
              )}
              {log.category}
            </span>
          </div>
          {hasDetails && (
            <div className="text-[#8E9299] group-hover:text-[#00FF9C] transition-colors">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm font-medium leading-relaxed group-hover:text-white transition-colors relative z-10">
        {log.message}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden relative z-10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner parts
          >
            <div className="pt-3 flex flex-col gap-3 mt-1 border-t border-[#2D2F34]/50">
              {log.txHash && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8E9299]">
                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Hash className="w-3 h-3 text-[#00FF9C]" />
                      Transaction Hash
                    </div>
                    {log.blockNumber && (
                      <span className="text-[#00FF9C] font-black">BLOCK #{log.blockNumber}</span>
                    )}
                  </div>
                  <div className="bg-black/40 border border-[#2D2F34] p-2 rounded-md flex items-center justify-between gap-2 hover:border-[#00FF9C]/30 transition-colors group/txbox">
                    <span className="text-[11px] font-mono text-white/90 truncate break-all">
                      {log.txHash}
                    </span>
                    <CopyButton text={log.txHash} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {log.gasUsed && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#8E9299] uppercase tracking-wider">
                      <Cpu className="w-3 h-3 text-[#00FF9C]" />
                      Gas Used
                    </div>
                    <div className="bg-black/40 border border-[#2D2F34] p-2 rounded-md font-mono text-[11px] text-white/90">
                      {log.gasUsed.toLocaleString()} units
                    </div>
                  </div>
                )}
                {log.contractAddress && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#8E9299] uppercase tracking-wider">
                      <FileCode className="w-3 h-3 text-[#00FF9C]" />
                      Address
                    </div>
                    <div className="bg-black/40 border border-[#2D2F34] p-2 rounded-md flex items-center justify-between gap-1 overflow-hidden hover:border-[#00FF9C]/30 transition-colors">
                      <span className="text-[11px] font-mono text-white/90 truncate">
                        {log.contractAddress}
                      </span>
                      <CopyButton text={log.contractAddress} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
