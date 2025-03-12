package models

import "time"

type TaskStatus string

const (
	NotStarted TaskStatus = "未着手"
	InProgress TaskStatus = "進行中"
	Completed  TaskStatus = "完了"
)

type Task struct {
	ID        int        `json:"id"`
	Name      string     `json:"name"`
	Details   string     `json:"details"`
	Status    TaskStatus `json:"status"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func GetAllTasks() ([]Task, error) {
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

func (t *Task) CreateTask() error {
	_, err := db.Exec(
		`INSERT INTO tasks (name, details, status, updated_at) VALUES ($1, $2, $3, $4)`,
		t.Name, t.Details, t.Status, t.UpdatedAt,
	)
	return err
}

func (t *Task) UpdateTask(id int) error {
	_, err := db.Exec(
		`UPDATE tasks SET name=$1, details=$2, status=$3, updated_at=$4 WHERE id=$5`,
		t.Name, t.Details, t.Status, t.UpdatedAt, id,
	)
	return err
}

func DeleteTask(id int) error {
	_, err := db.Exec(`DELETE FROM tasks WHERE id=$1`, id)
	return err
}
