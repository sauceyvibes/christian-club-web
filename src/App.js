import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Questions from './pages/Questions';
import AskQuestion from './pages/AskQuestion';
import Forums from './pages/Forums';
import Question from './pages/Question';
import CreatePost from './pages/CreatePost';
import ForumPost from './pages/ForumPost';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <Router basename="/">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/questions" replace />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/question" element={<Question />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/forum-post" element={<ForumPost />} />
          <Route path="/admin-key=5241269709-67" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;
