package database

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"fids-backend/models"
)

// initInMemory reads CSV files into memory when MySQL is unavailable.
func initInMemory() {
	possiblePaths := []string{".", "..", "c:/Users/IDHAM/Downloads/FIDS"}
	var csv1Path, csv2Path string
	for _, p := range possiblePaths {
		c1 := filepath.Join(p, "Data ASET PSIT Paling Fix Gajelasss.xlsx - T1, T2 & Non Terminal.csv")
		c2 := filepath.Join(p, "Data ASET PSIT Paling Fix Gajelasss.xlsx - T3.csv")
		if _, err := os.Stat(c1); err == nil && csv1Path == "" {
			csv1Path = c1
		}
		if _, err := os.Stat(c2); err == nil && csv2Path == "" {
			csv2Path = c2
		}
	}

	var allAssets []models.Asset
	if csv1Path != "" {
		a1 := parseCSV1(csv1Path)
		allAssets = append(allAssets, a1...)
		log.Printf("📄 Parsed %d assets from T1, T2 & Non Terminal CSV", len(a1))
	}
	if csv2Path != "" {
		a2 := parseCSV2(csv2Path)
		allAssets = append(allAssets, a2...)
		log.Printf("📄 Parsed %d assets from T3 CSV", len(a2))
	}

	memMu.Lock()
	memAssets = allAssets

	// Generate initial map pins
	for i, ast := range allAssets {
		if i < 45 {
			x := 15.0 + float64((i*17)%75)
			y := 20.0 + float64((i*23)%65)
			memPins = append(memPins, models.MapPin{
				AssetID:      ast.ID,
				Code:         ast.Code,
				Name:         ast.Name,
				Category:     ast.Category,
				Terminal:     ast.Terminal,
				LocationArea: ast.LocationArea,
				Status:       ast.Status,
				HealthScore:  ast.HealthScore,
				XPercent:     x,
				YPercent:     y,
			})
		}
	}

	memLogs = []models.MaintenanceLog{}
	memHistory = []models.ReplacementHistory{}
	memSpareParts = []models.SparePart{}

	memMu.Unlock()
	log.Printf("🚀 In-Memory DB ready with %d assets, %d pins, %d logs, %d replacement histories, %d spare parts", len(memAssets), len(memPins), len(memLogs), len(memHistory), len(memSpareParts))
}

