package database

import (
	"bytes"
	"encoding/csv"
	"log"
	"strconv"
	"strings"

	"fids-backend/models"
)

// GetAssets fetches assets matching query, status, and terminal filters.
func GetAssets(q, status, terminal string) []models.Asset {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()

		var results []models.Asset
		for _, a := range memAssets {
			if status != "" && strings.ToLower(status) != "all" && strings.ToLower(a.Status) != strings.ToLower(status) {
				continue
			}
			if terminal != "" && strings.ToLower(terminal) != "all" && !strings.Contains(strings.ToLower(a.Terminal), strings.ToLower(terminal)) {
				continue
			}
			if q != "" {
				ql := strings.ToLower(q)
				match := strings.Contains(strings.ToLower(a.Code), ql) ||
					strings.Contains(strings.ToLower(a.Name), ql) ||
					strings.Contains(strings.ToLower(a.LocationArea), ql) ||
					strings.Contains(strings.ToLower(a.IPAddress), ql) ||
					strings.Contains(strings.ToLower(a.MiniPCBrand), ql) ||
					strings.Contains(strings.ToLower(a.MiniPCModel), ql) ||
					strings.Contains(strings.ToLower(a.MonitorBrand), ql) ||
					strings.Contains(strings.ToLower(a.MonitorSN), ql) ||
					strings.Contains(strings.ToLower(a.MiniPCSN), ql)
				if !match {
					continue
				}
			}
			results = append(results, a)
		}
		return results
	}

	query := `SELECT id, code, name, category, location_area, terminal, zone, ip_address, status, health_score,
		mini_pc_origin, mini_pc_brand, mini_pc_model, mini_pc_sn, mini_pc_ports, mini_pc_disk,
		mini_pc_ram, mini_pc_os, mini_pc_year, mini_pc_condition, mini_pc_warranty,
		monitor_origin, monitor_brand, monitor_model, monitor_sn, monitor_ports, monitor_size,
		monitor_year, monitor_condition, monitor_warranty, monitor_converter, last_update
		FROM assets WHERE 1=1`

	args := []interface{}{}

	if status != "" && strings.ToLower(status) != "all" {
		query += " AND LOWER(status) = ?"
		args = append(args, strings.ToLower(status))
	}
	if terminal != "" && strings.ToLower(terminal) != "all" {
		query += " AND LOWER(terminal) LIKE ?"
		args = append(args, "%"+strings.ToLower(terminal)+"%")
	}
	if q != "" {
		qLike := "%" + strings.ToLower(q) + "%"
		query += ` AND (LOWER(code) LIKE ? OR LOWER(name) LIKE ? OR LOWER(location_area) LIKE ?
			OR LOWER(ip_address) LIKE ? OR LOWER(mini_pc_brand) LIKE ? OR LOWER(mini_pc_model) LIKE ?
			OR LOWER(monitor_brand) LIKE ? OR LOWER(monitor_sn) LIKE ? OR LOWER(mini_pc_sn) LIKE ?)`
		for i := 0; i < 9; i++ {
			args = append(args, qLike)
		}
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		log.Printf("❌ GetAssets query error: %v", err)
		return nil
	}
	defer rows.Close()

	var assets []models.Asset
	for rows.Next() {
		var a models.Asset
		err := rows.Scan(
			&a.ID, &a.Code, &a.Name, &a.Category, &a.LocationArea, &a.Terminal, &a.Zone,
			&a.IPAddress, &a.Status, &a.HealthScore,
			&a.MiniPCOrigin, &a.MiniPCBrand, &a.MiniPCModel, &a.MiniPCSN, &a.MiniPCPorts,
			&a.MiniPCDisk, &a.MiniPCRAM, &a.MiniPCOS, &a.MiniPCYear, &a.MiniPCCondition, &a.MiniPCWarranty,
			&a.MonitorOrigin, &a.MonitorBrand, &a.MonitorModel, &a.MonitorSN, &a.MonitorPorts,
			&a.MonitorSize, &a.MonitorYear, &a.MonitorCondition, &a.MonitorWarranty,
			&a.MonitorConverter, &a.LastUpdate,
		)
		if err != nil {
			log.Printf("⚠️  Row scan error: %v", err)
			continue
		}
		assets = append(assets, a)
	}
	return assets
}

