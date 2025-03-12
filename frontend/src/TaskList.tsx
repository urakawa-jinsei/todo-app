import React, { useEffect, useState } from "react";
import { Task, fetchTasks, createTask, updateTask, deleteTask } from "./api";
import { useNavigate } from "react-router-dom";

// ステータスの型定義
type StatusType = Task["status"]; // '未着手' | '進行中' | '完了'

// ステータスごとの背景色・文字色設定
const statusColorMap: Record<StatusType, string> = {
  "未着手": "bg-red-500 text-white",
  "進行中": "bg-blue-300 text-black",
  "完了":   "bg-green-500 text-white",
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const navigate = useNavigate();

  // フィルタリング用ステート
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" またはステータス値

  // タスク一覧を取得
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

  // 新規タスク作成（登録時はステータスは「未着手」で固定）
  const handleCreate = async () => {
    if (!name) return;
    try {
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

  // inline でステータス変更（タスク一覧画面）
  const handleStatusChange = async (task: Task, newStatus: StatusType) => {
    try {
      await updateTask(task.id, {
        name: task.name,
        details: task.details,
        status: newStatus,
      });
      loadTasks();
    } catch (error) {
      console.error("ステータス更新に失敗", error);
    }
  };

  // フィルタリング処理: 検索文字列がタスク名または詳細に含まれるか、かつステータスが一致するか
  const filteredTasks = tasks.filter((task) => {
    const matchText =
      task.name.toLowerCase().includes(filterText.toLowerCase()) ||
      task.details.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus =
      filterStatus === "all" || task.status === filterStatus;
    return matchText && matchStatus;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 animate-fadeIn">タスク一覧</h1>

      {/* 新規登録フォーム */}
      <div className="mb-4 animate-fadeIn">
        <input
          className="border p-2 w-full mb-2 transition-all duration-300 focus:shadow-lg"
          placeholder="タスク名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 transition-all duration-300 focus:shadow-lg"
          placeholder="詳細"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-600"
          onClick={handleCreate}
        >
          登録
        </button>
      </div>

      {/* フィルタリング・検索エリア */}
      <div className="mb-4 flex flex-col md:flex-row gap-2 animate-fadeIn">
        <input
          className="border p-2 flex-1 transition-all duration-300 focus:shadow-lg"
          placeholder="検索（タスク名、詳細）"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="border p-2 transition-all duration-300 focus:shadow-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
      </div>

      {/* タスク一覧テーブル */}
      <table className="table-auto w-full animate-fadeIn">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">ステータス</th>
            <th className="px-4 py-2 text-left">最終更新日時</th>
            <th className="px-4 py-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-all duration-300">
              <td className="px-4 py-2 border-b">{task.name}</td>
              <td className="px-4 py-2 border-b">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task, e.target.value as StatusType)
                  }
                  className={`px-2 py-1 rounded text-sm transition-all duration-300 ${statusColorMap[task.status as StatusType]}`}
                >
                  <option value="未着手">未着手</option>
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                </select>
              </td>
              <td className="px-4 py-2 border-b">
                {new Date(task.updated_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">
                <button 
                  className="bg-green-500 text-white px-2 py-1 mr-2 rounded transition-all duration-300 hover:bg-green-600"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  詳細
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded transition-all duration-300 hover:bg-red-600"
                  onClick={() => handleDelete(task.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          {filteredTasks.length === 0 && (
            <tr>
              <td className="px-4 py-2 border-b text-center" colSpan={4}>
                一致するタスクがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
