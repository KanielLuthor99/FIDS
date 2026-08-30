-- ============================================================
-- InJourney FIDS Asset Management - MySQL Database Migration
-- Target MySQL Version: 5.7+ / 8.0+ / MariaDB 10.3+
-- Database Name: fids_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS `fids_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fids_db`;

-- 1. Table Assets (Display Location with Paired Mini PC & Monitor)
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `location_area` VARCHAR(255) DEFAULT '',
  `terminal` VARCHAR(64) DEFAULT '',
  `zone` VARCHAR(64) DEFAULT '',
  `ip_address` VARCHAR(45) DEFAULT '',
  `status` VARCHAR(32) DEFAULT 'Active',
  `health_score` INT DEFAULT 100,
  
  -- Mini PC Hardware Attributes
  `mini_pc_origin` VARCHAR(64) DEFAULT '',
  `mini_pc_brand` VARCHAR(64) DEFAULT '',
  `mini_pc_model` VARCHAR(128) DEFAULT '',
  `mini_pc_sn` VARCHAR(128) DEFAULT '',
  `mini_pc_ports` VARCHAR(255) DEFAULT '',
  `mini_pc_disk` VARCHAR(64) DEFAULT '',
  `mini_pc_ram` VARCHAR(64) DEFAULT '',
  `mini_pc_os` VARCHAR(64) DEFAULT '',
  `mini_pc_year` VARCHAR(16) DEFAULT '',
  `mini_pc_condition` VARCHAR(64) DEFAULT '',
  `mini_pc_warranty` VARCHAR(64) DEFAULT '',

  -- Commercial Monitor / Display Panel Attributes
  `monitor_origin` VARCHAR(64) DEFAULT '',
  `monitor_brand` VARCHAR(64) DEFAULT '',
  `monitor_model` VARCHAR(128) DEFAULT '',
  `monitor_sn` VARCHAR(128) DEFAULT '',
  `monitor_ports` VARCHAR(255) DEFAULT '',
  `monitor_size` VARCHAR(32) DEFAULT '',
  `monitor_year` VARCHAR(16) DEFAULT '',
  `monitor_condition` VARCHAR(64) DEFAULT '',
  `monitor_warranty` VARCHAR(64) DEFAULT '',
  `monitor_converter` VARCHAR(128) DEFAULT '',

  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_terminal` (`terminal`),
  INDEX `idx_zone` (`zone`),
  INDEX `idx_status` (`status`),
  INDEX `idx_ip` (`ip_address`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table Maintenance Logs (With Damage Photo Documentation)
DROP TABLE IF EXISTS `maintenance_logs`;
CREATE TABLE `maintenance_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `asset_id` VARCHAR(64) NOT NULL,
  `asset_code` VARCHAR(64) NOT NULL,
  `asset_name` VARCHAR(255) NOT NULL,
  `terminal` VARCHAR(64) DEFAULT '',
  `target_component` VARCHAR(64) DEFAULT 'Sepaket', -- 'Mini PC', 'Monitor', or 'Sepaket'
  `type` VARCHAR(64) DEFAULT 'Corrective', -- 'Corrective', 'Preventive', 'Component Swap'
  `description` TEXT,
  `spare_parts_used` VARCHAR(255) DEFAULT 'N/A',
  `documentation_photo` LONGTEXT, -- Photo URL or Base64 Image
  `new_component_sn` VARCHAR(128) DEFAULT '',
  `new_component_model` VARCHAR(128) DEFAULT '',
  `health_before` INT DEFAULT 0,
  `health_after` INT DEFAULT 100,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table Users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `role` VARCHAR(32) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Default User
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `avatar`) VALUES
('usr-001', 'operator.fids', '$2a$10$e8Z4...mockhash', 'Operator FIDS', 'Operator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

-- 4. Table Spare Parts (Itemized Inventory by Serial Number - Mini PC & Monitor Only)
DROP TABLE IF EXISTS `spare_parts`;
CREATE TABLE `spare_parts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `category` VARCHAR(32) NOT NULL, -- 'Mini PC' or 'Monitor'
  `serial_number` VARCHAR(128) NOT NULL,
  `brand` VARCHAR(64) DEFAULT '',
  `model` VARCHAR(128) DEFAULT '',
  `specs` VARCHAR(255) DEFAULT '',
  `warehouse_location` VARCHAR(255) DEFAULT '',
  `origin_procurement` VARCHAR(255) DEFAULT '',
  `procurement_year` VARCHAR(16) DEFAULT '',
  `condition` VARCHAR(64) DEFAULT 'Bagus / Ready',
  `status` VARCHAR(32) DEFAULT 'Available', -- 'Available', 'In-Use', 'Under-Repair', 'Scrapped'
  `warranty_status` VARCHAR(64) DEFAULT '',
  `notes` TEXT,
  `last_updated` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sp_cat` (`category`),
  INDEX `idx_sp_sn` (`serial_number`),
  INDEX `idx_sp_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Spare Parts
INSERT INTO `spare_parts` (`id`, `category`, `serial_number`, `brand`, `model`, `specs`, `warehouse_location`, `origin_procurement`, `procurement_year`, `condition`, `status`, `warranty_status`, `notes`) VALUES
('SP-PC-001', 'Mini PC', '8CN25202GG', 'HP', 'Thin Client t640', 'AMD Ryzen R1505G, 8GB DDR4, 64GB M.2 SSD, Win 10 IoT', 'Gudang T3 Central - Rak PC-01', 'Pengadaan CAPEX AP II 2024', '2024', 'Bagus / Ready', 'Available', 'Garansi Resmi s/d Des 2026', 'Pre-installed image FIDS Client v4.2'),
('SP-PC-002', 'Mini PC', '8CN25203HA', 'HP', 'Thin Client t640', 'AMD Ryzen R1505G, 8GB DDR4, 64GB M.2 SSD, Win 10 IoT', 'Gudang T3 Central - Rak PC-01', 'Pengadaan CAPEX AP II 2024', '2024', 'Bagus / Ready', 'Available', 'Garansi Resmi s/d Des 2026', 'Unit cadangan staging siap pasang'),
('SP-PC-003', 'Mini PC', '8CN30114AB', 'HP', 'Thin Client Elite t655', 'AMD Ryzen R2314, 16GB DDR4, 128GB NVMe SSD, Win 11 IoT', 'Workshop T2 - Rak B-01', 'Pengadaan InJourney FIDS 2025', '2025', 'Bagus / Ready', 'Available', 'Garansi Resmi s/d Nov 2027', 'Cadangan performa tinggi untuk Gate Display T2'),
('SP-PC-004', 'Mini PC', 'GD20249911X', 'Giada', 'Signage Player D68', 'Intel Core i3-1115G4, 8GB DDR4, 128GB SSD', 'Workshop T1 - Rak A-02', 'Pengadaan Terminal 1 2023', '2023', 'Bagus / Ready', 'Available', 'Garansi Habis (Perawatan Mandiri)', 'Khusus replace unit Giada T1 & T2'),
('SP-PC-005', 'Mini PC', '8CN1920OLD', 'HP', 'Thin Client t630', 'AMD GX-420GI, 4GB RAM, 32GB Flash', 'Workshop PSIT - Meja Servis', 'Eks Copotan Gate 2 T3', '2021', 'Perlu Servis (RMA)', 'Under-Repair', 'Garansi Habis', 'Kendala No Display, sedang diganti IC power'),
('SP-PC-006', 'Mini PC', 'G6PY802OLD', 'Intel', 'NUC 7i3BNK', 'Core i3 Gen 7, 8GB RAM, 120GB SSD', 'Gudang T3 - Area Afkir', 'Eks Copotan Checkin T1A', '2019', 'Afkir / Rusak', 'Scrapped', 'Garansi Habis', 'Mainboard korslet terbakar, tidak dapat diperbaiki'),
('SP-MON-001', 'Monitor', '807KCGWP1775', 'LG', '65UH5C', '65 Inch UHD 4K, 500 nits, 24/7 Heavy Duty Operation', 'Gudang T3 Central - Storage Area C', 'Pengadaan Display Terminal 3 2024', '2024', 'Bagus / Ready', 'Available', 'Garansi Panel LG s/d Ags 2027', 'Panel Grade A untuk Master FIDS T3'),
('SP-MON-002', 'Monitor', '807KCGWP1776', 'LG', '65UH5C', '65 Inch UHD 4K, 500 nits, 24/7 Heavy Duty Operation', 'Gudang T3 Central - Storage Area C', 'Pengadaan Display Terminal 3 2024', '2024', 'Bagus / Ready', 'Available', 'Garansi Panel LG s/d Ags 2027', 'Unit cadangan masih segel dus'),
('SP-MON-003', 'Monitor', '409KCPL90123', 'LG', '43UH5F', '43 Inch UHD Commercial Signage, 24/7 Operation', 'Workshop T2 - Rak Display', 'Pengadaan Boarding Gate T2 2024', '2024', 'Bagus / Ready', 'Available', 'Garansi Panel LG s/d Feb 2027', 'Standar pengganti Boarding Gate & Conveyor Belt'),
('SP-MON-004', 'Monitor', '0B3MH4ZN8001', 'Samsung', 'QB55R', '55 Inch UHD 350 nits Non-glare 16/7 Operation', 'Workshop T1 - Rak Display', 'Pengadaan Terminal 1 2023', '2023', 'Bagus / Ready', 'Available', 'Garansi Resmi s/d Okt 2026', 'Cadangan display Checkin Row T1'),
('SP-MON-005', 'Monitor', '409KCRMA3321', 'LG', '43UH5F', '43 Inch UHD Commercial Display', 'Vendor LG Service Center', 'Eks Gate 12 T3', '2023', 'Perlu Servis (RMA)', 'Under-Repair', 'Klaim Garansi Resmi (Tiket LG-901)', 'Backlight redup sebagian, proses klaim panel baru'),
('SP-MON-006', 'Monitor', '807KCOLD991', 'LG', '65UH5C', '65 Inch UHD Display Panel', 'Gudang T3 - Area Afkir', 'Eks Pintu 4 T3', '2020', 'Afkir / Rusak', 'Scrapped', 'Garansi Habis', 'Layar pecah retak dalam saat renovasi gate');

