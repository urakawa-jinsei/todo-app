import React, { useEffect, useState } from "react";
import { Task, updateTask, fetchTasks, deleteTask } from "./api";
import { useParams, useNavigate } from "react-router-dom";

type StatusType = Task["status"];

// 同じパステルカラー設定
const statusColorMap: Record<StatusType, string> = {
  "未着手": "bg-pink-200 text-pink-800",
  "進行中": "bg-blue-200 text-blue-800",
  "完了":   "bg-green-200 text-green-800",
};

function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editStatus, setEditStatus] = useState<StatusType>("未着手");

  const loadTask = async () => {
    try {
      const data = await fetchTasks();
      const found = data.find((t: Task) => t.id === Number(id));
      if (found) {
        setTask(found);
        setEditName(found.name);
        setEditDetails(found.details);
        setEditStatus(found.status as StatusType);
      }
    } catch (error) {
      console.error("タスク取得に失敗", error);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleUpdate = async () => {
    if (!task) return;
    try {
      await updateTask(task.id, {
        name: editName,
        details: editDetails,
        status: editStatus,
      });
      loadTask();
    } catch (error) {
      console.error("タスク更新に失敗", error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await deleteTask(task.id);
      navigate("/");
    } catch (error) {
      console.error("タスク削除に失敗", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button 
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded transition-all duration-300 hover:bg-gray-400" 
        onClick={() => navigate("/")}
      >
        タスク一覧へ戻る
      </button>
      {task ? (
        <div>
          {/* タスク名の編集 */}
          <div className="mb-4">
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
              className={`px-2 py-1 rounded text-sm border transition-all duration-300 ${statusColorMap[editStatus]}`}
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as StatusType)}
            >
              <option value="未着手">未着手</option>
              <option value="進行中">進行中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          {/* 最終更新日時（読み取り専用） */}
          <div className="mb-4">
            <span className="block text-gray-600">最終更新日時</span>
            <p>{new Date(task.updated_at).toLocaleString()}</p>
          </div>

          {/* 詳細の編集 */}
          <div className="mb-4">
            <span className="block text-gray-600">詳細</span>
            <textarea
              className="border w-full p-2"
              rows={6}
              value={editDetails}
              onChange={(e) => setEditDetails(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-blue-200 text-blue-800 px-4 py-2 rounded transition-all duration-300 hover:bg-blue-300"
              onClick={handleUpdate}
            >
              保存
            </button>
            <button
              className="bg-pink-200 text-pink-800 px-4 py-2 rounded transition-all duration-300 hover:bg-pink-300"
              onClick={handleDelete}
            >
              削除
            </button>
          </div>
        </div>
      ) : (
        <div>タスクが見つかりません</div>
      )}
    </div>
  );
}

export default TaskDetail;
