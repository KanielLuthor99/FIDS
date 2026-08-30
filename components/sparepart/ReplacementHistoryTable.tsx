import React from 'react';
import { FileCheck } from 'lucide-react';
import { ReplacementHistory } from '@/lib/api';

interface ReplacementHistoryTableProps {
  histories: ReplacementHistory[];
  onOpenSnTracking: (sn: string, label: string) => void;
  onOpenBaFromHistory: (hist: ReplacementHistory) => void;
}

export default function ReplacementHistoryTable({
  histories,
  onOpenSnTracking,
  onOpenBaFromHistory,
}: ReplacementHistoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Riwayat Mutasi & Pertukaran Hardware (Audit Log)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Catatan lengkap asal barang, SN lama yang dilepas, dan SN baru yang dipasang.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold">
          {histories.length} Log Penggantian
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Waktu Mutasi</th>
              <th className="py-3 px-4">Aset & Lokasi Display</th>
              <th className="py-3 px-4">Komponen</th>
              <th className="py-3 px-4">Unit Lama (Dilepas)</th>
              <th className="py-3 px-4">Unit Baru (Dipasang)</th>
              <th className="py-3 px-4">Alasan & Disposisi Unit Lama</th>
              <th className="py-3 px-4">Teknisi</th>
              <th className="py-3 px-4 text-right">Berita Acara</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {histories.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Belum ada riwayat swap komponen yang dicatat.
                </td>
              </tr>
            ) : (
              histories.map((hist) => (
                <tr key={hist.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(hist.replaced_at).toLocaleString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{hist.asset_code}</div>
                    <div className="text-[11px] text-slate-500">{hist.asset_name}</div>
                    <div className="text-[10px] text-slate-400">{hist.terminal} • {hist.location_area}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      hist.component_type === 'Mini PC'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {hist.component_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenSnTracking(hist.old_sn, `${hist.old_brand} ${hist.old_model}`)}
                      className="font-mono text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200 text-[11px] inline-block transition-colors"
                      title="Klik untuk tracking riwayat SN ini"
                    >
                      {hist.old_sn}
                    </button>
                    <div className="text-[11px] text-slate-500 mt-0.5">{hist.old_brand} {hist.old_model}</div>
                    {hist.old_origin && <div className="text-[10px] text-slate-400">Asal: {hist.old_origin}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenSnTracking(hist.new_sn, `${hist.new_brand} ${hist.new_model}`)}
                      className="font-mono text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 text-[11px] inline-block transition-colors"
                      title="Klik untuk tracking riwayat SN ini"
                    >
                      {hist.new_sn}
                    </button>
                    <div className="text-[11px] text-slate-500 mt-0.5">{hist.new_brand} {hist.new_model}</div>
                    {hist.new_origin && <div className="text-[10px] text-slate-400">Asal: {hist.new_origin}</div>}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-xs text-slate-800 font-semibold">{hist.reason}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Disposisi: <span className="font-semibold">{hist.old_disposal || hist.old_status}</span>
                    </div>
                    {hist.old_disposal_loc && (
                      <div className="text-[10px] text-slate-400">→ {hist.old_disposal_loc}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 text-xs">{hist.technician_name}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenBaFromHistory(hist)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200 transition-all shadow-sm"
                      title="Download Berita Acara untuk mutasi ini"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Cetak BA</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
