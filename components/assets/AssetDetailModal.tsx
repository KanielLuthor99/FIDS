import React from 'react';
import Link from 'next/link';
import { X, Tv, Cpu, Monitor, Wrench, Layers } from 'lucide-react';
import { FIDSAsset } from '@/lib/api';

interface AssetDetailModalProps {
  asset: FIDSAsset | null;
  onClose: () => void;
}

export default function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-900/10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <span className="p-3 rounded-2xl bg-[#0d4440] text-emerald-300">
            <Tv className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                {asset.code}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Terminal {asset.terminal}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              {asset.name}
            </h2>
          </div>
        </div>

        {/* General Metadata */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Area Lokasi</span>
            <span className="font-bold text-slate-800">{asset.location_area}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">IP Address Network</span>
            <span className="font-mono font-bold text-emerald-800">{asset.ip_address || 'N/A'}</span>
          </div>
        </div>

        {/* Separate Hardware Component Cards */}
        <div className="space-y-4">
          {/* Component Card 1: Mini PC */}
          <div className="border border-blue-200 rounded-2xl p-4 bg-blue-50/20">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2 mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h3>Komponen 1: Mini PC Controller</h3>
              </div>
              <Link
                href={`/dashboard/maintenance?assetId=${asset.id}&code=${asset.code}&target=Mini+PC`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-xl transition-colors"
              >
                <Wrench className="w-3 h-3" />
                <span>Perbaiki / Ganti Mini PC Saja</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Merk & Model</span>
                <span className="font-bold text-slate-900">{asset.mini_pc_brand || '-'} {asset.mini_pc_model}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Serial Number (S/N)</span>
                <span className="font-mono text-slate-800 font-semibold">{asset.mini_pc_sn || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Sistem Operasi (OS)</span>
                <span className="font-semibold text-slate-800">{asset.mini_pc_os || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">RAM & Storage</span>
                <span className="font-semibold text-slate-800">{asset.mini_pc_ram || '-'} / {asset.mini_pc_disk || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Support Port</span>
                <span className="font-semibold text-slate-800">{asset.mini_pc_ports || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Kondisi Mini PC</span>
                <span className="font-bold text-blue-800">{asset.mini_pc_condition || '100%'}</span>
              </div>
            </div>
          </div>

          {/* Component Card 2: Commercial Monitor */}
          <div className="border border-purple-200 rounded-2xl p-4 bg-purple-50/20">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2 mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-purple-950">
                <Monitor className="w-4 h-4 text-purple-600" />
                <h3>Komponen 2: Commercial Display Panel / Monitor</h3>
              </div>
              <Link
                href={`/dashboard/maintenance?assetId=${asset.id}&code=${asset.code}&target=Monitor`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-xl transition-colors"
              >
                <Wrench className="w-3 h-3" />
                <span>Perbaiki / Ganti Monitor Saja</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Merk & Model</span>
                <span className="font-bold text-slate-900">{asset.monitor_brand || '-'} {asset.monitor_model}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Ukuran Panel</span>
                <span className="font-bold text-purple-800">{asset.monitor_size || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Serial Number (S/N)</span>
                <span className="font-mono text-slate-800 font-semibold">{asset.monitor_sn || '-'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Converter Cable</span>
                <span className="font-semibold text-slate-800">{asset.monitor_converter || 'Direct Cable'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Kondisi Monitor</span>
                <span className="font-bold text-purple-800">{asset.monitor_condition || '100%'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tahun Pengadaan</span>
                <span className="font-semibold text-slate-800">{asset.monitor_year || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">ID: {asset.id}</span>
          <Link
            href={`/dashboard/maintenance?assetId=${asset.id}&code=${asset.code}&target=Sepaket`}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0d4440] to-[#1a6b65] text-white text-xs font-bold shadow-lg hover:shadow-emerald-950/30 transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-300" />
            <span>Log Maintenance Sepaket (Keduanya)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
