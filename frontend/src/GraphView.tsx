import React, { useEffect, useState } from 'react';
import { Task, fetchTasks } from './api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

type StatusType = Task["status"];

const statusColorMap: Record<StatusType, string> = {
  "未着手": "rgba(255, 99, 132, 0.6)",  // パステルピンク
  "進行中": "rgba(54, 162, 235, 0.6)",   // パステルブルー
  "完了":   "rgba(75, 192, 192, 0.6)",   // パステルグリーン
};

function GraphView() {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (status) => statusColorMap[status as StatusType]
        ),
        borderColor: Object.keys(statusCounts).map(
          (status) => statusColorMap[status as StatusType].replace("0.6", "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,  // 凡例を下に配置
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
    maintainAspectRatio: false, // 親要素のサイズに合わせる
  };

  return (
    // 画面全体を flex コンテナにし、縦横中央寄せ
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* タイトルと戻るボタンをまとめて中央に配置 */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold mb-2">タスクステータスの割合</h1>
        <Link
          to="/"
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-gray-400"
        >
          タスク一覧へ戻る
        </Link>
      </div>
      {/* 円グラフ（凡例も含めて上下左右中央に） */}
      <div className="w-96 h-96">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default GraphView;
