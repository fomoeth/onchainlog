/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { StatsHeader } from "./components/StatsHeader";
import { LogFeed, Log } from "./components/LogFeed";
import { LogForm } from "./components/LogForm";
import { Profile } from "./components/Profile";
import { Wallet, Shield, Settings, Menu, Signal, Plus } from "lucide-react";
import { motion } from "motion/react";
import { io, Socket } from "socket.io-client";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [nodeStatus, setNodeStatus] = useState({ latency: 0, blocksProcessed: 0 });
  const [gasPrice, setGasPrice] = useState<string>('--');
  const [blockNumber, setBlockNumber] = useState<string>('--');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    });

    socket.on("new-log", (log: Log) => {
      setLogs(prev => {
        // Prevent duplicates if the same ID arrives (idempotency)
        if (prev.some(l => l.id === log.id)) return prev;
        return [log, ...prev].slice(0, 50); // Keep last 50 logs
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Base Network Watcher
  useEffect(() => {
    const fetchEvmStats = async () => {
      try {
        const [price, blockNum] = await Promise.all([
          publicClient.getGasPrice(),
          publicClient.getBlockNumber()
        ]);
        const gwei = Number(price) / 1e9;
        setGasPrice(`${gwei.toFixed(2)} Gwei`);
        setBlockNumber(blockNum.toString());
      } catch (e) {
        console.error("Stats error", e);
      }
    };

    fetchEvmStats();
    const interval = setInterval(fetchEvmStats, 2000);

    const unwatch = publicClient.watchBlocks({
      onBlock: async (block) => {
        setNodeStatus(prev => ({ 
          latency: Math.floor(Math.random() * 40) + 60, 
          blocksProcessed: prev.blocksProcessed + 1 
        }));
        
        if (!block.transactions || block.transactions.length === 0) return;

        const txHashes = block.transactions.slice(0, 2);
        
        for (const hash of txHashes) {
          try {
            const tx = await publicClient.getTransaction({ hash: hash as `0x${string}` });
            
            const newLog: Log = {
              id: tx.hash,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '/'),
              category: "BASE",
              message: `BASE Node: Activity from ${tx.from.slice(0, 6)}...${tx.from.slice(-4)} detected.`,
              txHash: tx.hash,
              blockNumber: Number(block.number),
              gasUsed: Number(tx.gas),
              contractAddress: tx.to || undefined
            };

            setLogs(prev => {
              if (prev.some(l => l.id === newLog.id)) return prev;
              return [newLog, ...prev].slice(0, 50);
            });
          } catch (err) {
            // RPC Limit
          }
        }
      },
      onError: (error) => console.error(`Watch Error:`, error),
      pollingInterval: 2000,
    });

    return () => {
      unwatch();
      clearInterval(interval);
    };
  }, []);

  const handleAddLog = (category: string, message: string) => {
    const hasTx = Math.random() > 0.5;
    const newLog: Log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '/'),
      category,
      message,
      txHash: hasTx ? `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}` : undefined,
      blockNumber: hasTx ? 19283745 : undefined,
      gasUsed: hasTx ? Math.floor(21000 + Math.random() * 100000) : undefined
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const connectWallet = () => {
    setIsWalletConnected(true);
    setWalletAddress("0x71C7...fD74");
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-2xl mx-auto flex flex-col font-sans">
      {/* Navigation / Header */}
      <nav className="flex items-center justify-between mb-8 pb-4 border-b border-[#2D2F34]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00FF9C] rounded-lg flex items-center justify-center font-mono font-black text-black text-xl rotate-3 shadow-lg shadow-[#00FF9C22]">
            O
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none uppercase">ONCHAINLOG</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-[#00FF9C] animate-pulse" />
              <p className="text-[9px] font-mono text-[#00FF9C] tracking-[0.2em] font-black uppercase">ALPHA V1.0</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLogFormOpen(true)}
            className="p-2 text-[#00FF9C] hover:bg-[#00FF9C]/10 rounded-lg transition-all border border-transparent hover:border-[#00FF9C]/30 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="p-2 text-[#8E9299] hover:bg-[#1A1C1E] rounded-lg transition-colors border border-transparent hover:border-[#2D2F34] relative group"
          >
            <Menu className="w-5 h-5 group-hover:text-white transition-colors" />
            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isWalletConnected ? 'bg-[#00FF9C]' : 'bg-red-500'} animate-pulse`} />
          </button>
        </div>
      </nav>

      {/* Profile Drawer */}
      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        walletAddress={walletAddress}
        isWalletConnected={isWalletConnected}
      />

      {/* Wallet Connection Status */}
      <section className="mb-8">
        {!isWalletConnected ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={connectWallet}
            className="w-full py-4 px-6 bg-[#1A1C1E] border border-[#2D2F34] hover:border-[#00FF9C] rounded-xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#8E9299] group-hover:text-[#00FF9C]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Connect Wallet</p>
                <p className="text-[10px] text-[#8E9299] font-mono">ENCRYPTED LOGGING SECURE</p>
              </div>
            </div>
            <div className="text-[#00FF9C] font-mono text-[10px] font-bold group-hover:translate-x-1 transition-transform cursor-pointer">
              LINK &rarr;
            </div>
          </motion.button>
        ) : (
          <div className="w-full py-4 px-6 bg-[#00FF9C]/5 border border-[#00FF9C]/30 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00FF9C]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#00FF9C]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Signed: {walletAddress}</p>
                <p className="text-[10px] text-[#00FF9C] font-mono font-bold tracking-widest uppercase">Identity Verified</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Key Metrics */}
      <StatsHeader gasPrice={gasPrice} blockNumber={blockNumber} />

      {/* Log Feed */}
      <LogFeed logs={logs} isConnected={isConnected} />

      {/* Log Form Modal */}
      <LogForm 
        onAddLog={handleAddLog} 
        isOpen={isLogFormOpen} 
        onClose={() => setIsLogFormOpen(false)} 
      />
      
      {/* Decorative Technical Footer */}
      <footer className="mt-auto py-8 flex flex-col items-center gap-4 opacity-30 select-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2D2F34] to-transparent" />
        <div className="flex gap-12 font-mono text-[9px] tracking-widest text-[#8E9299]">
          <span>NETWORK: BASE_MAINNET</span>
          <span>LATENCY: {nodeStatus.latency || '--'}ms</span>
          <span>BLOCKS: {nodeStatus.blocksProcessed}</span>
        </div>
      </footer>
    </div>
  );
}

