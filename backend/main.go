package main

import (
	"log"
	"net/http"

	"github.com/example/todo-backend/controllers"
)

func main() {
	http.HandleFunc("GET /tasks", makeHandler(controllers.GetTasksHandler))
	http.HandleFunc("POST /tasks", makeHandler(controllers.CreateTaskHandler))
	http.HandleFunc("PUT /tasks/{id}", makeHandler(controllers.UpdateTaskHandler))
	http.HandleFunc("DELETE /tasks/{id}", makeHandler(controllers.DeleteTaskHandler))

	// OPTIONS メソッドにも対応（プリフライトリクエスト用）
	http.HandleFunc("/", makeHandler(controllers.PreflightHandler))

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func makeHandler(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		fn(w, r)
	}
}
