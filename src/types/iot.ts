// IoT Hardware & Telemetry Types for Awaaz-AI ESP32 Hardware Integration
// Exactly aligned with Arduino IDE firmware schema for ESP32 (NG-001)

export interface FirebaseStreetlightPayload {
  deviceId: string;
  ldr: number;
  environment: 'NIGHT' | 'DAY';
  pole1: {
    light: 'ON' | 'OFF';
  };
  pole2: {
    light: 'ON' | 'OFF';
  };
  current: number;
  status: 'NORMAL' | 'CHECK' | 'WASTAGE' | 'FAULTY';
  location: {
    latitude: number;
    longitude: number;
    area: string;
  };
  timestamp: string;
}

export interface IoTStreetlightDevice {
  deviceId: string;
  name: string;
  status: 'operational' | 'faulty' | 'wastage';
  rawStatus: 'NORMAL' | 'CHECK' | 'WASTAGE';
  environment: 'NIGHT' | 'DAY';
  ldrValue: number;
  pole1Light: 'ON' | 'OFF';
  pole2Light: 'ON' | 'OFF';
  currentReading: number;
  voltage: number;
  faultReason?: string;
  location: {
    lat: number;
    lng: number;
    area: string;
    ward: string;
    zone: string;
  };
  lastUpdated: number;
  timestampStr: string;
  hardwareInfo: {
    microcontroller: string;
    pins: {
      ldr: number;
      current: number;
      led1: number;
      led2: number;
      oledSda: number;
      oledScl: number;
    };
    sensors: string[];
    actuators: string[];
  };
}

export interface IoTAlertNotification {
  id: string;
  deviceId: string;
  deviceName: string;
  title: string;
  message: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  ward: string;
  timestamp: Date;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  alertType: 'FAULT_LIGHT_UNLIT' | 'ENERGY_WASTAGE' | 'NOMINAL';
  sensorSnapshot: {
    ldr: number;
    environment: 'NIGHT' | 'DAY';
    current: number;
    pole1: 'ON' | 'OFF';
    pole2: 'ON' | 'OFF';
  };
  isRead: boolean;
}
