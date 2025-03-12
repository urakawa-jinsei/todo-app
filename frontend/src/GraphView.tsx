import React, { useEffect, useState } from 'react';
import { Task, fetchTasks } from './api';
import { Pie } from 'react-chartjs-2';
import { useNavigate, Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type StatusType = Task["status"];

// ステータスごとの背景色設定（rgba形式で透明度調整）
const statusColorMap: Record<StatusType, string> = {
  "未着手": "rgba(255, 99, 132, 0.6)",  // 赤
  "進行中": "rgba(54, 162, 235, 0.6)",   // 水色
  "完了":   "rgba(75, 192, 192, 0.6)",    // 緑
};

function GraphView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // タスク一覧の取得
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

  // 各ステータスの件数を集計
  const statusCounts: Record<StatusType, number> = {
    "未着手": 0,
    "進行中": 0,
    "完了": 0,
  };

  tasks.forEach((task) => {
    if (statusCounts[task.status as StatusType] !== undefined) {
      statusCounts[task.status as StatusType] += 1;
    }
  });

  // グラフに渡すデータ
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (status) => statusColorMap[status as StatusType]
        ),
        borderColor: Object.keys(statusCounts).map(
          (status) =>
            statusColorMap[status as StatusType].replace("0.6", "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">タスクステータスの割合</h1>
        {/* タスク一覧画面へ戻るリンク */}
        <Link
          className="bg-gray-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-gray-600"
          to="/"
        >
          タスク一覧へ戻る
        </Link>
      </div>
      <div className="max-w-md mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
}

export default GraphView;
