package models

import "time"

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Avatar   string `json:"avatar"`
}

type Asset struct {
	ID           string    `json:"id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	Category     string    `json:"category"`
	LocationArea string    `json:"location_area"`
	Terminal     string    `json:"terminal"`
	Zone         string    `json:"zone"`
	IPAddress    string    `json:"ip_address"`
	Status       string    `json:"status"`
	HealthScore  int       `json:"health_score"`

	// Mini PC Specs
	MiniPCOrigin    string `json:"mini_pc_origin"`
	MiniPCBrand     string `json:"mini_pc_brand"`
	MiniPCModel     string `json:"mini_pc_model"`
	MiniPCSN        string `json:"mini_pc_sn"`
	MiniPCPorts     string `json:"mini_pc_ports"`
	MiniPCDisk      string `json:"mini_pc_disk"`
	MiniPCRAM       string `json:"mini_pc_ram"`
	MiniPCOS        string `json:"mini_pc_os"`
	MiniPCYear      string `json:"mini_pc_year"`
	MiniPCCondition string `json:"mini_pc_condition"`
	MiniPCWarranty  string `json:"mini_pc_warranty"`

	// Monitor Specs
	MonitorOrigin    string `json:"monitor_origin"`
	MonitorBrand     string `json:"monitor_brand"`
	MonitorModel     string `json:"monitor_model"`
	MonitorSN        string `json:"monitor_sn"`
	MonitorPorts     string `json:"monitor_ports"`
	MonitorSize      string `json:"monitor_size"`
	MonitorYear      string `json:"monitor_year"`
	MonitorCondition string `json:"monitor_condition"`
	MonitorWarranty  string `json:"monitor_warranty"`
	MonitorConverter string `json:"monitor_converter"`

	LastUpdate time.Time `json:"last_update"`
}

type MapPin struct {
	AssetID      string  `json:"asset_id"`
	Code         string  `json:"code"`
	Name         string  `json:"name"`
	Category     string  `json:"category"`
	Terminal     string  `json:"terminal"`
	LocationArea string  `json:"location_area"`
	Status       string  `json:"status"`
	HealthScore  int     `json:"health_score"`
	XPercent     float64 `json:"x_percent"`
	YPercent     float64 `json:"y_percent"`
}

type MaintenanceLog struct {
	ID                 string    `json:"id"`
	AssetID            string    `json:"asset_id"`
	AssetCode          string    `json:"asset_code"`
	AssetName          string    `json:"asset_name"`
	Terminal           string    `json:"terminal"`
	TargetComponent    string    `json:"target_component"`   // "Mini PC", "Monitor", "Sepaket (Both)"
	Type               string    `json:"type"`               // "Corrective", "Preventive", "Component Swap"
	Description        string    `json:"description"`
	SparePartsUsed     string    `json:"spare_parts_used"`
	DocumentationPhoto string    `json:"documentation_photo"`// URL or Base64 photo of equipment damage/repair
	NewComponentSN     string    `json:"new_component_sn"`
	NewComponentModel   string    `json:"new_component_model"`
	HealthBefore       int       `json:"health_before"`
	HealthAfter        int       `json:"health_after"`
	CreatedAt          time.Time `json:"created_at"`
}

type DashboardMetrics struct {
	TargetSLA       float64 `json:"target_sla"`
	ActualSLA       float64 `json:"actual_sla"`
	AvgHealthScore  float64 `json:"avg_health_score"`
	TotalAssets     int     `json:"total_assets"`
	ActiveAssets    int     `json:"active_assets"`
	NeedService     int     `json:"need_service"`
	InStorageAssets int     `json:"in_storage_assets"`
	TotalLogsCount  int     `json:"total_logs_count"`

	TotalMiniPCs        int `json:"total_mini_pcs"`
	ActiveMiniPCs       int `json:"active_mini_pcs"`
	MaintenanceMiniPCs  int `json:"maintenance_mini_pcs"`
	TotalMonitors       int `json:"total_monitors"`
	ActiveMonitors      int `json:"active_monitors"`
	MaintenanceMonitors int `json:"maintenance_monitors"`
}

type LoginRequest struct {
	Role string `json:"role"`
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
	User    User   `json:"user"`
}

type ReplacementHistory struct {
	ID              string    `json:"id"`
	AssetID         string    `json:"asset_id"`
	AssetCode       string    `json:"asset_code"`
	AssetName       string    `json:"asset_name"`
	Terminal        string    `json:"terminal"`
	LocationArea    string    `json:"location_area"`
	ComponentType   string    `json:"component_type"` // "Mini PC" | "Monitor"
	OldBrand        string    `json:"old_brand"`
	OldModel        string    `json:"old_model"`
	OldSN           string    `json:"old_sn"`
	OldOrigin       string    `json:"old_origin"`       // asal pengadaan unit lama
	OldDisposal     string    `json:"old_disposal"`     // "RMA Servis" | "Afkir / Scrapped" | "Simpan Gudang"
	OldDisposalLoc  string    `json:"old_disposal_loc"` // lokasi tujuan unit lama
	NewBrand        string    `json:"new_brand"`
	NewModel        string    `json:"new_model"`
	NewSN           string    `json:"new_sn"`
	NewOrigin       string    `json:"new_origin"`       // asal pengadaan unit baru
	Reason          string    `json:"reason"`
	OldStatus       string    `json:"old_status"` // disposisi ringkas
	TechnicianName  string    `json:"technician_name"`
	ReplacedAt      time.Time `json:"replaced_at"`
}

type SparePart struct {
	ID                string    `json:"id"`
	Category          string    `json:"category"` // "Mini PC" or "Monitor"
	SerialNumber      string    `json:"serial_number"`
	Brand             string    `json:"brand"`
	Model             string    `json:"model"`
	Specs             string    `json:"specs"`
	WarehouseLocation string    `json:"warehouse_location"`
	OriginProcurement string    `json:"origin_procurement"`
	ProcurementYear   string    `json:"procurement_year"`
	Condition         string    `json:"condition"` // "Bagus / Ready", "Perlu Servis (RMA)", "Afkir / Rusak"
	Status            string    `json:"status"`    // "Available", "In-Use", "Under-Repair", "Scrapped"
	WarrantyStatus    string    `json:"warranty_status"`
	Notes             string    `json:"notes"`
	LastUpdated       time.Time `json:"last_updated"`
}

type SwapRequest struct {
	AssetID        string `json:"asset_id"`
	ComponentType  string `json:"component_type"` // "Mini PC" or "Monitor"
	OldBrand       string `json:"old_brand"`
	OldModel       string `json:"old_model"`
	OldSN          string `json:"old_sn"`
	OldOrigin      string `json:"old_origin"`       // asal pengadaan unit lama
	OldDisposal    string `json:"old_disposal"`     // "RMA Servis" | "Afkir / Scrapped" | "Simpan Gudang"
	OldDisposalLoc string `json:"old_disposal_loc"` // lokasi tujuan unit lama
	OldStatus      string `json:"old_status"`       // ringkasan disposisi untuk history log
	NewSparePartID string `json:"new_sparepart_id"`
	NewBrand       string `json:"new_brand"`
	NewModel       string `json:"new_model"`
	NewSN          string `json:"new_sn"`
	NewSpecs       string `json:"new_specs"`
	NewOrigin      string `json:"new_origin"`
	Reason         string `json:"reason"`
	TechnicianName string `json:"technician_name"`
}

