// IoT Real-Time Detection & Telemetry Notification Modal for Awaaz-AI
// Aligned with ESP32 Arduino Firmware (NG-001, Dharampeth, Nagpur)

import React, { useState } from 'react';
import { 
  Bell, 
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
  RefreshCw, 
  Layers,
  Send,
  Radio,
  Tv,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIoTTelemetry } from '../hooks/useIoTTelemetry';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface IoTNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: (lat: number, lng: number) => void;
}

export function IoTNotificationModal({
  isOpen,
  onClose,
  onNavigateToMap
}: IoTNotificationModalProps) {
  const { devices, alerts, activeFaultCount, setHardwareStatus, resolveAlert } = useIoTTelemetry();
  const [activeTab, setActiveTab] = useState<'alerts' | 'devices' | 'oled' | 'hardware'>('alerts');
  const [dispatchedAlerts, setDispatchedAlerts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleDispatchCrew = (deviceId: string, location: string) => {
    setDispatchedAlerts(prev => ({ ...prev, [deviceId]: true }));
    toast.success(`🚨 NMC Electrical Team Dispatched!`, {
      description: `Dispatched to ${location} for Device ${deviceId}. Ticket #NMC-${deviceId}-${Date.now().toString().slice(-4)}`
    });
  };

  const handleResolveAlert = (deviceId: string, name: string) => {
    resolveAlert(deviceId);
    toast.success(`✅ Restored to Normal`, {
      description: `${name} marked NORMAL. Telemetry synchronized.`
    });
  };

  const defaultDevice: IoTStreetlightDevice = {
    deviceId: 'NG-001',
    name: 'Streetlight Cluster (Dharampeth, Nagpur)',
    status: 'operational',
    rawStatus: 'NORMAL',
    environment: 'NIGHT',
    ldrValue: 180,
    pole1Light: 'ON',
    pole2Light: 'ON',
    currentReading: 0.45,
    voltage: 230.0,
    location: {
      lat: 21.1458,
      lng: 79.0882,
      area: 'Dharampeth, Nagpur',
      ward: 'Device NG-001',
      zone: 'Dharampeth'
    },
    lastUpdated: Date.now(),
    timestampStr: new Date().toISOString(),
    hardwareInfo: {
      microcontroller: 'ESP32 (Wi-Fi + HTTP Client)',
      pins: { ldr: 34, current: 36, led1: 18, led2: 19, oledSda: 21, oledScl: 22 },
      sensors: ['LDR Photoresistor (Pin 34)', 'Current Sensor ACS712 (Pin 36)'],
      actuators: ['LED 1 (Pin 18)', 'LED 2 (Pin 19)', 'OLED Display 128x64']
    }
  };

  const primaryDevice = devices.find(d => d.deviceId === 'NG-001') || devices[0];
  const activeDevice = primaryDevice || defaultDevice;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
                  <Cpu className="w-5 h-5 text-indigo-300" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">ESP32 IoT Sensor Telemetry</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium border border-emerald-400/30 flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/80">
                    {primaryDevice 
                      ? <>Device ID: <strong className="text-white">{primaryDevice.deviceId}</strong> • {primaryDevice.location.area} ({primaryDevice.location.lat.toFixed(4)}°N, {primaryDevice.location.lng.toFixed(4)}°E)</>
                      : <>Waiting for ESP32 hardware connection...</>
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1.5 mt-4 pt-2 border-t border-white/10 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'alerts'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Fault Alerts</span>
                {activeFaultCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-bold animate-pulse">
                    {activeFaultCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('oled')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'oled'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>OLED Display</span>
              </button>

              <button
                onClick={() => setActiveTab('devices')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'devices'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                <span>Poles ({devices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hardware')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'hardware'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>ESP32 Circuit</span>
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {/* TAB 1: FAULT ALERTS */}
            {activeTab === 'alerts' && (
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="space-y-3">
                    {/* Live Connected Hardware Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-xl p-4 border border-emerald-200 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-950 text-sm">System Healthy • All Lights Normal</h3>
                            <p className="text-[11px] text-emerald-700">ESP32 <strong className="font-mono text-emerald-900">{activeDevice.deviceId}</strong> is actively transmitting</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold tracking-wide">
                          NORMAL
                        </Badge>
                      </div>

                      {/* Location Box */}
                      <div className="bg-white/90 p-3 rounded-lg border border-emerald-200/80 mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{activeDevice.location.area}</span>
                            <div className="font-mono text-[11px] text-slate-600 mt-0.5 flex flex-wrap gap-x-3">
                              <span>📍 Lat: <strong className="text-slate-900">{activeDevice.location.lat.toFixed(4)}° N</strong></span>
                              <span>Lng: <strong className="text-slate-900">{activeDevice.location.lng.toFixed(4)}° E</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Hardware Telemetry Grid */}
                      <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" /> Live Hardware Telemetry (From ESP32):
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                            {activeDevice.environment === 'NIGHT' ? <Moon className="w-3 h-3 text-indigo-500" /> : <Sun className="w-3 h-3 text-amber-500" />}
                            LDR (Pin 34)
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">
                            {activeDevice.ldrValue}
                          </div>
                          <span className="text-[9px] text-emerald-700 font-medium">{activeDevice.environment}</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
                            <Zap className="w-3 h-3 text-amber-600" /> Current (Pin 36)
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">
                            {activeDevice.currentReading.toFixed(3)} A
                          </div>
                          <span className="text-[9px] text-slate-500 font-normal">Nominal</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                            <Lightbulb className="w-3 h-3 text-yellow-500" /> LEDs (Pins 18/19)
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">
                            {activeDevice.pole1Light}
                          </div>
                          <span className="text-[9px] text-slate-500 font-normal">P1 & P2</span>
                        </div>
                      </div>

                      {/* Fault Trigger Guide */}
                      <div className="mt-3 p-2.5 bg-amber-50/80 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>To test fault detection on your hardware:</strong> Cover the LDR sensor with your hand/finger to simulate NIGHT. The system will detect unlit streetlights and instantly trigger a <strong>🚨 FAULT ALERT</strong> with GPS coordinates!
                        </div>
                      </div>

                      {/* Simulation Quick Buttons */}
                      <div className="flex justify-center gap-2 mt-3 pt-2 border-t border-emerald-200/60">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setHardwareStatus(activeDevice.deviceId, 'CHECK')}
                          className="text-xs bg-white text-red-600 border-red-200 hover:bg-red-50 flex-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-500" /> Test "CHECK" Fault
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setHardwareStatus(activeDevice.deviceId, 'WASTAGE')}
                          className="text-xs bg-white text-amber-600 border-amber-200 hover:bg-amber-50 flex-1"
                        >
                          <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" /> Test "WASTAGE"
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const isCheck = alert.alertType === 'FAULT_LIGHT_UNLIT';
                    return (
                      <div
                        key={alert.id}
                        className={`border-2 rounded-xl p-3.5 relative overflow-hidden shadow-sm transition-all ${
                          isCheck ? 'bg-red-50/90 border-red-200' : 'bg-amber-50/90 border-amber-200'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isCheck ? 'bg-red-500' : 'bg-amber-500'}`}></div>

                        <div className="flex items-start justify-between gap-2 pl-2">
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 text-white rounded-lg shadow-sm ${isCheck ? 'bg-red-500' : 'bg-amber-500'}`}>
                              <AlertTriangle className="w-4 h-4" />
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight">
                                {isCheck ? '🚨 Streetlight Fault Detected' : '⚡ Energy Wastage Detected'}
                              </h4>
                              <span className="text-[11px] text-slate-600 font-medium">
                                Device ID: <strong className="font-mono text-slate-900">{alert.deviceId}</strong>
                              </span>
                            </div>
                          </div>
                          <Badge variant={isCheck ? 'destructive' : 'default'} className="text-[10px] uppercase font-bold tracking-wider">
                            Status: {isCheck ? 'CHECK' : 'WASTAGE'}
                          </Badge>
                        </div>

                        {/* Location & GPS Coordinates */}
                        <div className="mt-3 pl-2 grid grid-cols-1 gap-2 bg-white/90 p-2.5 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900">Area:</span> {alert.address}
                              <div className="font-mono text-[11px] text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-3">
                                <span>📍 Latitude: <strong className="text-slate-900">{alert.coordinates.lat.toFixed(4)}° N</strong></span>
                                <span>Longitude: <strong className="text-slate-900">{alert.coordinates.lng.toFixed(4)}° E</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hardware Sensor Telemetry Box */}
                        <div className="mt-2.5 pl-2">
                          <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-indigo-600" /> Real-Time Sensor Readings:
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                {alert.sensorSnapshot.environment === 'NIGHT' ? <Moon className="w-3 h-3 text-indigo-500" /> : <Sun className="w-3 h-3 text-amber-500" />}
                                LDR (Pin 34)
                              </div>
                              <div className="font-bold text-slate-800 mt-0.5">
                                {alert.sensorSnapshot.ldr} <span className="text-[9px] text-slate-500 block font-normal">({alert.sensorSnapshot.environment})</span>
                              </div>
                            </div>

                            <div className={`p-2 rounded-lg border bg-white ${isCheck ? 'border-red-300 bg-red-50/50' : 'border-amber-300 bg-amber-50/50'}`}>
                              <div className="text-[10px] text-slate-700 flex items-center justify-center gap-1 font-semibold">
                                <Zap className="w-3 h-3 text-amber-600" /> Current (Pin 36)
                              </div>
                              <div className="font-bold text-red-600 mt-0.5">
                                {alert.sensorSnapshot.current.toFixed(3)} A
                                <span className="text-[9px] text-slate-400 block font-normal">(Threshold: 0.02A)</span>
                              </div>
                            </div>

                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                <Lightbulb className="w-3 h-3 text-yellow-500" /> Pole 1 / Pole 2
                              </div>
                              <div className="font-bold text-slate-800 mt-0.5">
                                P1: {alert.sensorSnapshot.pole1} | P2: {alert.sensorSnapshot.pole2}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Fault Reason Description */}
                        <p className="mt-2.5 pl-2 text-xs text-slate-900 bg-white/70 p-2 rounded-lg leading-relaxed border border-slate-200/60">
                          <strong>ESP32 Diagnosis:</strong> {alert.message}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-3 pl-2 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDispatchCrew(alert.deviceId, alert.address)}
                            disabled={dispatchedAlerts[alert.deviceId]}
                            className={`text-xs flex-1 ${
                              dispatchedAlerts[alert.deviceId]
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            {dispatchedAlerts[alert.deviceId] ? 'NMC Crew Dispatched' : 'Dispatch NMC Crew'}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveAlert(alert.deviceId, alert.deviceName)}
                            className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Wrench className="w-3.5 h-3.5 mr-1" /> Reset to NORMAL
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: OLED DISPLAY SIMULATOR */}
            {activeTab === 'oled' && (
              <div className="space-y-3.5">
                <div className="bg-slate-950 p-4 rounded-xl border-4 border-slate-800 shadow-inner font-mono text-cyan-400">
                  <div className="flex items-center justify-between text-[10px] text-cyan-500/70 border-b border-cyan-500/20 pb-1 mb-2">
                    <span>SSD1306 OLED (128x64 • I2C 0x3C)</span>
                    <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
                  </div>

                  <div className="text-sm font-bold text-center text-white mb-2 tracking-wider">
                    SMART STREETLIGHT
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>LDR: <strong className="text-white">{activeDevice.ldrValue}</strong></span>
                      <span>TIME: <strong className="text-white">{activeDevice.environment}</strong></span>
                    </div>

                    <div className="flex justify-between">
                      <span>P1: <strong className={activeDevice.pole1Light === 'ON' ? 'text-emerald-400' : 'text-slate-400'}>{activeDevice.pole1Light}</strong></span>
                      <span>P2: <strong className={activeDevice.pole2Light === 'ON' ? 'text-emerald-400' : 'text-slate-400'}>{activeDevice.pole2Light}</strong></span>
                    </div>

                    <div className="flex justify-between">
                      <span>Current: <strong className="text-white">{activeDevice.currentReading.toFixed(2)} A</strong></span>
                      <span>Status: <strong className={activeDevice.rawStatus === 'NORMAL' ? 'text-emerald-400' : activeDevice.rawStatus === 'CHECK' ? 'text-red-400 animate-pulse' : 'text-amber-400'}>{activeDevice.rawStatus}</strong></span>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 border-t border-cyan-500/10 flex justify-between">
                      <span>Dev: {activeDevice.deviceId}</span>
                      <span>Area: {activeDevice.location.area.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* State Switcher for Demonstration */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Interactive Hardware State Tester:
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant={activeDevice.rawStatus === 'NORMAL' ? 'default' : 'outline'}
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'NORMAL')}
                      className="text-xs h-8"
                    >
                      NORMAL
                    </Button>
                    <Button
                      size="sm"
                      variant={activeDevice.rawStatus === 'CHECK' ? 'destructive' : 'outline'}
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'CHECK')}
                      className="text-xs h-8"
                    >
                      CHECK (Fault)
                    </Button>
                    <Button
                      size="sm"
                      variant={activeDevice.rawStatus === 'WASTAGE' ? 'secondary' : 'outline'}
                      onClick={() => setHardwareStatus(activeDevice.deviceId, 'WASTAGE')}
                      className="text-xs h-8"
                    >
                      WASTAGE
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: POLES & SENSORS */}
            {activeTab === 'devices' && (
              <div className="space-y-3">
                {devices.map((device) => {
                  const isFaulty = device.rawStatus === 'CHECK';
                  const isWastage = device.rawStatus === 'WASTAGE';
                  return (
                    <div
                      key={device.deviceId}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isFaulty
                          ? 'bg-red-50/50 border-red-200'
                          : isWastage
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${isFaulty ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Lightbulb className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{device.name}</h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {device.location.area} ({device.location.ward})
                            </p>
                          </div>
                        </div>

                        <Badge
                          className={`text-[10px] font-semibold ${
                            isFaulty ? 'bg-red-500 text-white' : isWastage ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {device.rawStatus}
                        </Badge>
                      </div>

                      {/* Telemetry grid */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-500 block">Pole 1 (Pin 18)</span>
                          <span className={`font-bold ${device.pole1Light === 'ON' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {device.pole1Light === 'ON' ? '💡 ON (Lit)' : '⚪ OFF'}
                          </span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-500 block">Pole 2 (Pin 19)</span>
                          <span className={`font-bold ${device.pole2Light === 'ON' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {device.pole2Light === 'ON' ? '💡 ON (Lit)' : '⚪ OFF'}
                          </span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-500 block">LDR Light (Pin 34)</span>
                          <span className="font-bold text-slate-800">{device.ldrValue} ({device.environment})</span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-500 block">Current (Pin 36)</span>
                          <span className={`font-bold ${isFaulty ? 'text-red-600' : 'text-slate-800'}`}>
                            {device.currentReading.toFixed(3)} A
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 4: HARDWARE PINOUT & ARCHITECTURE */}
            {activeTab === 'hardware' && (
              <div className="space-y-3.5">
                <div className="bg-gradient-to-br from-indigo-50 to-slate-100 p-3.5 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-indigo-700" />
                    <h4 className="font-bold text-indigo-950 text-sm">ESP32 Hardware Model Specifications</h4>
                  </div>
                  <p className="text-xs text-indigo-900/80 leading-relaxed">
                    Microcontroller: <strong>ESP32 NodeMCU</strong> running Arduino C++ firmware. Connects to Wi-Fi and pushes telemetry JSON payloads to Firebase Realtime Database at <code>/streetlights/NG-001.json</code> every 5 seconds.
                  </p>
                </div>

                {/* Pinout Details */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ESP32 GPIO Pin Configuration</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-indigo-700 block">LDR_PIN: GPIO 34 (ADC)</span>
                      <span className="text-[11px] text-slate-600">Measures ambient light (&lt;300 = NIGHT, &gt;=300 = DAY)</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-red-700 block">CURRENT_PIN: GPIO 36 (ADC)</span>
                      <span className="text-[11px] text-slate-600">Current sensor with 100 sample averaging</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-emerald-700 block">LED1_PIN (18) & LED2_PIN (19)</span>
                      <span className="text-[11px] text-slate-600">Streetlight Pole 1 & Pole 2 digital outputs</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-cyan-700 block">OLED SDA (21) & SCL (22)</span>
                      <span className="text-[11px] text-slate-600">I2C interface for 128x64 SSD1306 display</span>
                    </div>
                  </div>
                </div>

                {/* Firebase Connection Config Note */}
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-700" /> Firebase Integration Note:
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Set <code>FIREBASE_URL</code> in your Arduino code to your Firebase Realtime Database URL (without trailing slash).
                    The frontend automatically listens to <code>/streetlights</code> in real-time.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ESP32 NG-001 Live Stream
            </span>
            <Button size="sm" variant="default" onClick={onClose} className="h-8 px-4 text-xs bg-slate-900 hover:bg-slate-800 text-white">
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
