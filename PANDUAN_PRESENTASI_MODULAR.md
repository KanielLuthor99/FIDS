# ✈️ PANDUAN LENGKAP & PETA KODINGAN PRESENTASI FIDS
> **InJourney Airports — Flight Information Display System (FIDS) Asset Management**
> 
> *Dokumen pegangan resmi untuk presentasi demo: memetakan letak kode semula ke arsitektur modular baru, skrip jawaban penguji, dan alur demo 5 menit.*

---

## 🗺️ 1. Peta Letak Kodingan: Dulu vs Sekarang (Modular Clean Architecture)

Semua file raksasa (>500–1.700 baris) telah berhasil dipecah menjadi komponen modular rapi (**rata-rata 60–160 baris per file**). Jika penguji meminta kamu membuka kodingan fitur tertentu, gunakan tabel pemetaan berikut:

### 🔵 A. Frontend (Next.js & React TSX)

| Fitur / Komponen | Letak Semula (Monolitik) | 📍 Letak Baru Sekarang (Modular) | Penjelasan Singkat |
|:---|:---|:---|:---|
| **Katalog Preset Hardware** | `sparepart/page.tsx` *(Line 70)* | [`components/sparepart/constants.ts`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/constants.ts) | Master preset spek HP Thin Client, Intel NUC, LG, Samsung, opsi disposisi. |
| **Card Statistik Spare Part** | `sparepart/page.tsx` *(Line 540)* | [`components/sparepart/SparePartStats.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/SparePartStats.tsx) | 4 Card KPI: Total SN, Ready Mini PC, Ready Monitor, Afkir/Servis. |
| **Tabel Stok Gudang Suku Cadang** | `sparepart/page.tsx` *(Line 690)* | [`components/sparepart/SparePartTable.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/SparePartTable.tsx) | Tabel list unit per Serial Number + tombol aksi Edit, Hapus, Swap. |
| **Tabel Audit Riwayat Swap** | `sparepart/page.tsx` *(Line 850)* | [`components/sparepart/ReplacementHistoryTable.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/ReplacementHistoryTable.tsx) | Log pergantian: SN lama dilepas vs SN baru dipasang + tombol Cetak BA. |
| **Modal Tracking Serial Number** | `sparepart/page.tsx` *(Line 955)* | [`components/sparepart/HistoryTimelineModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/HistoryTimelineModal.tsx) | Dialog timeline pelacakan riwayat perjalanan & mutasi satu SN. |
| **Modal Input Unit Spare Part** | `sparepart/page.tsx` *(Line 1060)* | [`components/sparepart/AddSparePartModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/AddSparePartModal.tsx) | Form registrasi unit spare part baru ke gudang dengan validasi anti-duplikat SN. |
| **Wizard 4-Step Tukar (Swap)** | `sparepart/page.tsx` *(Line 1285)* | [`components/sparepart/SwapModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/SwapModal.tsx) | Form wizard 4 langkah penukaran unit rusak di lapangan dengan cadangan. |
| **Halaman Utama Spare Part** | `sparepart/page.tsx` *(1.754 baris)* | [`app/dashboard/sparepart/page.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/app/dashboard/sparepart/page.tsx) | **Kini hanya 180 baris** sebagai koordinator state & React Query. |
| **Modal Detail Aset Dual-Component** | `assets/page.tsx` *(Line 950)* | [`components/assets/AssetDetailModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/assets/AssetDetailModal.tsx) | Popup spesifikasi terpisah antara Mini PC Controller dan Commercial Monitor. |
| **Modal Registrasi Aset Baru** | `assets/page.tsx` *(Line 670)* | [`components/assets/AddAssetModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/assets/AddAssetModal.tsx) | Form input display baru lengkap dengan data lokasi & spek kedua komponen. |
| **Modal Ekspor Dokumen** | `assets/page.tsx` *(Line 570)* | [`components/assets/AssetExportModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/assets/AssetExportModal.tsx) | Pilihan unduh PDF Rekap Aset, PDF Audit Penggantian, atau Spreadsheet CSV. |
| **Tabel Master Aset 4-Tab** | `assets/page.tsx` *(Line 300)* | [`components/assets/AssetTable.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/assets/AssetTable.tsx) | Tabel rendering untuk Tab Pairing, Monitor, Mini PC, & Riwayat Penggantian. |
| **Halaman Master Aset** | `assets/page.tsx` *(1.102 baris)* | [`app/dashboard/assets/page.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/app/dashboard/assets/page.tsx) | **Kini hanya 175 baris** sebagai koordinator filter & data. |
| **Modal Form Catat Maintenance** | `maintenance/page.tsx` *(Line 300)* | [`components/maintenance/AddMaintenanceModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/maintenance/AddMaintenanceModal.tsx) | Form input tindakan perbaikan + preset tag kerusakan + upload foto Base64. |
| **Modal Zoom Foto Dokumentasi** | `maintenance/page.tsx` *(Line 580)* | [`components/maintenance/PhotoZoomModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/maintenance/PhotoZoomModal.tsx) | Dialog pembesar foto sebelum/sesudah perbaikan resolusi tinggi. |
| **Tabel Riwayat Maintenance** | `maintenance/page.tsx` *(Line 175)* | [`components/maintenance/MaintenanceTable.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/maintenance/MaintenanceTable.tsx) | Tabel log pekerjaan teknisi, thumbnail foto, dan progress recovery score. |
| **Halaman Maintenance** | `maintenance/page.tsx` *(670 baris)* | [`app/dashboard/maintenance/page.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/app/dashboard/maintenance/page.tsx) | **Kini hanya 90 baris** ringkas dan bersih. |