// GetMetrics calculates dashboard summary statistics.
func GetMetrics() models.DashboardMetrics {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()

		total := len(memAssets)
		active := 0
		needService := 0
		inStorage := 0
		healthSum := 0.0

		for _, a := range memAssets {
			healthSum += float64(a.HealthScore)
			switch a.Status {
			case "Active":
				active++
			case "Maintenance":
				needService++
			case "In Storage":
				inStorage++
			}
		}

		avgHealth := 95.0
		if total > 0 {
			avgHealth = healthSum / float64(total)
		}

		sla := 99.85
		if needService > 20 {
			sla = 99.20
		}

		return models.DashboardMetrics{
			TargetSLA:           99.8,
			ActualSLA:           sla,
			AvgHealthScore:      avgHealth,
			TotalAssets:         total,
			ActiveAssets:        active,
			NeedService:         needService,
			InStorageAssets:     inStorage,
			TotalLogsCount:      len(memLogs),
			TotalMiniPCs:        total,
			ActiveMiniPCs:       active,
			MaintenanceMiniPCs:  needService,
			TotalMonitors:       total,
			ActiveMonitors:      active,
			MaintenanceMonitors: needService,
		}
	}

	var total, active, needService, inStorage int
	var healthSum float64

	rows, err := DB.Query("SELECT status, health_score FROM assets")
	if err != nil {
		log.Printf("❌ GetMetrics error: %v", err)
		return models.DashboardMetrics{}
	}
	defer rows.Close()

	for rows.Next() {
		var status string
		var hs int
		rows.Scan(&status, &hs)
		total++
		healthSum += float64(hs)
		switch status {
		case "Active":
			active++
		case "Maintenance":
			needService++
		case "In Storage":
			inStorage++
		}
	}

	avgHealth := 95.0
	if total > 0 {
		avgHealth = healthSum / float64(total)
	}

	sla := 99.85
	if needService > 20 {
		sla = 99.20
	}

	var logsCount int
	DB.QueryRow("SELECT COUNT(*) FROM maintenance_logs").Scan(&logsCount)

	return models.DashboardMetrics{
		TargetSLA:           99.8,
		ActualSLA:           sla,
		AvgHealthScore:      avgHealth,
		TotalAssets:         total,
		ActiveAssets:        active,
		NeedService:         needService,
		InStorageAssets:     inStorage,
		TotalLogsCount:      logsCount,
		TotalMiniPCs:        total,
		ActiveMiniPCs:       active,
		MaintenanceMiniPCs:  needService,
		TotalMonitors:       total,
		ActiveMonitors:      active,
		MaintenanceMonitors: needService,
	}
}

// ExportCSV exports asset records into CSV byte buffer.
func ExportCSV(q, status, terminal string) []byte {
	assets := GetAssets(q, status, terminal)

	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	writer.Write([]string{
		"ID", "Kode Aset", "Nama Peralatan", "Lokasi", "Terminal", "Zona", "IP Address", "Status", "Health Score",
		"Mini PC Merk", "Mini PC Model", "Mini PC S/N", "Mini PC OS", "Mini PC RAM", "Mini PC Disk",
		"Monitor Merk", "Monitor Model", "Monitor S/N", "Monitor Ukuran", "Converter",
	})

	for _, a := range assets {
		writer.Write([]string{
			a.ID, a.Code, a.Name, a.LocationArea, a.Terminal, a.Zone, a.IPAddress, a.Status, strconv.Itoa(a.HealthScore),
			a.MiniPCBrand, a.MiniPCModel, a.MiniPCSN, a.MiniPCOS, a.MiniPCRAM, a.MiniPCDisk,
			a.MonitorBrand, a.MonitorModel, a.MonitorSN, a.MonitorSize, a.MonitorConverter,
		})
	}

	writer.Flush()
	return buf.Bytes()
}
