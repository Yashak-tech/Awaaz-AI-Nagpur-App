import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Cpu, Users, Bell, Sparkles } from 'lucide-react';

const NMCBackground: React.FC = () => {
  const features = [
    { icon: MapPin, label: "10 NMC Zones" },
    { icon: Cpu, label: "Proactive AI" },
    { icon: ShieldCheck, label: "Deduplicated" },
    { icon: Users, label: "Equitable Service" },
    { icon: Bell, label: "Real-Time Tracking" },
    { icon: Sparkles, label: "Smart Governance" }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 hidden md:block overflow-hidden">
      {/* Main NMC / Awaaz-AI Branding on Left */}
      <motion.div 
        className="absolute top-10 left-10 text-white/90 max-w-xs"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo.png" alt="Awaaz-AI Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1 shadow-lg" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Awaaz-AI</h2>
            <p className="text-xs font-semibold text-emerald-300">The Nagpur App • NMC</p>
          </div>
        </div>
        <p className="text-xs text-emerald-100/70 leading-relaxed mt-2">
          Unified, intelligent & inclusive civic infrastructure system for Nagpur Municipal Corporation.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded-full border border-emerald-400/30">
            📍 10 NMC Zones
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full border border-blue-400/30">
            🤖 AI Deduplication
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-1 rounded-full border border-amber-400/30">
            ⚡ Proactive Sensors
          </span>
        </div>
      </motion.div>

      {/* Floating NMC Indicators on Left & Right */}
      <div className="absolute inset-0">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isRight = index % 2 === 1;
          const leftPos = isRight ? `${72 + (index * 4)}%` : `${5 + (index * 3)}%`;
          const topPos = `${25 + index * 12}%`;

          return (
            <motion.div
              key={feature.label}
              className="absolute text-white/20 flex items-center gap-2"
              style={{ left: leftPos, top: topPos }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.4, 
                scale: 1, 
                y: [0, -8, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.2,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.4
                }
              }}
            >
              <Icon size={24} className="text-emerald-300/40" />
              <span className="text-xs font-semibold text-white/30 hidden lg:inline">
                {feature.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Animated Light Beams */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
            style={{
              top: `${25 + i * 20}%`,
              left: '-100%',
              width: '200%',
            }}
            animate={{
              x: ['0%', '100%'],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NMCBackground;
