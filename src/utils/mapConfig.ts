// Map configuration and utilities
export const MAP_CONFIG = {
  defaultCenter: [
    Number(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG) || 79.0882, // Nagpur longitude
    Number(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT) || 21.1458   // Nagpur latitude
  ] as [number, number],
  defaultZoom: Number(import.meta.env.VITE_DEFAULT_MAP_ZOOM) || 12,
};

export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Nagpur': [79.0882, 21.1458],
  'Pune': [73.8567, 18.5204],
  'Mumbai': [72.8777, 19.0760],
  'Thane': [72.9781, 19.2183],
  'Chhatrapati Sambhajinagar': [75.3433, 19.8762],
  'Nashik': [73.7898, 19.9975],
  'New Delhi': [77.2090, 28.6139],
  'Bangalore': [77.5946, 12.9716],
  'Kolkata': [88.3639, 22.5726],
  'Hyderabad': [78.4867, 17.3850],
};

export const getDistrictCenter = (district: string): [number, number] => {
  return DISTRICT_COORDINATES[district] || MAP_CONFIG.defaultCenter;
};

export const createMarkerElement = (report: any) => {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    position: relative;
    transition: transform 0.2s ease;
  `;

  // Set background color based on report status
  const statusColors = {
    pending: '#ef4444',    // red
    submitted: '#f59e0b',  // yellow/orange
    resolved: '#10b981'    // green
  };

  el.style.backgroundColor = statusColors[report.status as keyof typeof statusColors] || '#6b7280';

  // Add priority indicator
  if (report.priority === 'high') {
    const priorityIndicator = document.createElement('div');
    priorityIndicator.style.cssText = `
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background-color: #dc2626;
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse 2s infinite;
    `;
    el.appendChild(priorityIndicator);
  }

  // Add icon
  const icon = document.createElement('div');
  icon.innerHTML = '📍';
  icon.style.cssText = `
    font-size: 16px;
    color: white;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  `;
  el.appendChild(icon);

  // Add hover effect
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.2)';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
  });

  return el;
};

export const generateRandomCoordinates = (center: [number, number], count: number, radiusKm: number = 5): [number, number][] => {
  const coordinates: [number, number][] = [];
  const [centerLng, centerLat] = center;
  
  for (let i = 0; i < count; i++) {
    // Convert radius from kilometers to degrees (rough approximation)
    const radiusDeg = radiusKm / 111; // 1 degree ≈ 111 km
    
    // Generate random angle and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusDeg;
    
    // Calculate new coordinates
    const lng = centerLng + (distance * Math.cos(angle));
    const lat = centerLat + (distance * Math.sin(angle));
    
    coordinates.push([lng, lat]);
  }
  
  return coordinates;
};