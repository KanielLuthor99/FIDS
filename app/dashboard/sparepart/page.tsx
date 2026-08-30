'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiGetSpareParts,
  apiCreateSparePart,
  apiUpdateSparePart,
  apiDeleteSparePart,
  apiExecuteSwap,
  apiGetAssets,
  apiGetReplacementHistory,
  apiGetSparePartHistory,
  SparePart,
  ReplacementHistory,
} from '@/lib/api';
import {
  Cpu,
  Monitor,
  Search,
  Plus,
  Warehouse,
  ArrowRightLeft,
  X,
  Download,
  History,
  FileCheck,
} from 'lucide-react';
import BeritaAcaraModal from '@/components/BeritaAcaraModal';
import { BeritaAcaraData } from '@/lib/exportPdf';
import SparePartStats from '@/components/sparepart/SparePartStats';
import SparePartTable from '@/components/sparepart/SparePartTable';
import ReplacementHistoryTable from '@/components/sparepart/ReplacementHistoryTable';
import HistoryTimelineModal from '@/components/sparepart/HistoryTimelineModal';
import AddSparePartModal from '@/components/sparepart/AddSparePartModal';
import SwapModal from '@/components/sparepart/SwapModal';

export default function SparePartManagementPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mini PC' | 'Monitor'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'In-Use' | 'Under-Repair' | 'Scrapped'>('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'inventory' | 'history'>('inventory');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState<'Mini PC' | 'Monitor'>('Mini PC');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapInitialSpare, setSwapInitialSpare] = useState<SparePart | null>(null);

  // SN Tracking Modal
  const [snTrackingModal, setSnTrackingModal] = useState<{ open: boolean; sn: string; label: string }>({
    open: false,
    sn: '',
    label: '',
  });

  // Berita Acara Modal State
  const [isBaModalOpen, setIsBaModalOpen] = useState(false);
  const [baModalData, setBaModalData] = useState<Partial<BeritaAcaraData>>({});

  // Queries
  const { data: spareParts = [], isLoading: isLoadingSpares } = useQuery({
    queryKey: ['spare-parts', searchQuery, activeCategory, statusFilter, locationFilter],
    queryFn: () => apiGetSpareParts(searchQuery, activeCategory, statusFilter, locationFilter),
  });

  const { data: allAssets = [] } = useQuery({
    queryKey: ['master-assets-for-swap'],
    queryFn: () => apiGetAssets('', '', ''),
  });

  const { data: replacementHistories = [] } = useQuery({
    queryKey: ['replacement-histories-tab'],
    queryFn: () => apiGetReplacementHistory('', '', ''),
  });

  const { data: snHistory = [], isLoading: isLoadingSnHistory } = useQuery({
    queryKey: ['sn-history', snTrackingModal.sn],
    queryFn: () => apiGetSparePartHistory(snTrackingModal.sn),
    enabled: snTrackingModal.open && !!snTrackingModal.sn,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: apiCreateSparePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
      setIsAddModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SparePart> }) => apiUpdateSparePart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteSparePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
    },
  });

  const swapMutation = useMutation({
    mutationFn: apiExecuteSwap,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
      queryClient.invalidateQueries({ queryKey: ['master-assets'] });
      queryClient.invalidateQueries({ queryKey: ['replacement-histories'] });
      queryClient.invalidateQueries({ queryKey: ['replacement-histories-tab'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      setIsSwapModalOpen(false);

      // Auto open BA Modal populated with swap data
      setBaModalData({
        tipeDoc: 'pergantian',
        tanggal: new Date().toISOString(),
        shift: 'Shift Pagi',
        terminal: data.terminal || 'Terminal 3',
        lokasi: `${data.location_area || ''} (${data.asset_code})`,
        newItemName: `${data.component_type} ${data.new_brand} ${data.new_model}`,
        newItemQty: 1,
        newItemSN: data.new_sn,
        oldItemName: `${data.component_type} ${data.old_brand} ${data.old_model}`,
        oldItemQty: 1,
        oldItemSN: data.old_sn,
        oldItemStatus: data.reason || 'Bermasalah',
        pihak1Nama: data.technician_name || 'Cecep',
        pihak2Nama: 'Moh. Taufiqi / Heru S / Vanny S',
        blankNames: true,
      });
      setIsBaModalOpen(true);
    },
  });

  const handleOpenAddModal = (cat: 'Mini PC' | 'Monitor') => {
    setAddModalCategory(cat);
    setIsAddModalOpen(true);
  };

  const handleOpenSwapWithSpare = (part: SparePart) => {
    setSwapInitialSpare(part);
    setIsSwapModalOpen(true);
  };

  const handleOpenBaFromHistory = (hist: ReplacementHistory) => {
    setBaModalData({
      tipeDoc: 'pergantian',
      tanggal: hist.replaced_at || new Date().toISOString(),
      shift: 'Shift Pagi',
      terminal: hist.terminal || 'Terminal 3',
      lokasi: `${hist.location_area || ''} (${hist.asset_code})`,
      newItemName: `${hist.component_type} ${hist.new_brand} ${hist.new_model}`,
      newItemQty: 1,
      newItemSN: hist.new_sn,
      oldItemName: `${hist.component_type} ${hist.old_brand} ${hist.old_model}`,
      oldItemQty: 1,
      oldItemSN: hist.old_sn,
      oldItemStatus: hist.reason || 'Bermasalah',
      pihak1Nama: hist.technician_name || 'Cecep',
      pihak2Nama: 'Moh. Taufiqi / Heru S / Vanny S',
      blankNames: true,
    });
    setIsBaModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Kategori,Serial Number,Brand,Model,Spesifikasi,Lokasi Gudang,Asal Pengadaan,Tahun,Kondisi,Status,Garansi,Catatan'];
    const rows = spareParts.map((p) =>
      `"${p.id}","${p.category}","${p.serial_number}","${p.brand}","${p.model}","${p.specs}","${p.warehouse_location}","${p.origin_procurement}","${p.procurement_year}","${p.condition}","${p.status}","${p.warranty_status}","${p.notes}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `FIDS_SpareParts_SN_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-[#1a2744] text-cyan-300 shadow-md shadow-slate-900/10">
            <ArrowRightLeft className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Manajemen Suku Cadang & Serial Number Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan itemized cadangan hardware FIDS berbasis <strong>Serial Number (SN)</strong> khusus <strong>Mini PC</strong> & <strong>Monitor Commercial</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setBaModalData({ blankNames: true }); setIsBaModalOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-xs font-bold text-sky-800 shadow-sm transition-all"
          >
            <FileCheck className="w-4 h-4 text-sky-600" />
            <span>Download Berita Acara</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => { setSwapInitialSpare(null); setIsSwapModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all active:scale-[0.98]"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Tukar Komponen (Swap)</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('Mini PC')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-sky-950/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit (SN)</span>
          </button>
        </div>
      </div>

      {/* ── KPI Stats ───────────────────────────────────────────── */}
      <SparePartStats spareParts={spareParts} />

      {/* ── View Switcher & Category Tabs ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('inventory')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'inventory'
                ? 'bg-[#1a2744] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Inventaris Suku Cadang</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{spareParts.length}</span>
          </button>

          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'history'
                ? 'bg-[#1a2744] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Swap Komponen (Log)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{replacementHistories.length}</span>
          </button>
        </div>

        {viewMode === 'inventory' && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Mini PC', 'Monitor'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? cat === 'Mini PC' ? 'bg-blue-600 text-white shadow-sm'
                      : cat === 'Monitor' ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat === 'Mini PC' && <Cpu className="w-3.5 h-3.5" />}
                {cat === 'Monitor' && <Monitor className="w-3.5 h-3.5" />}
                <span>{cat === 'All' ? 'Semua Komponen' : cat}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Content Views ──────────────────────────────────── */}
      {viewMode === 'inventory' ? (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Serial Number (SN), Brand, Model, Spek, atau Asal Pengadaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full md:w-44 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold"
            >
              <option value="All">Semua Status Unit</option>
              <option value="Available">🟢 Ready / Available</option>
              <option value="In-Use">🔵 Terpasang (In-Use)</option>
              <option value="Under-Repair">🟡 Dalam Servis (RMA)</option>
              <option value="Scrapped">🔴 Afkir / Rusak</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full md:w-52 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold"
            >
              <option value="All">Semua Lokasi Gudang</option>
              <option value="Gudang T3 Central">Gudang T3 Central</option>
              <option value="Workshop T2">Workshop T2</option>
              <option value="Workshop T1">Workshop T1</option>
              <option value="Workshop PSIT">Workshop PSIT (Servis)</option>
            </select>
          </div>

          <SparePartTable
            spareParts={spareParts}
            isLoading={isLoadingSpares}
            onOpenSnTracking={(sn, label) => setSnTrackingModal({ open: true, sn, label })}
            onOpenSwapWithSpare={handleOpenSwapWithSpare}
            onEditPart={(part) => {
              const notes = prompt('Update catatan / lokasi unit:', part.notes || part.warehouse_location);
              if (notes !== null) {
                updateMutation.mutate({ id: part.id, data: { notes } });
              }
            }}
            onDeletePart={(id, sn) => {
              if (confirm(`Hapus data serial number ${sn}?`)) {
                deleteMutation.mutate(id);
              }
            }}
          />
        </div>
      ) : (
        <ReplacementHistoryTable
          histories={replacementHistories}
          onOpenSnTracking={(sn, label) => setSnTrackingModal({ open: true, sn, label })}
          onOpenBaFromHistory={handleOpenBaFromHistory}
        />
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      <HistoryTimelineModal
        isOpen={snTrackingModal.open}
        sn={snTrackingModal.sn}
        label={snTrackingModal.label}
        isLoading={isLoadingSnHistory}
        snHistory={snHistory}
        onClose={() => setSnTrackingModal({ open: false, sn: '', label: '' })}
      />

      <AddSparePartModal
        isOpen={isAddModalOpen}
        spareParts={spareParts}
        isPending={createMutation.isPending}
        initialCategory={addModalCategory}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(part) => createMutation.mutate(part as SparePart)}
      />

      <SwapModal
        isOpen={isSwapModalOpen}
        allAssets={allAssets}
        spareParts={spareParts}
        isPending={swapMutation.isPending}
        initialComponentType={swapInitialSpare?.category || 'Mini PC'}
        initialSparePartId={swapInitialSpare?.id || ''}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={(payload) => swapMutation.mutate(payload)}
      />

      {isBaModalOpen && (
        <BeritaAcaraModal
          isOpen={isBaModalOpen}
          initialData={baModalData}
          onClose={() => setIsBaModalOpen(false)}
        />
      )}
    </div>
  );
}
