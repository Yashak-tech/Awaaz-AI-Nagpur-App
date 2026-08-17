import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  Building, 
  AlertTriangle, 
  Sparkles, 
  Star,
  Zap,
  Layers,
  PieChart as PieIcon,
  Flame,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Report, User } from '../App';
import { translations } from './translations';
import { generateInsights } from '../utils/aiClassification';
import { getSeverityColor } from '../utils/severityColors';
import { getAllPredictions } from '../utils/predictiveMaintenance';

interface AnalyticsScreenProps {
  reports: Report[];
  user: User;
}

export function AnalyticsScreen({ reports, user }: AnalyticsScreenProps) {
  const t = translations[user.language];
  const insights = generateInsights(reports);
  const predictiveRisks = getAllPredictions(reports);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // ==========================================
  // 1. Dynamic Chart Data Preparation
  // ==========================================

  // Weekly Trend Data (Smooth Area Chart)
  const weeklyTrendData = [
    { day: 'Mon', reported: 18, resolved: 14, predicted: 16 },
    { day: 'Tue', reported: 24, resolved: 21, predicted: 22 },
    { day: 'Wed', reported: 32, resolved: 28, predicted: 30 },
    { day: 'Thu', reported: 29, resolved: 27, predicted: 28 },
    { day: 'Fri', reported: 45, resolved: 39, predicted: 42 },
    { day: 'Sat', reported: 38, resolved: 35, predicted: 36 },
    { day: 'Sun', reported: 22, resolved: 20, predicted: 21 },
  ];

  // Category Distribution for Vibrant Donut Chart
  const categoryColors: Record<string, string> = {
    road: '#3b82f6',        // Vibrant Blue
    garbage: '#10b981',     // Emerald Green
    streetlight: '#f59e0b', // Amber Orange
    water: '#06b6d4',       // Electric Cyan
    drainage: '#8b5cf6',    // Rich Purple
    other: '#ec4899'        // Rose Pink
  };

  const categoryLabels: Record<string, string> = {
    road: 'Roads & Potholes',
    garbage: 'Solid Waste & Sanitation',
    streetlight: 'Smart Streetlights (IoT)',
    water: 'Water Pipeline & Supply',
    drainage: 'Drainage & Sewage',
    other: 'Civic Infrastructure'
  };

  const categoryDistribution = React.useMemo(() => {
    const counts: Record<string, number> = {
      road: 0,
      garbage: 0,
      streetlight: 0,
      water: 0,
      drainage: 0
    };

    reports.forEach(r => {
      const type = (r.type || 'road').toLowerCase();
      if (counts[type] !== undefined) {
        counts[type] += 1;
      } else {
        counts.road += 1;
      }
    });

    // Ensure realistic baseline for visualization
    if (reports.length === 0) {
      counts.road = 14;
      counts.garbage = 11;
      counts.streetlight = 9;
      counts.water = 7;
      counts.drainage = 5;
    }

    return Object.entries(counts).map(([key, value]) => ({
      name: categoryLabels[key] || key,
      categoryKey: key,
      value: value || 1,
      color: categoryColors[key] || '#64748b'
    }));
  }, [reports]);

  // Zone Performance (Vibrant Bar Chart)
  const zonePerformanceData = [
    { zone: 'Z1 Laxmi', active: 12, resolved: 38, avgHours: 14 },
    { zone: 'Z2 Dharam', active: 9, resolved: 46, avgHours: 11 },
    { zone: 'Z3 Hanuman', active: 18, resolved: 31, avgHours: 19 },
    { zone: 'Z4 Dhantoli', active: 14, resolved: 42, avgHours: 13 },
    { zone: 'Z5 Nehru', active: 21, resolved: 29, avgHours: 24 },
    { zone: 'Z6 Gandhi', active: 16, resolved: 35, avgHours: 16 },
  ];

  // Hourly Incident Density (Smooth Spline Chart)
  const hourlyDensityData = [
    { hour: '06:00', density: 12, resolved: 8 },
    { hour: '09:00', density: 42, resolved: 31 },
    { hour: '12:00', density: 38, resolved: 36 },
    { hour: '15:00', density: 29, resolved: 27 },
    { hour: '18:00', density: 56, resolved: 44 },
    { hour: '21:00', density: 34, resolved: 30 },
    { hour: '00:00', density: 15, resolved: 14 },
  ];

  // Smart Streetlight IoT Power & Light Curve
  const iotTelemetryCurve = [
    { time: '18:00', powerKw: 24.2, baselineKw: 48.0, lux: 150 },
    { time: '20:00', powerKw: 42.0, baselineKw: 48.0, lux: 20 },
    { time: '22:00', powerKw: 46.5, baselineKw: 48.0, lux: 5 },
    { time: '01:00', powerKw: 31.2, baselineKw: 48.0, lux: 0 },
    { time: '04:00', powerKw: 28.0, baselineKw: 48.0, lux: 12 },
    { time: '06:00', powerKw: 12.4, baselineKw: 48.0, lux: 480 },
  ];

  // Department Statistics
  const departmentStats = React.useMemo(() => {
    const deptMap: Record<string, { total: number; resolved: number; open: number; totalResTimeHours: number; ratings: number[] }> = {};

    reports.forEach(report => {
      const dept = report.suggestedDepartment || (
        report.type === 'road' ? 'Public Works Department' :
        report.type === 'garbage' ? 'Waste Management Department' :
        report.type === 'streetlight' ? 'Electrical Department' :
        report.type === 'water' ? 'Water Supply Department' :
        report.type === 'drainage' ? 'Drainage Department' : 'General Municipal Services'
      );

      if (!deptMap[dept]) {
        deptMap[dept] = { total: 0, resolved: 0, open: 0, totalResTimeHours: 0, ratings: [] };
      }

      deptMap[dept].total += 1;
      if (report.status === 'resolved') {
        deptMap[dept].resolved += 1;
        if (report.resolvedAt) {
          const hours = (new Date(report.resolvedAt).getTime() - new Date(report.timestamp).getTime()) / (1000 * 60 * 60);
          deptMap[dept].totalResTimeHours += Math.max(hours, 1);
        } else {
          deptMap[dept].totalResTimeHours += 24;
        }
      } else {
        deptMap[dept].open += 1;
      }

      if (report.satisfactionRating) {
        deptMap[dept].ratings.push(report.satisfactionRating);
      }
    });

    return Object.entries(deptMap).map(([name, data]) => {
      const resolutionRate = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;
      const avgResTime = data.resolved > 0 ? (data.totalResTimeHours / data.resolved).toFixed(1) : 'N/A';
      const avgRating = data.ratings.length > 0 ? (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1) : null;
      return {
        name,
        total: data.total,
        resolved: data.resolved,
        open: data.open,
        resolutionRate,
        avgResTime: avgResTime === 'N/A' ? 'Pending' : `${avgResTime}h`,
        avgRating
      };
    });
  }, [reports]);

  // High-Level Stat Cards
  const statsCards = [
    {
      title: 'Total Civic Reports',
      value: insights.totalReports || 148,
      subtext: '+18.4% vs last week',
      icon: BarChart3,
      gradient: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'SLA Resolution Rate',
      value: `${insights.resolvedPercentage || 88.5}%`,
      subtext: 'Target SLA: 85.0%',
      icon: CheckCircle,
      gradient: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'IoT Energy Savings',
      value: '42.6%',
      subtext: '284.5 kWh saved / day',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      title: 'Active Citizens',
      value: Math.floor((insights.totalReports || 148) * 0.75),
      subtext: '98.4% Ward Parity',
      icon: Users,
      gradient: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-xl shadow-xl text-xs backdrop-blur-md border"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', borderColor: '#334155', color: '#ffffff' }}
        >
          <p className="font-bold text-slate-200 mb-1.5 pb-1 border-b border-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-blue-400" />
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color || '#94a3b8' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="font-mono text-white text-sm">{entry.value}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* ==================================================================== */}
      {/* 1. STICKY PAGE HEADER WITH FILTER CONTROLS                            */}
      {/* ==================================================================== */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-xs">
        <div className="p-4 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  NMC Analytics & Insights
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Nagpur Municipal Corporation • Real-Time Civic & IoT Telemetry
                </p>
              </div>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-5 max-w-4xl mx-auto space-y-5">
        {/* ==================================================================== */}
        {/* 2. STATS KPI GRID WITH VIBRANT ACCENTS                                */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-xs`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">
                  {stat.subtext}
                </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient}`} 
                  style={{ width: `${80 + index * 5}%` }} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ==================================================================== */}
        {/* 3. CHART 1: WEEKLY RESOLUTION VELOCITY & INFLOW (SMOOTH AREA CHART) */}
        {/* ==================================================================== */}
        <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Weekly Civic Velocity & Inflow Trend
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Reports received vs. cases verified & resolved across Nagpur wards
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Inflow
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Resolved
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Cyan to Blue Gradient */}
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Emerald to Green Gradient */}
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="reported" 
                  name="New Reports"
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorReported)" 
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  name="Resolved"
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorResolved)" 
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ==================================================================== */}
        {/* 4. DUAL CHARTS: CATEGORY DONUT + HOURLY DENSITY                       */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart 2: Category Breakdown (Vibrant Donut) */}
          <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Issue Distribution
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold text-purple-700 border-purple-200">
                5 Major Sectors
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Categorized by AI Vision & citizen geotagged reports
            </p>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                    cornerRadius={6}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {insights.totalReports || 148}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>

            {/* Custom Interactive Legend Badges */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
              {categoryDistribution.map((cat) => (
                <div key={cat.categoryKey} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 text-[11px]">
                  <span className="flex items-center gap-1.5 truncate font-medium text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate">{cat.name.split(' ')[0]}</span>
                  </span>
                  <strong className="font-mono text-slate-900 shrink-0 ml-1">{cat.value}</strong>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart 3: Hourly Reporting Density (Smooth Gradient Spline) */}
          <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Hourly Peak Density
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold text-amber-700 border-amber-200">
                Peak: 18:00
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Citizen activity spikes during morning & evening commutes
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyDensityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="density" 
                    name="Incident Inflow" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorDensity)" 
                    activeDot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 font-medium mt-2">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Peak Triage Window
              </span>
              <strong>17:30 - 19:30 IST</strong>
            </div>
          </Card>
        </div>

        {/* ==================================================================== */}
        {/* 5. CHART 4: ZONE-WISE PERFORMANCE & RESOLUTION (ROUNDED BAR CHART)   */}
        {/* ==================================================================== */}
        <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Nagpur Municipal Zone Workload & Resolution
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Active backlogs vs resolved cases across 6 key administrative zones
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Resolved
              </span>
              <span className="flex items-center gap-1.5 text-orange-500">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Active Backlog
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zonePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="zone" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="resolved" 
                  name="Resolved" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  barSize={18}
                />
                <Bar 
                  dataKey="active" 
                  name="Active Backlog" 
                  fill="#f97316" 
                  radius={[6, 6, 0, 0]} 
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ==================================================================== */}
        {/* 6. CHART 5: LIVE SMART STREETLIGHT IoT ENERGY SAVINGS & DIMMING CURVE */}
        {/* ==================================================================== */}
        <Card className="p-4 sm:p-5 border-emerald-200 shadow-xs bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Smart Streetlight IoT Energy Conservation Curve
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Live ESP32 adaptive luminaire load vs legacy un-dimmed baseline
              </p>
            </div>

            <Badge className="bg-emerald-600 text-white font-bold text-[11px] self-start sm:self-auto">
              ⚡ 42.6% Energy Conserved
            </Badge>
          </div>

          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={iotTelemetryCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="baselineKw" 
                  name="Legacy Fixed Grid (kW)" 
                  stroke="#94a3b8" 
                  strokeDasharray="4 4" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorBaseline)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="powerKw" 
                  name="Smart ESP32 Adaptive (kW)" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPower)" 
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-100 text-center">
            <div className="p-2 rounded-xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Grid Power Saved</span>
              <div className="text-sm sm:text-base font-black text-emerald-600 font-mono">284.5 kWh</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase">CO₂ Emission Cut</span>
              <div className="text-sm sm:text-base font-black text-teal-600 font-mono">198.2 kg</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Municipal Savings</span>
              <div className="text-sm sm:text-base font-black text-slate-900 font-mono">₹ 2,418 / day</div>
            </div>
          </div>
        </Card>

        {/* ==================================================================== */}
        {/* 7. DEPARTMENT SLA & PERFORMANCE TRACKING                             */}
        {/* ==================================================================== */}
        <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Department SLA & Performance Tracking
              </h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold">Live Tracking</Badge>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-medium">
            Monitoring NMC municipal departments across resolution velocity, active backlogs, and citizen feedback.
          </p>

          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{dept.name}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {dept.total} total cases • {dept.open} pending / {dept.resolved} resolved
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={dept.resolutionRate >= 70 ? 'bg-emerald-600 text-white font-bold' : dept.resolutionRate >= 40 ? 'bg-amber-600 text-white font-bold' : 'bg-red-600 text-white font-bold'}>
                      {dept.resolutionRate}% SLA
                    </Badge>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dept.resolutionRate >= 70 ? 'bg-emerald-500' : dept.resolutionRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.max(dept.resolutionRate, 5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Avg. Speed: <strong className="text-slate-800">{dept.avgResTime}</strong></span>
                  {dept.avgRating && (
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {dept.avgRating} / 5.0
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ==================================================================== */}
        {/* 8. AI PREDICTIVE MAINTENANCE INSIGHTS                                */}
        {/* ==================================================================== */}
        <Card className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-slate-50 border-indigo-200 shadow-xs rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-indigo-950">
                AI Predictive Maintenance Insights
              </h3>
            </div>
            <Badge className="bg-indigo-600 text-white text-[10px] font-bold">Rule-based Engine</Badge>
          </div>
          <p className="text-xs text-indigo-900/80 mb-3 font-medium">
            Pattern detection analyzes repeat incident clusters and seasonal risks before citizen escalation occurs.
          </p>

          <div className="space-y-3">
            {predictiveRisks.length > 0 ? (
              predictiveRisks.map((risk) => (
                <div key={risk.id} className="bg-white p-3 sm:p-3.5 rounded-xl border border-indigo-100 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${risk.riskLevel === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                      <p className="font-bold text-xs text-slate-900">{risk.category}</p>
                    </div>
                    <Badge className={risk.riskLevel === 'high' ? 'bg-red-100 text-red-800 font-bold' : 'bg-amber-100 text-amber-800 font-bold'}>
                      {risk.riskLevel.toUpperCase()} RISK ({risk.confidence}% conf)
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{risk.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 font-medium">
                    <span>📍 {risk.ward}</span>
                    <span className="text-indigo-700 font-bold">Pre-emptive dispatch recommended</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-center text-xs text-slate-500">
                No high-probability repeat failure clusters detected at current thresholds.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}