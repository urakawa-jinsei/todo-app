package main

import (
	"log"
	"net/http"

	"github.com/example/todo-backend/controllers"
)

func main() {
	http.HandleFunc("GET /tasks", controllers.GetTasksHandler)
	http.HandleFunc("POST /tasks", controllers.CreateTaskHandler)
	http.HandleFunc("PUT /tasks/{id}", controllers.UpdateTaskHandler)
	http.HandleFunc("DELETE /tasks/{id}", controllers.DeleteTaskHandler)

	// OPTIONS メソッドにも対応（プリフライトリクエスト用）
	http.HandleFunc("/", controllers.PreflightHandler)

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
