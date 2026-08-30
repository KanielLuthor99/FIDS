package handlers

import (
	"fmt"
	"net/http"
	"time"

	"fids-backend/database"
	"fids-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("InJourney-FIDS-Secret-Key-2026")

func HandleLogin(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req.Role = "Admin"
	}

	if req.Role == "" {
		req.Role = "Admin"
	}

	user := models.User{
		ID:       "usr-001",
		Username: "admin.fids",
		Name:     "Administrator FIDS",
		Role:     req.Role,
		Avatar:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
	}

	if req.Role == "Teknisi" {
		user = models.User{
			ID:       "usr-002",
			Username: "teknisi.fids",
			Name:     "Teknisi Maintenance",
			Role:     "Teknisi",
			Avatar:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
		}
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"name": user.Name,
		"role": user.Role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.LoginResponse{
		Success: true,
		Token:   tokenString,
		User:    user,
	})
}

func GetMetrics(c *gin.Context) {
	metrics := database.GetMetrics()
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   metrics,
	})
}

func GetAssets(c *gin.Context) {
	q := c.Query("q")
	status := c.Query("status")
	terminal := c.Query("terminal")

	assets := database.GetAssets(q, status, terminal)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"count":  len(assets),
		"data":   assets,
	})
}

func GetMapPins(c *gin.Context) {
	terminal := c.Query("terminal")
	pins := database.GetPins(terminal)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"count":  len(pins),
		"data":   pins,
	})
}

func GetMaintenanceLogs(c *gin.Context) {
	logs := database.GetLogs()
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"count":  len(logs),
		"data":   logs,
	})
}

func CreateMaintenanceLog(c *gin.Context) {
	var req models.MaintenanceLog
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created := database.AddLog(req)
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Log Maintenance berhasil dicatat",
		"data":    created,
	})
}

func ExportAssetsCSV(c *gin.Context) {
	q := c.Query("q")
	status := c.Query("status")
	terminal := c.Query("terminal")

	csvBytes := database.ExportCSV(q, status, terminal)

	filename := fmt.Sprintf("FIDS_Asset_Inventory_%s.csv", time.Now().Format("20060102_150405"))
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "text/csv")
	c.Data(http.StatusOK, "text/csv", csvBytes)
}

func GetReplacementHistory(c *gin.Context) {
	q := c.Query("q")
	terminal := c.Query("terminal")
	compType := c.Query("component_type")

	histories := database.GetReplacementHistory(q, terminal, compType)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"count":  len(histories),
		"data":   histories,
	})
}

func GetSpareParts(c *gin.Context) {
	q := c.Query("q")
	category := c.Query("category")
	status := c.Query("status")
	location := c.Query("location")

	parts := database.GetSpareParts(q, category, status, location)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"count":  len(parts),
		"data":   parts,
	})
}

func CreateSparePart(c *gin.Context) {
	var req models.SparePart
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created := database.CreateSparePart(req)
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Data suku cadang berhasil ditambahkan",
		"data":    created,
	})
}

func UpdateSparePart(c *gin.Context) {
	id := c.Param("id")
	var req models.SparePart
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := database.UpdateSparePart(id, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Data suku cadang berhasil diperbarui",
		"data":    updated,
	})
}

func DeleteSparePart(c *gin.Context) {
	id := c.Param("id")
	if err := database.DeleteSparePart(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Suku cadang berhasil dihapus",
	})
}

func ExecuteSwap(c *gin.Context) {
	var req models.SwapRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.AssetID == "" || req.ComponentType == "" || req.NewSN == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Asset ID, Tipe Komponen, dan Serial Number Baru wajib diisi"})
		return
	}

	hist, err := database.ExecuteSwap(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Proses swap komponen berhasil dieksekusi dan dicatat ke riwayat",
		"data":    hist,
	})
}

func GetSparePartHistory(c *gin.Context) {
	sn := c.Param("sn")
	if sn == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Serial Number (SN) wajib diisi"})
		return
	}

	histories := database.GetSparePartHistoryBySN(sn)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"sn":     sn,
		"count":  len(histories),
		"data":   histories,
	})
}
