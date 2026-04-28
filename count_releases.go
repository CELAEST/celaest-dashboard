package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://postgres:123@127.0.0.1:5432/celaest-back?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT count(*) FROM releases;")
	if err != nil {
		log.Fatal(err)
	}
	var count int
	for rows.Next() {
		rows.Scan(&count)
		fmt.Println("Releases count:", count)
	}
}
