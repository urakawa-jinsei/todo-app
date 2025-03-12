import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import GraphView from "./GraphView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </Router>
  );
}

export default App;