// seedFromCSVsIfEmpty seeds the MySQL database on first startup if empty.
func seedFromCSVsIfEmpty(db *sql.DB) {
	var count int
	if err := db.QueryRow("SELECT COUNT(*) FROM assets").Scan(&count); err != nil {
		log.Printf("⚠️  Could not check assets count: %v", err)
		return
	}
	if count > 0 {
		log.Printf("ℹ️  Assets table already has %d rows — skipping CSV seed", count)
		return
	}

	possiblePaths := []string{".", "..", "c:/Users/IDHAM/Downloads/FIDS"}
	var csv1Path, csv2Path string
	for _, p := range possiblePaths {
		c1 := filepath.Join(p, "Data ASET PSIT Paling Fix Gajelasss.xlsx - T1, T2 & Non Terminal.csv")
		c2 := filepath.Join(p, "Data ASET PSIT Paling Fix Gajelasss.xlsx - T3.csv")
		if _, err := os.Stat(c1); err == nil && csv1Path == "" {
			csv1Path = c1
		}
		if _, err := os.Stat(c2); err == nil && csv2Path == "" {
			csv2Path = c2
		}
	}

	var allAssets []models.Asset
	if csv1Path != "" {
		a1 := parseCSV1(csv1Path)
		allAssets = append(allAssets, a1...)
		log.Printf("📄 Parsed %d assets from T1, T2 & Non Terminal CSV", len(a1))
	}
	if csv2Path != "" {
		a2 := parseCSV2(csv2Path)
		allAssets = append(allAssets, a2...)
		log.Printf("📄 Parsed %d assets from T3 CSV", len(a2))
	}

	if len(allAssets) == 0 {
		log.Println("⚠️  No CSV data found to seed")
		return
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("❌ Could not start transaction: %v", err)
	}

	insertAsset := `INSERT IGNORE INTO assets
		(id, code, name, category, location_area, terminal, zone, ip_address, status, health_score,
		mini_pc_origin, mini_pc_brand, mini_pc_model, mini_pc_sn, mini_pc_ports, mini_pc_disk,
		mini_pc_ram, mini_pc_os, mini_pc_year, mini_pc_condition, mini_pc_warranty,
		monitor_origin, monitor_brand, monitor_model, monitor_sn, monitor_ports, monitor_size,
		monitor_year, monitor_condition, monitor_warranty, monitor_converter, last_update)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

	stmt, err := tx.Prepare(insertAsset)
	if err != nil {
		tx.Rollback()
		log.Fatalf("❌ Prepare insert failed: %v", err)
	}
	defer stmt.Close()

	pinIndex := 0
	insertedCount := 0
	var pinAssets []models.Asset

	for _, ast := range allAssets {
		_, err := stmt.Exec(
			ast.ID, ast.Code, ast.Name, ast.Category, ast.LocationArea,
			ast.Terminal, ast.Zone, ast.IPAddress, ast.Status, ast.HealthScore,
			ast.MiniPCOrigin, ast.MiniPCBrand, ast.MiniPCModel, ast.MiniPCSN, ast.MiniPCPorts,
			ast.MiniPCDisk, ast.MiniPCRAM, ast.MiniPCOS, ast.MiniPCYear, ast.MiniPCCondition,
			ast.MiniPCWarranty,
			ast.MonitorOrigin, ast.MonitorBrand, ast.MonitorModel, ast.MonitorSN, ast.MonitorPorts,
			ast.MonitorSize, ast.MonitorYear, ast.MonitorCondition, ast.MonitorWarranty,
			ast.MonitorConverter, ast.LastUpdate,
		)
		if err != nil {
			log.Printf("⚠️  Skipping asset %s: %v", ast.ID, err)
			continue
		}
		insertedCount++
		if pinIndex < 45 {
			pinAssets = append(pinAssets, ast)
			pinIndex++
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("❌ Commit failed: %v", err)
	}

	log.Printf("🚀 Seeded %d assets into MySQL", insertedCount)
	seedMapPins(db, pinAssets)
}

func seedMapPins(db *sql.DB, assets []models.Asset) {
	tx, _ := db.Begin()
	stmt, err := tx.Prepare(`INSERT IGNORE INTO map_pins
		(asset_id, code, name, category, terminal, location_area, status, health_score, x_percent, y_percent)
		VALUES (?,?,?,?,?,?,?,?,?,?)`)
	if err != nil {
		tx.Rollback()
		return
	}
	defer stmt.Close()

	for i, ast := range assets {
		x := 15.0 + float64((i*17)%75)
		y := 20.0 + float64((i*23)%65)
		stmt.Exec(ast.ID, ast.Code, ast.Name, ast.Category, ast.Terminal,
			ast.LocationArea, ast.Status, ast.HealthScore, x, y)
	}
	tx.Commit()
	log.Printf("📍 Seeded %d map pins", len(assets))
}

func getSafe(row []string, idx int) string {
	if idx >= 0 && idx < len(row) {
		return strings.TrimSpace(row[idx])
	}
	return ""
}

func parseHealthScore(condStr string) int {
	clean := strings.ReplaceAll(condStr, "%", "")
	clean = strings.ReplaceAll(clean, "Normal", "")
	clean = strings.TrimSpace(clean)
	if val, err := strconv.Atoi(clean); err == nil && val >= 0 && val <= 100 {
		return val
	}
	if strings.Contains(strings.ToLower(condStr), "normal") {
		return 90
	}
	return 85
}

func parseCSV1(filePath string) []models.Asset {
	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("Error opening CSV 1: %v", err)
		return nil
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1

	rows, err := reader.ReadAll()
	if err != nil {
		log.Printf("Error reading CSV 1 lines: %v", err)
		return nil
	}

	var assets []models.Asset
	currentTerminalHeader := "T1"

	for i, row := range rows {
		if i < 2 || len(row) < 5 {
			continue
		}

		cgear := getSafe(row, 1)
		name := getSafe(row, 2)

		if strings.HasPrefix(strings.ToUpper(cgear), "TERMINAL") || strings.HasPrefix(strings.ToUpper(name), "TERMINAL") {
			if name != "" {
				currentTerminalHeader = name
			} else {
				currentTerminalHeader = cgear
			}
			continue
		}

		location := getSafe(row, 3)
		terminal := getSafe(row, 4)
		zone := getSafe(row, 5)
		ip := getSafe(row, 6)

		if name == "" && location == "" && ip == "" {
			continue
		}

		if terminal == "" {
			terminal = currentTerminalHeader
		}

		id := fmt.Sprintf("ast-t1t2-%d", i)
		code := fmt.Sprintf("FIDS-%s-%03d", strings.ReplaceAll(terminal, " ", ""), i)
		if cgear != "" && cgear != "-" {
			code = fmt.Sprintf("FIDS-%s-%s", strings.ReplaceAll(terminal, " ", ""), cgear)
		}

		miniPCBrand := getSafe(row, 8)
		miniPCModel := getSafe(row, 9)
		miniPCCond := getSafe(row, 16)
		health := parseHealthScore(miniPCCond)

		status := "Active"
		if health < 60 {
			status = "Maintenance"
		} else if strings.Contains(strings.ToLower(location), "gudang") || strings.Contains(strings.ToLower(name), "spare") {
			status = "In Storage"
		}

		category := "Flight Information Board"
		if strings.Contains(strings.ToLower(zone), "checkin") || strings.Contains(strings.ToLower(location), "checkin") {
			category = "Check-in Counter"
		} else if strings.Contains(strings.ToLower(zone), "gate") || strings.Contains(strings.ToLower(location), "gate") {
			category = "Gate Display"
		} else if strings.Contains(strings.ToLower(zone), "baggage") || strings.Contains(strings.ToLower(location), "baggage") {
			category = "Baggage Claim"
		} else if strings.Contains(strings.ToLower(location), "departure") {
			category = "Master Departure"
		}

		assetName := name
		if assetName == "" {
			assetName = fmt.Sprintf("Display %s", location)
		}

		ast := models.Asset{
			ID:               id,
			Code:             code,
			Name:             assetName,
			Category:         category,
			LocationArea:     location,
			Terminal:         terminal,
			Zone:             zone,
			IPAddress:        ip,
			Status:           status,
			HealthScore:      health,
			MiniPCOrigin:     getSafe(row, 7),
			MiniPCBrand:      miniPCBrand,
			MiniPCModel:      miniPCModel,
			MiniPCSN:         getSafe(row, 10),
			MiniPCPorts:      getSafe(row, 11),
			MiniPCDisk:       getSafe(row, 12),
			MiniPCRAM:        getSafe(row, 13),
			MiniPCOS:         getSafe(row, 14),
			MiniPCYear:       getSafe(row, 15),
			MiniPCCondition:  miniPCCond,
			MiniPCWarranty:   getSafe(row, 17),
			MonitorOrigin:    getSafe(row, 18),
			MonitorBrand:     getSafe(row, 19),
			MonitorModel:     getSafe(row, 20),
			MonitorSN:        getSafe(row, 21),
			MonitorPorts:     getSafe(row, 22),
			MonitorSize:      getSafe(row, 23),
			MonitorYear:      getSafe(row, 24),
			MonitorCondition: getSafe(row, 25),
			MonitorWarranty:  "",
			MonitorConverter: getSafe(row, 28),
			LastUpdate:       time.Now(),
		}

		assets = append(assets, ast)
	}

	return assets
}

func parseCSV2(filePath string) []models.Asset {
	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("Error opening CSV 2: %v", err)
		return nil
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1

	rows, err := reader.ReadAll()
	if err != nil {
		log.Printf("Error reading CSV 2 lines: %v", err)
		return nil
	}

	var assets []models.Asset

	for i, row := range rows {
		if i < 2 || len(row) < 5 {
			continue
		}

		location := getSafe(row, 1)
		terminal := getSafe(row, 2)
		zone := getSafe(row, 3)
		ip := getSafe(row, 4)

		if location == "" && ip == "" {
			continue
		}

		id := fmt.Sprintf("ast-t3-%d", i)
		code := fmt.Sprintf("FIDS-T3-%03d", i)

		miniPCCond := getSafe(row, 14)
		health := parseHealthScore(miniPCCond)

		status := "Active"
		if health < 60 {
			status = "Maintenance"
		} else if strings.Contains(strings.ToLower(location), "gudang") {
			status = "In Storage"
		}

		category := "Flight Information Board"
		if strings.Contains(strings.ToLower(zone), "checkin") || strings.Contains(strings.ToLower(location), "checkin") {
			category = "Check-in Counter"
		} else if strings.Contains(strings.ToLower(zone), "gate") || strings.Contains(strings.ToLower(location), "gate") {
			category = "Gate Display"
		} else if strings.Contains(strings.ToLower(zone), "baggage") || strings.Contains(strings.ToLower(location), "baggage") {
			category = "Baggage Claim"
		} else if strings.Contains(strings.ToLower(location), "departure") {
			category = "Master Departure"
		}

		ast := models.Asset{
			ID:               id,
			Code:             code,
			Name:             location,
			Category:         category,
			LocationArea:     location,
			Terminal:         terminal,
			Zone:             zone,
			IPAddress:        ip,
			Status:           status,
			HealthScore:      health,
			MiniPCOrigin:     getSafe(row, 5),
			MiniPCBrand:      getSafe(row, 6),
			MiniPCModel:      getSafe(row, 7),
			MiniPCSN:         getSafe(row, 8),
			MiniPCPorts:      getSafe(row, 9),
			MiniPCDisk:       getSafe(row, 10),
			MiniPCRAM:        getSafe(row, 11),
			MiniPCOS:         getSafe(row, 12),
			MiniPCYear:       getSafe(row, 13),
			MiniPCCondition:  miniPCCond,
			MiniPCWarranty:   getSafe(row, 15),
			MonitorOrigin:    getSafe(row, 16),
			MonitorBrand:     getSafe(row, 17),
			MonitorModel:     getSafe(row, 18),
			MonitorSN:        getSafe(row, 19),
			MonitorPorts:     getSafe(row, 20),
			MonitorSize:      getSafe(row, 21),
			MonitorYear:      getSafe(row, 22),
			MonitorCondition: getSafe(row, 23),
			MonitorWarranty:  getSafe(row, 24),
			MonitorConverter: "",
			LastUpdate:       time.Now(),
		}

		assets = append(assets, ast)
	}

	return assets
}
