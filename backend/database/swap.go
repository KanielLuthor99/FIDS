package database

import (
	"fmt"
	"log"
	"strings"
	"time"

	"fids-backend/models"
)

// ExecuteSwap executes a 6-step multi-table hardware replacement transaction.
func ExecuteSwap(req models.SwapRequest) (models.ReplacementHistory, error) {
	now := time.Now()
	repID := fmt.Sprintf("REP-2026-%03d", now.Unix()%10000)

	var asset models.Asset
	var found bool

	// In-Memory Mode
	if useMemory || DB == nil {
		memMu.Lock()
		defer memMu.Unlock()

		for i, a := range memAssets {
			if a.ID == req.AssetID {
				asset = a
				found = true

				// 1. Update Asset hardware fields
				if req.ComponentType == "Mini PC" {
					memAssets[i].MiniPCBrand = req.NewBrand
					memAssets[i].MiniPCModel = req.NewModel
					memAssets[i].MiniPCSN = req.NewSN
					memAssets[i].MiniPCCondition = "100%"
				} else {
					memAssets[i].MonitorBrand = req.NewBrand
					memAssets[i].MonitorModel = req.NewModel
					memAssets[i].MonitorSN = req.NewSN
					memAssets[i].MonitorCondition = "100%"
				}
				memAssets[i].HealthScore = 100
				memAssets[i].Status = "Active"
				memAssets[i].LastUpdate = now
				break
			}
		}

		if !found {
			return models.ReplacementHistory{}, fmt.Errorf("asset not found")
		}

		// 2. Update Map Pin
		for i, p := range memPins {
			if p.AssetID == req.AssetID {
				memPins[i].Status = "Active"
				memPins[i].HealthScore = 100
				break
			}
		}

		// 3. Mark New Spare Part as In-Use
		if req.NewSparePartID != "" {
			for i, sp := range memSpareParts {
				if sp.ID == req.NewSparePartID {
					memSpareParts[i].Status = "In-Use"
					memSpareParts[i].Notes = fmt.Sprintf("Terpasang di aset %s (%s)", asset.Code, asset.Name)
					memSpareParts[i].LastUpdated = now
					break
				}
			}
		}

		// 4. Register Old Part to Spare Parts Registry
		if req.OldSN != "" && req.OldSN != "N/A" {
			oldCond := "Perlu Servis (RMA)"
			oldStat := "Under-Repair"
			disposalLoc := req.OldDisposalLoc
			if disposalLoc == "" {
				disposalLoc = "Workshop IT Maintenance"
			}
			if strings.Contains(strings.ToLower(req.OldDisposal), "scrap") || strings.Contains(strings.ToLower(req.OldDisposal), "afkir") ||
				strings.Contains(strings.ToLower(req.OldStatus), "scrap") || strings.Contains(strings.ToLower(req.OldStatus), "afkir") {
				oldCond = "Afkir / Rusak"
				oldStat = "Scrapped"
			} else if strings.Contains(strings.ToLower(req.OldDisposal), "simpan") || strings.Contains(strings.ToLower(req.OldDisposal), "storage") {
				oldCond = "Bagus / Ready"
				oldStat = "Available"
			}
			oldSpID := fmt.Sprintf("SP-OLD-%d", now.Unix()%100000)
			oldOrigin := req.OldOrigin
			if oldOrigin == "" {
				oldOrigin = "Copotan Unit Lapangan"
			}
			memSpareParts = append(memSpareParts, models.SparePart{
				ID:                oldSpID,
				Category:          req.ComponentType,
				SerialNumber:      req.OldSN,
				Brand:             req.OldBrand,
				Model:             req.OldModel,
				Specs:             fmt.Sprintf("Unit eks copotan dari %s (%s)", asset.Code, asset.LocationArea),
				WarehouseLocation: disposalLoc,
				OriginProcurement: oldOrigin,
				ProcurementYear:   "2023",
				Condition:         oldCond,
				Status:            oldStat,
				WarrantyStatus:    "Perlu Pengecekan",
				Notes:             fmt.Sprintf("Alasan swap: %s. Teknisi: %s. Disposisi: %s", req.Reason, req.TechnicianName, req.OldDisposal),
				LastUpdated:       now,
			})
		}

		// 5. Create Replacement History record
		hist := models.ReplacementHistory{
			ID:             repID,
			AssetID:        asset.ID,
			AssetCode:      asset.Code,
			AssetName:      asset.Name,
			Terminal:       asset.Terminal,
			LocationArea:   asset.LocationArea,
			ComponentType:  req.ComponentType,
			OldBrand:       req.OldBrand,
			OldModel:       req.OldModel,
			OldSN:          req.OldSN,
			OldOrigin:      req.OldOrigin,
			OldDisposal:    req.OldDisposal,
			OldDisposalLoc: req.OldDisposalLoc,
			NewBrand:       req.NewBrand,
			NewModel:       req.NewModel,
			NewSN:          req.NewSN,
			NewOrigin:      req.NewOrigin,
			Reason:         req.Reason,
			OldStatus:      req.OldStatus,
			TechnicianName: req.TechnicianName,
			ReplacedAt:     now,
		}
		memHistory = append([]models.ReplacementHistory{hist}, memHistory...)

		// 6. Add Maintenance Log
		logData := models.MaintenanceLog{
			ID:                fmt.Sprintf("LOG-SWAP-%d", now.Unix()%10000),
			AssetID:           asset.ID,
			AssetCode:         asset.Code,
			AssetName:         asset.Name,
			Terminal:          asset.Terminal,
			TargetComponent:   req.ComponentType,
			Type:              "Component Swap",
			Description:       fmt.Sprintf("Swap %s: SN Lama [%s] diganti SN Baru [%s]. Alasan: %s", req.ComponentType, req.OldSN, req.NewSN, req.Reason),
			SparePartsUsed:    fmt.Sprintf("%s %s (SN: %s)", req.NewBrand, req.NewModel, req.NewSN),
			NewComponentSN:    req.NewSN,
			NewComponentModel: fmt.Sprintf("%s %s", req.NewBrand, req.NewModel),
			HealthBefore:      45,
			HealthAfter:       100,
			CreatedAt:         now,
		}
		memLogs = append([]models.MaintenanceLog{logData}, memLogs...)

		return hist, nil
	}

	// MySQL Mode
	row := DB.QueryRow("SELECT id, code, name, terminal, location_area FROM assets WHERE id = ?", req.AssetID)
	if err := row.Scan(&asset.ID, &asset.Code, &asset.Name, &asset.Terminal, &asset.LocationArea); err != nil {
		return models.ReplacementHistory{}, fmt.Errorf("asset not found in DB: %v", err)
	}

	// 1. Update Asset in DB
	var updateQ string
	if req.ComponentType == "Mini PC" {
		updateQ = "UPDATE assets SET mini_pc_brand=?, mini_pc_model=?, mini_pc_sn=?, mini_pc_condition='100%', health_score=100, status='Active', last_update=NOW() WHERE id=?"
	} else {
		updateQ = "UPDATE assets SET monitor_brand=?, monitor_model=?, monitor_sn=?, monitor_condition='100%', health_score=100, status='Active', last_update=NOW() WHERE id=?"
	}
	if _, err := DB.Exec(updateQ, req.NewBrand, req.NewModel, req.NewSN, req.AssetID); err != nil {
		log.Printf("⚠️ Error updating asset in swap: %v", err)
	}

	// 2. Update Map Pin
	DB.Exec("UPDATE map_pins SET status='Active', health_score=100 WHERE asset_id=?", req.AssetID)

	// 3. Mark New Spare Part as In-Use
	if req.NewSparePartID != "" {
		DB.Exec("UPDATE spare_parts SET status='In-Use', notes=?, last_updated=NOW() WHERE id=?",
			fmt.Sprintf("Terpasang di aset %s (%s)", asset.Code, asset.Name), req.NewSparePartID)
	}

	// 4. Register Old Part to spare_parts
	if req.OldSN != "" && req.OldSN != "N/A" {
		oldCond := "Perlu Servis (RMA)"
		oldStat := "Under-Repair"
		disposalLoc := req.OldDisposalLoc
		if disposalLoc == "" {
			disposalLoc = "Workshop IT Maintenance"
		}
		if strings.Contains(strings.ToLower(req.OldDisposal), "scrap") || strings.Contains(strings.ToLower(req.OldDisposal), "afkir") ||
			strings.Contains(strings.ToLower(req.OldStatus), "scrap") || strings.Contains(strings.ToLower(req.OldStatus), "afkir") {
			oldCond = "Afkir / Rusak"
			oldStat = "Scrapped"
		} else if strings.Contains(strings.ToLower(req.OldDisposal), "simpan") || strings.Contains(strings.ToLower(req.OldDisposal), "storage") {
			oldCond = "Bagus / Ready"
			oldStat = "Available"
		}
		oldSpID := fmt.Sprintf("SP-OLD-%d", now.Unix()%100000)
		oldOrigin := req.OldOrigin
		if oldOrigin == "" {
			oldOrigin = "Copotan Unit Lapangan"
		}
		DB.Exec(`INSERT INTO spare_parts
			(id, category, serial_number, brand, model, specs, warehouse_location, origin_procurement, procurement_year, `+"`condition`"+`, status, warranty_status, notes, last_updated)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
			oldSpID, req.ComponentType, req.OldSN, req.OldBrand, req.OldModel,
			fmt.Sprintf("Unit eks copotan dari %s (%s)", asset.Code, asset.LocationArea),
			disposalLoc, oldOrigin, "2023", oldCond, oldStat, "Perlu Pengecekan",
			fmt.Sprintf("Alasan swap: %s. Teknisi: %s. Disposisi: %s", req.Reason, req.TechnicianName, req.OldDisposal), now)
	}

	// 5. Insert Replacement History
	hist := models.ReplacementHistory{
		ID:             repID,
		AssetID:        asset.ID,
		AssetCode:      asset.Code,
		AssetName:      asset.Name,
		Terminal:       asset.Terminal,
		LocationArea:   asset.LocationArea,
		ComponentType:  req.ComponentType,
		OldBrand:       req.OldBrand,
		OldModel:       req.OldModel,
		OldSN:          req.OldSN,
		OldOrigin:      req.OldOrigin,
		OldDisposal:    req.OldDisposal,
		OldDisposalLoc: req.OldDisposalLoc,
		NewBrand:       req.NewBrand,
		NewModel:       req.NewModel,
		NewSN:          req.NewSN,
		NewOrigin:      req.NewOrigin,
		Reason:         req.Reason,
		OldStatus:      req.OldStatus,
		TechnicianName: req.TechnicianName,
		ReplacedAt:     now,
	}

	DB.Exec(`INSERT INTO replacement_history
		(id, asset_id, asset_code, asset_name, terminal, location_area, component_type,
		old_brand, old_model, old_sn, new_brand, new_model, new_sn, reason, old_status, technician_name, replaced_at)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		hist.ID, hist.AssetID, hist.AssetCode, hist.AssetName, hist.Terminal, hist.LocationArea, hist.ComponentType,
		hist.OldBrand, hist.OldModel, hist.OldSN, hist.NewBrand, hist.NewModel, hist.NewSN,
		hist.Reason, hist.OldStatus, hist.TechnicianName, hist.ReplacedAt)

	// 6. Insert Maintenance Log
	logID := fmt.Sprintf("LOG-SWAP-%d", now.Unix()%10000)
	DB.Exec(`INSERT INTO maintenance_logs
		(id, asset_id, asset_code, asset_name, terminal, target_component, type, description,
		spare_parts_used, new_component_sn, new_component_model, health_before, health_after, created_at)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		logID, asset.ID, asset.Code, asset.Name, asset.Terminal, req.ComponentType, "Component Swap",
		fmt.Sprintf("Swap %s: SN Lama [%s] diganti SN Baru [%s]. Alasan: %s", req.ComponentType, req.OldSN, req.NewSN, req.Reason),
		fmt.Sprintf("%s %s (SN: %s)", req.NewBrand, req.NewModel, req.NewSN),
		req.NewSN, fmt.Sprintf("%s %s", req.NewBrand, req.NewModel),
		45, 100, now)

	return hist, nil
}

// GetReplacementHistory fetches historical swap events.
func GetReplacementHistory(q, terminal, componentType string) []models.ReplacementHistory {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()

		var results []models.ReplacementHistory
		for _, h := range memHistory {
			if terminal != "" && strings.ToLower(terminal) != "all" && !strings.Contains(strings.ToLower(h.Terminal), strings.ToLower(terminal)) {
				continue
			}
			if componentType != "" && strings.ToLower(componentType) != "all" && strings.ToLower(h.ComponentType) != strings.ToLower(componentType) {
				continue
			}
			if q != "" {
				ql := strings.ToLower(q)
				match := strings.Contains(strings.ToLower(h.AssetCode), ql) ||
					strings.Contains(strings.ToLower(h.AssetName), ql) ||
					strings.Contains(strings.ToLower(h.OldSN), ql) ||
					strings.Contains(strings.ToLower(h.NewSN), ql) ||
					strings.Contains(strings.ToLower(h.Reason), ql)
				if !match {
					continue
				}
			}
			results = append(results, h)
		}
		return results
	}

	query := `SELECT id, asset_id, asset_code, asset_name, terminal, location_area, component_type,
		old_brand, old_model, old_sn, new_brand, new_model, new_sn, reason, old_status, technician_name, replaced_at
		FROM replacement_history WHERE 1=1`
	args := []interface{}{}

	if terminal != "" && strings.ToLower(terminal) != "all" {
		query += " AND LOWER(terminal) LIKE ?"
		args = append(args, "%"+strings.ToLower(terminal)+"%")
	}
	if componentType != "" && strings.ToLower(componentType) != "all" {
		query += " AND LOWER(component_type) = ?"
		args = append(args, strings.ToLower(componentType))
	}
	if q != "" {
		ql := "%" + strings.ToLower(q) + "%"
		query += " AND (LOWER(asset_code) LIKE ? OR LOWER(asset_name) LIKE ? OR LOWER(old_sn) LIKE ? OR LOWER(new_sn) LIKE ? OR LOWER(reason) LIKE ?)"
		args = append(args, ql, ql, ql, ql, ql)
	}
	query += " ORDER BY replaced_at DESC"

	rows, err := DB.Query(query, args...)
	if err != nil {
		log.Printf("❌ GetReplacementHistory query error: %v", err)
		return nil
	}
	defer rows.Close()

	var list []models.ReplacementHistory
	for rows.Next() {
		var h models.ReplacementHistory
		rows.Scan(&h.ID, &h.AssetID, &h.AssetCode, &h.AssetName, &h.Terminal, &h.LocationArea, &h.ComponentType,
			&h.OldBrand, &h.OldModel, &h.OldSN, &h.NewBrand, &h.NewModel, &h.NewSN, &h.Reason, &h.OldStatus, &h.TechnicianName, &h.ReplacedAt)
		list = append(list, h)
	}
	return list
}
