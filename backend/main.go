package main

import (
	"log"
	"os"
	"time"

	"fids-backend/database"
	"fids-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()

	r := gin.Default()

	// Configure CORS for Next.js frontend integration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	v1 := r.Group("/api/v1")
	{
		v1.POST("/auth/login", handlers.HandleLogin)
		v1.GET("/dashboard/metrics", handlers.GetMetrics)
		v1.GET("/assets", handlers.GetAssets)
		v1.GET("/assets/export", handlers.ExportAssetsCSV)
		v1.GET("/map/pins", handlers.GetMapPins)
		v1.GET("/maintenance", handlers.GetMaintenanceLogs)
		v1.POST("/maintenance", handlers.CreateMaintenanceLog)
		v1.GET("/history/replacements", handlers.GetReplacementHistory)
		v1.GET("/spareparts", handlers.GetSpareParts)
		v1.POST("/spareparts", handlers.CreateSparePart)
		v1.PUT("/spareparts/:id", handlers.UpdateSparePart)
		v1.DELETE("/spareparts/:id", handlers.DeleteSparePart)
		v1.GET("/spareparts/:sn/history", handlers.GetSparePartHistory)
		v1.POST("/swap", handlers.ExecuteSwap)
	}


	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("⚡ InJourney FIDS Asset Management Backend (Go Gin Gonic) running on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		if port == "8080" {
			log.Println("⚠️ Port 8080 occupied, starting on port 8088...")
			if err2 := r.Run(":8088"); err2 != nil {
				log.Fatalf("Server failed to start: %v", err2)
			}
		} else {
			log.Fatalf("Server failed to start: %v", err)
		}
	}
}
