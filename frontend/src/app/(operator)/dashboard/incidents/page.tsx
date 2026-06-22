'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, Plus, Eye, Clock, Filter, AlertCircle, CheckCircle2, 
  Search, RotateCcw, Car, Hammer, CloudRain, HelpCircle, Activity, 
  ShieldAlert, MapPin, Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Incident {
  id: number;
  title: string;
  type: string;
  severity: string;
  status: string;
  source: string;
  created_at: string;
}

export default function IncidentsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', severity: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));
      if (filter.status !== 'all') params.set('status', filter.status);
      if (filter.severity !== 'all') params.set('severity', filter.severity);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await api.get(`/incidents?${params}`);
      setIncidents(res.data.data || []);
      setTotal(res.data.total || res.data.data?.length || 0);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  useEffect(() => {
    fetchIncidents();
  }, [filter, debouncedSearch, page]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await api.post('/incidents', {
        title: form.get('title'),
        type: form.get('type'),
        severity: form.get('severity'),
        source: 'operator',
        description: form.get('description'),
        location_name: form.get('location_name') || 'Cầu Rồng, Hải Châu, Đà Nẵng',
        latitude: 16.068,
        longitude: 108.2122,
      });
      setCreateOpen(false);
      fetchIncidents();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setFilter({ status: 'all', severity: 'all' });
    setSearchQuery('');
  };

  // Stats computation
  const accidentCount = incidents.filter(i => i.type === 'accident').length;
  const congestionCount = incidents.filter(i => i.type === 'congestion').length;
  const criticalCount = incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length;

  const isFilterActive = filter.status !== 'all' || filter.severity !== 'all' || searchQuery !== '';

  // Icon mapping for incident types
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <Car className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'congestion':
        return <Activity className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'construction':
        return <Hammer className="w-4 h-4 text-yellow-500 shrink-0" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  // Styled badges for severity
  const renderSeverityBadge = (severity: string) => {
    const labels: Record<string, string> = {
      low: locale === 'vi' ? 'Thấp' : 'Low',
      medium: locale === 'vi' ? 'Trung bình' : 'Medium',
      high: locale === 'vi' ? 'Cao' : 'High',
      critical: locale === 'vi' ? 'Cực kỳ nghiêm trọng' : 'Critical'
    };
    const styles: Record<string, string> = {
      low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      high: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      critical: 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[severity] || 'text-slate-500 bg-slate-500/10 border-slate-500/20'}`}>
        {labels[severity] || severity}
      </span>
    );
  };

  // Styled badges for status
  const renderStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      open: locale === 'vi' ? 'Đang mở' : 'Open',
      investigating: locale === 'vi' ? 'Đang điều tra' : 'Investigating',
      resolved: locale === 'vi' ? 'Đã giải quyết' : 'Resolved',
      closed: locale === 'vi' ? 'Đã đóng' : 'Closed'
    };
    const styles: Record<string, string> = {
      open: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      investigating: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      resolved: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      closed: 'text-slate-500 bg-slate-500/10 border-slate-500/20'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'text-slate-500 bg-slate-500/10 border-slate-500/20'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Banner - Redesigned with Glassmorphism & Accent Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-card/85 to-card/50 p-6 sm:p-8 rounded-2xl border border-border backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/5">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              {t('op.trafficIncidents')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 flex items-center gap-2 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              {t('op.activeIncidentsCount', { n: String(total) })}
            </p>
          </div>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger className="z-10 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/95 h-11 px-5 shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="w-5 h-5 mr-2" /> {t('op.reportIncident')}
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl border border-border bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                {t('op.reportNewIncident')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {t('op.reportNewDesc')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('op.titleLabel')}</label>
                <Input name="title" required placeholder={t('op.titlePlaceholder')} className="rounded-lg h-10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('op.incidentType')}</label>
                  <select name="type" required className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="accident">{t('enums.incidentType.accident')}</option>
                    <option value="congestion">{t('enums.incidentType.congestion')}</option>
                    <option value="construction">{t('enums.incidentType.construction')}</option>
                    <option value="weather">{t('enums.incidentType.weather')}</option>
                    <option value="other">{t('enums.incidentType.other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('common.severity')}</label>
                  <select name="severity" required className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="low">{t('enums.incidentSeverity.low')}</option>
                    <option value="medium">{t('enums.incidentSeverity.medium')}</option>
                    <option value="high">{t('enums.incidentSeverity.high')}</option>
                    <option value="critical">{t('enums.incidentSeverity.critical')}</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {locale === 'vi' ? 'Vị trí / Địa điểm' : 'Location Name'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    name="location_name" 
                    required 
                    placeholder={locale === 'vi' ? 'Ví dụ: Cầu Rồng, Hải Châu, Đà Nẵng' : 'Example: Dragon Bridge, Da Nang'} 
                    className="rounded-lg h-10 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('op.detailsLabel')}</label>
                <textarea name="description" rows={3} required className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none" placeholder={t('op.detailsPlaceholder')} />
              </div>
              <DialogFooter className="pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)} disabled={submitting}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={submitting} className="min-w-[100px]">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('op.submitReport')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total incidents */}
        <Card className="p-4 bg-gradient-to-br from-card/80 to-card/40 border border-border backdrop-blur-md shadow-md relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {locale === 'vi' ? 'Tổng Sự Cố Tìm Thấy' : 'Total Incidents Found'}
              </p>
              <h3 className="text-3xl font-bold tracking-tight mt-1 tabular-nums">{total}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {locale === 'vi' ? 'Theo bộ lọc hiện tại' : 'In current filter'}
          </p>
        </Card>

        {/* Card 2: Accidents */}
        <Card className="p-4 bg-gradient-to-br from-card/80 to-card/40 border border-border backdrop-blur-md shadow-md relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {locale === 'vi' ? 'Tai nạn & Va chạm' : 'Accidents'}
              </p>
              <h3 className="text-3xl font-bold tracking-tight mt-1 tabular-nums">{accidentCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {locale === 'vi' ? 'Đang hiển thị trên trang này' : 'Visible on this page'}
          </p>
        </Card>

        {/* Card 3: Congestion */}
        <Card className="p-4 bg-gradient-to-br from-card/80 to-card/40 border border-border backdrop-blur-md shadow-md relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {locale === 'vi' ? 'Ùn tắc giao thông' : 'Congestions'}
              </p>
              <h3 className="text-3xl font-bold tracking-tight mt-1 tabular-nums">{congestionCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {locale === 'vi' ? 'Đang hiển thị trên trang này' : 'Visible on this page'}
          </p>
        </Card>

        {/* Card 4: Critical/High */}
        <Card className="p-4 bg-gradient-to-br from-card/80 to-card/40 border border-border backdrop-blur-md shadow-md relative overflow-hidden group hover:border-rose-600/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/5 rounded-full blur-2xl group-hover:bg-rose-600/10 transition-all" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {locale === 'vi' ? 'Nghiêm trọng / Cao' : 'Critical / High'}
              </p>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-rose-500 tabular-nums">{criticalCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {locale === 'vi' ? 'Cần tập trung điều phối xử lý' : 'Requires immediate routing'}
          </p>
        </Card>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/30 p-4 rounded-xl border border-border backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          
          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'vi' ? 'Tìm kiếm sự cố...' : 'Search incidents...'}
              className="rounded-lg h-9 pl-9 bg-card/65 border-border/80 focus-visible:ring-orange-500"
            />
          </div>

          {/* Status filter */}
          <Select value={filter.status} onValueChange={(val) => setFilter({ ...filter, status: val || 'all' })}>
            <SelectTrigger className="w-[160px] h-9 rounded-lg bg-card/65 border-border/80 focus:ring-orange-500">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder={t('common.status')} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">{t('op.anyStatus')}</SelectItem>
              <SelectItem value="open">{t('enums.incidentStatus.open')}</SelectItem>
              <SelectItem value="investigating">{t('enums.incidentStatus.investigating')}</SelectItem>
              <SelectItem value="resolved">{t('enums.incidentStatus.resolved')}</SelectItem>
              <SelectItem value="closed">{t('enums.incidentStatus.closed')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Severity filter */}
          <Select value={filter.severity} onValueChange={(val) => setFilter({ ...filter, severity: val || 'all' })}>
            <SelectTrigger className="w-[160px] h-9 rounded-lg bg-card/65 border-border/80 focus:ring-orange-500">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder={t('common.severity')} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">{t('op.anySeverity')}</SelectItem>
              <SelectItem value="low">{t('enums.incidentSeverity.low')}</SelectItem>
              <SelectItem value="medium">{t('enums.incidentSeverity.medium')}</SelectItem>
              <SelectItem value="high">{t('enums.incidentSeverity.high')}</SelectItem>
              <SelectItem value="critical">{t('enums.incidentSeverity.critical')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {isFilterActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetFilters}
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-lg flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {locale === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters'}
          </Button>
        )}
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden bg-card/40 border border-border/70 backdrop-blur-xl shadow-2xl rounded-2xl">
        {loading ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-card/85 border-b border-border/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] font-bold text-xs text-muted-foreground">{t('common.id')}</TableHead>
                  <TableHead className="font-bold text-xs text-muted-foreground">{t('op.incidentRefCol')}</TableHead>
                  <TableHead className="text-center font-bold text-xs text-muted-foreground">{t('common.severity')}</TableHead>
                  <TableHead className="text-center font-bold text-xs text-muted-foreground">{t('common.status')}</TableHead>
                  <TableHead className="font-bold text-xs text-muted-foreground">{t('op.timestamp')}</TableHead>
                  <TableHead className="text-right font-bold text-xs text-muted-foreground">{t('op.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-border/40">
                    <TableCell><div className="h-4 w-8 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="space-y-2"><div className="h-4 w-44 bg-muted animate-pulse rounded" /><div className="h-3.5 w-28 bg-muted animate-pulse rounded" /></div></TableCell>
                    <TableCell className="text-center"><div className="h-5.5 w-16 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                    <TableCell className="text-center"><div className="h-5.5 w-16 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                    <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-secondary/60 flex items-center justify-center mb-2 shadow-inner border">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/85" />
            </div>
            <p className="font-bold text-base text-foreground">{t('op.noIncidentsMatch')}</p>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              {locale === 'vi' 
                ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.' 
                : 'Try altering your keywords or filter parameters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-card/85 border-b border-border/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[85px] font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('common.id')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('op.incidentRefCol')}</TableHead>
                  <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('common.severity')}</TableHead>
                  <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('common.status')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('op.timestamp')}</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">{t('op.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => {
                  // Severity border color helper
                  const getSeverityLeftBorder = (sev: string) => {
                    switch (sev) {
                      case 'critical': return 'border-l-4 border-l-rose-500';
                      case 'high': return 'border-l-4 border-l-orange-500';
                      case 'medium': return 'border-l-4 border-l-amber-500';
                      case 'low': return 'border-l-4 border-l-emerald-500';
                      default: return '';
                    }
                  };

                  return (
                    <TableRow 
                      key={inc.id} 
                      className={`group cursor-pointer hover:bg-accent/40 transition-all duration-200 border-b border-border/40 hover:scale-[1.003] ${getSeverityLeftBorder(inc.severity)}`}
                      onClick={() => router.push(`/dashboard/incidents/${inc.id}`)}
                    >
                      <TableCell className="font-heading text-xs font-semibold text-muted-foreground py-4">
                        #{inc.id}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                            {inc.title}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize flex items-center gap-1.5 mt-1 font-medium">
                            {getIncidentIcon(inc.type)}
                            {t(`enums.incidentType.${inc.type}`)} 
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/35 inline-block" /> 
                            <span className="truncate max-w-[130px] font-semibold text-muted-foreground/80">
                              {t(`enums.incidentSource.${inc.source}`)}
                            </span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderSeverityBadge(inc.severity)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderStatusBadge(inc.status)}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-muted-foreground py-4">
                        <div className="flex items-center gap-2" suppressHydrationWarning>
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/75" />
                          {new Date(inc.created_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 bg-secondary/80 hover:bg-primary hover:text-primary-foreground shadow-sm transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            {lastPage > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card/25">
                <p className="text-xs font-semibold text-muted-foreground">
                  {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} {locale === 'vi' ? 'trong tổng số' : 'of'} {total}
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page <= 1}
                    className="h-8 w-10 px-0 rounded-lg hover:bg-accent border-border/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-bold px-2 tabular-nums">
                    {page} / {lastPage}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(lastPage, p + 1))} 
                    disabled={page >= lastPage}
                    className="h-8 w-10 px-0 rounded-lg hover:bg-accent border-border/80"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
