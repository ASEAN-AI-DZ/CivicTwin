'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import {
  Camera, Maximize2, Minimize2, Wifi, WifiOff,
  MapPin, Clock, Shield, Search, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SensorCamera {
  id: number;
  sensor_code: string;
  type: string;
  status: string;
  last_active_at: string | null;
  metadata: Record<string, string> | null;
  edge?: { id: number; name: string };
}

interface YoloObject {
  id: number;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
  confidence: number;
}

function YoloOverlay({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState(30.0);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth || 640;
      canvas.height = canvas.clientHeight || 360;
    };
    resize();
    window.addEventListener('resize', resize);

    const vehicleTypes = ['car', 'motorbike', 'bus', 'truck'];
    const labelTranslations: Record<string, string> = {
      car: 'Car',
      motorbike: 'Motorbike',
      bus: 'Bus',
      truck: 'Truck'
    };

    let objects: YoloObject[] = [];
    const createObject = (side: 'left' | 'right' | 'random'): YoloObject => {
      const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const w = type === 'bus' || type === 'truck' ? 70 : type === 'car' ? 45 : 20;
      const h = type === 'bus' || type === 'truck' ? 45 : type === 'car' ? 30 : 15;
      
      const width = canvas.width || 640;
      const height = canvas.height || 360;

      let x = 0;
      let y = 0;
      let dx = 0;
      let dy = 0;

      const pathType = Math.random() > 0.5 ? 1 : 2;

      if (pathType === 1) {
        x = -w;
        y = height * 0.4 + Math.random() * (height * 0.1);
        dx = 1.2 + Math.random() * 1.5;
        dy = 0.4 + Math.random() * 0.4;
      } else {
        x = width;
        y = height * 0.6 + Math.random() * (height * 0.2);
        dx = -(1.2 + Math.random() * 1.5);
        dy = -(0.4 + Math.random() * 0.4);
      }

      return {
        id: Math.random(),
        type,
        x,
        y,
        w,
        h,
        dx,
        dy,
        confidence: Math.floor(82 + Math.random() * 17)
      };
    };

    // Seed mock vehicles
    for (let i = 0; i < 6; i++) {
      const obj = createObject('random');
      obj.x = Math.random() * (canvas.width || 640);
      obj.y = obj.dx > 0 
        ? (canvas.height || 360) * 0.4 + (obj.x / (canvas.width || 640)) * ((canvas.height || 360) * 0.2)
        : (canvas.height || 360) * 0.8 + ((obj.x - (canvas.width || 640)) / (canvas.width || 640)) * ((canvas.height || 360) * 0.2);
      objects.push(obj);
    }

    let animationFrameId: number;
    let lastFpsUpdate = performance.now();
    let frameCount = 0;

    const loop = (time: number) => {
      frameCount++;
      if (time - lastFpsUpdate > 1000) {
        setFps(Number(((frameCount * 1000) / (time - lastFpsUpdate)).toFixed(1)));
        frameCount = 0;
        lastFpsUpdate = time;
        setLatency(Math.floor(10 + Math.random() * 7));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      objects.forEach((obj) => {
        obj.x += obj.dx;
        obj.y += obj.dy;

        const scale = 0.5 + (obj.y / canvas.height) * 0.8;
        const currentW = obj.w * scale;
        const currentH = obj.h * scale;

        ctx.lineWidth = 1.5;
        const color = obj.type === 'car' ? '#06B6D4' : obj.type === 'motorbike' ? '#10B981' : '#F59E0B';
        ctx.strokeStyle = color;
        ctx.strokeRect(obj.x, obj.y, currentW, currentH);

        ctx.fillStyle = color;
        const label = `${labelTranslations[obj.type] || obj.type} ${obj.confidence}%`;
        ctx.font = '10px monospace';
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(obj.x, obj.y - 15, textWidth + 6, 15);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, obj.x + 3, obj.y - 4);
      });

      objects = objects.filter((obj) => {
        return obj.x > -120 && obj.x < canvas.width + 120 && obj.y > -100 && obj.y < canvas.height + 100;
      });

      while (objects.length < 6) {
        objects.push(createObject('left'));
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
      <div className="absolute top-4 left-24 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-20 text-[10px] font-mono text-cyan-400 space-y-0.5 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>YOLOv8x_Traffic</span>
        </div>
        <div className="text-white/60">FPS: <span className="text-white font-bold">{fps}</span></div>
        <div className="text-white/60">Latency: <span className="text-white font-bold">{latency}ms</span></div>
      </div>
    </>
  );
}

export default function CCTVPage() {
  const { t, locale } = useTranslation();
  const [sensors, setSensors] = useState<SensorCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [clockTime, setClockTime] = useState<string>('');

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sensors');
      const all: SensorCamera[] = res.data.data || [];
      // Filter camera-type sensors (including camera_feed)
      const cameras = all.filter(s => s.type === 'camera' || s.type === 'cctv' || s.type === 'camera_feed');
      setSensors(cameras.length > 0 ? cameras : all);
    } catch {
      setSensors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSensors(); }, []);

  // Live clock — client-only to avoid hydration mismatch
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setClockTime(fmt());
    const id = setInterval(() => setClockTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [locale]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sensors;
    const q = search.toLowerCase();
    return sensors.filter(s =>
      s.sensor_code.toLowerCase().includes(q) ||
      s.edge?.name?.toLowerCase().includes(q)
    );
  }, [sensors, search]);

  const onlineCount = sensors.filter(s => s.status === 'active' || s.status === 'online').length;
  const offlineCount = sensors.length - onlineCount;
  const expandedCam = sensors.find(s => s.id === expanded);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div id="cctv-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/50 p-6 rounded-2xl border border-border backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Camera className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight">{t('op.cctvMonitoring')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('op.camerasOnline', { online: String(onlineCount), total: String(sensors.length) })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1.5 text-emerald-500 border-emerald-500/20">
            <Wifi className="w-3 h-3" /> {onlineCount} {t('op.online')}
          </Badge>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1.5 text-rose-500 border-rose-500/20">
            <WifiOff className="w-3 h-3" /> {offlineCount} {t('op.offline')}
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchSensors} disabled={loading} className="gap-2 ml-2">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div id="cctv-search" className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('op.searchCamera')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 bg-card/50 backdrop-blur-md"
        />
      </div>

      {/* Expanded View */}
      {expanded !== null && expandedCam && (
        <Card className="bg-card/50 backdrop-blur-xl shadow-2xl border-border/80 overflow-hidden animate-in zoom-in-95 duration-300">
          <CardContent className="p-0 relative">
            <div className="aspect-video bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <video
                src={(expandedCam.metadata as any)?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-large-city-street-4509-large.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <YoloOverlay isPlaying={true} />

              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <Badge className="bg-rose-500/80 text-white border-0 text-[10px] uppercase tracking-wider gap-1 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" /> {t('op.live')}
                </Badge>
                <Badge variant="outline" className="bg-black/40 text-[10px] border-white/10 text-white uppercase tracking-wider">
                  {(expandedCam.metadata as any)?.resolution || '1080p'}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setExpanded(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors border border-white/10"
                >
                  <Minimize2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 text-xs text-white/60 font-mono flex items-center gap-2 z-20 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                <Clock className="w-3 h-3" /> {clockTime}
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-white/60 font-mono z-20 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                {(expandedCam.metadata as any)?.manufacturer || 'Axis'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-card/30 border-dashed">
          <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t('op.noCamerasFound')}</p>
        </Card>
      ) : (
        <div id="cctv-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cam) => {
            const isOnline = cam.status === 'active' || cam.status === 'online';
            const videoUrl = (cam.metadata as any)?.video_url;
            return (
              <Card
                key={cam.id}
                className={`bg-card/40 backdrop-blur-xl shadow-lg border-border/80 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all group ${
                  !isOnline ? 'opacity-60' : ''
                } ${expanded === cam.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => isOnline && setExpanded(cam.id)}
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-950/80 flex items-center justify-center relative overflow-hidden">
                    {isOnline && videoUrl ? (
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <Camera className="w-10 h-10 text-muted-foreground/20" />
                    )}

                    <div className="absolute top-3 left-3 z-10">
                      {isOnline ? (
                        <Badge className="bg-emerald-500/80 text-white border-0 text-[9px] uppercase tracking-wider gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> {t('op.live')}
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/60 text-white border-0 text-[9px] uppercase tracking-wider gap-1">
                          <WifiOff className="w-2.5 h-2.5" /> {t('op.offline')}
                        </Badge>
                      )}
                    </div>

                    {isOnline && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors border border-white/10">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                    {cam.last_active_at && (
                      <div className="absolute bottom-2 right-3 text-[10px] text-white/40 font-mono z-10 bg-black/40 px-1.5 py-0.5 rounded">
                        {new Date(cam.last_active_at).toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{cam.sensor_code}</p>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" /> {cam.edge?.name || t('op.unknownLocation')}
                        </p>
                      </div>
                      <Shield className={`w-4 h-4 shrink-0 ${isOnline ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
