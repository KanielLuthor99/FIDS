'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetLogs, apiCreateLog, apiGetAssets, MaintenanceLog } from '@/lib/api';
import { exportLogsPDF } from '@/lib/exportPdf';
import { Wrench, Plus, Download } from 'lucide-react';
import AddMaintenanceModal from '@/components/maintenance/AddMaintenanceModal';
import PhotoZoomModal from '@/components/maintenance/PhotoZoomModal';
import MaintenanceTable from '@/components/maintenance/MaintenanceTable';

function MaintenanceLogsContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePhotoZoom, setActivePhotoZoom] = useState<string | null>(null);
  const [initialAssetId, setInitialAssetId] = useState('');

  const paramAssetId = searchParams.get('assetId');

  const { data: logs } = useQuery({
    queryKey: ['maintenance-logs'],
    queryFn: apiGetLogs,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['assets-for-modal'],
    queryFn: () => apiGetAssets('', '', ''),
  });

  useEffect(() => {
    if (paramAssetId) {
      setInitialAssetId(paramAssetId);
      setIsModalOpen(true);
    }
  }, [paramAssetId]);

  const createMutation = useMutation({
    mutationFn: apiCreateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-logs'] });
      queryClient.invalidateQueries({ queryKey: ['master-assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      setIsModalOpen(false);
    },
  });

  return (
    <div className="space-y-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-bold text-slate-800">Log Maintenance</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Riwayat perbaikan & dokumentasi kerusakan perangkat FIDS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportLogsPDF(logs || [], '', 'All')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => { setInitialAssetId(''); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a2744] text-white text-[12px] font-semibold hover:bg-[#243561] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Maintenance Baru</span>
          </button>
        </div>
      </div>

      {/* ── Log Table ───────────────────────────────────────── */}
      <MaintenanceTable
        logs={logs}
        onPhotoZoom={setActivePhotoZoom}
      />

      {/* ── Modals ──────────────────────────────────────────── */}
      <AddMaintenanceModal
        isOpen={isModalOpen}
        assets={assets}
        initialAssetId={initialAssetId}
        isPending={createMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data as MaintenanceLog)}
      />

      <PhotoZoomModal
        photoUrl={activePhotoZoom}
        onClose={() => setActivePhotoZoom(null)}
      />
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat halaman maintenance...</div>}>
      <MaintenanceLogsContent />
    </Suspense>
  );
}
