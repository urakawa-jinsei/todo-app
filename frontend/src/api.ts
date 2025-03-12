export interface Task {
    id: number;
    name: string;
    details: string;
    status: '完了' | '進行中' | '未着手';
    updated_at: string;
  }
  
  const API_URL = "http://localhost:8080";
  
  export async function fetchTasks(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json();
  }
  
  export async function createTask(task: Omit<Task, 'id' | 'updated_at'>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
    return res.json();
  }
  
  export async function updateTask(id: number, task: Omit<Task, 'id' | 'updated_at'>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
    return res.json();
  }
  
  export async function deleteTask(id: number): Promise<void> {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  }
  