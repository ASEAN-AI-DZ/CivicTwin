'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import {
  ShieldCheck, Users, Database, Settings, ActivitySquare,
  TrendingUp, Clock, Shield, ChevronRight, Zap, AlertTriangle, Loader2, Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// QUICK_LINKS moved inside component to use t()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Stats = Record<string, any>;

export default function AdminPage() {
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const QUICK_LINKS = [
    { href: '/admin/users', icon: Users, label: t('quickLinks.userManagement'), description: t('quickLinks.userManagementDesc'), color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { href: '/admin/master', icon: Database, label: t('quickLinks.masterData'), description: t('quickLinks.masterDataDesc'), color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { href: '/admin/settings', icon: Settings, label: t('quickLinks.systemSettings'), description: t('quickLinks.systemSettingsDesc'), color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { href: '/admin/logs', icon: ActivitySquare, label: t('quickLinks.systemLogs'), description: t('quickLinks.systemLogsDesc'), color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admin/logs?per_page=5'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) {
          setStats(statsRes.value.data.data);
        }
        if (logsRes.status === 'fulfilled' && logsRes.value.data?.data) {
          setLogs(logsRes.value.data.data);
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // KPI definitions with gradient colors for icon containers and stat bars
  const KPI_GRADIENTS = [
    { from: 'from-blue-500', to: 'to-blue-600', bar: '#3b82f6' },
    { from: 'from-rose-500', to: 'to-rose-600', bar: '#f43f5e' },
    { from: 'from-cyan-500', to: 'to-cyan-600', bar: '#06b6d4' },
    { from: 'from-amber-500', to: 'to-amber-600', bar: '#f59e0b' },
    { from: 'from-violet-500', to: 'to-violet-600', bar: '#8b5cf6' },
    { from: 'from-orange-500', to: 'to-orange-600', bar: '#f97316' },
  ];

  const kpis = stats ? [
    { label: t('admin.totalUsers'), value: stats.total_users, icon: <Users className="w-5 h-5 text-white" /> },
    { label: t('admin.activeIncidents'), value: stats.active_incidents, icon: <AlertTriangle className="w-5 h-5 text-white" /> },
    { label: t('admin.mapNodes'), value: stats.total_nodes, icon: <Database className="w-5 h-5 text-white" /> },
    { label: t('admin.mapEdges'), value: stats.total_edges, icon: <Zap className="w-5 h-5 text-white" /> },
    { label: t('admin.aiSuccess'), value: stats.total_predictions > 0 ? `${Math.round((stats.completed_predictions / stats.total_predictions) * 100)}%` : 'N/A', icon: <Brain className="w-5 h-5 text-white" /> },
    { label: t('admin.pendingActions'), value: stats.pending_recommendations, icon: <Clock className="w-5 h-5 text-white" /> },
  ] : [];

  // Compute rough bar width from KPI value
  const getBarWidth = (value: string | number): number => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      return isNaN(num) ? 15 : Math.min(num, 100);
    }
    if (value === 0) return 5;
    return Math.min(Math.max(Math.round((Number(value) / (Number(value) + 20)) * 100), 8), 95);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/50 p-6 rounded-2xl border border-border backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">{t('admin.title')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('admin.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 text-teal-500" />
          {t('admin.superAdminAccess')}
        </div>
      </div>

      {/* KPI Row */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {kpis.map((stat, i) => (
            <Card key={i} className="card-lift bg-card/50 backdrop-blur-xl border-border/80">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${KPI_GRADIENTS[i].from} ${KPI_GRADIENTS[i].to} flex items-center justify-center shadow-md shrink-0`}>
                  {stat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-heading font-black">{stat.value}</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <div className="stat-bar mt-3">
                    <div className="stat-bar-fill" style={{ width: `${getBarWidth(stat.value)}%`, background: KPI_GRADIENTS[i].bar }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="card-lift relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/80 hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{link.label}</h3>
                <p className="text-xs text-muted-foreground font-medium">{link.description}</p>
                <div className="flex justify-end mt-3">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1.5 group-hover:text-primary transition-all" />
                </div>
              </CardContent>
              {/* Gradient hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats breakdown */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Incidents by Type */}
          <Card className="bg-card/40 backdrop-blur-xl shadow-2xl border-border/80">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                {t('admin.incidentsByType')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {(() => {
                  const entries = Object.entries(stats.incidents_by_type || {});
                  const maxCount = Math.max(...entries.map(([, c]) => Number(c)), 1);
                  return entries.map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-transparent hover:border-border transition-all">
                      <span className="text-sm font-medium capitalize shrink-0">{t(`enums.incidentType.${type}`)}</span>
                      <div className="flex-1 mx-3">
                        <div className="stat-bar">
                          <div className="stat-bar-fill bg-orange-500/80" style={{ width: `${(Number(count) / maxCount) * 100}%` }} />
                        </div>
                      </div>
                      <Badge variant="outline" className="font-heading font-bold shrink-0">{String(count)}</Badge>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Users by Role */}
          <Card className="bg-card/40 backdrop-blur-xl shadow-2xl border-border/80">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                {t('admin.usersByRole')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {(() => {
                  const entries = Object.entries(stats.users_by_role || {});
                  const maxCount = Math.max(...entries.map(([, c]) => Number(c)), 1);
                  return entries.map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-transparent hover:border-border transition-all">
                      <span className="text-sm font-medium shrink-0">{t(`enums.roles.${role}`)}</span>
                      <div className="flex-1 mx-3">
                        <div className="stat-bar">
                          <div className="stat-bar-fill bg-blue-500/80" style={{ width: `${(Number(count) / maxCount) * 100}%` }} />
                        </div>
                      </div>
                      <Badge variant="outline" className="font-heading font-bold shrink-0">{String(count)}</Badge>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card className="bg-card/40 backdrop-blur-xl shadow-2xl border-border/80">
        <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ActivitySquare className="w-4 h-4 text-violet-500" />
            {t('admin.recentActivity')}
          </CardTitle>
          <Link href="/admin/logs" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            {t('admin.viewAll')} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t('admin.noActivityLogs')}</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div key={log.id} className="timeline-item flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-transparent hover:border-border transition-all">
                  <div className="p-1.5 rounded-lg bg-secondary/80 shrink-0 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${log.event === 'created' ? 'bg-emerald-500' : log.event === 'updated' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1" suppressHydrationWarning>
                        <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </p>
                      {log.causer && (
                        <span className="text-[11px] text-muted-foreground">by {log.causer.name}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wider shrink-0">
                    {log.event || log.log_name}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
