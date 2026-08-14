import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Loader } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* App Logo */}
        <motion.div 
          className="w-24 h-24 mx-auto mb-6"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <img 
            src="/logo.png" 
            alt="Awaaz-AI Logo" 
            className="w-full h-full object-contain rounded-full shadow-lg"
          />
        </motion.div>

        {/* Circular Loader */}
        <motion.div 
          className="w-12 h-12 mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Loader className="w-8 h-8 text-green-600 animate-spin" />
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Swachh Nagar</h1> */}
        </motion.div>

        {/* Features */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-md">&nbsp;Building a cleaner community</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-md">&nbsp;Connecting citizens & government</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}