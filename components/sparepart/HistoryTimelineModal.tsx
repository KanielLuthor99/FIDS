import React from 'react';
import { History, X, RefreshCw, ClipboardList } from 'lucide-react';
import { ReplacementHistory } from '@/lib/api';

interface HistoryTimelineModalProps {
  isOpen: boolean;
  sn: string;
  label: string;
  isLoading: boolean;
  snHistory: ReplacementHistory[];
  onClose: () => void;
}

export default function HistoryTimelineModal({
  isOpen,
  sn,
  label,
  isLoading,
  snHistory,
  onClose,
}: HistoryTimelineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-700"><History className="w-5 h-5" /></span>
            <div>
              <h3 className="text-base font-bold text-slate-800">Riwayat Tracking Serial Number</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <code className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-sm border border-sky-200">
                  {sn}
                </code>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mb-2" />
              <p className="text-sm">Memuat riwayat SN...</p>
            </div>
          ) : snHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
              <ClipboardList className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">Belum ada riwayat pertukaran untuk SN ini.</p>
              <p className="text-xs text-center">SN ini belum pernah terlibat dalam proses swap komponen yang tercatat.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-3">
                Ditemukan <strong>{snHistory.length}</strong> catatan riwayat untuk SN ini (sebagai unit yang dipasang maupun dilepas).
              </p>
              {snHistory.map((h) => {
                const isOldUnit = h.old_sn === sn;
                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-2xl border ${
                      isOldUnit
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-emerald-200 bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOldUnit
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isOldUnit ? '⬆️ Dilepas / Dicopot dari Aset' : '⬇️ Dipasang ke Aset'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(h.replaced_at).toLocaleString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide mb-0.5">Aset / Lokasi</span>
                        <div className="font-bold text-slate-800">{h.asset_code}</div>
                        <div className="text-slate-500 text-[11px]">{h.asset_name}</div>
                        <div className="text-slate-400 text-[10px]">{h.terminal} · {h.location_area}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide mb-0.5">Detail Swap</span>
                        <div className="text-slate-700 text-[11px]">Komponen: <strong>{h.component_type}</strong></div>
                        <div className="text-slate-700 text-[11px]">Alasan: <strong>{h.reason}</strong></div>
                        <div className="text-slate-700 text-[11px]">Teknisi: <strong>{h.technician_name}</strong></div>
                      </div>
                      {isOldUnit ? (
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide mb-0.5">Disposisi Setelah Dicopot</span>
                          <div className="font-semibold text-rose-700 text-[11px]">{h.old_disposal || h.old_status}</div>
                          {h.old_disposal_loc && <div className="text-slate-500 text-[10px]">→ {h.old_disposal_loc}</div>}
                          <div className="text-slate-500 text-[11px] mt-1">Diganti oleh: <code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 rounded">{h.new_sn}</code> ({h.new_brand} {h.new_model})</div>
                        </div>
                      ) : (
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide mb-0.5">Menggantikan Unit Lama</span>
                          <div className="text-slate-500 text-[11px]">SN lama: <code className="font-mono text-rose-700 bg-rose-50 px-1.5 rounded">{h.old_sn}</code> ({h.old_brand} {h.old_model})</div>
                          {h.new_origin && <div className="text-slate-500 text-[10px] mt-0.5">Asal unit: {h.new_origin}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
