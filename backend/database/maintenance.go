package database

import (
	"fmt"
	"log"
	"time"

	"fids-backend/models"
)

// GetLogs fetches maintenance logs in descending creation order.
func GetLogs() []models.MaintenanceLog {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()
		return memLogs
	}

	rows, err := DB.Query(`SELECT id, asset_id, asset_code, asset_name, terminal, target_component, type,
		description, spare_parts_used, documentation_photo, new_component_sn, new_component_model,
		health_before, health_after, created_at
		FROM maintenance_logs ORDER BY created_at DESC`)
	if err != nil {
		log.Printf("❌ GetLogs error: %v", err)
		return nil
	}
	defer rows.Close()

	var logs []models.MaintenanceLog
	for rows.Next() {
		var l models.MaintenanceLog
		rows.Scan(&l.ID, &l.AssetID, &l.AssetCode, &l.AssetName, &l.Terminal,
			&l.TargetComponent, &l.Type, &l.Description, &l.SparePartsUsed,
			&l.DocumentationPhoto, &l.NewComponentSN, &l.NewComponentModel,
			&l.HealthBefore, &l.HealthAfter, &l.CreatedAt)
		logs = append(logs, l)
	}
	return logs
}

// AddLog creates a new maintenance log and updates the asset health.
func AddLog(logData models.MaintenanceLog) models.MaintenanceLog {
	if useMemory || DB == nil {
		memMu.Lock()
		defer memMu.Unlock()

		logData.ID = fmt.Sprintf("LOG-2026-%03d", len(memLogs)+1)
		logData.CreatedAt = time.Now()
		if logData.TargetComponent == "" {
			logData.TargetComponent = "Sepaket"
		}
		memLogs = append([]models.MaintenanceLog{logData}, memLogs...)

		// Update asset in memory
		for i, a := range memAssets {
			if a.ID == logData.AssetID {
				memAssets[i].HealthScore = logData.HealthAfter
				if logData.HealthAfter < 60 {
					memAssets[i].Status = "Maintenance"
				} else {
					memAssets[i].Status = "Active"
				}
				if logData.Type == "Component Swap" || logData.NewComponentSN != "" {
					oldBrand := a.MiniPCBrand
					oldModel := a.MiniPCModel
					oldSN := a.MiniPCSN
					compType := logData.TargetComponent
					if compType == "Monitor" {
						oldBrand = a.MonitorBrand
						oldModel = a.MonitorModel
						oldSN = a.MonitorSN
					}

					rep := models.ReplacementHistory{
						ID:             fmt.Sprintf("REP-2026-%03d", len(memHistory)+1),
						AssetID:        a.ID,
						AssetCode:      a.Code,
						AssetName:      a.Name,
						Terminal:       a.Terminal,
						LocationArea:   a.LocationArea,
						ComponentType:  compType,
						OldBrand:       oldBrand,
						OldModel:       oldModel,
						OldSN:          oldSN,
						NewBrand:       oldBrand,
						NewModel:       logData.NewComponentModel,
						NewSN:          logData.NewComponentSN,
						Reason:         logData.Description,
						OldStatus:      "Scrapped / In Repair",
						TechnicianName: "Teknisi Maintenance",
						ReplacedAt:     time.Now(),
					}
					memHistory = append([]models.ReplacementHistory{rep}, memHistory...)

					if logData.TargetComponent == "Mini PC" && logData.NewComponentSN != "" {
						memAssets[i].MiniPCSN = logData.NewComponentSN
						if logData.NewComponentModel != "" {
							memAssets[i].MiniPCModel = logData.NewComponentModel
						}
					} else if logData.TargetComponent == "Monitor" && logData.NewComponentSN != "" {
						memAssets[i].MonitorSN = logData.NewComponentSN
						if logData.NewComponentModel != "" {
							memAssets[i].MonitorModel = logData.NewComponentModel
						}
					}
				}
				memAssets[i].LastUpdate = time.Now()
				break
			}
		}

		// Update pin in memory
		for i, p := range memPins {
			if p.AssetID == logData.AssetID {
				memPins[i].HealthScore = logData.HealthAfter
				if logData.HealthAfter < 60 {
					memPins[i].Status = "Maintenance"
				} else {
					memPins[i].Status = "Active"
				}
				break
			}
		}
		return logData
	}

	var count int
	DB.QueryRow("SELECT COUNT(*) FROM maintenance_logs").Scan(&count)
	logData.ID = fmt.Sprintf("LOG-2026-%03d", count+1)
	logData.CreatedAt = time.Now()
	if logData.TargetComponent == "" {
		logData.TargetComponent = "Sepaket"
	}

	_, err := DB.Exec(`INSERT INTO maintenance_logs
		(id, asset_id, asset_code, asset_name, terminal, target_component, type, description,
		spare_parts_used, documentation_photo, new_component_sn, new_component_model,
		health_before, health_after, created_at)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		logData.ID, logData.AssetID, logData.AssetCode, logData.AssetName, logData.Terminal,
		logData.TargetComponent, logData.Type, logData.Description, logData.SparePartsUsed,
		logData.DocumentationPhoto, logData.NewComponentSN, logData.NewComponentModel,
		logData.HealthBefore, logData.HealthAfter, logData.CreatedAt,
	)
	if err != nil {
		log.Printf("❌ AddLog insert error: %v", err)
		return logData
	}

	newStatus := "Active"
	if logData.HealthAfter < 60 {
		newStatus = "Maintenance"
	}

	updateAssetQuery := `UPDATE assets SET health_score = ?, status = ?, last_update = NOW()`
	args := []interface{}{logData.HealthAfter, newStatus}

	if logData.Type == "Component Swap" || logData.NewComponentSN != "" {
		switch logData.TargetComponent {
		case "Mini PC":
			if logData.NewComponentSN != "" {
				updateAssetQuery += ", mini_pc_sn = ?"
				args = append(args, logData.NewComponentSN)
			}
			if logData.NewComponentModel != "" {
				updateAssetQuery += ", mini_pc_model = ?"
				args = append(args, logData.NewComponentModel)
			}
			updateAssetQuery += fmt.Sprintf(", mini_pc_condition = '%d%%'", logData.HealthAfter)
		case "Monitor":
			if logData.NewComponentSN != "" {
				updateAssetQuery += ", monitor_sn = ?"
				args = append(args, logData.NewComponentSN)
			}
			if logData.NewComponentModel != "" {
				updateAssetQuery += ", monitor_model = ?"
				args = append(args, logData.NewComponentModel)
			}
			updateAssetQuery += fmt.Sprintf(", monitor_condition = '%d%%'", logData.HealthAfter)
		}
	}

	updateAssetQuery += " WHERE id = ?"
	args = append(args, logData.AssetID)

	if _, err := DB.Exec(updateAssetQuery, args...); err != nil {
		log.Printf("⚠️  UpdateAsset after log error: %v", err)
	}

	DB.Exec(`UPDATE map_pins SET status = ?, health_score = ? WHERE asset_id = ?`,
		newStatus, logData.HealthAfter, logData.AssetID)

	return logData
}
