package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	_ "github.com/lib/pq"
)

type Task struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Details   string    `json:"details"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"updated_at"`
}

func GetTasks() ([]Task, error) {
	rows, err := db.Query(`SELECT id, name, details, status, updated_at FROM tasks ORDER BY updated_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Name, &t.Details, &t.Status, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, nil
}

func (t *Task) Create() error {
	_, err := db.Exec(
		`INSERT INTO tasks (name, details, status, updated_at) VALUES ($1, $2, $3, $4)`,
		t.Name, t.Details, t.Status, t.UpdatedAt,
	)
	return err
}

func (t *Task) Save(id int) error {
	_, err := db.Exec(
		`UPDATE tasks SET name=$1, details=$2, status=$3, updated_at=$4 WHERE id=$5`,
		t.Name, t.Details, t.Status, t.UpdatedAt, id,
	)
	return err
}

func Delete(id int) error {
	_, err := db.Exec(`DELETE FROM tasks WHERE id=$1`, id)
	return err
}

var db *sql.DB

// setCORSHeaders を各ハンドラの先頭で呼び出すことで CORS 対応します
func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
}

func main() {
	var err error
	// DB接続情報（docker-compose の環境変数に合わせる）
	connStr := "host=postgres user=postgres password=postgres dbname=tododb sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}
	defer db.Close()

	// Golang1.22 のルーティング機能を利用（HTTP メソッドとパスの組み合わせで登録）
	http.HandleFunc("GET /tasks", getHandler)
	http.HandleFunc("POST /tasks", postHandler)
	http.HandleFunc("PUT /tasks/{id}", putHandler)
	http.HandleFunc("DELETE /tasks/{id}", deleteHandler)

	// OPTIONS メソッドにも対応（プリフライトリクエスト用）
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			setCORSHeaders(w)
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	tasks, err := GetTasks()
	if err != nil {
		http.Error(w, "DB取得エラー", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSONパースエラー", http.StatusBadRequest)
		return
	}
	t.UpdatedAt = time.Now()
	if err := t.Create(); err != nil {
		http.Error(w, "DB挿入エラー", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func putHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なID", http.StatusBadRequest)
		return
	}
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSONパースエラー", http.StatusBadRequest)
		return
	}
	t.UpdatedAt = time.Now()
	if err := t.Save(id); err != nil {
		http.Error(w, "DB更新エラー", http.StatusInternalServerError)
		return
	}
	t.ID = id
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(t)
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なID", http.StatusBadRequest)
		return
	}
	if err := Delete(id); err != nil {
		http.Error(w, "DB削除エラー", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
