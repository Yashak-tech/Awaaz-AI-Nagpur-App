// React Hook for ESP32 IoT Sensor Telemetry & Alerts
import { useState, useEffect, useCallback } from 'react';
import { IoTStreetlightDevice, IoTAlertNotification } from '../types/iot';
import { iotHardwareService } from '../utils/iotHardwareService';

export function useIoTTelemetry() {
  const [devices, setDevices] = useState<IoTStreetlightDevice[]>(() => iotHardwareService.getDevices());
  const [alerts, setAlerts] = useState<IoTAlertNotification[]>(() => iotHardwareService.getAlertNotifications());

  useEffect(() => {
    const unsubscribe = iotHardwareService.subscribe(() => {
      setDevices(iotHardwareService.getDevices());
      setAlerts(iotHardwareService.getAlertNotifications());
    });
    return unsubscribe;
  }, []);

  const setHardwareStatus = useCallback((deviceId: string, status: 'NORMAL' | 'CHECK' | 'WASTAGE') => {
    iotHardwareService.setHardwareStatus(deviceId, status);
  }, []);

  const resolveAlert = useCallback((deviceId: string) => {
    iotHardwareService.resolveAlert(deviceId);
  }, []);

  const activeFaultCount = alerts.filter(a => a.status === 'active').length;

  return {
    devices,
    alerts,
    activeFaultCount,
    setHardwareStatus,
    resolveAlert
  };
}
