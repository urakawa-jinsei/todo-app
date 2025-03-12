import React, { useEffect, useState } from "react";
import { Task, updateTask, fetchTasks, deleteTask } from "./api";
import { useParams, useNavigate } from "react-router-dom";

type StatusType = Task["status"];

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
    <div className="max-w-6xl mx-auto min-h-screen p-4">
      <button
        className="mb-4 bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-gray-400"
        onClick={() => navigate("/")}
      >
        タスク一覧へ戻る
      </button>
      {task ? (
        <div>
          <div className="mb-4">
            <input
              className="border-b focus:outline-none p-1 text-base w-80 placeholder-gray-400 text-gray-800"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="タスク名"
            />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">ステータス</span>
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
          <div className="mb-4">
            <span className="block text-sm text-gray-600">最終更新日時</span>
            <p className="text-sm">{new Date(task.updated_at).toLocaleString()}</p>
          </div>
          <div className="mb-4">
            <span className="block text-sm text-gray-600">詳細</span>
            <textarea
              className="border w-full p-2 text-sm placeholder-gray-400 text-gray-800"
              rows={6}
              value={editDetails}
              onChange={(e) => setEditDetails(e.target.value)}
              placeholder="タスクの詳細を入力"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-blue-300"
              onClick={handleUpdate}
            >
              保存
            </button>
            <button
              className="bg-pink-200 text-pink-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-pink-300"
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
