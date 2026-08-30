import React from 'react';
import Link from 'next/link';
import { Cpu, Monitor, Info, Wrench } from 'lucide-react';
import { FIDSAsset, ReplacementHistory } from '@/lib/api';

interface AssetTableProps {
  activeTab: 'pairing' | 'monitor' | 'minipc' | 'replacement_history';
  assets: FIDSAsset[];
  replacementHistories: ReplacementHistory[];
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  histPage: number;
  totalHistPages: number;
  perPage: number;
  histPerPage: number;
  onPageChange: (page: number) => void;
  onHistPageChange: (page: number) => void;
  onSelectAsset: (asset: FIDSAsset) => void;
}

export default function AssetTable({
  activeTab,
  assets,
  replacementHistories,
  filteredCount,
  currentPage,
  totalPages,
  histPage,
  totalHistPages,
  perPage,
  histPerPage,
  onPageChange,
  onHistPageChange,
  onSelectAsset,
}: AssetTableProps) {
  const mapKondisi = (status: string) => {
    if (status === 'Active') return 'Baik';
    if (status === 'Maintenance') return 'Maintenance';
    return 'Rusak';
  };

  return (
    <div className="fids-card overflow-hidden">
      {/* Table Title */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
          {activeTab === 'pairing' && <span>Titik Display FIDS (Pairing Monitor & Mini PC)</span>}
          {activeTab === 'monitor' && <span>Master Inventaris Commercial Monitor (Display Panel)</span>}
          {activeTab === 'minipc' && <span>Master Inventaris Mini PC (FIDS Controller)</span>}
          {activeTab === 'replacement_history' && <span>Riwayat Audit Penggantian Alat (Replaced / Lifecycle Equipment)</span>}
          <span className="text-slate-400 font-normal text-xs">
            ({activeTab === 'replacement_history' ? `${replacementHistories.length} log riwayat` : `${filteredCount} unit`})
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        {/* TAB 1: PAIRING TABLE */}
        {activeTab === 'pairing' && (
          <table className="fids-table">
            <thead>
              <tr>
                <th>Kode Aset</th>
                <th>Lokasi Display & Gate</th>
                <th>Terminal</th>
                <th>IP Network</th>
                <th>Komponen Mini PC</th>
                <th>Komponen Monitor</th>
                <th>Health</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const kondisi = mapKondisi(asset.status);
                return (
                  <tr key={asset.id}>
                    <td><span className="font-mono text-[12px] font-semibold text-[#1a2744]">{asset.code}</span></td>
                    <td><span className="text-[13px] text-slate-800 font-semibold">{asset.location_area || asset.name}</span></td>
                    <td><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{asset.terminal}</span></td>
                    <td><span className="font-mono text-[11px] text-slate-600">{asset.ip_address || '-'}</span></td>
                    <td>
                      <div className="text-[12px] font-semibold text-blue-950">{asset.mini_pc_brand || 'HP'} {asset.mini_pc_model || 'Thin Client'}</div>
                      <div className="text-[11px] font-mono text-slate-400">SN: {asset.mini_pc_sn || '-'}</div>
                    </td>
                    <td>
                      <div className="text-[12px] font-semibold text-purple-950">{asset.monitor_brand || 'LG'} {asset.monitor_model || '65UH5C'} ({asset.monitor_size || '65"'})</div>
                      <div className="text-[11px] font-mono text-slate-400">SN: {asset.monitor_sn || '-'}</div>
                    </td>
                    <td>
                      <span className={`text-xs font-bold ${asset.health_score >= 80 ? 'text-green-600' : asset.health_score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {asset.health_score}%
                      </span>
                    </td>
                    <td>
                      {kondisi === 'Baik' && <span className="badge-baik"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Baik</span>}
                      {kondisi === 'Rusak' && <span className="badge-rusak"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Rusak</span>}
                      {kondisi === 'Maintenance' && <span className="badge-maintenance"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Maintenance</span>}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onSelectAsset(asset)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Detail Hardware">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/dashboard/maintenance?assetId=${asset.id}&code=${asset.code}`} className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#1a2744] hover:text-white text-slate-600 transition-colors" title="Catat Maintenance">
                          <Wrench className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* TAB 2: MONITOR TABLE */}
        {activeTab === 'monitor' && (
          <table className="fids-table">
            <thead>
              <tr>
                <th>S/N Monitor</th>
                <th>Merk & Model</th>
                <th>Ukuran Layar</th>
                <th>Kabel / Converter</th>
                <th>Lokasi Display Pasang</th>
                <th>Terminal</th>
                <th>Kondisi Panel</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={`mon-${asset.id}`}>
                  <td><span className="font-mono text-[12px] font-bold text-purple-900">{asset.monitor_sn || 'SN-MON-UNREGISTERED'}</span></td>
                  <td><span className="text-[13px] font-semibold text-slate-800">{asset.monitor_brand || 'LG'} {asset.monitor_model || 'Commercial Display'}</span></td>
                  <td><span className="text-xs font-bold text-slate-700">{asset.monitor_size || '65"'}</span></td>
                  <td><span className="text-xs text-slate-600">{asset.monitor_converter || 'Direct Cable'}</span></td>
                  <td>
                    <div className="text-[13px] font-medium text-slate-800">{asset.location_area || asset.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{asset.code}</div>
                  </td>
                  <td><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{asset.terminal}</span></td>
                  <td><span className="text-xs font-semibold text-slate-700">{asset.monitor_condition || `${asset.health_score}% Normal`}</span></td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {asset.status === 'Active' ? 'Terpasang Aktif' : 'Dalam Perbaikan'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button onClick={() => onSelectAsset(asset)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Detail Monitor">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 3: MINI PC TABLE */}
        {activeTab === 'minipc' && (
          <table className="fids-table">
            <thead>
              <tr>
                <th>S/N Mini PC</th>
                <th>Merk & Model Controller</th>
                <th>Operating System</th>
                <th>RAM & Disk</th>
                <th>IP Address Network</th>
                <th>Lokasi Display Pasang</th>
                <th>Terminal</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={`pc-${asset.id}`}>
                  <td><span className="font-mono text-[12px] font-bold text-blue-900">{asset.mini_pc_sn || 'SN-PC-UNREGISTERED'}</span></td>
                  <td><span className="text-[13px] font-semibold text-slate-800">{asset.mini_pc_brand || 'HP'} {asset.mini_pc_model || 'Thin Client'}</span></td>
                  <td><span className="text-xs text-slate-700 font-medium">{asset.mini_pc_os || 'Win 10 IoT'}</span></td>
                  <td><span className="text-xs font-mono text-slate-600">{asset.mini_pc_ram || '8GB'} / {asset.mini_pc_disk || '60GB'}</span></td>
                  <td><span className="font-mono text-[12px] font-semibold text-slate-800">{asset.ip_address || '-'}</span></td>
                  <td>
                    <div className="text-[13px] font-medium text-slate-800">{asset.location_area || asset.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{asset.code}</div>
                  </td>
                  <td><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{asset.terminal}</span></td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {asset.status === 'Active' ? 'Online Aktif' : 'Maintenance'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button onClick={() => onSelectAsset(asset)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Detail Mini PC">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: REPLACEMENT HISTORY TABLE */}
        {activeTab === 'replacement_history' && (
          <table className="fids-table">
            <thead>
              <tr>
                <th>ID Audit</th>
                <th>Tanggal Penggantian</th>
                <th>Titik Display & Terminal</th>
                <th>Tipe Komponen</th>
                <th>Perangkat Lama (Dicopot)</th>
                <th>Perangkat Baru (Pengganti)</th>
                <th>Alasan / Kerusakan</th>
                <th>Status Unit Lama</th>
                <th>Teknisi</th>
              </tr>
            </thead>
            <tbody>
              {replacementHistories.map((hist) => (
                <tr key={hist.id}>
                  <td><span className="font-mono text-[12px] font-bold text-amber-900">{hist.id}</span></td>
                  <td>
                    <div className="text-[12px] font-semibold text-slate-800">
                      {new Date(hist.replaced_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(hist.replaced_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </div>
                  </td>
                  <td>
                    <div className="font-mono font-bold text-[12px] text-slate-900">{hist.asset_code}</div>
                    <div className="text-[11px] text-slate-600">{hist.location_area || hist.asset_name} ({hist.terminal})</div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${hist.component_type === 'Mini PC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {hist.component_type === 'Mini PC' ? <Cpu className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                      {hist.component_type}
                    </span>
                  </td>
                  <td>
                    <div className="text-[12px] font-semibold text-rose-900">{hist.old_brand} {hist.old_model}</div>
                    <div className="font-mono text-[11px] text-rose-700 font-bold">SN: {hist.old_sn}</div>
                  </td>
                  <td>
                    <div className="text-[12px] font-semibold text-emerald-900">{hist.new_brand} {hist.new_model}</div>
                    <div className="font-mono text-[11px] text-emerald-700 font-bold">SN: {hist.new_sn}</div>
                  </td>
                  <td><span className="text-[12px] text-slate-700">{hist.reason}</span></td>
                  <td>
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {hist.old_status}
                    </span>
                  </td>
                  <td><span className="text-xs text-slate-600 font-medium">{hist.technician_name}</span></td>
                </tr>
              ))}

              {replacementHistories.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    Belum ada riwayat penggantian perangkat hardware yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12px] text-slate-500">
          {activeTab === 'replacement_history'
            ? `Menampilkan ${Math.min((histPage - 1) * histPerPage + 1, replacementHistories.length)}–${Math.min(histPage * histPerPage, replacementHistories.length)} dari ${replacementHistories.length} riwayat`
            : `Menampilkan ${Math.min((currentPage - 1) * perPage + 1, filteredCount)}–${Math.min(currentPage * perPage, filteredCount)} dari ${filteredCount} unit`}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => activeTab === 'replacement_history' ? onHistPageChange(Math.max(1, histPage - 1)) : onPageChange(Math.max(1, currentPage - 1))}
            disabled={activeTab === 'replacement_history' ? histPage === 1 : currentPage === 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            ‹
          </button>

          <span className="px-3 text-xs font-bold text-slate-700">
            Halaman {activeTab === 'replacement_history' ? histPage : currentPage} dari {activeTab === 'replacement_history' ? totalHistPages : totalPages}
          </span>

          <button
            onClick={() => activeTab === 'replacement_history' ? onHistPageChange(Math.min(totalHistPages, histPage + 1)) : onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={activeTab === 'replacement_history' ? histPage === totalHistPages : currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
