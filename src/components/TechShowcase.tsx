import React from 'react';
import { Brain, MapPin, Mic, Building2, BarChart3, ShieldCheck, Zap, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface TechShowcaseProps {
  language: string;
}

export function TechShowcase({ language }: TechShowcaseProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Classification & Urgency',
      description: 'Automatically detects issue type (potholes, garbage, lighting, leaks) with 94%+ confidence and priority scoring',
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      icon: Layers,
      title: 'AI Duplicate Complaint Deduplication',
      description: 'Automatically matches and merges redundant complaints into a single ticket, saving staff working hours',
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'Proactive Sensor & Pre-Emptive Early Warning',
      description: 'Learns bin fill levels and streetlight voltage anomalies before citizen reports escalate',
      color: 'bg-emerald-50 text-emerald-700',
      iconColor: 'text-emerald-600'
    },
    {
      icon: MapPin,
      title: 'NMC 10 Administrative Zones Engine',
      description: 'Automatic location matching to Nagpur Municipal Corporation administrative zones and wards',
      color: 'bg-indigo-50 text-indigo-700',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Mic,
      title: 'Inclusive Voice Intake (Marathi/Nagpuri)',
      description: 'Voice notes with NLP transcription ensures equitable reporting for citizens in all wards',
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      icon: Building2,
      title: 'Smart Department Routing',
      description: 'Instant ticket dispatch to PWD, Sanitation, Electrical, Water Works, or Drainage teams',
      color: 'bg-orange-50 text-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Ward Service Parity Analytics',
      description: 'Real-time monitoring ensuring underserved wards receive equal resolution times',
      color: 'bg-cyan-50 text-cyan-700',
      iconColor: 'text-cyan-600'
    },
    {
      icon: ShieldCheck,
      title: 'Photo Verification & Integrity',
      description: 'AI image analysis prevents duplicate or tampered media submissions',
      color: 'bg-rose-50 text-rose-700',
      iconColor: 'text-rose-600'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Awaaz-AI Platform Core</h2>
        <p className="text-xs font-semibold text-emerald-600">
          Nagpur Municipal Corporation • The Nagpur App
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className={`p-3.5 ${feature.color}`}>
              <div className="flex items-start gap-3">
                <feature.icon className={`w-5 h-5 ${feature.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-3 py-1">
          Awaaz-AI • Nagpur Civic Infrastructure Platform
        </Badge>
      </div>
    </div>
  );
}