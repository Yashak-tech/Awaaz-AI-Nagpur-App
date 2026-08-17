// Smart Streetlight Monitoring Modal for Awaaz-AI & Nagpur Municipal Corporation (NMC)
// Real-Time ESP32 IoT Infrastructure Monitoring Dashboard (NG-001, VNIT Nagpur)

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Cpu, 
  Activity, 
  Zap, 
  Sun, 
  Moon, 
  Lightbulb, 
  Wrench, 
  Radio, 
  Tv, 
  Send,
  Sliders,
  Clock,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIoTTelemetry } from '../hooks/useIoTTelemetry';
import { IoTStreetlightDevice } from '../types/iot';
import { toast } from 'sonner';

interface IoTNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: (lat?: number, lng?: number) => void;
}

export function IoTNotificationModal({
  isOpen,
  onClose,
  onNavigateToMap
}: IoTNotificationModalProps) {
  const { devices, activeFaultCount, setHardwareStatus, resolveAlert } = useIoTTelemetry();
  const [activeTab, setActiveTab] = useState<'overview' | 'oled' | 'system'>('overview');
  const [isDispatched, setIsDispatched] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const defaultDevice: IoTStreetlightDevice = {
    deviceId: 'NG-001',
    name: 'Streetlight Cluster (VNIT Nagpur)',
    status: 'operational',
    rawStatus: 'NORMAL',
    environment: 'DAY',
    ldrValue: 1015,
    pole1Light: 'OFF',
    pole2Light: 'OFF',
    currentReading: 0.000,
    voltage: 230.0,
    location: {
      lat: 21.1233,
      lng: 79.0514,
      area: 'Food and Multi Activity Center, VNIT Nagpur',
      ward: 'Zone 2 - Dharampeth (Ward 15)',
      zone: 'Zone 2 - Dharampeth'
    },
    lastUpdated: Date.now(),
    timestampStr: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    hardwareInfo: {
      microcontroller: 'ESP32 Smart IoT Controller',
      pins: { ldr: 34, current: 36, led1: 18, led2: 19, oledSda: 21, oledScl: 22 },
      sensors: ['Ambient Light Sensor', 'Load Current Sensor'],
      actuators: ['Luminaire Pole 1', 'Luminaire Pole 2', 'Digital Display']
    }
  };

  const primaryDevice = devices.find(d => d.deviceId === 'NG-001') || devices[0];
  const activeDevice = primaryDevice || defaultDevice;

  // Determine system condition
  const rawStatus = activeDevice.rawStatus || 'NORMAL';
  const isFault = rawStatus === 'CHECK' || activeDevice.status === 'faulty';
  const isWastage = rawStatus === 'WASTAGE' || activeDevice.status === 'wastage';
  const isNormal = !isFault && !isWastage;
  const isOnline = activeDevice && (Date.now() - activeDevice.lastUpdated < 60000 || rawStatus !== undefined);

  // High-level condition label for judges & operators
  const conditionLabel = isWastage 
    ? 'DAY + LIGHT ON' 
    : isFault 
    ? 'NIGHT + LIGHT OFF' 
    : `${activeDevice.environment} + LIGHTS ${activeDevice.pole1Light}`;

  const handleDispatch = (deviceId: string) => {
    setIsDispatched(prev => ({ ...prev, [deviceId]: true }));
    toast.success('🚨 Maintenance Crew Dispatched!', {
      description: `Dispatched to ${activeDevice.location.area} for Device ${deviceId}. Ticket #NMC-ELEC-${Date.now().toString().slice(-4)}`
    });
  };

  const handleResolve = (deviceId: string) => {
    resolveAlert(deviceId);
    setIsDispatched(prev => ({ ...prev, [deviceId]: false }));
    toast.success('✅ Marked as Resolved', {
      description: `Device ${deviceId} status synchronized to NORMAL.`
    });
  };

  const handleViewMap = () => {
    if (onNavigateToMap) {
      onNavigateToMap(activeDevice.location.lat, activeDevice.location.lng);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start sm:justify-center min-h-screen"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.70)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto sm:my-auto my-3"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', maxHeight: 'calc(100vh - 24px)' }}
        >
          {/* ==================================================================== */}
          {/* 1. STICKY PROFESSIONAL HEADER (Guaranteed Visible on All Screens)    */}
          {/* ==================================================================== */}
          <div 
            className="sticky top-0 z-20 p-3.5 sm:p-4 md:p-5 border-b shadow-xs shrink-0"
            style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0">
                <div 
                  className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8' }}
                >
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h1 
                      className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight truncate"
                      style={{ color: '#0f172a' }}
                    >
                      SMART STREETLIGHT MONITORING
                    </h1>
                    {/* Connectivity Indicator */}
                    <span 
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shrink-0"
                      style={
                        isOnline 
                          ? { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
                          : { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
                      }
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ 
                          backgroundColor: isOnline ? '#16a34a' : '#dc2626',
                          boxShadow: isOnline ? '0 0 6px #16a34a' : 'none'
                        }}
                      />
                      {isOnline ? 'ESP32 ONLINE' : 'ESP32 OFFLINE'}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs font-medium mt-0.5 truncate" style={{ color: '#475569' }}>
                    Real-Time ESP32 IoT Infrastructure Monitoring
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs mt-1 font-medium" style={{ color: '#64748b' }}>
                    <span>Device: <strong style={{ color: '#0f172a' }}>{activeDevice.deviceId}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <strong style={{ color: '#0f172a' }} className="truncate">Food and Multi Activity Center, VNIT Nagpur</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl transition-all hover:bg-slate-100 active:scale-95 shrink-0"
                style={{ color: '#64748b', border: '1px solid #e2e8f0' }}
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t overflow-x-auto" style={{ borderColor: '#f1f5f9' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0"
                style={
                  activeTab === 'overview'
                    ? { backgroundColor: '#0f172a', color: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                    : { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
                }
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Overview & Telemetry</span>
                {(isFault || isWastage) && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white">
                    1 Alert
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('oled')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0"
                style={
                  activeTab === 'oled'
                    ? { backgroundColor: '#0f172a', color: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                    : { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
                }
              >
                <Tv className="w-3.5 h-3.5" />
                <span>OLED Screen Mirror</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0"
                style={
                  activeTab === 'system'
                    ? { backgroundColor: '#0f172a', color: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                    : { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
                }
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>System Architecture</span>
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 2. SCROLLABLE DASHBOARD CONTENT (Smooth Inner Scrolling)             */}
          {/* ==================================================================== */}
          <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 overscroll-contain">
            {activeTab === 'overview' && (
              <>
                {/* -------------------------------------------------------------- */}
                {/* A. MAIN SYSTEM STATUS CARD                                      */}
                {/* -------------------------------------------------------------- */}
                {isNormal && (
                  <div 
                    className="p-3.5 sm:p-4.5 rounded-xl border transition-all"
                    style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: '#16a34a' }}
                      >
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h2 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#14532d' }}>
                            🟢 SYSTEM NORMAL
                          </h2>
                          <span 
                            className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                          >
                            NOMINAL
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed" style={{ color: '#166534' }}>
                          Streetlight operation is functioning as expected.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: '#ffffff', borderColor: '#bbf7d0', color: '#14532d' }}>
                            Condition: <strong>{activeDevice.environment}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: '#ffffff', borderColor: '#bbf7d0', color: '#14532d' }}>
                            Luminaires: <strong>{activeDevice.pole1Light}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: '#ffffff', borderColor: '#bbf7d0', color: '#14532d' }}>
                            Current: <strong>{(activeDevice.currentReading || 0).toFixed(3)} A</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isWastage && (
                  <div 
                    className="p-3.5 sm:p-4.5 rounded-xl border transition-all"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: '#d97706' }}
                      >
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h2 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#78350f' }}>
                            🟠 ENERGY WASTAGE DETECTED
                          </h2>
                          <span 
                            className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}
                          >
                            WARNING
                          </span>
                        </div>

                        <div className="mt-1 text-xs font-bold" style={{ color: '#92400e' }}>
                          Detected Condition: <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">{conditionLabel}</span>
                        </div>

                        <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed" style={{ color: '#92400e' }}>
                          Streetlights are operating during daylight hours. Unnecessary energy consumption detected.
                        </p>

                        <div className="mt-2.5 p-2.5 rounded-lg text-xs border" style={{ backgroundColor: '#ffffff', borderColor: '#fde68a', color: '#78350f' }}>
                          <strong>Recommended Action:</strong> Inspect automatic lighting control and scheduling.
                        </div>

                        {/* Responsive Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-1">
                          <button
                            onClick={() => handleDispatch(activeDevice.deviceId)}
                            disabled={isDispatched[activeDevice.deviceId]}
                            className="w-full sm:w-auto flex-1 h-10 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                            style={{ backgroundColor: isDispatched[activeDevice.deviceId] ? '#64748b' : '#d97706' }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isDispatched[activeDevice.deviceId] ? 'MAINTENANCE DISPATCHED' : 'DISPATCH MAINTENANCE'}</span>
                          </button>

                          <button
                            onClick={() => handleResolve(activeDevice.deviceId)}
                            className="w-full sm:w-auto flex-1 h-10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                            style={{ backgroundColor: '#ffffff', color: '#78350f', border: '1px solid #d97706' }}
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>MARK AS RESOLVED</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isFault && (
                  <div 
                    className="p-3.5 sm:p-4.5 rounded-xl border transition-all"
                    style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: '#dc2626' }}
                      >
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h2 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#7f1d1d' }}>
                            🔴 STREETLIGHT FAULT DETECTED
                          </h2>
                          <span 
                            className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                          >
                            CRITICAL
                          </span>
                        </div>

                        <div className="mt-1 text-xs font-bold" style={{ color: '#991b1b' }}>
                          Detected Condition: <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 font-mono">{conditionLabel}</span>
                        </div>

                        <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed" style={{ color: '#991b1b' }}>
                          Nighttime detected, but the streetlights are not operating. Possible lamp, wiring, or power failure.
                        </p>

                        <div className="mt-2.5 p-2.5 rounded-lg text-xs border" style={{ backgroundColor: '#ffffff', borderColor: '#fecaca', color: '#7f1d1d' }}>
                          <strong>Recommended Action:</strong> Inspect the lamp, wiring and power supply.
                        </div>

                        {/* Responsive Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-1">
                          <button
                            onClick={() => handleDispatch(activeDevice.deviceId)}
                            disabled={isDispatched[activeDevice.deviceId]}
                            className="w-full sm:w-auto flex-1 h-10 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                            style={{ backgroundColor: isDispatched[activeDevice.deviceId] ? '#64748b' : '#dc2626' }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isDispatched[activeDevice.deviceId] ? 'MAINTENANCE DISPATCHED' : 'DISPATCH MAINTENANCE'}</span>
                          </button>

                          <button
                            onClick={() => handleResolve(activeDevice.deviceId)}
                            className="w-full sm:w-auto flex-1 h-10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                            style={{ backgroundColor: '#ffffff', color: '#7f1d1d', border: '1px solid #dc2626' }}
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>MARK AS RESOLVED</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------- */}
                {/* B. LIVE HARDWARE TELEMETRY SECTION (Clean Telemetry Cards)      */}
                {/* -------------------------------------------------------------- */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase flex items-center gap-1.5" style={{ color: '#0f172a' }}>
                      <Activity className="w-4 h-4 text-blue-600" />
                      LIVE HARDWARE TELEMETRY
                    </h3>
                    <span className="text-[10px] sm:text-[11px] font-medium" style={{ color: '#64748b' }}>
                      Live auto-sync
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {/* Card 1: Ambient Light Sensor */}
                    <div 
                      className="p-3 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider" style={{ color: '#64748b' }}>
                          LIGHT SENSOR
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                          Ambient
                        </span>
                      </div>

                      <div className="my-1.5">
                        <div className="text-lg sm:text-2xl font-black font-mono tracking-tight" style={{ color: '#0f172a' }}>
                          {activeDevice.ldrValue}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {activeDevice.environment === 'NIGHT' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}>
                              <Moon className="w-3 h-3 text-purple-600" /> NIGHT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                              <Sun className="w-3 h-3 text-amber-500" /> DAY
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[9px] sm:text-[10px] font-medium truncate" style={{ color: '#94a3b8' }}>
                        {activeDevice.environment === 'NIGHT' ? 'Nighttime Darkness' : 'Natural Daylight'}
                      </div>
                    </div>

                    {/* Card 2: Power Load Current */}
                    <div 
                      className="p-3 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider" style={{ color: '#64748b' }}>
                          CURRENT SENSOR
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                          Load Current
                        </span>
                      </div>

                      <div className="my-1.5">
                        <div className="text-lg sm:text-2xl font-black font-mono tracking-tight" style={{ color: '#0f172a' }}>
                          {(activeDevice.currentReading || 0).toFixed(3)} <span className="text-xs font-semibold" style={{ color: '#64748b' }}>A</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                            <Zap className="w-3 h-3 text-blue-600" /> Current Draw
                          </span>
                        </div>
                      </div>

                      <div className="text-[9px] sm:text-[10px] font-medium truncate" style={{ color: '#94a3b8' }}>
                        Threshold: 0.020 A
                      </div>
                    </div>

                    {/* Card 3: Streetlight Poles */}
                    <div 
                      className="p-3 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider" style={{ color: '#64748b' }}>
                          STREETLIGHT POLES
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                          P1 & P2
                        </span>
                      </div>

                      <div className="my-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold" style={{ color: '#475569' }}>Pole 1:</span>
                          <span 
                            className="font-bold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5"
                            style={
                              activeDevice.pole1Light === 'ON'
                                ? { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }
                                : { backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }
                            }
                          >
                            <Lightbulb className="w-2.5 h-2.5" />
                            {activeDevice.pole1Light}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold" style={{ color: '#475569' }}>Pole 2:</span>
                          <span 
                            className="font-bold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5"
                            style={
                              activeDevice.pole2Light === 'ON'
                                ? { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }
                                : { backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }
                            }
                          >
                            <Lightbulb className="w-2.5 h-2.5" />
                            {activeDevice.pole2Light}
                          </span>
                        </div>
                      </div>

                      <div className="text-[9px] sm:text-[10px] font-medium truncate" style={{ color: '#94a3b8' }}>
                        Dual Luminaire Array
                      </div>
                    </div>

                    {/* Card 4: Device Connection */}
                    <div 
                      className="p-3 rounded-xl border flex flex-col justify-between"
                      style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider" style={{ color: '#64748b' }}>
                          DEVICE
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                          ESP32
                        </span>
                      </div>

                      <div className="my-1.5">
                        <div className="text-base sm:text-lg font-black font-mono tracking-tight" style={{ color: '#0f172a' }}>
                          {activeDevice.deviceId}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold mt-0.5" style={{ color: isOnline ? '#15803d' : '#b91c1c' }}>
                          <Radio className="w-3 h-3" />
                          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                      </div>

                      <div className="text-[9px] sm:text-[10px] font-medium flex items-center gap-1 truncate" style={{ color: '#94a3b8' }}>
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{activeDevice.timestampStr.split(' ')[1] || activeDevice.timestampStr}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------- */}
                {/* C. POLE LOCATION SECTION                                        */}
                {/* -------------------------------------------------------------- */}
                <div 
                  className="p-3.5 sm:p-4 rounded-xl border"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div 
                        className="p-2 sm:p-2.5 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                      >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
                          POLE LOCATION
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold mt-0.5 leading-snug" style={{ color: '#0f172a' }}>
                          Food and Multi Activity Center, VNIT Nagpur
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs mt-1 font-mono" style={{ color: '#475569' }}>
                          <span>Device: <strong style={{ color: '#0f172a' }}>{activeDevice.deviceId}</strong></span>
                          <span>•</span>
                          <span>Lat: <strong style={{ color: '#0f172a' }}>21.1233° N</strong></span>
                          <span>•</span>
                          <span>Lng: <strong style={{ color: '#0f172a' }}>79.0514° E</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleViewMap}
                      className="w-full sm:w-auto h-10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-xs"
                      style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>VIEW ON MAP</span>
                    </button>
                  </div>
                </div>

                {/* -------------------------------------------------------------- */}
                {/* D. PROTOTYPE DEMONSTRATION CONTROLS (Visually Separated)       */}
                {/* -------------------------------------------------------------- */}
                <div 
                  className="p-3.5 sm:p-4 rounded-xl border"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-slate-700" />
                      <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                        PROTOTYPE DEMONSTRATION CONTROLS
                      </h4>
                    </div>
                    <span 
                      className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: '#e2e8f0', color: '#475569' }}
                    >
                      Demo Simulation Only
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs mb-2.5 font-medium leading-relaxed" style={{ color: '#64748b' }}>
                    Simulate condition states to demonstrate automated fault detection and maintenance dispatch workflows:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'CHECK')}
                      className="w-full h-10 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                      style={
                        isFault
                          ? { backgroundColor: '#dc2626', color: '#ffffff' }
                          : { backgroundColor: '#ffffff', color: '#b91c1c', border: '1px solid #fecaca' }
                      }
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">SIMULATE FAULT</span>
                    </button>

                    <button
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'WASTAGE')}
                      className="w-full h-10 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                      style={
                        isWastage
                          ? { backgroundColor: '#d97706', color: '#ffffff' }
                          : { backgroundColor: '#ffffff', color: '#b45309', border: '1px solid #fde68a' }
                      }
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">SIMULATE WASTAGE</span>
                    </button>

                    <button
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'NORMAL')}
                      className="w-full h-10 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                      style={
                        isNormal
                          ? { backgroundColor: '#16a34a', color: '#ffffff' }
                          : { backgroundColor: '#ffffff', color: '#15803d', border: '1px solid #bbf7d0' }
                      }
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">RESET TO NORMAL</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ================================================================== */}
            {/* TAB 2: SSD1306 OLED MIRROR                                          */}
            {/* ================================================================== */}
            {activeTab === 'oled' && (
              <div className="space-y-3.5">
                <div 
                  className="p-4 sm:p-5 rounded-2xl font-mono shadow-inner border-4"
                  style={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#38bdf8' }}
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] pb-2 mb-2.5 border-b" style={{ borderColor: '#0369a1' }}>
                    <span className="text-cyan-400 font-bold">DIGITAL STATUS DISPLAY</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE DISPLAY MIRROR
                    </span>
                  </div>

                  <div className="text-center font-bold text-white text-xs sm:text-sm tracking-widest mb-2.5">
                    SMART STREETLIGHT
                  </div>

                  <div className="space-y-1.5 text-[11px] sm:text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: '#94a3b8' }}>LIGHT LEVEL:</span>
                      <strong className="text-white">{activeDevice.ldrValue}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: '#94a3b8' }}>TIME OF DAY:</span>
                      <strong className="text-white">{activeDevice.environment}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: '#94a3b8' }}>LUMINAIRE 1 & 2:</span>
                      <strong className="text-emerald-400">P1: {activeDevice.pole1Light} | P2: {activeDevice.pole2Light}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: '#94a3b8' }}>CURRENT LOAD:</span>
                      <strong className="text-white">{(activeDevice.currentReading || 0).toFixed(3)} A</strong>
                    </div>

                    <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: '#0369a1' }}>
                      <span style={{ color: '#94a3b8' }}>SYSTEM STATUS:</span>
                      <strong className={isNormal ? 'text-emerald-400' : isFault ? 'text-red-400 animate-pulse' : 'text-amber-400'}>
                        {activeDevice.rawStatus}
                      </strong>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                      <span>DEVICE: {activeDevice.deviceId}</span>
                      <span>LOCATION: VNIT NAGPUR</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border text-xs" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#475569' }}>
                  <p className="leading-relaxed">
                    Live digital mirror reflecting the physical luminaire cluster display mounted on Pole <strong>NG-001</strong> at <strong>Food and Multi Activity Center, VNIT Nagpur</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================== */}
            {/* TAB 3: SYSTEM ARCHITECTURE SPECIFICATIONS                           */}
            {/* ================================================================== */}
            {activeTab === 'system' && (
              <div className="space-y-3.5">
                <div 
                  className="p-3.5 sm:p-4.5 rounded-xl border"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
                >
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2.5" style={{ color: '#0f172a' }}>
                    SMART CITY INFRASTRUCTURE SPECIFICATIONS
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="font-bold flex items-center justify-between" style={{ color: '#0f172a' }}>
                        <span>IoT Telemetry Protocol</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[10px]">Wi-Fi HTTP REST</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>
                        Encrypted JSON telemetry streaming every 3 seconds to Nagpur Municipal Cloud servers.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="font-bold flex items-center justify-between" style={{ color: '#0f172a' }}>
                        <span>Municipal Administrative Zone</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[10px]">Zone 2 - Dharampeth</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>
                        Ward 15 electrical feeder line covering VNIT campus public lighting grid.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="font-bold flex items-center justify-between" style={{ color: '#0f172a' }}>
                        <span>Automated Fault Detection</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">Real-Time</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>
                        Identifies unlit lamps during night conditions and alerts central dispatch immediately.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="font-bold flex items-center justify-between" style={{ color: '#0f172a' }}>
                        <span>Daytime Energy Conservation</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">Active</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>
                        Flags power leakage and daytime luminaire activation to prevent municipal energy wastage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
