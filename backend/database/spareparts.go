package database

import (
	"fmt"
	"log"
	"strings"
	"time"

	"fids-backend/models"
)

// GetSpareParts fetches spare part stock with filters.
func GetSpareParts(q, category, status, location string) []models.SparePart {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()

		var results []models.SparePart
		for _, p := range memSpareParts {
			if category != "" && strings.ToLower(category) != "all" && strings.ToLower(p.Category) != strings.ToLower(category) {
				continue
			}
			if status != "" && strings.ToLower(status) != "all" && strings.ToLower(p.Status) != strings.ToLower(status) {
				continue
			}
			if location != "" && strings.ToLower(location) != "all" && !strings.Contains(strings.ToLower(p.WarehouseLocation), strings.ToLower(location)) {
				continue
			}
			if q != "" {
				ql := strings.ToLower(q)
				match := strings.Contains(strings.ToLower(p.SerialNumber), ql) ||
					strings.Contains(strings.ToLower(p.Brand), ql) ||
					strings.Contains(strings.ToLower(p.Model), ql) ||
					strings.Contains(strings.ToLower(p.Specs), ql) ||
					strings.Contains(strings.ToLower(p.OriginProcurement), ql) ||
					strings.Contains(strings.ToLower(p.WarehouseLocation), ql)
				if !match {
					continue
				}
			}
			results = append(results, p)
		}
		return results
	}

	query := `SELECT id, category, serial_number, brand, model, specs, warehouse_location,
		origin_procurement, procurement_year, ` + "`condition`" + `, status, warranty_status, notes, last_updated
		FROM spare_parts WHERE 1=1`
	args := []interface{}{}

	if category != "" && strings.ToLower(category) != "all" {
		query += " AND LOWER(category) = ?"
		args = append(args, strings.ToLower(category))
	}
	if status != "" && strings.ToLower(status) != "all" {
		query += " AND LOWER(status) = ?"
		args = append(args, strings.ToLower(status))
	}
	if location != "" && strings.ToLower(location) != "all" {
		query += " AND LOWER(warehouse_location) LIKE ?"
		args = append(args, "%"+strings.ToLower(location)+"%")
	}
	if q != "" {
		ql := "%" + strings.ToLower(q) + "%"
		query += " AND (LOWER(serial_number) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR LOWER(specs) LIKE ? OR LOWER(origin_procurement) LIKE ? OR LOWER(warehouse_location) LIKE ?)"
		args = append(args, ql, ql, ql, ql, ql, ql)
	}
	query += " ORDER BY last_updated DESC"

	rows, err := DB.Query(query, args...)
	if err != nil {
		log.Printf("❌ GetSpareParts query error: %v", err)
		return nil
	}
	defer rows.Close()

	var list []models.SparePart
	for rows.Next() {
		var p models.SparePart
		rows.Scan(&p.ID, &p.Category, &p.SerialNumber, &p.Brand, &p.Model, &p.Specs, &p.WarehouseLocation,
			&p.OriginProcurement, &p.ProcurementYear, &p.Condition, &p.Status, &p.WarrantyStatus, &p.Notes, &p.LastUpdated)
		list = append(list, p)
	}
	return list
}

// CreateSparePart registers a new spare part into the warehouse.
func CreateSparePart(part models.SparePart) models.SparePart {
	if part.ID == "" {
		prefix := "SP-PC"
		if part.Category == "Monitor" {
			prefix = "SP-MON"
		}
		part.ID = fmt.Sprintf("%s-%d", prefix, time.Now().Unix()%100000)
	}
	part.LastUpdated = time.Now()
	if part.Status == "" {
		part.Status = "Available"
	}
	if part.Condition == "" {
		part.Condition = "Bagus / Ready"
	}

	if useMemory || DB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		memSpareParts = append([]models.SparePart{part}, memSpareParts...)
		return part
	}

	_, err := DB.Exec(`INSERT INTO spare_parts
		(id, category, serial_number, brand, model, specs, warehouse_location, origin_procurement, procurement_year, `+"`condition`"+`, status, warranty_status, notes, last_updated)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		part.ID, part.Category, part.SerialNumber, part.Brand, part.Model, part.Specs, part.WarehouseLocation,
		part.OriginProcurement, part.ProcurementYear, part.Condition, part.Status, part.WarrantyStatus, part.Notes, part.LastUpdated)
	if err != nil {
		log.Printf("❌ CreateSparePart error: %v", err)
	}
	return part
}

// UpdateSparePart modifies an existing spare part record.
func UpdateSparePart(id string, part models.SparePart) (models.SparePart, error) {
	part.LastUpdated = time.Now()
	if useMemory || DB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		for i, p := range memSpareParts {
			if p.ID == id {
				part.ID = id
				memSpareParts[i] = part
				return part, nil
			}
		}
		return part, fmt.Errorf("part not found")
	}

	_, err := DB.Exec(`UPDATE spare_parts SET
		category=?, serial_number=?, brand=?, model=?, specs=?, warehouse_location=?,
		origin_procurement=?, procurement_year=?, `+"`condition`"+`=?, status=?, warranty_status=?, notes=?, last_updated=?
		WHERE id=?`,
		part.Category, part.SerialNumber, part.Brand, part.Model, part.Specs, part.WarehouseLocation,
		part.OriginProcurement, part.ProcurementYear, part.Condition, part.Status, part.WarrantyStatus, part.Notes, part.LastUpdated, id)
	if err != nil {
		log.Printf("❌ UpdateSparePart error: %v", err)
		return part, err
	}
	part.ID = id
	return part, nil
}

// DeleteSparePart deletes a spare part by ID.
func DeleteSparePart(id string) error {
	if useMemory || DB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		for i, p := range memSpareParts {
			if p.ID == id {
				memSpareParts = append(memSpareParts[:i], memSpareParts[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("part not found")
	}

	_, err := DB.Exec("DELETE FROM spare_parts WHERE id = ?", id)
	return err
}

// GetSparePartHistoryBySN retrieves the full provenance timeline of a Serial Number.
func GetSparePartHistoryBySN(sn string) []models.ReplacementHistory {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()
		var result []models.ReplacementHistory
		snUpper := strings.ToUpper(strings.TrimSpace(sn))
		for _, h := range memHistory {
			if strings.ToUpper(h.OldSN) == snUpper || strings.ToUpper(h.NewSN) == snUpper {
				result = append(result, h)
			}
		}
		return result
	}

	rows, err := DB.Query(`SELECT id, asset_id, asset_code, asset_name, terminal, location_area,
		component_type, old_brand, old_model, old_sn, new_brand, new_model, new_sn,
		reason, old_status, technician_name, replaced_at
		FROM replacement_history
		WHERE UPPER(old_sn) = UPPER(?) OR UPPER(new_sn) = UPPER(?)
		ORDER BY replaced_at DESC`, sn, sn)
	if err != nil {
		log.Printf("⚠️ GetSparePartHistoryBySN error: %v", err)
		return nil
	}
	defer rows.Close()

	var result []models.ReplacementHistory
	for rows.Next() {
		var h models.ReplacementHistory
		if err := rows.Scan(&h.ID, &h.AssetID, &h.AssetCode, &h.AssetName, &h.Terminal, &h.LocationArea,
			&h.ComponentType, &h.OldBrand, &h.OldModel, &h.OldSN, &h.NewBrand, &h.NewModel, &h.NewSN,
			&h.Reason, &h.OldStatus, &h.TechnicianName, &h.ReplacedAt); err == nil {
			result = append(result, h)
		}
	}
	return result
}
