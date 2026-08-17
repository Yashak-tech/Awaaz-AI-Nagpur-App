// IoT Hardware Service for Awaaz-AI ESP32 Hardware Integration
// Supports both:
// 1. Direct Local HTTP Ingestion via Antigravity Vite Server (/streetlights)
// 2. Firebase Realtime Database (/streetlights)

import { IoTStreetlightDevice, IoTAlertNotification, FirebaseStreetlightPayload } from '../types/iot';
import { database } from '../firebaseConfig';

const STORAGE_KEY = 'awaaz_iot_devices';

/** Load previously received hardware data from localStorage (survives page refresh) */
function loadPersistedDevices(): IoTStreetlightDevice[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as IoTStreetlightDevice[];
      // Restore Date-related fields
      return parsed.map(d => ({ ...d, lastUpdated: d.lastUpdated || Date.now() }));
    }
  } catch {
    // ignore
  }
  return [];
}

/** Save current device state to localStorage */
function persistDevices(devices: IoTStreetlightDevice[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch {
    // ignore quota errors
  }
}

class IoTService {
  // Start EMPTY — only real hardware data will appear
  private devices: IoTStreetlightDevice[] = loadPersistedDevices();
  private listeners: Array<() => void> = [];

  constructor() {
    this.initFirebaseListener();
    this.initLocalServerPolling();
  }

  // 1. Direct Local Receiver Polling (fetches data ESP32 sent to Vite middleware)
  private initLocalServerPolling() {
    if (typeof window === 'undefined') return;

    // Poll immediately on startup, then every 2 seconds
    const poll = async () => {
      try {
        const res = await fetch('/streetlights');
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            Object.entries(data).forEach(([key, val]: [string, any]) => {
              this.processPayload(key, val);
            });
            persistDevices(this.devices);
            this.notifyListeners();
          }
        }
      } catch {
        // Local endpoint polling silent catch
      }
    };

    poll(); // First poll immediately on page load / refresh
    setInterval(poll, 2000);
  }

  // 2. Firebase Cloud Realtime Listener
  private async initFirebaseListener() {
    if (!database) return;
    try {
      const { ref, onValue } = await import('firebase/database');
      const streetlightsRef = ref(database, 'streetlights');

      onValue(streetlightsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.entries(data).forEach(([key, val]: [string, any]) => {
            this.processPayload(key, val);
          });
          persistDevices(this.devices);
          this.notifyListeners();
        }
      });
    } catch (e) {
      console.warn('[IoTService] Firebase listener error:', e);
    }
  }

  private processPayload(key: string, val: any) {
    const payload = val as FirebaseStreetlightPayload;
    const deviceId = payload.deviceId || key;
    const rawStatus = (payload.status || 'NORMAL').toUpperCase() as 'NORMAL' | 'CHECK' | 'WASTAGE';
    
    const isFaulty = rawStatus === 'CHECK' || rawStatus === 'FAULTY';
    const isWastage = rawStatus === 'WASTAGE';

    // Use EXACT location from Arduino code
    const areaFromHardware = payload.location?.area || 'Unknown Area';
    const latFromHardware = payload.location?.latitude || 0;
    const lngFromHardware = payload.location?.longitude || 0;

    let faultReason: string | undefined;
    if (isFaulty) {
      faultReason = `🚨 CHECK ALERT at ${areaFromHardware}: Night time (LDR: ${payload.ldr}) with lights ON, but Current sensor measured ${payload.current} A (<= 0.02 A threshold). Possible burnt LED or open circuit. GPS: ${latFromHardware}°N, ${lngFromHardware}°E`;
    } else if (isWastage) {
      faultReason = `⚡ ENERGY WASTAGE at ${areaFromHardware}: Day time (LDR: ${payload.ldr}) with lights OFF, but Current sensor measured ${payload.current} A (> 0.02 A). Power draining unnecessarily. GPS: ${latFromHardware}°N, ${lngFromHardware}°E`;
    }

    const updatedDevice: IoTStreetlightDevice = {
      deviceId,
      name: `Streetlight Cluster — ${areaFromHardware}`,
      status: isFaulty ? 'faulty' : isWastage ? 'wastage' : 'operational',
      rawStatus,
      environment: payload.environment || (payload.ldr < 300 ? 'NIGHT' : 'DAY'),
      ldrValue: typeof payload.ldr === 'number' ? payload.ldr : 200,
      pole1Light: payload.pole1?.light || (payload.environment === 'NIGHT' ? 'ON' : 'OFF'),
      pole2Light: payload.pole2?.light || (payload.environment === 'NIGHT' ? 'ON' : 'OFF'),
      currentReading: typeof payload.current === 'number' ? payload.current : 0,
      voltage: 230.0,
      faultReason,
      location: {
        lat: latFromHardware,
        lng: lngFromHardware,
        area: areaFromHardware,
        ward: `Device ${deviceId}`,
        zone: areaFromHardware
      },
      lastUpdated: Date.now(),
      timestampStr: payload.timestamp || new Date().toISOString(),
      hardwareInfo: {
        microcontroller: 'ESP32 (Wi-Fi + HTTP Client)',
        pins: {
          ldr: 34,
          current: 36,
          led1: 18,
          led2: 19,
          oledSda: 21,
          oledScl: 22
        },
        sensors: ['LDR Photoresistor (Pin 34 ADC)', 'Current Sensor ACS712 (Pin 36 ADC)'],
        actuators: ['Pole 1 LED (Pin 18)', 'Pole 2 LED (Pin 19)', 'OLED Display (I2C)']
      }
    };

    const existingIndex = this.devices.findIndex(d => d.deviceId === deviceId);
    if (existingIndex !== -1) {
      this.devices[existingIndex] = updatedDevice;
    } else {
      this.devices.push(updatedDevice);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  public getDevices(): IoTStreetlightDevice[] {
    return [...this.devices];
  }

  public getAlertNotifications(): IoTAlertNotification[] {
    const alerts: IoTAlertNotification[] = [];

    this.devices.forEach(device => {
      if (device.rawStatus === 'CHECK' || device.rawStatus === 'WASTAGE' || device.status === 'faulty') {
        const isCheck = device.rawStatus === 'CHECK' || device.status === 'faulty';
        alerts.push({
          id: `alert-${device.deviceId}-${device.lastUpdated}`,
          deviceId: device.deviceId,
          deviceName: `${device.name} [${device.deviceId}]`,
          title: isCheck 
            ? `⚠️ Fault Detected — ${device.deviceId} at ${device.location.area}`
            : `⚡ Energy Wastage — ${device.deviceId} at ${device.location.area}`,
          message: device.faultReason || (isCheck ? 'Streetlight unlit during night condition.' : 'Streetlight drawing power during daytime.'),
          coordinates: {
            lat: device.location.lat,
            lng: device.location.lng,
          },
          address: device.location.area,
          ward: device.location.ward,
          timestamp: new Date(device.lastUpdated),
          severity: isCheck ? 'critical' : 'warning',
          status: 'active',
          alertType: isCheck ? 'FAULT_LIGHT_UNLIT' : 'ENERGY_WASTAGE',
          sensorSnapshot: {
            ldr: device.ldrValue,
            environment: device.environment,
            current: device.currentReading,
            pole1: device.pole1Light,
            pole2: device.pole2Light
          },
          isRead: false
        });
      }
    });

    return alerts;
  }

  public setHardwareStatus(deviceId: string, rawStatus: 'NORMAL' | 'CHECK' | 'WASTAGE') {
    // If no devices exist yet, create a placeholder for testing
    if (this.devices.length === 0) {
      this.devices.push({
        deviceId,
        name: `Streetlight Cluster — Test Device`,
        status: 'operational',
        rawStatus: 'NORMAL',
        environment: 'NIGHT',
        ldrValue: 200,
        pole1Light: 'ON',
        pole2Light: 'ON',
        currentReading: 0.4,
        voltage: 230.0,
        location: { lat: 0, lng: 0, area: 'Test Location', ward: deviceId, zone: 'Test' },
        lastUpdated: Date.now(),
        timestampStr: new Date().toISOString(),
        hardwareInfo: {
          microcontroller: 'ESP32',
          pins: { ldr: 34, current: 36, led1: 18, led2: 19, oledSda: 21, oledScl: 22 },
          sensors: ['LDR', 'Current Sensor'],
          actuators: ['LED1', 'LED2', 'OLED']
        }
      });
    }

    this.devices = this.devices.map(device => {
      if (device.deviceId === deviceId) {
        const isNight = rawStatus === 'CHECK' || (rawStatus === 'NORMAL' && device.environment === 'NIGHT');
        const current = rawStatus === 'CHECK' ? 0.005 : rawStatus === 'WASTAGE' ? 0.380 : 0.442;
        const ldr = rawStatus === 'WASTAGE' ? 550 : isNight ? 142 : 550;
        const env = ldr < 300 ? 'NIGHT' : 'DAY';

        let faultReason: string | undefined;
        if (rawStatus === 'CHECK') {
          faultReason = `🚨 CHECK ALERT at ${device.location.area}: Night time (LDR: ${ldr}) with lights commanded ON, but Current Sensor measured ${current} A (<= 0.02 A). Blown LED / disconnected jumper wire. GPS: ${device.location.lat}°N, ${device.location.lng}°E`;
        } else if (rawStatus === 'WASTAGE') {
          faultReason = `⚡ ENERGY WASTAGE at ${device.location.area}: Day time (LDR: ${ldr}) with lights commanded OFF, but Current Sensor measured ${current} A (> 0.02 A). Power leak detected. GPS: ${device.location.lat}°N, ${device.location.lng}°E`;
        }

        return {
          ...device,
          rawStatus,
          status: rawStatus === 'CHECK' ? 'faulty' : rawStatus === 'WASTAGE' ? 'wastage' : 'operational',
          environment: env,
          ldrValue: ldr,
          pole1Light: env === 'NIGHT' ? 'ON' : 'OFF',
          pole2Light: env === 'NIGHT' ? 'ON' : 'OFF',
          currentReading: current,
          faultReason,
          lastUpdated: Date.now(),
          timestampStr: new Date().toISOString().replace('T', ' ').substring(0, 19)
        } as IoTStreetlightDevice;
      }
      return device;
    });
    persistDevices(this.devices);
    this.notifyListeners();
  }

  public resolveAlert(deviceId: string) {
    this.setHardwareStatus(deviceId, 'NORMAL');
  }
}

export const iotHardwareService = new IoTService();
