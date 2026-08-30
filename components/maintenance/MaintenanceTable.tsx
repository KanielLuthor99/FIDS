import React from 'react';
import { ZoomIn, Cpu, Monitor, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MaintenanceLog } from '@/lib/api';

interface MaintenanceTableProps {
  logs: MaintenanceLog[] | undefined;
  onPhotoZoom: (photoUrl: string) => void;
}

export default function MaintenanceTable({ logs, onPhotoZoom }: MaintenanceTableProps) {
  return (
    <div className="fids-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="fids-table">
          <thead>
            <tr>
              <th>ID & Waktu</th>
              <th>Kode & Nama Aset</th>
              <th className="text-center">Dokumentasi Foto</th>
              <th>Target & Tindakan</th>
              <th>Keterangan</th>
              <th className="text-center">Health Recovery</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log) => (
              <tr key={log.id}>
                {/* ID & Waktu */}
                <td>
                  <div className="font-mono text-[12px] font-semibold text-[#1a2744]">{log.id}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(log.created_at).toLocaleString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </td>

                {/* Kode Aset */}
                <td>
                  <div className="font-mono font-semibold text-[13px] text-slate-900">{log.asset_code}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{log.asset_name}</div>
                  <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium mt-0.5">
                    {log.terminal}
                  </span>
                </td>

                {/* Foto */}
                <td className="text-center">
                  {log.documentation_photo ? (
                    <div
                      onClick={() => onPhotoZoom(log.documentation_photo || '')}
                      className="group relative inline-block w-16 h-11 rounded-lg overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-[#1a2744] transition-all"
                    >
                      <img
                        src={log.documentation_photo}
                        alt="Dokumentasi"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Tanpa Foto</span>
                  )}
                </td>

                {/* Target & Tindakan */}
                <td>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 ${
                      log.target_component === 'Mini PC'
                        ? 'bg-blue-100 text-blue-800'
                        : log.target_component === 'Monitor'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {log.target_component === 'Mini PC' && <Cpu className="w-3 h-3" />}
                    {log.target_component === 'Monitor' && <Monitor className="w-3 h-3" />}
                    {log.target_component === 'Sepaket' && <Layers className="w-3 h-3" />}
                    {log.target_component || 'Monitor'}
                  </span>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.type === 'Corrective'
                          ? 'bg-rose-100 text-rose-700'
                          : log.type === 'Component Swap'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {log.type}
                    </span>
                  </div>
                </td>

                {/* Keterangan */}
                <td className="max-w-xs">
                  <div className="text-[12px] text-slate-800 line-clamp-2">{log.description}</div>
                  {log.spare_parts_used && log.spare_parts_used !== 'N/A' && (
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Spare Part: {log.spare_parts_used}</span>
                    </div>
                  )}
                </td>

                {/* Health Recovery */}
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-rose-600 font-bold">{log.health_before}%</span>
                    <span className="text-slate-400 text-xs">→</span>
                    <span className="text-xs text-emerald-600 font-bold">{log.health_after}%</span>
                  </div>
                  <div className="w-20 bg-slate-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${log.health_after}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
