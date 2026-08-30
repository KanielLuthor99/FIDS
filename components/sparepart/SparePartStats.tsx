import React from 'react';
import { Tag, Cpu, Monitor, AlertTriangle } from 'lucide-react';
import { SparePart } from '@/lib/api';

interface SparePartStatsProps {
  spareParts: SparePart[];
}

export default function SparePartStats({ spareParts }: SparePartStatsProps) {
  const totalRegisteredSN = spareParts.length;
  const readyMiniPCs = spareParts.filter((p) => p.category === 'Mini PC' && p.status === 'Available').length;
  const readyMonitors = spareParts.filter((p) => p.category === 'Monitor' && p.status === 'Available').length;
  const underRepairOrScrapped = spareParts.filter((p) => p.status === 'Under-Repair' || p.status === 'Scrapped').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total SN Terdata</span>
          <span className="p-2 rounded-xl bg-slate-100 text-slate-700"><Tag className="w-4 h-4" /></span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{totalRegisteredSN}</span>
          <span className="text-xs text-slate-400 font-medium">Unit Hardware</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Itemized unik per Serial Number</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Mini PC (Ready Stock)</span>
          <span className="p-2 rounded-xl bg-blue-100 text-blue-700"><Cpu className="w-4 h-4" /></span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-700">{readyMiniPCs}</span>
          <span className="text-xs text-blue-600/80 font-medium">Unit Cadangan</span>
        </div>
        <p className="text-[11px] text-blue-500 mt-1">Siap pasang / pre-installed FIDS client</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-purple-200/80 shadow-sm bg-gradient-to-br from-white to-purple-50/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Monitor (Ready Stock)</span>
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700"><Monitor className="w-4 h-4" /></span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-700">{readyMonitors}</span>
          <span className="text-xs text-purple-600/80 font-medium">Panel Layar</span>
        </div>
        <p className="text-[11px] text-purple-500 mt-1">Siap deploy ke gate & check-in row</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Diservis / Afkir</span>
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700"><AlertTriangle className="w-4 h-4" /></span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-700">{underRepairOrScrapped}</span>
          <span className="text-xs text-amber-600/80 font-medium">Unit Non-Aktif</span>
        </div>
        <p className="text-[11px] text-amber-600 mt-1">Eks copotan atau proses klaim garansi</p>
      </div>
    </div>
  );
}
