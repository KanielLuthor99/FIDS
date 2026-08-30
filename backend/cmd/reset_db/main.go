package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "root:@tcp(127.0.0.1:3306)/fids_db?timeout=3s"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ Connection setup failed: %v", err)
	}
	defer db.Close()

	db.SetConnMaxLifetime(time.Minute * 1)

	if err := db.Ping(); err != nil {
		log.Fatalf("⚠️ MySQL belum aktif / tidak dapat dihubungi di port 3306 (%v).\n👉 Pastikan MySQL sudah di-START di XAMPP / Laragon / Windows Services.", err)
	}

	queries := []string{
		"SET FOREIGN_KEY_CHECKS = 0;",
		"TRUNCATE TABLE assets;",
		"TRUNCATE TABLE map_pins;",
		"TRUNCATE TABLE maintenance_logs;",
		"TRUNCATE TABLE replacement_history;",
		"TRUNCATE TABLE spare_parts;",
		"SET FOREIGN_KEY_CHECKS = 1;",
	}

	for _, q := range queries {
		if _, err := db.Exec(q); err != nil {
			log.Fatalf("❌ Error executing '%s': %v", q, err)
		}
	}

	fmt.Println("🎉 [BERHASIL] Tabel database MySQL fids_db telah dikosongkan dan siap untuk re-seed data baru!")
}
