import React, { useEffect, useState } from "react";
import { Activity, Cpu, Database, Zap } from "lucide-react";
import { motion } from "motion/react";

interface StatsHeaderProps {
  gasPrice: string;
  blockNumber: string;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ gasPrice, blockNumber }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard 
        icon={<Activity className="w-4 h-4 text-[#00FF9C]" />} 
        label="GAS PRICE" 
        value={gasPrice} 
      />
      <StatCard 
        icon={<Database className="w-4 h-4 text-[#00FF9C]" />} 
        label="BLOCK" 
        value={blockNumber} 
      />
      <StatCard 
        icon={<Activity className="w-4 h-4 text-[#00FF9C]" />} 
        label="TPS" 
        value="1,402" 
      />
      <StatCard 
        icon={<Cpu className="w-4 h-4 text-[#00FF9C]" />} 
        label="UPTIME" 
        value="99.99%" 
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1A1C1E] hardware-border p-4 flex flex-col gap-2 rounded-lg"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[10px] font-mono tracking-widest text-[#8E9299]">
        {label}
      </span>
    </div>
    <div className="text-xl font-mono font-bold tracking-tight text-white glow-text">
      {value}
    </div>
  </motion.div>
);
