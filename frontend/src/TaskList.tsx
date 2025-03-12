import React, { useEffect, useState } from "react";
import { Task, fetchTasks, createTask, deleteTask } from "./api";
import { useNavigate } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const navigate = useNavigate();

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
      // 登録時はステータスを「未着手」に固定
      await createTask({ name, details, status: "未着手" });
      setName("");
      setDetails("");
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">タスク一覧</h1>
      <div className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          placeholder="タスク名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="詳細"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          登録
        </button>
      </div>

      <table className="table-auto w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">ステータス</th>
            <th className="px-4 py-2 text-left">最終更新日時</th>
            <th className="px-4 py-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{task.name}</td>
              <td className="px-4 py-2 border-b">{task.status}</td>
              <td className="px-4 py-2 border-b">{new Date(task.updated_at).toLocaleString()}</td>
              <td className="px-4 py-2 border-b">
                <button 
                  className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  詳細
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(task.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
