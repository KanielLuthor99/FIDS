import React from 'react';
import {
  Cpu,
  Monitor,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  History,
  ShieldCheck,
  Trash2,
  Edit3,
  RefreshCw,
} from 'lucide-react';
import { SparePart } from '@/lib/api';

interface SparePartTableProps {
  spareParts: SparePart[];
  isLoading: boolean;
  onOpenSnTracking: (sn: string, label: string) => void;
  onOpenSwapWithSpare: (part: SparePart) => void;
  onEditPart: (part: SparePart) => void;
  onDeletePart: (id: string, sn: string) => void;
}

export default function SparePartTable({
  spareParts,
  isLoading,
  onOpenSnTracking,
  onOpenSwapWithSpare,
  onEditPart,
  onDeletePart,
}: SparePartTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Serial Number (SN)</th>
              <th className="py-3 px-4">Kategori & Brand</th>
              <th className="py-3 px-4">Model & Spesifikasi</th>
              <th className="py-3 px-4">Asal Pengadaan & Garansi</th>
              <th className="py-3 px-4">Lokasi Rak / Gudang</th>
              <th className="py-3 px-4 text-center">Status & Kondisi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Memuat data inventaris...
                </td>
              </tr>
            ) : spareParts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  Tidak ada suku cadang yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              spareParts.map((part) => {
                const isMiniPC = part.category === 'Mini PC';
                return (
                  <tr key={part.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Serial Number */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenSnTracking(part.serial_number, `${part.brand} ${part.model}`)}
                          title="Lihat riwayat tracking SN ini"
                          className="font-mono font-bold text-[#1a2744] bg-slate-100 hover:bg-sky-100 hover:text-sky-700 px-2.5 py-1 rounded-md text-xs border border-slate-200 hover:border-sky-300 select-all cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          {part.serial_number}
                          <History className="w-3 h-3 opacity-50" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{part.id}</span>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {isMiniPC ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Cpu className="w-3 h-3" />Mini PC
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Monitor className="w-3 h-3" />Monitor
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-800 text-xs mt-1">{part.brand}</div>
                    </td>

                    {/* Model & Specs */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 text-xs">{part.model}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{part.specs}</div>
                    </td>

                    {/* Origin & Warranty */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-slate-700">{part.origin_procurement} ({part.procurement_year})</div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{part.warranty_status || 'Garansi Standar'}</span>
                      </div>
                    </td>

                    {/* Warehouse Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                        <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{part.warehouse_location}</span>
                      </div>
                      {part.notes && <div className="text-[10px] text-slate-400 mt-0.5 italic">{part.notes}</div>}
                    </td>

                    {/* Status & Condition */}
                    <td className="py-3 px-4 text-center">
                      {part.status === 'Available' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />Ready
                        </span>
                      ) : part.status === 'In-Use' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          In-Use
                        </span>
                      ) : part.status === 'Under-Repair' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />Servis (RMA)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Afkir / Rusak
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">{part.condition}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {part.status === 'Available' && (
                          <button
                            onClick={() => onOpenSwapWithSpare(part)}
                            title="Pasang / Tukar unit ini ke Titik Display"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold shadow-sm transition-all"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Swap</span>
                          </button>
                        )}

                        <button
                          onClick={() => onEditPart(part)}
                          title="Edit data unit"
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeletePart(part.id, part.serial_number)}
                          title="Hapus dari inventaris"
                          className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
