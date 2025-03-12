import React, { useEffect, useState } from "react";
import { Task, fetchTasks, createTask, updateTask, deleteTask } from "./api";

const statuses: Array<Task["status"]> = ["未着手", "進行中", "完了"];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Task["status"]>("未着手");

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("タスク取得に失敗", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    try {
      await createTask({ name, details, status });
      setName("");
      setDetails("");
      setStatus("未着手");
      loadTasks();
    } catch (error) {
      console.error("タスク作成に失敗", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("タスク削除に失敗", error);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    try {
      await updateTask(task.id, { name: task.name, details: task.details, status: newStatus });
      loadTasks();
    } catch (error) {
      console.error("タスク更新に失敗", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="タスク名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="詳細"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <select
          className="border p-2 mr-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white p-2" onClick={handleCreate}>
          登録
        </button>
      </div>
      <div>
        {(tasks || []).map((task) => (
          <div key={task.id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <h2 className="font-bold">{task.name}</h2>
              <p>{task.details}</p>
              <p className="text-sm text-gray-500">
                更新: {new Date(task.updated_at).toLocaleString()}
              </p>
            </div>
            <div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value as Task["status"])}
                className="border p-1 mr-2"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="bg-red-500 text-white p-2" onClick={() => handleDelete(task.id)}>
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
