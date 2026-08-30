# ✈️ InJourney FIDS Asset Management System

> **PT Angkasa Pura Indonesia — Bandara Internasional Soekarno-Hatta (CGK)**
>
> Portal Enterprise Manajemen Hardware & Pemeliharaan Operasional **Flight Information Display System (FIDS)** berbasis Full-Stack Web Application.

---

## 📌 Daftar Isi

1. [Ringkasan Projek](#-1-ringkasan-projek)
2. [Tech Stack Lengkap](#-2-tech-stack-lengkap)
3. [Struktur Folder & Peta File](#-3-struktur-folder--peta-file)
4. [Penjelasan Setiap File & Fungsinya](#-4-penjelasan-setiap-file--fungsinya)
5. [Lokasi Edit 4 Modul Utama](#-5-lokasi-edit-4-modul-utama-dashboard-aset-maintenance-spare-part)
6. [REST API Endpoints](#-6-rest-api-endpoints)
7. [Alur Data (Data Flow)](#-7-alur-data-data-flow)
8. [Perbedaan Aset vs Spare Part](#-8-perbedaan-aset-vs-spare-part)
9. [Cara Menjalankan Aplikasi](#-9-cara-menjalankan-aplikasi)
10. [Database Schema](#-10-database-schema)

---

## 📋 1. Ringkasan Projek

Sistem ini dirancang untuk **memantau, mengelola inventaris, dan mencatat riwayat pemeliharaan** seluruh perangkat Flight Information Display System (FIDS) di seluruh terminal Bandara Internasional Soekarno-Hatta (Terminal 1A/1B/1C, Terminal 2, Terminal 3 International/Domestic, dan Non-Terminal).

Setiap titik display terdiri dari 2 komponen utama:
- **Controller (Mini PC)** → Komputer kecil yang menjalankan software penampil informasi penerbangan.
- **Display Panel (Monitor)** → Layar monitor komersial yang menampilkan informasi ke penumpang.

Aplikasi ini memiliki **4 modul utama**:
1. **Dashboard** — Ringkasan statistik & grafik seluruh aset.
2. **Master Aset** — Tabel inventaris semua perangkat FIDS yang terpasang di bandara.
3. **Maintenance** — Pencatatan log perbaikan/pemeliharaan hardware.
4. **Spare Part** — Manajemen stok suku cadang & buffer hardware di gudang (`/dashboard/sparepart`).

---

## 🛠️ 2. Tech Stack Lengkap

### 🔵 A. Frontend

| Teknologi | Versi | Fungsi |
|:---|:---|:---|
| **Next.js** | 14.2 | Framework React dengan App Router, server/client rendering, dan routing otomatis berbasis folder. |
| **React** | 18.3 | Library UI untuk membangun komponen interaktif (state, hooks, lifecycle). |
| **TypeScript** | 5.6 | Superset JavaScript dengan tipe data statis → mencegah bug & autocomplete di IDE. |
| **Tailwind CSS** | 3.4 | Framework CSS utility-first → styling langsung di className tanpa nulis CSS terpisah. |
| **TanStack React Query** | 5.56 | Library untuk fetching, caching, & sinkronisasi data dari API → otomatis refetch & loading state. |
| **Recharts** | 3.10 | Library grafik React → digunakan untuk chart Aktivitas Maintenance 6 Bulan di Dashboard. |
| **Lucide React** | 0.446 | Koleksi ikon SVG modern & ringan → ikon sidebar, tombol, badge status. |
| **jsPDF + jspdf-autotable** | 4.2 + 5.0 | Library generate dokumen PDF langsung di browser → Export Laporan Rekapitulasi Aset & Maintenance. |
| **Google Fonts (Inter)** | — | Tipografi utama seluruh aplikasi → tampilan bersih & profesional. |

### 🐹 B. Backend

| Teknologi | Versi | Fungsi |
|:---|:---|:---|
| **Go (Golang)** | 1.22 | Bahasa pemrograman backend → cepat, ringan, cocok untuk REST API server. |
| **Gin Gonic** | 1.10 | Web framework Go → menangani HTTP routing, middleware, dan request handler. |
| **Gin CORS** | 1.7 | Middleware CORS → mengizinkan frontend Next.js (port 3000) mengakses API backend (port 8080). |
| **golang-jwt** | 5.2 | Library JWT → membuat token autentikasi saat login. |

### 🗄️ C. Database & Data Source

| Teknologi | Fungsi |
|:---|:---|
| **In-Memory Database (Go)** | Saat ini data aset disimpan di memori (RAM) saat server berjalan → dibaca dari file CSV. |
| **CSV Files** | 2 file CSV inventaris fisik dari Excel: data Terminal 1/2/Non-Terminal dan data Terminal 3. |
| **MySQL Schema (`.sql`)** | Skema migrasi database MySQL sudah disiapkan → untuk production nanti tinggal hubungkan ke MySQL. |

### ⚙️ D. Development Tools
  
| Tool | Fungsi |
|:---|:---|
| **npm** | Package manager untuk install dependency frontend. |
| **PostCSS + Autoprefixer** | Prosesor CSS → menambahkan vendor prefix otomatis untuk kompatibilitas browser. |
| **TypeScript Compiler** | Mengecek tipe data saat development → error ditangkap sebelum runtime. |

---

## 📁 3. Struktur Folder & Peta File

```
FIDS/
│
├── app/                              ← 🔵 FRONTEND: Next.js App Router (semua halaman)
│   ├── layout.tsx                    ← Root layout HTML (head, font, body wrapper)
│   ├── page.tsx                      ← Halaman root "/" → redirect ke /dashboard
│   ├── globals.css                   ← Semua custom CSS global (card, badge, tabel, animasi)
│   ├── not-found.tsx                 ← Halaman 404 Not Found
│   │
│   ├── login/
│   │   └── page.tsx                  ← Halaman Login (One-Click Direct Login)
│   │
│   └── dashboard/
│       ├── layout.tsx                ← Layout Dashboard (Sidebar + Header + Footer)
│       ├── page.tsx                  ← 📊 MODUL 1: Halaman Dashboard Overview
│       │
│       ├── assets/
│       │   └── page.tsx              ← 📺 MODUL 2: Halaman Master Inventaris Aset
│       │
│       ├── maintenance/
│       │   └── page.tsx              ← 🛠️ MODUL 3: Halaman Log Maintenance
│       │
│       └── map/
│           └── page.tsx              ← 🗺️ Halaman Peta Aset per Terminal
│
├── components/
│   └── Providers.tsx                 ← Auth Context + React Query Provider (session management)
│
├── lib/
│   ├── api.ts                        ← API Client: semua fungsi fetch ke backend + mock fallback
│   └── exportPdf.ts                  ← Modul PDF Generator (export rekapitulasi aset & maintenance)
│
├── public/
│   └── injourney-logo.png            ← Logo InJourney Airports (dipakai di sidebar & login)
│
├── backend/                          ← 🐹 BACKEND: Go REST API Server
│   ├── main.go                       ← Entry point backend: setup Gin server + routing
│   ├── go.mod                        ← Daftar dependency Go
│   ├── go.sum                        ← Checksum dependency Go
│   │
│   ├── handlers/
│   │   └── handlers.go               ← Semua HTTP handler (Login, GetAssets, GetMetrics, dll)
│   │
│   ├── models/
│   │   └── models.go                 ← Struct data model (Asset, MaintenanceLog, User, dll)
│   │
│   ├── database/
│   │   └── database.go               ← In-Memory DB + CSV parser + seeder + query functions
│   │
│   └── fids_database.sql             ← Skema migrasi MySQL (assets, maintenance_logs, users)
│
├── Data ASET PSIT Paling Fix...T1, T2 & Non Terminal.csv   ← Data inventaris Terminal 1, 2
├── Data ASET PSIT Paling Fix...T3.csv                       ← Data inventaris Terminal 3
│
├── package.json                      ← Daftar dependency & scripts frontend
├── tailwind.config.js                ← Konfigurasi warna, font, shadow Tailwind CSS
├── postcss.config.js                 ← Konfigurasi PostCSS
├── tsconfig.json                     ← Konfigurasi TypeScript
├── next.config.js                    ← Konfigurasi Next.js
└── next-env.d.ts                     ← TypeScript environment types Next.js
```

---

## 📖 4. Penjelasan Setiap File & Fungsinya

### 🔵 FRONTEND

#### `app/layout.tsx` — Root Layout
- **Bahasa:** TypeScript (React TSX)
- **Fungsi:** Layout paling atas yang membungkus seluruh aplikasi. Memuat Google Fonts Inter, meta title SEO, dan `<Providers>` (React Query + Auth Context).

#### `app/page.tsx` — Root Page
- **Bahasa:** TypeScript
- **Fungsi:** Halaman "/" → hanya berisi redirect ke `/dashboard`.

#### `app/globals.css` — Global Styles
- **Bahasa:** CSS3 + Tailwind Directives
- **Fungsi:** Mendefinisikan semua custom class yang dipakai di seluruh app:
  - `.fids-card`, `.glass-card`, `.glass-panel` → style kartu/panel.
  - `.stat-card` → kartu statistik Dashboard (Total Aset, Aset Rusak, dll).
  - `.badge-baik`, `.badge-rusak`, `.badge-maintenance` → badge status kondisi.
  - `.fids-table` → styling tabel inventaris.
  - `.fids-input`, `.fids-select` → input & dropdown filter.
  - `.stacked-bar-*` → stacked bar chart custom di Dashboard.
  - Animasi `fade-in-up`, `fadeIn`.
  - Custom scrollbar.

#### `app/login/page.tsx` — Halaman Login
- **Bahasa:** TypeScript (React TSX)
- **Library:** `next/image`, `useRouter`, `useAuth`, `apiLogin`, `Lucide Icons`
- **Fungsi:** Halaman login dengan desain glassmorphism bertema InJourney Deep Navy. Fitur **One-Click Direct Login** → klik langsung masuk sebagai Admin tanpa input username/password. Mendukung 3 role: Admin, Teknisi, Supervisor.

#### `app/dashboard/layout.tsx` — Dashboard Layout (Sidebar + Header)
- **Bahasa:** TypeScript (React TSX)
- **Library:** `next/navigation`, `useAuth`, `Lucide Icons`
- **Fungsi:**
  - **Sidebar** (sisi kiri, warna Deep Navy `#1a2744`) → navigasi utama: Dashboard, Aset, Maintenance, Spare Part, Data Network & AOCC.
  - **Top Header** → jam real-time (LiveClock), judul halaman dinamis, avatar user + dropdown logout.
  - **Footer** → copyright InJourney Airports.
  - Responsive: sidebar menjadi overlay di mobile.

#### `app/dashboard/page.tsx` — 📊 Dashboard Overview
- **Bahasa:** TypeScript (React TSX)
- **Library:** `React Query`, `Recharts`, `Lucide Icons`
- **Fungsi:** Halaman utama dashboard berisi:
  - **4 Stat Cards** → Total Aset, Aset Rusak, Stok Menipis, Maintenance Bulan Ini.
  - **Grafik Aktivitas Maintenance 6 Bulan** → bar chart (jumlah) + line chart (selesai) menggunakan Recharts.
  - **Kondisi Aset per Terminal** → horizontal stacked bar chart custom (Baik/Maintenance/Rusak dalam %).
  - **Alert Stok Rendah** → tabel spare part dengan stok di bawah ambang batas.
  - **Aktivitas Maintenance Terbaru** → 3 log maintenance terakhir.

#### `app/dashboard/assets/page.tsx` — 📺 Master Inventaris Aset
- **Bahasa:** TypeScript (React TSX)
- **Library:** `React Query`, `useMutation`, `jsPDF`, `Lucide Icons`
- **Fungsi:** Halaman paling besar (862 baris). Berisi:
  - **Filter Bar** → pencarian real-time, dropdown Terminal, dropdown Status, dropdown Kondisi.
  - **Tabel Inventaris** → menampilkan semua aset FIDS dengan kolom: Kode, Nama/Lokasi, Terminal, IP Address, Spek Mini PC, Spek Monitor, Health Score, Status.
  - **Detail Modal** → klik baris aset untuk lihat spesifikasi lengkap Mini PC & Monitor.
  - **Tambah Aset Modal** → form input aset baru (kode, lokasi, spek Mini PC, spek Monitor).
  - **Export PDF** → generate dokumen PDF rekapitulasi inventaris menggunakan `exportAssetsPDF()`.
  - **Pagination** → navigasi halaman untuk aset yang banyak.

#### `app/dashboard/maintenance/page.tsx` — 🛠️ Log Maintenance
- **Bahasa:** TypeScript (React TSX)
- **Library:** `React Query`, `useMutation`, `FileReader API`, `Lucide Icons`
- **Fungsi:**
  - **Tabel Log Maintenance** → menampilkan riwayat semua perbaikan hardware.
  - **Tambah Log Modal** → form input maintenance baru:
    - Pilih aset target.
    - Pilih komponen target (Mini PC / Monitor / Sepaket).
    - Pilih tipe maintenance (Corrective / Preventive / Component Swap).
    - Preset tag kerusakan (Redup, Bergaris, Black Spot, Mati Total, dll).
    - Upload foto sebelum & sesudah perbaikan (dikonversi ke Base64).
    - Input S/N & model komponen pengganti baru.
    - Slider Health Score sebelum & sesudah.
  - **Zoom Foto** → klik foto dokumentasi untuk memperbesar.
  - **Export PDF** → generate dokumen PDF rekapitulasi log maintenance.

#### `app/dashboard/map/page.tsx` — 🗺️ Peta Aset Terminal
- **Bahasa:** TypeScript (React TSX)
- **Library:** `React Query`, `Lucide Icons`
- **Fungsi:** Menampilkan peta visual posisi aset FIDS di terminal. Bisa pilih Terminal 1/2/3. Klik pin untuk lihat detail aset.

#### `components/Providers.tsx` — Auth & Query Provider
- **Bahasa:** TypeScript (React TSX)
- **Library:** `React Context API`, `React Query`
- **Fungsi:**
  - **AuthContext** → mengelola sesi login user (simpan/baca dari `localStorage`).
  - **QueryClientProvider** → menyediakan React Query client ke seluruh app (caching 10 detik, tidak refetch saat focus window).
  - **Auto-recovery** → jika tab idle > 5 menit, otomatis invalidasi cache query saat kembali.
  - **Chunk Error Handler** → jika terjadi error HMR/chunk Next.js, otomatis reload halaman.

#### `lib/api.ts` — API Client & Mock Fallback
- **Bahasa:** TypeScript
- **Library:** `Fetch API` browser
- **Fungsi:** File ini adalah **jembatan** antara frontend dan backend. Berisi:
  - Interface TypeScript untuk semua tipe data (`FIDSAsset`, `MaintenanceLog`, `DashboardMetrics`, `MapPin`, `UserSession`).
  - **`fetchWithFallback()`** → fungsi generic: coba fetch ke backend (timeout 1.5 detik), jika gagal/timeout pakai data fallback statis.
  - **`apiLogin()`** → POST ke `/api/v1/auth/login` → dapat JWT token.
  - **`apiGetMetrics()`** → GET `/api/v1/dashboard/metrics` → data statistik dashboard.
  - **`apiGetAssets()`** → GET `/api/v1/assets` → daftar semua aset + filter client-side.
  - **`apiGetPins()`** → GET `/api/v1/map/pins` → posisi pin aset di peta.
  - **`apiGetLogs()`** → GET `/api/v1/maintenance` → daftar log maintenance.
  - **`apiCreateLog()`** → POST `/api/v1/maintenance` → tambah log maintenance baru.
  - **`apiCreateAsset()`** → POST `/api/v1/assets` → tambah aset baru.
  - **`apiExportCSV()`** → buka tab baru ke `/api/v1/assets/export` → download file CSV.
  - **Fallback Data** → jika backend mati, app tetap bisa jalan pakai data dummy statis di dalam file ini.

#### `lib/exportPdf.ts` — PDF Generator
- **Bahasa:** TypeScript
- **Library:** `jsPDF`, `jspdf-autotable`
- **Fungsi:** Berisi 2 fungsi:
  - **`exportAssetsPDF()`** → Generate PDF landscape A4 rekapitulasi inventaris aset FIDS. Header banner InJourney hijau tua (`#0d4440`), sub-header filter & statistik, tabel multi-kolom (No, Kode, Nama, Terminal, IP, Spek Mini PC, Spek Monitor, Health, Status), footer halaman.
  - **`exportLogsPDF()`** → Generate PDF landscape A4 rekapitulasi log maintenance. Format serupa: header, tabel (No, ID Log, Waktu, Kode Aset, Terminal, Komponen, Kategori, Deskripsi, Sparepart, Perubahan Health), footer halaman.

### 🐹 BACKEND

#### `backend/main.go` — Server Entry Point
- **Bahasa:** Go
- **Library:** `Gin Gonic`, `Gin CORS`
- **Fungsi:** File utama yang dijalankan pertama kali. Melakukan:
  1. `database.InitDB()` → inisialisasi in-memory database + baca CSV.
  2. Setup Gin router + middleware CORS (allow all origins).
  3. Mendaftarkan semua API endpoint di group `/api/v1`.
  4. Menjalankan HTTP server di port `8080`.

#### `backend/handlers/handlers.go` — API Request Handlers
- **Bahasa:** Go
- **Library:** `Gin`, `JWT`
- **Fungsi:** Berisi semua handler function yang memproses HTTP request:
  - **`HandleLogin()`** → Menerima POST request, buat user sesuai role, generate JWT token, return response.
  - **`GetMetrics()`** → Hitung statistik dashboard (total aset, aktif, rusak, SLA, avg health) dari database.
  - **`GetAssets()`** → Query aset dengan filter pencarian (q), status, dan terminal.
  - **`GetMapPins()`** → Query posisi pin aset di peta, filter per terminal.
  - **`GetMaintenanceLogs()`** → Return semua log maintenance.
  - **`CreateMaintenanceLog()`** → Terima data log baru, simpan ke database, update health score aset terkait.
  - **`ExportAssetsCSV()`** → Generate file CSV inventaris aset → di-download oleh browser.

#### `backend/models/models.go` — Data Models / Struct
- **Bahasa:** Go
- **Fungsi:** Mendefinisikan struktur data yang digunakan di seluruh backend:
  - **`Asset`** → 30+ field: ID, Code, Name, Location, Terminal, Zone, IP, Status, Health Score, 11 field Mini PC (Origin, Brand, Model, S/N, Ports, Disk, RAM, OS, Year, Condition, Warranty), 10 field Monitor (Origin, Brand, Model, S/N, Ports, Size, Year, Condition, Warranty, Converter).
  - **`MaintenanceLog`** → ID, AssetID, Terminal, Target Component, Type, Description, Spare Parts Used, Documentation Photo (Base64), New Component S/N & Model, Health Before/After, Timestamp.
  - **`MapPin`** → Asset ID, Code, Name, Terminal, Location, Status, Health, X/Y Percent (posisi di peta).
  - **`DashboardMetrics`** → SLA, Avg Health, Total/Active/Maintenance/Storage counts.
  - **`User`** → ID, Username, Name, Role, Avatar.
  - **`LoginRequest` / `LoginResponse`** → request/response body untuk login API.

#### `backend/database/database.go` — In-Memory Database + CSV Parser
- **Bahasa:** Go
- **Library:** `encoding/csv`, `sync.RWMutex`
- **Fungsi:** File terpanjang di backend (566 baris). Berisi:
  - **`MemoryDB`** struct → database in-memory menggunakan Go map + mutex untuk thread safety.
  - **`InitDB()`** → inisialisasi database, panggil `seedDataFromCSVs()`.
  - **`seedDataFromCSVs()`** → cari file CSV di beberapa path, panggil parser.
  - **`parseCSV1()`** → parse CSV Terminal 1/2/Non-Terminal. Mapping kolom CSV ke field Asset struct. Auto-detect terminal header. Hitung Health Score dari kondisi Mini PC. Auto-set status (Active jika health ≥ 60, Maintenance jika < 60, In Storage jika lokasi "gudang"). Auto-kategorikan (Flight Info Board, Check-in Counter, Gate Display, Baggage Claim, Master Departure).
  - **`parseCSV2()`** → parse CSV Terminal 3. Format kolom berbeda dari CSV 1, mapping disesuaikan.
  - **`generatePinsAndLogs()`** → otomatis generate pin peta (max 45 pin) dan log maintenance untuk aset berstatus "Maintenance".
  - **Query Functions:**
    - `GetAssets()` → filter aset berdasarkan pencarian, status, terminal.
    - `GetMetrics()` → hitung statistik dashboard real-time dari data di memori.
    - `GetPins()` → filter pin peta per terminal.
    - `GetLogs()` → return semua log.
    - `AddLog()` → tambah log baru + otomatis update health score & status aset terkait. Jika tipe "Component Swap", update S/N dan model komponen di aset.
    - `ExportCSV()` → generate byte array CSV dari data aset yang terfilter.

#### `backend/fids_database.sql` — Skema Database MySQL
- **Bahasa:** SQL (MySQL 8.0 / MariaDB)
- **Fungsi:** DDL migration script untuk production. Berisi:
  - Tabel `assets` → 30+ kolom lengkap dengan INDEX pada terminal, zone, status, ip_address, code.
  - Tabel `maintenance_logs` → dengan FOREIGN KEY ke assets, `documentation_photo` LONGTEXT untuk Base64.
  - Tabel `users` → username UNIQUE, password hash, role.
  - Seed default user (`operator.fids`).

### ⚙️ KONFIGURASI

#### `tailwind.config.js` — Konfigurasi Tailwind CSS
- **Fungsi:** Mendefinisikan design tokens:
  - Warna brand: Deep Navy `#0f172a`, InJourney Cyan `#0284c7`, Teal `#0891b2`, Accent `#06b6d4`.
  - Font: Inter → system-ui → sans-serif.
  - Shadow: `glass`, `glass-hover`, `card`.

#### `package.json` — Dependency & Scripts
- **Scripts:**
  - `npm run dev` → jalankan frontend dev server (port 3000). Script `predev` otomatis hapus folder `.next` sebelum start.
  - `npm run build` → build production bundle.
  - `npm start` → jalankan production server.

#### `next.config.js` — Konfigurasi Next.js
- **Fungsi:** Konfigurasi framework Next.js (image domains, dll).

---

## 🎯 5. Lokasi Edit 4 Modul Utama (Dashboard, Aset, Maintenance, Spare Part)

### 📊 Modul 1: Dashboard
| Komponen | File | Line Penting |
|:---|:---|:---|
| **Tampilan halaman Dashboard** | `app/dashboard/page.tsx` | Seluruh file (400 baris) |
| **4 Stat Cards** (Total Aset, Aset Rusak, dll) | `app/dashboard/page.tsx` | Baris 52-77 (komponen `StatCard`) |
| **Data stat cards** (nilai yang ditampilkan) | `app/dashboard/page.tsx` | Baris 135-138 |
| **Grafik chart 6 bulan** (data mock) | `app/dashboard/page.tsx` | Baris 27-34 |
| **Kondisi aset per terminal** (data mock) | `app/dashboard/page.tsx` | Baris 36-42 |
| **Alert stok rendah** (data mock) | `app/dashboard/page.tsx` | Baris 44-48 |
| **API fetch metrics** | `lib/api.ts` | Baris 247-249 (`apiGetMetrics`) |
| **Styling stat-card & stacked-bar** | `app/globals.css` | Baris 49-71 & 235-258 |

### 📺 Modul 2: Master Aset
| Komponen | File | Line Penting |
|:---|:---|:---|
| **Tampilan halaman Aset** | `app/dashboard/assets/page.tsx` | Seluruh file (862 baris) |
| **Filter bar** (search, terminal, status) | `app/dashboard/assets/page.tsx` | Baris 142-200 |
| **Tabel inventaris** | `app/dashboard/assets/page.tsx` | Baris ~400-600 |
| **Detail modal aset** | `app/dashboard/assets/page.tsx` | Baris ~600-750 |
| **Tambah aset modal** | `app/dashboard/assets/page.tsx` | Baris ~750-862 |
| **State form tambah aset** | `app/dashboard/assets/page.tsx` | Baris 34-59 |
| **API fetch assets** | `lib/api.ts` | Baris 251-273 (`apiGetAssets`) |
| **API create asset** | `lib/api.ts` | Baris 325-376 (`apiCreateAsset`) |
| **Export PDF aset** | `lib/exportPdf.ts` | Baris 5-135 (`exportAssetsPDF`) |
| **Backend handler get assets** | `backend/handlers/handlers.go` | Baris 73-84 |
| **Backend query filter** | `backend/database/database.go` | Baris 380-418 |

### 🛠️ Modul 3: Maintenance
| Komponen | File | Line Penting |
|:---|:---|:---|
| **Tampilan halaman Maintenance** | `app/dashboard/maintenance/page.tsx` | Seluruh file (598 baris) |
| **Form state** (assetId, type, description, dll) | `app/dashboard/maintenance/page.tsx` | Baris 43-58 |
| **Preset tag kerusakan** | `app/dashboard/maintenance/page.tsx` | Baris 30-37 |
| **API fetch logs** | `lib/api.ts` | Baris 284-286 (`apiGetLogs`) |
| **API create log** | `lib/api.ts` | Baris 288-323 (`apiCreateLog`) |
| **Export PDF maintenance** | `lib/exportPdf.ts` | Baris 137-273 (`exportLogsPDF`) |
| **Backend handler create log** | `backend/handlers/handlers.go` | Baris 105-118 |
| **Backend logic add log + update aset** | `backend/database/database.go` | Baris 493-541 |

### 📦 Modul 4: Spare Part
| Komponen | File | Line Penting |
|:---|:---|:---|
| **Link Spare Part di sidebar** | `app/dashboard/layout.tsx` | Baris 66 (sekarang mengarah ke `/dashboard/assets`) |
| **Alert stok rendah di Dashboard** | `app/dashboard/page.tsx` | Baris 44-48 (data mock statis) |
| **Widget stok menipis (Stat Card)** | `app/dashboard/page.tsx` | Baris 158-163 |
| **Halaman khusus Spare Part** | ❌ **BELUM ADA** | Perlu dibuat: `app/dashboard/spare-parts/page.tsx` |

> ⚠️ **Catatan:** Modul Spare Part saat ini belum punya halaman tersendiri. Link "Spare Part" di sidebar masih mengarah ke halaman Aset. Data stok menipis di Dashboard masih berupa data mock statis (baris 44-48 di `dashboard/page.tsx`). Untuk membuat halaman Spare Part:
> 1. Buat folder `app/dashboard/spare-parts/`
> 2. Buat file `page.tsx` di dalamnya.
> 3. Update link sidebar di `app/dashboard/layout.tsx` baris 66 → ganti `href` ke `/dashboard/spare-parts`.
> 4. Tambahkan route ke `PAGE_TITLES` di `app/dashboard/layout.tsx` baris 48-53.

---

## 🌐 6. REST API Endpoints

Backend berjalan di `http://localhost:8080`. Semua endpoint di-group di bawah `/api/v1`.

| Method | Endpoint | Handler | Fungsi |
|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/login` | `HandleLogin` | Login → return JWT token + user data |
| `GET` | `/api/v1/dashboard/metrics` | `GetMetrics` | Ambil statistik dashboard (total aset, SLA, health avg) |
| `GET` | `/api/v1/assets` | `GetAssets` | Ambil daftar aset. Query params: `q` (search), `status`, `terminal` |
| `GET` | `/api/v1/assets/export` | `ExportAssetsCSV` | Download file CSV inventaris aset |
| `GET` | `/api/v1/map/pins` | `GetMapPins` | Ambil posisi pin aset di peta. Query param: `terminal` |
| `GET` | `/api/v1/maintenance` | `GetMaintenanceLogs` | Ambil semua log maintenance |
| `POST` | `/api/v1/maintenance` | `CreateMaintenanceLog` | Catat log maintenance baru + auto update health aset |

### Contoh Request & Response

**Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role": "Admin"}'
```
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr-001",
    "username": "admin.injourney",
    "name": "Ir. Hendra Wijaya",
    "role": "Admin"
  }
}
```

**Get Assets:**
```bash
curl "http://localhost:8080/api/v1/assets?q=departure&terminal=3U&status=Active"
```
```json
{
  "status": "success",
  "count": 42,
  "data": [
    {
      "id": "ast-t3-5",
      "code": "FIDS-T3-005",
      "name": "General Departure Curbside T3",
      "terminal": "3U-INT",
      "status": "Active",
      "health_score": 100,
      "mini_pc_brand": "HP",
      "mini_pc_model": "Thin Client Elite t655",
      "monitor_brand": "LG",
      "monitor_size": "75\""
    }
  ]
}
```

---

## 🔄 7. Alur Data (Data Flow)

```
┌──────────────────────────────────────────────────────────────┐
│  📁 CSV Files (Data Inventaris Excel → CSV)                  │
│  ├── T1, T2 & Non Terminal.csv                               │
│  └── T3.csv                                                  │
└──────────────────┬───────────────────────────────────────────┘
                   │ dibaca saat server start
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  🐹 Go Backend (localhost:8080)                              │
│  ├── database.go → parseCSV1(), parseCSV2()                  │
│  ├── In-Memory DB (map[string]Asset + []MaintenanceLog)      │
│  ├── handlers.go → HTTP handler functions                    │
│  └── main.go → Gin Router + CORS middleware                  │
└──────────────────┬───────────────────────────────────────────┘
                   │ REST API (JSON over HTTP)
                   │ GET /api/v1/assets
                   │ GET /api/v1/dashboard/metrics
                   │ POST /api/v1/maintenance
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  🌐 lib/api.ts (API Client + Mock Fallback)                  │
│  ├── fetchWithFallback() → coba API, jika gagal pakai mock   │
│  ├── apiGetAssets(), apiGetMetrics(), apiGetLogs()            │
│  └── apiCreateLog(), apiCreateAsset()                        │
└──────────────────┬───────────────────────────────────────────┘
                   │ React Query (caching + auto-refetch)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  🔵 Next.js Frontend (localhost:3000)                        │
│  ├── Dashboard → StatCard, Chart, Alert, Recent Logs         │
│  ├── Assets → Tabel + Filter + Detail Modal + Export PDF     │
│  ├── Maintenance → Tabel Log + Form Input + Upload Foto      │
│  └── Map → Visual pin peta terminal                          │
└──────────────────────────────────────────────────────────────┘
```

**Catatan penting:** Jika backend (Go server) tidak berjalan, frontend **tetap bisa diakses** karena `lib/api.ts` memiliki mekanisme fallback → data dummy statis akan digunakan (baris 107-199 di `api.ts`).

---

## 🔍 8. Perbedaan Aset vs Spare Part

| Parameter | 📺 **Aset (Perangkat Terpasang)** | 📦 **Spare Part (Suku Cadang Gudang)** |
|:---|:---|:---|
| **Definisi** | Unit utuh yang **sedang terpasang dan beroperasi** di titik lokasi bandara | Komponen pengganti yang **disimpan di gudang** untuk keperluan perbaikan |
| **Identitas** | Punya **lokasi fisik spesifik** (misal: Terminal 3 Check-in Island D) + **Nomor Seri (S/N)** unik | Berbasis **jumlah kuantitas stok** + **kode barang/part number** |
| **Parameter** | Dipantau: **Health Score (%)**, **Status Operasional** (Active/Maintenance/In Storage), **SLA 24/7** | Dipantau: **Jumlah Stok**, **Ambang Batas Minimum**, **Status Alert** (Kritis/Aman) |
| **Fungsi** | Menampilkan informasi penerbangan ke penumpang secara live | Dikonsumsi oleh teknisi saat melakukan **maintenance/perbaikan** pada aset bermasalah |
| **Contoh** | Monitor LG 75" di Gate 5 T3, Mini PC HP t655 di T2 Baggage Claim | Power Supply Unit (stok 3 pcs), Kabel HDMI to DP (stok 15 pcs), RAM DDR4 8GB spare |
| **Saat maintenance** | Aset yang rusak → dicatat di Log Maintenance | Spare part yang terpakai → stoknya dikurangi |

---

## 🚀 9. Cara Menjalankan Aplikasi

### Prasyarat
- **Node.js** v18+ (untuk frontend)
- **Go** v1.22+ (untuk backend)
- **npm** (sudah termasuk saat install Node.js)

### Langkah 1: Jalankan Backend (Go)
```bash
cd backend
go run main.go
```
Output yang diharapkan:
```
✅ Loaded 786 assets from T1, T2 & Non Terminal CSV
✅ Loaded 532 assets from T3 CSV
🚀 Total Assets Loaded in MySQL Engine: 1318
⚡ InJourney FIDS Asset Management Backend (Go Gin Gonic) running on http://localhost:8080
```

### Langkah 2: Jalankan Frontend (Next.js)
```bash
# di folder root FIDS/
npm install        # install dependency (pertama kali saja)
npm run dev        # jalankan dev server
```
Output yang diharapkan:
```
▲ Next.js 14.2.13
- Local:   http://localhost:3000
```

### Langkah 3: Buka di Browser
```
http://localhost:3000
```
Klik tombol login → langsung masuk ke Dashboard.

> **💡 Tip:** Frontend bisa dijalankan **tanpa backend** → data fallback statis akan digunakan otomatis.

---

## 🗄️ 10. Database Schema

Saat ini menggunakan **In-Memory Database** (data disimpan di RAM, hilang saat server restart). Skema MySQL sudah disiapkan di `backend/fids_database.sql` untuk migrasi ke production.

### Tabel `assets`
```
id, code, name, location_area, terminal, zone, ip_address, status, health_score,
mini_pc_origin, mini_pc_brand, mini_pc_model, mini_pc_sn, mini_pc_ports, mini_pc_disk, mini_pc_ram, mini_pc_os, mini_pc_year, mini_pc_condition, mini_pc_warranty,
monitor_origin, monitor_brand, monitor_model, monitor_sn, monitor_ports, monitor_size, monitor_year, monitor_condition, monitor_warranty, monitor_converter,
created_at, updated_at
```

### Tabel `maintenance_logs`
```
id, asset_id (FK → assets), asset_code, asset_name, terminal,
target_component, type, description, spare_parts_used,
documentation_photo (LONGTEXT/Base64), new_component_sn, new_component_model,
health_before, health_after, created_at
```

### Tabel `users`
```
id, username (UNIQUE), password, name, role, avatar, created_at
```

---

> **© 2026 InJourney Airports — PT Angkasa Pura Indonesia**
> FIDS Asset Management System v1.0.0
