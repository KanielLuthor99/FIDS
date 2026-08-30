package database

import (
	"log"
	"strings"

	"fids-backend/models"
)

// GetPins retrieves map pin coordinates for the terminal display map.
func GetPins(terminal string) []models.MapPin {
	if useMemory || DB == nil {
		memMu.RLock()
		defer memMu.RUnlock()

		if terminal == "" || strings.ToLower(terminal) == "all" {
			return memPins
		}
		var results []models.MapPin
		for _, p := range memPins {
			if strings.Contains(strings.ToLower(p.Terminal), strings.ToLower(terminal)) {
				results = append(results, p)
			}
		}
		return results
	}

	query := `SELECT asset_id, code, name, category, terminal, location_area, status, health_score, x_percent, y_percent
		FROM map_pins WHERE 1=1`
	args := []interface{}{}

	if terminal != "" && strings.ToLower(terminal) != "all" {
		query += " AND LOWER(terminal) LIKE ?"
		args = append(args, "%"+strings.ToLower(terminal)+"%")
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		log.Printf("❌ GetPins error: %v", err)
		return nil
	}
	defer rows.Close()

	var pins []models.MapPin
	for rows.Next() {
		var p models.MapPin
		rows.Scan(&p.AssetID, &p.Code, &p.Name, &p.Category, &p.Terminal,
			&p.LocationArea, &p.Status, &p.HealthScore, &p.XPercent, &p.YPercent)
		pins = append(pins, p)
	}
	return pins
}
