package database

import (
	"database/sql"
	"log"
)

// autoMigrate creates required database tables if they do not exist.
func autoMigrate(db *sql.DB) {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS assets (
			id VARCHAR(64) NOT NULL PRIMARY KEY,
			code VARCHAR(64) NOT NULL,
			name VARCHAR(255) NOT NULL,
			category VARCHAR(64) DEFAULT '',
			location_area VARCHAR(255) DEFAULT '',
			terminal VARCHAR(64) DEFAULT '',
			zone VARCHAR(64) DEFAULT '',
			ip_address VARCHAR(45) DEFAULT '',
			status VARCHAR(32) DEFAULT 'Active',
			health_score INT DEFAULT 100,
			mini_pc_origin VARCHAR(64) DEFAULT '',
			mini_pc_brand VARCHAR(64) DEFAULT '',
			mini_pc_model VARCHAR(128) DEFAULT '',
			mini_pc_sn VARCHAR(128) DEFAULT '',
			mini_pc_ports VARCHAR(255) DEFAULT '',
			mini_pc_disk VARCHAR(64) DEFAULT '',
			mini_pc_ram VARCHAR(64) DEFAULT '',
			mini_pc_os VARCHAR(64) DEFAULT '',
			mini_pc_year VARCHAR(16) DEFAULT '',
			mini_pc_condition VARCHAR(64) DEFAULT '',
			mini_pc_warranty VARCHAR(64) DEFAULT '',
			monitor_origin VARCHAR(64) DEFAULT '',
			monitor_brand VARCHAR(64) DEFAULT '',
			monitor_model VARCHAR(128) DEFAULT '',
			monitor_sn VARCHAR(128) DEFAULT '',
			monitor_ports VARCHAR(255) DEFAULT '',
			monitor_size VARCHAR(32) DEFAULT '',
			monitor_year VARCHAR(16) DEFAULT '',
			monitor_condition VARCHAR(64) DEFAULT '',
			monitor_warranty VARCHAR(64) DEFAULT '',
			monitor_converter VARCHAR(128) DEFAULT '',
			last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_terminal (terminal),
			INDEX idx_status (status),
			INDEX idx_code (code)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

		`CREATE TABLE IF NOT EXISTS maintenance_logs (
			id VARCHAR(64) NOT NULL PRIMARY KEY,
			asset_id VARCHAR(64) NOT NULL,
			asset_code VARCHAR(64) NOT NULL,
			asset_name VARCHAR(255) NOT NULL,
			terminal VARCHAR(64) DEFAULT '',
			target_component VARCHAR(64) DEFAULT 'Sepaket',
			type VARCHAR(64) DEFAULT 'Corrective',
			description TEXT,
			spare_parts_used VARCHAR(255) DEFAULT 'N/A',
			documentation_photo LONGTEXT,
			new_component_sn VARCHAR(128) DEFAULT '',
			new_component_model VARCHAR(128) DEFAULT '',
			health_before INT DEFAULT 0,
			health_after INT DEFAULT 100,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

		`CREATE TABLE IF NOT EXISTS map_pins (
			asset_id VARCHAR(64) NOT NULL PRIMARY KEY,
			code VARCHAR(64) NOT NULL,
			name VARCHAR(255) NOT NULL,
			category VARCHAR(64) DEFAULT '',
			terminal VARCHAR(64) DEFAULT '',
			location_area VARCHAR(255) DEFAULT '',
			status VARCHAR(32) DEFAULT 'Active',
			health_score INT DEFAULT 100,
			x_percent DOUBLE DEFAULT 0,
			y_percent DOUBLE DEFAULT 0,
			FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

		`CREATE TABLE IF NOT EXISTS replacement_history (
			id VARCHAR(64) NOT NULL PRIMARY KEY,
			asset_id VARCHAR(64) NOT NULL,
			asset_code VARCHAR(64) NOT NULL,
			asset_name VARCHAR(255) NOT NULL,
			terminal VARCHAR(64) DEFAULT '',
			location_area VARCHAR(255) DEFAULT '',
			component_type VARCHAR(32) NOT NULL,
			old_brand VARCHAR(64) DEFAULT '',
			old_model VARCHAR(128) DEFAULT '',
			old_sn VARCHAR(128) DEFAULT '',
			new_brand VARCHAR(64) DEFAULT '',
			new_model VARCHAR(128) DEFAULT '',
			new_sn VARCHAR(128) DEFAULT '',
			reason VARCHAR(255) DEFAULT '',
			old_status VARCHAR(64) DEFAULT 'In Repair',
			technician_name VARCHAR(128) DEFAULT 'Teknisi Maintenance',
			replaced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_hist_asset (asset_id),
			INDEX idx_hist_comp (component_type)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

		`CREATE TABLE IF NOT EXISTS spare_parts (
			id VARCHAR(64) NOT NULL PRIMARY KEY,
			category VARCHAR(32) NOT NULL,
			serial_number VARCHAR(128) NOT NULL,
			brand VARCHAR(64) DEFAULT '',
			model VARCHAR(128) DEFAULT '',
			specs VARCHAR(255) DEFAULT '',
			warehouse_location VARCHAR(255) DEFAULT '',
			origin_procurement VARCHAR(255) DEFAULT '',
			procurement_year VARCHAR(16) DEFAULT '',
			` + "`condition`" + ` VARCHAR(64) DEFAULT 'Bagus / Ready',
			status VARCHAR(32) DEFAULT 'Available',
			warranty_status VARCHAR(64) DEFAULT '',
			notes TEXT,
			last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_sp_cat (category),
			INDEX idx_sp_sn (serial_number),
			INDEX idx_sp_status (status)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
	}

	for _, q := range queries {
		if _, err := db.Exec(q); err != nil {
			log.Fatalf("❌ Auto-migrate failed: %v", err)
		}
	}
	log.Println("✅ Database schema ready")
}
