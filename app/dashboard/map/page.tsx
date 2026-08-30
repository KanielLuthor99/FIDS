'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiGetPins, apiGetAssets, MapPin, FIDSAsset } from '@/lib/api';
import {
  MapPin as MapPinIcon,
  Tv,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Wrench,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function TerminalMapPage() {
  const [selectedTerminal, setSelectedTerminal] = useState<'Terminal 1' | 'Terminal 2' | 'Terminal 3'>('Terminal 3');
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

  const { data: pins, isLoading: isPinsLoading } = useQuery({
    queryKey: ['map-pins', selectedTerminal],
    queryFn: () => apiGetPins(selectedTerminal),
  });

  const { data: assets } = useQuery({
    queryKey: ['assets-map-all'],
    queryFn: () => apiGetAssets('', '', ''),
  });

  const activeAssetDetail = assets?.find(a => a.id === selectedPin?.asset_id);

  return (
    <div className="space-y-6">
      {/* Page Title & Terminal Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0d4440] text-emerald-300">
              <MapPinIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-[#0d4440]">
              Interactive Terminal Visual Map
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Denah lokasi posisi real-time monitor FIDS di area Keberangkatan, Kedatangan, Gate & Baggage Claim.
          </p>
        </div>

        {/* Terminal Switcher Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white shadow-sm border border-emerald-900/10 self-start">
          {(['Terminal 1', 'Terminal 2', 'Terminal 3'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTerminal(t);
                setSelectedPin(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedTerminal === t
                  ? 'bg-gradient-to-r from-[#0d4440] to-[#1a6b65] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0d4440] hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-emerald-900/10 text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-700">Status Pins:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse"></span>
            <span className="font-medium text-slate-700">🟢 Aktif Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100 animate-pulse"></span>
            <span className="font-medium text-slate-700">🔴 Butuh Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>
            <span className="font-medium text-slate-700">🟡 Cadangan Gudang</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px]">
          *Klik pada pin di peta untuk membuka Card Detail Perangkat
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative min-h-[480px] bg-gradient-to-br from-slate-900 via-[#0d4440] to-slate-900 rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden flex flex-col justify-between">
          {/* Subtle Airport Terminal Architectural Blueprint Vector Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#26938b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Terminal Blueprint Outlines */}
              <rect x="5%" y="15%" width="90%" height="70%" rx="20" fill="none" stroke="#ddeee9" strokeWidth="2" strokeDasharray="6,6" />
              <rect x="15%" y="25%" width="30%" height="50%" rx="10" fill="none" stroke="#26938b" strokeWidth="1.5" />
              <rect x="55%" y="25%" width="30%" height="50%" rx="10" fill="none" stroke="#26938b" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Map Header Label Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Visual Layout {selectedTerminal} — Bandara Soekarno-Hatta (CGK)
            </div>
            <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/20">
              Live Map Latency: 12ms
            </div>
          </div>

          {/* Interactive Pins Container */}
          <div className="relative z-10 my-auto w-full h-[360px] border border-white/10 rounded-2xl bg-slate-950/40 backdrop-blur-sm overflow-hidden">
            {/* Terminal Map Floorplan Zone Labels */}
            <div className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-emerald-300/60 pointer-events-none">
              Zone A: Departure Lounge & Check-in
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-emerald-300/60 pointer-events-none">
              Zone B: Arrival & Baggage Claim
            </div>

            {/* Pins Rendering */}
            {pins?.map((pin) => {
              const isSelected = selectedPin?.asset_id === pin.asset_id;

              let colorBg = 'bg-emerald-500 shadow-emerald-500/50';
              let ringColor = 'ring-emerald-300';
              if (pin.status === 'Maintenance') {
                colorBg = 'bg-rose-500 shadow-rose-500/50';
                ringColor = 'ring-rose-300';
              } else if (pin.status === 'In Storage') {
                colorBg = 'bg-amber-500 shadow-amber-500/50';
                ringColor = 'ring-amber-300';
              }

              return (
                <div
                  key={pin.asset_id}
                  style={{ left: `${pin.x_percent}%`, top: `${pin.y_percent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => setSelectedPin(pin)}
                >
                  {/* Pin Dot */}
                  <div className={`relative flex items-center justify-center`}>
                    <span className={`absolute w-8 h-8 rounded-full ${colorBg} opacity-40 animate-ping`} />
                    <button
                      className={`relative w-8 h-8 rounded-full ${colorBg} ${
                        isSelected ? `ring-4 ${ringColor} scale-125 z-30` : 'hover:scale-110'
                      } text-white font-bold text-xs flex items-center justify-center shadow-lg transition-all duration-200`}
                    >
                      <Tv className="w-4 h-4" />
                    </button>

                    {/* Tooltip Label on Hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                      <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 shadow-xl">
                        {pin.code} ({pin.health_score}%)
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-white/20" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Status */}
          <div className="relative z-10 text-xs text-emerald-200/70 flex items-center justify-between">
            <span>Total Pins di {selectedTerminal}: {pins?.length || 0} unit FIDS</span>
            <span>Tekan pin mana saja untuk melihat detail spesifikasi</span>
          </div>
        </div>

        {/* Selected Asset Floating Card Panel */}
        <div className="lg:col-span-1">
          {selectedPin ? (
            <div className="glass-card rounded-3xl p-6 border border-[#1a6b65]/30 space-y-5 shadow-2xl relative animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-teal-50 text-[#1a6b65]">
                    <Tv className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      {selectedPin.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {selectedPin.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Health Score Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status Perangkat:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedPin.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedPin.status === 'Maintenance'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {selectedPin.status === 'Active' && '🟢 Aktif Normal'}
                    {selectedPin.status === 'Maintenance' && '🔴 Butuh Maintenance'}
                    {selectedPin.status === 'In Storage' && '🟡 Cadangan Gudang'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Health Score:</span>
                    <span className="font-bold text-slate-900">{selectedPin.health_score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedPin.health_score >= 80
                          ? 'bg-emerald-500'
                          : selectedPin.health_score >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${selectedPin.health_score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Technical Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Terminal & Zone:</span>
                  <span className="font-semibold text-slate-800">{selectedPin.terminal} • {selectedPin.location_area}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Kategori FIDS:</span>
                  <span className="font-semibold text-slate-800">{selectedPin.category}</span>
                </div>
                {activeAssetDetail && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Merk & Hardware:</span>
                      <span className="font-semibold text-slate-800">{activeAssetDetail.mini_pc_brand || activeAssetDetail.brand || activeAssetDetail.monitor_brand || 'N/A'} {activeAssetDetail.mini_pc_model || ''}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Serial Number:</span>
                      <span className="font-mono text-slate-800">{activeAssetDetail.mini_pc_sn || activeAssetDetail.serial_number || activeAssetDetail.monitor_sn || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">IP Address:</span>
                      <span className="font-mono text-slate-800">{activeAssetDetail.ip_address}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button to Form Maintenance */}
              <div className="pt-2">
                <Link
                  href={`/dashboard/maintenance?assetId=${selectedPin.asset_id}&code=${selectedPin.code}`}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#0d4440] to-[#1a6b65] text-white font-semibold text-xs shadow-lg hover:shadow-emerald-900/30 transition-all active:scale-[0.98]"
                >
                  <Wrench className="w-4 h-4 text-emerald-300" />
                  <span>🛠️ Buat Log Maintenance Perangkat Ini</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-slate-200 text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Tidak ada Pin yang Dipilih</h4>
              <p className="text-xs text-slate-500">
                Klik salah satu pin pada denah visual {selectedTerminal} di sebelah kiri untuk melihat rincian spesifikasi & status kesehatan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
