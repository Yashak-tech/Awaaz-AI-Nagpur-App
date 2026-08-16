import React from 'react';
import { Home, Plus, Map, User, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen } from '../App';
import { translations, Language } from './translations';

interface BottomNavigationProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  language: Language;
}

export function BottomNavigation({ currentScreen, onScreenChange, language }: BottomNavigationProps) {
  const t = translations[language];

  const navItems = [
    { id: 'home' as Screen, icon: Home, label: t.home },
    { id: 'map' as Screen, icon: Map, label: t.map },
    { id: 'report' as Screen, icon: Plus, label: t.report, isCenter: true },
    { id: 'analytics' as Screen, icon: BarChart3, label: 'Analytics' },
    { id: 'profile' as Screen, icon: User, label: t.profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 px-3 py-1.5 safe-area-pb z-[9999] shadow-lg pointer-events-auto">
      <div className="flex items-center justify-between pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <motion.button
              key={item.id}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-lg transition-colors ${
                item.isCenter
                  ? 'bg-primary text-primary-foreground shadow-lg px-3 py-2 -mt-4'
                  : isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onScreenChange(item.id)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: item.isCenter ? 1.05 : 1.02 }}
            >
              <Icon className={`w-5 h-5 ${item.isCenter ? 'w-6 h-6' : ''}`} />
              <span className={`text-[10px] mt-0.5 font-medium ${item.isCenter ? 'hidden' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}