---

### 🐹 B. Backend (Golang & Database Package)

Semua fungsi backend berada di dalam satu `package database`, sehingga tidak ada breaking change pada handler maupun API router:

| Fungsi Backend | Letak Semula (`database.go`) | 📍 Letak Baru Sekarang | Penjelasan Singkat |
|:---|:---|:---|:---|
| **Koneksi MySQL & Dual-Engine Toggle** | `database.go` *(Line 32)* | [`backend/database/db.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/db.go) | `InitDB()`, connection pooling, ping MySQL, dan in-memory state toggle. |
| **Skema Tabel (Auto-Migrate)** | `database.go` *(Line 118)* | [`backend/database/schema.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/schema.go) | `autoMigrate()`: DDL CREATE TABLE 5 tabel MySQL beserta Foreign Key & Index. |
| **Import & Parsing CSV Excel** | `database.go` *(Line 245)* | [`backend/database/csv_parser.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/csv_parser.go) | `parseCSV1` (T1/T2/Non-Terminal) & `parseCSV2` (T3) normalisasi data inventaris bandara. |
| **Query Master Aset & Statistik** | `database.go` *(Line 630)* | [`backend/database/assets.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/assets.go) | `GetAssets()`, `GetMetrics()`, dan `ExportCSV()`. |
| **Log Perbaikan (Maintenance)** | `database.go` *(Line 870)* | [`backend/database/maintenance.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/maintenance.go) | `GetLogs()` dan `AddLog()` (otomatis update health score aset). |
| **Stok Gudang & SN Tracking** | `database.go` *(Line 1150)* | [`backend/database/spareparts.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/spareparts.go) | CRUD `spare_parts` dan `GetSparePartHistoryBySN()`. |
| **Transaksi Multi-Tabel Swap** | `database.go` *(Line 1308)* | [`backend/database/swap.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/swap.go) | `ExecuteSwap()` (6-langkah transaksi update aset, stok, audit log, & maintenance). |
| **Koordinat Peta Terminal** | `database.go` *(Line 828)* | [`backend/database/pins.go`](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/pins.go) | `GetPins()` untuk filter titik display di peta. |

---

## 🗣️ 2. Jawaban Profesional Saat Penguji Bertanya

### Q1: "Kenapa struktur folder kodingannya dibuat terpecah-pecah seperti ini?"
> *"Kami menerapkan prinsip **Clean Architecture** dan **Component-Driven Design (Single Responsibility Principle)**. Di frontend, setiap modal, tabel, dan preset kami isolasi ke file independen berukuran 60–150 baris agar reusable dan mudah di-maintenance. Di backend Go, kami memisahkan domain database (assets, maintenance, spareparts, dan swap transaction) ke file modular agar tidak terjadi 'God File' anti-pattern."*

### Q2: "Coba tunjukkan di mana letak logika transaksi saat petugas menukar perangkat (Swap)!"
1. Buka file frontend form modalnya: [`components/sparepart/SwapModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/SwapModal.tsx).
2. Buka file backend transaksinya: [`backend/database/swap.go` (Baris 140+)](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/swap.go#L140).
> *"Di `swap.go`, fungsi `ExecuteSwap()` mengeksekusi 6 langkah transaksi: memperbarui master aset ke SN baru, mengaktifkan status pin peta, mengubah stok cadangan menjadi In-Use, mencatat unit lama yang dicopot, membuat log mutasi audit di `replacement_history`, dan otomatis membuat tiket di `maintenance_logs`."*

### Q3: "Bagaimana sistem bisa melacak riwayat satu Serial Number (SN Tracking)?"
1. Buka file modalnya: [`components/sparepart/HistoryTimelineModal.tsx`](file:///c:/Users/IDHAM/Downloads/FIDS/components/sparepart/HistoryTimelineModal.tsx).
2. Buka query backend-nya: [`backend/database/spareparts.go` (Baris 140+)](file:///c:/Users/IDHAM/Downloads/FIDS/backend/database/spareparts.go#L140).
> *"Query mencari klausa `WHERE old_sn = ? OR new_sn = ?` di tabel `replacement_history`. Hasilnya menampilkan timeline lengkap apakah unit tersebut sedang dipasang, pernah dicopot dari gate mana, alasan perbaikannya apa, dan siapa teknisinya."*

---

## 🎬 3. Skenario Demo 5 Menit (Golden Flow)

1. **Menit 1 — Dashboard (`/dashboard`)**:
   * Tunjukkan total 1.222 display bandara, grafik perbaikan bulanan, dan tabel stok spare part yang menipis.
2. **Menit 2 — Master Aset (`/dashboard/assets`)**:
   * Cari display di terminal tertentu $\rightarrow$ klik barisnya $\rightarrow$ tunjukkan **Dual-Component Modal** yang memisahkan Mini PC & Monitor.
3. **Menit 3 — Maintenance (`/dashboard/maintenance`)**:
   * Klik tombol catat maintenance $\rightarrow$ pilih tag kerusakan $\rightarrow$ tunjukkan foto dokumentasi sebelum & sesudah.
4. **Menit 4 — Spare Part & Swap (`/dashboard/sparepart`)**:
   * Tunjukkan daftar Serial Number di gudang $\rightarrow$ klik **Tukar Komponen (Swap)** $\rightarrow$ simulasikan penggantian hardware unit rusak.
5. **Menit 5 — Hasil Otomatis (Berita Acara)**:
   * Tunjukkan popup **Berita Acara PDF** yang otomatis terisi dan siap dicetak/ditandatangani pejabat operasional bandara.
