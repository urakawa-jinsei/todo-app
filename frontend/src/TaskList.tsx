import React, { useEffect, useState } from "react";
import { Task, fetchTasks, createTask, updateTask, deleteTask } from "./api";
import { useNavigate, Link } from "react-router-dom";

type StatusType = Task["status"];

const statusColorMap: Record<StatusType, string> = {
  "未着手": "bg-pink-200 text-pink-800",
  "進行中": "bg-blue-200 text-blue-800",
  "完了":   "bg-green-200 text-green-800",
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState("");
  const [editingNewTask, setEditingNewTask] = useState(false);

  const navigate = useNavigate();

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

  // 新規タスク登録
  const handleCreate = async () => {
    if (!newTaskName.trim()) {
      // タスク名が空の場合は何もしない
      setEditingNewTask(false);
      return;
    }
    try {
      await createTask({
        name: newTaskName.trim(),
        details: newTaskDetails.trim(),
        status: "未着手",
      });
      // フィールド初期化 & 編集モード解除
      setNewTaskName("");
      setNewTaskDetails("");
      setEditingNewTask(false);
      // 再取得
      loadTasks();
    } catch (error) {
      console.error("タスク作成に失敗", error);
    }
  };

  // ステータス変更
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

  // 削除
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("タスク削除に失敗", error);
    }
  };

  // フィルタリング
  const filteredTasks = tasks.filter((task) => {
    const matchText =
      task.name.toLowerCase().includes(filterText.toLowerCase()) ||
      task.details.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    return matchText && matchStatus;
  });

  // Enter キーで登録
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* ヘッダ */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">タスク一覧</h1>
        <Link
          className="bg-indigo-200 text-indigo-800 px-4 py-2 rounded transition-all duration-300 hover:bg-indigo-300"
          to="/graph"
        >
          グラフビューへ
        </Link>
      </div>

      {/* フィルタリングエリア */}
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
        <input
          className="border px-2 py-1 text-sm text-gray-700 placeholder-gray-400 focus:shadow-lg transition-all duration-300"
          style={{ width: "220px" }}
          placeholder="検索"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="border p-1 text-sm text-gray-700 focus:shadow-lg transition-all duration-300"
          style={{ width: "120px" }}
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
      <table className="table-auto w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">ステータス</th>
            <th className="px-4 py-2 text-left">最終更新日時</th>
            <th className="px-4 py-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-50 transition-all duration-300"
            >
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
                  className="bg-green-200 text-green-800 px-2 py-1 mr-2 rounded text-sm transition-all duration-300 hover:bg-green-300"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  詳細
                </button>
                <button
                  className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-sm transition-all duration-300 hover:bg-pink-300"
                  onClick={() => handleDelete(task.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          {/* 新規タスク追加用の行 */}
          {!editingNewTask ? (
            // 編集前: "+ 新規タスクを追加" と表示
            <tr
              className="hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              onClick={() => setEditingNewTask(true)}
            >
              <td className="px-4 py-2 border-b text-pink-500" colSpan={4}>
                ＋ 新規タスクを追加
              </td>
            </tr>
          ) : (
            // 編集中: タスク名・詳細の入力フィールドを表示
            <tr className="transition-all duration-300 bg-gray-50">
              <td className="px-4 py-2 border-b">
                <input
                  className="border p-1 text-sm w-40 placeholder-gray-400 text-gray-800 focus:shadow-lg"
                  placeholder="タスク名"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </td>
              <td className="px-4 py-2 border-b" colSpan={2}>
                <input
                  className="border p-1 text-sm w-60 placeholder-gray-400 text-gray-800 focus:shadow-lg"
                  placeholder="詳細"
                  value={newTaskDetails}
                  onChange={(e) => setNewTaskDetails(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-blue-300 mr-2"
                  onClick={handleCreate}
                >
                  ✓
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-gray-400"
                  onClick={() => {
                    setEditingNewTask(false);
                    setNewTaskName("");
                    setNewTaskDetails("");
                  }}
                >
                  ✕
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
