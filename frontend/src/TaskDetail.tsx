import React, { useEffect, useState } from "react";
import { Task, updateTask, fetchTasks, deleteTask } from "./api";
import { useParams, useNavigate } from "react-router-dom";

type StatusType = Task["status"];
const statusColorMap: Record<StatusType, string> = {
  "未着手": "bg-gray-200 text-gray-800",
  "進行中": "bg-yellow-200 text-yellow-800",
  "完了": "bg-green-200 text-green-800",
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
    <div className="p-4">
      <button 
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded" 
        onClick={() => navigate("/")}
      >
        戻る
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
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              保存
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
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
