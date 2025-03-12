package models

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var db *sql.DB

func init() {
	var err error
	connStr := "host=postgres user=postgres password=postgres dbname=tododb sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}
}
