// Digital Twin Map Screen for Nagpur Municipal Corporation (NMC)
// Aggregates civic infrastructure health metrics at the ward & zone level
// Calculates Ward Urban Health Score and displays real-time civic load

import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertCircle, Building2, Star, Sparkles, MapPin, ChevronRight, BarChart2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LeafletMap } from './LeafletMap';
import { Report, User } from '../App';
import { getSeverityColor } from '../utils/severityColors';

interface DigitalTwinScreenProps {
  reports: Report[];
  user: User;
}

interface WardAggregation {
  wardName: string;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  criticalIssues: number;
  moderateIssues: number;
  minorIssues: number;
  urbanHealthScore: number;
  averageSatisfaction: number | null;
  reportsList: Report[];
}

export function DigitalTwinScreen({ reports, user }: DigitalTwinScreenProps) {
  const [selectedWardName, setSelectedWardName] = useState<string | null>(null);

  // Group reports by ward
  const wardData = useMemo(() => {
    const wardMap: Record<string, WardAggregation> = {};

    reports.forEach((report) => {
      const ward = report.ward || 'Zone 1 - Laxmi Nagar (Ward 36)';
      if (!wardMap[ward]) {
        wardMap[ward] = {
          wardName: ward,
          totalReports: 0,
          resolvedReports: 0,
          pendingReports: 0,
          criticalIssues: 0,
          moderateIssues: 0,
          minorIssues: 0,
          urbanHealthScore: 100,
          averageSatisfaction: null,
          reportsList: []
        };
      }

      const entry = wardMap[ward];
      entry.totalReports += 1;
      entry.reportsList.push(report);

      if (report.status === 'resolved') {
        entry.resolvedReports += 1;
      } else {
        entry.pendingReports += 1;
        if (report.severity >= 8) {
          entry.criticalIssues += 1;
        } else if (report.severity >= 5) {
          entry.moderateIssues += 1;
        } else {
          entry.minorIssues += 1;
        }
      }
    });

    // Calculate Urban Health Score and satisfaction per ward
    return Object.values(wardMap).map((w) => {
      // Score formula: 100 minus penalty for open unresolved issues
      const penalty = (w.criticalIssues * 15) + (w.moderateIssues * 8) + (w.minorIssues * 3);
      const urbanHealthScore = Math.max(10, Math.min(100, 100 - penalty));

      const ratings = w.reportsList
        .map((r) => r.satisfactionRating)
        .filter((r): r is number => typeof r === 'number' && r > 0);

      const averageSatisfaction =
        ratings.length > 0
          ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
          : null;

      return {
        ...w,
        urbanHealthScore,
        averageSatisfaction
      };
    });
  }, [reports]);

  // Overall City Health Score
  const cityHealthScore = useMemo(() => {
    if (wardData.length === 0) return 100;
    const sum = wardData.reduce((acc, w) => acc + w.urbanHealthScore, 0);
    return Math.round(sum / wardData.length);
  }, [wardData]);

  const selectedWard = useMemo(() => {
    if (!selectedWardName) return wardData[0] || null;
    return wardData.find((w) => w.wardName === selectedWardName) || wardData[0] || null;
  }, [wardData, selectedWardName]);

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'Optimal Health', color: 'bg-emerald-600 text-white font-bold shadow-xs' };
    if (score >= 60) return { label: 'Moderate Load', color: 'bg-amber-500 text-white font-bold shadow-xs' };
    return { label: 'Critical Attention', color: 'bg-rose-600 text-white font-bold shadow-xs' };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-slate-900">NMC Digital Twin</h1>
            </div>
            <p className="text-xs text-muted-foreground">Real-time Ward Health Aggregation • Nagpur</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1">
            10 Zones Active
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* City Health Index Overview */}
        <Card className="p-4 bg-slate-900 text-white shadow-xl border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Nagpur City Urban Health Score
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Simulation
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  {cityHealthScore}
                </span>
                <span className="text-base text-slate-400 font-semibold">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Weighted across {wardData.length} monitored administrative wards
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Infrastructure Load</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${getHealthBadge(cityHealthScore).color}`}>
                {getHealthBadge(cityHealthScore).label}
              </span>
            </div>
          </div>
        </Card>

        {/* Map Container */}
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <div className="p-3 bg-white border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-slate-800">Geospatial Ward Map</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Select marker to inspect</span>
          </div>
          <div className="h-[220px] w-full relative">
            <LeafletMap
              reports={selectedWard ? selectedWard.reportsList : reports}
              user={user}
              onReportSelect={() => {}}
              className="h-full w-full"
            />
          </div>
        </Card>

        {/* Ward Breakdown & Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-primary" />
              Administrative Ward Performance
            </h2>
            <span className="text-xs text-muted-foreground">{wardData.length} Zones</span>
          </div>

          <div className="space-y-2.5">
            {wardData.map((ward) => {
              const isSelected = selectedWard?.wardName === ward.wardName;
              const badge = getHealthBadge(ward.urbanHealthScore);

              return (
                <Card
                  key={ward.wardName}
                  onClick={() => setSelectedWardName(ward.wardName)}
                  className={`p-3.5 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm'
                      : 'hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{ward.wardName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {ward.totalReports} reports • {ward.resolvedReports} resolved • {ward.pendingReports} pending
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-slate-900">{ward.urbanHealthScore}</span>
                      <span className="text-[10px] text-muted-foreground block">Health Score</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      {ward.criticalIssues > 0 && (
                        <span className="text-[10px] font-medium text-red-600 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          {ward.criticalIssues} critical
                        </span>
                      )}
                    </div>
                    {ward.averageSatisfaction && (
                      <span className="flex items-center gap-1 text-amber-600 text-[11px] font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {ward.averageSatisfaction}/5.0
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Ward Deep Dive */}
        {selectedWard && (
          <Card className="p-4 bg-white border-primary/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Ward Detail Panel</span>
                <h3 className="text-sm font-bold text-slate-900">{selectedWard.wardName}</h3>
              </div>
              <Badge className="bg-primary text-primary-foreground text-xs">
                Score: {selectedWard.urbanHealthScore}/100
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border">
                <span className="text-muted-foreground text-[10px] block">Open Issues</span>
                <strong className="text-base text-slate-900">{selectedWard.pendingReports}</strong>
              </div>
              <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                <span className="text-red-700 text-[10px] block">Critical (≥8)</span>
                <strong className="text-base text-red-700">{selectedWard.criticalIssues}</strong>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <span className="text-emerald-700 text-[10px] block">Resolved</span>
                <strong className="text-base text-emerald-700">{selectedWard.resolvedReports}</strong>
              </div>
            </div>

            {/* List of active reports in this ward */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-800 block">Reports in this Ward</span>
              {selectedWard.reportsList.map((r) => (
                <div key={r.id} className="p-2 bg-slate-50 rounded text-xs flex items-center justify-between border">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-medium truncate text-slate-800">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground">{r.street}</p>
                  </div>
                  <Badge className={`text-[10px] ${getSeverityColor(r.severity).bg} ${getSeverityColor(r.severity).text}`}>
                    Sev {r.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
