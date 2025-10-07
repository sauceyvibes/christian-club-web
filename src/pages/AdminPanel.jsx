import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Question, Answer, ForumPost, ForumReply } from '../entities/all';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '../components/ui/all';
import { Trash2, LogOut, Lock, Eye, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Trio } from 'ldrs/react'
import 'ldrs/react/Trio.css'

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        loadAllData();
      }
    });
    return unsubscribe;
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [q, a, p, r] = await Promise.all([
        Question.list('created_at', 'desc', 100),
        Answer.list('created_at', 'desc', 100),
        ForumPost.list('created_at', 'desc', 100),
        ForumReply.list('created_at', 'desc', 100)
      ]);
      setQuestions(q);
      setAnswers(a);
      setPosts(p);
      setReplies(r);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Invalid credentials');
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question and all its answers?')) return;
    
    try {
      // Delete all answers for this question
      const questionAnswers = answers.filter(a => a.question_id === id);
      for (const answer of questionAnswers) {
        await Answer.deleteItem(answer.id);
      }
      
      // Delete the question
      await Question.deleteItem(id);
      
      // Refresh data
      await loadAllData();
    } catch (error) {
      alert('Error deleting question');
      console.error(error);
    }
  };

  const handleDeleteAnswer = async (id, questionId) => {
    if (!window.confirm('Delete this answer?')) return;
    
    try {
      await Answer.deleteItem(id);
      await Question.decrementAnswerCount(questionId);
      await loadAllData();
    } catch (error) {
      alert('Error deleting answer');
      console.error(error);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post and all its replies?')) return;
    
    try {
      const postReplies = replies.filter(r => r.post_id === id);
      for (const reply of postReplies) {
        await ForumReply.deleteItem(reply.id);
      }
      
      await ForumPost.deleteItem(id);
      await loadAllData();
    } catch (error) {
      alert('Error deleting post');
      console.error(error);
    }
  };

  const handleDeleteReply = async (id, postId) => {
    if (!window.confirm('Delete this reply?')) return;
    
    try {
      await ForumReply.deleteItem(id);
      await ForumPost.decrementReplyCount(postId);
      await loadAllData();
    } catch (error) {
      alert('Error deleting reply');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {loading ? (
          // Default values shown
          <Trio
            size="150"
           speed="1.75"
           color="black" 
          />
        ) : (
          <div className="space-y-8">
            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{q.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{q.content?.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {q.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {q.answer_count || 0}
                          </span>
                          <span>{format(new Date(q.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Answers Section */}
            <Card>
              <CardHeader>
                <CardTitle>Answers ({answers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {answers.map((a) => (
                    <div key={a.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm">{a.content?.substring(0, 150)}...</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{a.author_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{format(new Date(a.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnswer(a.id, a.question_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forum Posts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Forum Posts ({posts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((p) => (
                    <div key={p.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{p.content?.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <Badge variant="outline">{p.category}</Badge>
                          <span>{p.author_name || 'Anonymous'}</span>
                          <span>{format(new Date(p.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(p.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Replies Section */}
            <Card>
              <CardHeader>
                <CardTitle>Forum Replies ({replies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {replies.map((r) => (
                    <div key={r.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm">{r.content?.substring(0, 150)}...</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{r.author_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{format(new Date(r.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReply(r.id, r.post_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
