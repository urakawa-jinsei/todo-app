package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/example/todo-backend/models"
)

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
}

func GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	tasks, err := models.GetAllTasks()
	if err != nil {
		http.Error(w, "DB取得エラー", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	var t models.Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSONパースエラー", http.StatusBadRequest)
		return
	}
	t.UpdatedAt = time.Now()
	if err := t.CreateTask(); err != nil {
		http.Error(w, "DB挿入エラー", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なID", http.StatusBadRequest)
		return
	}
	var t models.Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "JSONパースエラー", http.StatusBadRequest)
		return
	}
	t.UpdatedAt = time.Now()
	if err := t.UpdateTask(id); err != nil {
		http.Error(w, "DB更新エラー", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	t.ID = id
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(t)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なID", http.StatusBadRequest)
		return
	}
	if err := models.DeleteTask(id); err != nil {
		http.Error(w, "DB削除エラー", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func PreflightHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}
	http.NotFound(w, r)
}
