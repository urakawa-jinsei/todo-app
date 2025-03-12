import React, { useEffect, useState } from "react";
import { Task, fetchTasks, createTask, updateTask, deleteTask } from "./api";

// タスクステータスの型定義
type StatusType = Task["status"]; // '完了' | '進行中' | '未着手'

// ステータスごとの色付け用
const statusColorMap: Record<StatusType, string> = {
  "未着手": "bg-gray-200 text-gray-800",
  "進行中": "bg-yellow-200 text-yellow-800",
  "完了":   "bg-green-200 text-green-800",
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 新規作成用フォーム
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  // 選択タスクの編集用
  const [editName, setEditName] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editStatus, setEditStatus] = useState<StatusType>("未着手");

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

  // 初回マウント時にタスクをロード
  useEffect(() => {
    loadTasks();
  }, []);

  // 新規タスク作成
  const handleCreate = async () => {
    if (!name) return;  // タスク名が空の場合は作成しない
    try {
      // ステータスは「未着手」で固定
      await createTask({ 
        name, 
        details, 
        status: "未着手" 
      });
      // フォームリセット
      setName("");
      setDetails("");
      // 一覧を再読み込み
      loadTasks();
    } catch (error) {
      console.error("タスク作成に失敗", error);
    }
  };

  // タスク削除
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      // 削除されたタスクが選択中なら選択解除
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
      }
      loadTasks();
    } catch (error) {
      console.error("タスク削除に失敗", error);
    }
  };

  // タスク選択時に右カラムの編集フォームへ反映
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setEditName(task.name);
    setEditDetails(task.details);
    setEditStatus(task.status as StatusType);
  };

  // 右カラムの「保存」ボタンでタスクを更新
  const handleUpdateSelected = async () => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, {
        name: editName,
        details: editDetails,
        status: editStatus,
      });
      // 一覧を再読み込み
      loadTasks();
      // 更新内容を selectedTask に反映
      setSelectedTask({
        ...selectedTask,
        name: editName,
        details: editDetails,
        status: editStatus,
      });
    } catch (error) {
      console.error("タスク更新に失敗", error);
    }
  };

  // 選択タスクの削除ボタン
  const handleDeleteSelected = () => {
    if (!selectedTask) return;
    handleDelete(selectedTask.id);
  };

  return (
    <div className="flex h-screen">
      {/* 左カラム: タスク一覧 & 新規登録フォーム */}
      <div className="w-1/2 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
          <div className="mb-4">
            <input
              className="border p-2 w-full"
              placeholder="タスク名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className="border p-2 w-full"
              placeholder="詳細"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
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
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr 
                key={task.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectTask(task)}
              >
                <td className="px-4 py-2 border-b">
                  {task.name}
                </td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded text-sm ${statusColorMap[task.status as StatusType]}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  {new Date(task.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 右カラム: 選択されたタスクの詳細表示（編集可） */}
      <div className="w-1/2 overflow-y-auto">
        {selectedTask ? (
          <div className="p-6">
            {/* タスク名の編集 */}
            <div className="mb-2">
              <input
                className="text-2xl font-bold w-full border-b focus:outline-none p-1"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            {/* ステータスの編集 */}
            <div className="flex items-center gap-2 mb-4">
              <span>ステータス</span>
              <select
                className={`px-2 py-1 rounded text-sm border ${statusColorMap[editStatus]}`}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as StatusType)}
              >
                {Object.keys(statusColorMap).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 最終更新日時（読み取り専用） */}
            <div className="mb-4">
              <span className="block text-gray-600">最終更新日時</span>
              <p>{new Date(selectedTask.updated_at).toLocaleString()}</p>
            </div>

            {/* 詳細の編集 */}
            <div className="mb-4">
              <span className="block text-gray-600">詳細</span>
              <textarea
                className="border w-full p-2"
                rows={6}
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                placeholder="詳細を追加..."
              />
            </div>

            <div className="flex justify-end gap-2">
              {/* 保存ボタン */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateSelected}
              >
                保存
              </button>
              {/* 削除ボタン */}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteSelected}
              >
                削除
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-500">
            タスクを選択すると詳細が表示されます
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
