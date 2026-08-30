package database

import (
	"database/sql"
	"log"
	"os"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"fids-backend/models"
)

var (
	DB            *sql.DB
	useMemory     bool
	memMu         sync.RWMutex
	memAssets     []models.Asset
	memPins       []models.MapPin
	memLogs       []models.MaintenanceLog
	memHistory    []models.ReplacementHistory
	memSpareParts []models.SparePart
)

// InitDB initializes MySQL connection or activates In-Memory mode as fallback.
func InitDB() {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = "root:@tcp(localhost:3306)/fids_db?parseTime=true&charset=utf8mb4&loc=Local"
	}

	db, err := sql.Open("mysql", dsn)
	if err == nil {
		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(10)
		db.SetConnMaxLifetime(5 * time.Minute)

		if pingErr := db.Ping(); pingErr == nil {
			DB = db
			log.Println("✅ Connected to MySQL successfully")
			autoMigrate(db)
			seedFromCSVsIfEmpty(db)
			return
		}
	}

	// Graceful fallback to in-memory mode if MySQL is not running
	useMemory = true
	log.Println("⚠️  MySQL not reachable on localhost:3306.")
	log.Println("⚡ Running with In-Memory CSV Engine (Full data loaded directly from CSVs)")
	initInMemory()
}
