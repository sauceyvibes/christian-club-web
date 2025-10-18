import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '../components/ui/all';
import { Trash2, LogOut, Lock, Eye, MessageCircle, RefreshCw, AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadError, setLoadError] = useState('');
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.email : 'Not logged in');
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      if (user) {
        loadAllData();
      }
    });
    return unsubscribe;
  }, []);

  // Direct Firestore queries instead of using entities
  const loadAllData = async () => {
    setLoading(true);
    setLoadError('');
    console.log('🔄 Starting to load data from Firestore...');
    
    try {
      // Load questions
      console.log('📝 Loading questions...');
      const questionsRef = collection(db, 'questions');
      const questionsQuery = query(questionsRef, orderBy('created_at', 'desc'), limit(100));
      const questionsSnapshot = await getDocs(questionsQuery);
      const questionsData = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Loaded ${questionsData.length} questions`);
      setQuestions(questionsData);

      // Load answers
      console.log('💬 Loading answers...');
      const answersRef = collection(db, 'answers');
      const answersQuery = query(answersRef, orderBy('created_at', 'desc'), limit(100));
      const answersSnapshot = await getDocs(answersQuery);
      const answersData = answersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Loaded ${answersData.length} answers`);
      setAnswers(answersData);

      // Load forum posts
      console.log('📋 Loading forum posts...');
      const postsRef = collection(db, 'forum_posts');
      const postsQuery = query(postsRef, orderBy('created_at', 'desc'), limit(100));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Loaded ${postsData.length} forum posts`);
      setPosts(postsData);

      // Load replies
      console.log('💭 Loading replies...');
      const repliesRef = collection(db, 'forum_replies');
      const repliesQuery = query(repliesRef, orderBy('created_at', 'desc'), limit(100));
      const repliesSnapshot = await getDocs(repliesQuery);
      const repliesData = repliesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Loaded ${repliesData.length} replies`);
      setReplies(repliesData);

      const totalItems = questionsData.length + answersData.length + postsData.length + repliesData.length;
      console.log(`✅ Total items loaded: ${totalItems}`);
      
      if (totalItems === 0) {
        setLoadError('No data found in database. Try creating some content on the main site first.');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setLoadError(`Failed to load data: ${error.message}`);
    }
    
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    console.log('Attempting login with:', email);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', userCredential.user.email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Invalid credentials';
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    
    try {
      // Create backup object with all data
      const backup = {
        metadata: {
          exportDate: new Date().toISOString(),
          exportedBy: currentUser?.email,
          version: '1.0',
          totalRecords: questions.length + answers.length + posts.length + replies.length
        },
        questions: questions,
        answers: answers,
        forum_posts: posts,
        forum_replies: replies
      };

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(backup, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      link.download = `firestore-backup_${timestamp}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('✅ Backup exported successfully');
      alert('Backup exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('❌ Error exporting backup:', error);
      alert(`Failed to export backup: ${error.message}`);
    }
    
    setIsExporting(false);
  };

  const handleDeleteQuestion = async (id) => {
    if (!deleteMode) {
      alert('Please enable Delete Mode using the switch at the top to delete items.');
      return;
    }
    if (!window.confirm('Delete this question and all its answers? This cannot be undone.')) return;
    
    try {
      // Delete all answers for this question
      const questionAnswers = answers.filter(a => a.question_id === id);
      console.log(`Deleting question ${id} and ${questionAnswers.length} answers`);
      
      for (const answer of questionAnswers) {
        await deleteDoc(doc(db, 'answers', answer.id));
      }
      
      // Delete the question
      await deleteDoc(doc(db, 'questions', id));
      
      console.log('✅ Question deleted successfully');
      await loadAllData();
    } catch (error) {
      console.error('❌ Error deleting question:', error);
      alert(`Failed to delete question: ${error.message}`);
    }
  };

  const handleDeleteAnswer = async (id) => {
    if (!deleteMode) {
      alert('Please enable Delete Mode using the switch at the top to delete items.');
      return;
    }
    if (!window.confirm('Delete this answer?')) return;
    
    try {
      await deleteDoc(doc(db, 'answers', id));
      console.log('✅ Answer deleted successfully');
      await loadAllData();
    } catch (error) {
      console.error('❌ Error deleting answer:', error);
      alert(`Failed to delete answer: ${error.message}`);
    }
  };

  const handleToggleVerified = async (answerId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'verify' : 'unverify';
    
    if (!window.confirm(`Are you sure you want to ${action} this answer?`)) return;
    
    try {
      const answerRef = doc(db, 'answers', answerId);
      await updateDoc(answerRef, {
        is_verified: newStatus,
        updated_at: new Date().toISOString()
      });
      
      console.log(`✅ Answer ${newStatus ? 'verified' : 'unverified'} successfully`);
      
      // Update local state without full reload
      setAnswers(prev => prev.map(a => 
        a.id === answerId ? { ...a, is_verified: newStatus } : a
      ));
    } catch (error) {
      console.error('❌ Error updating verification status:', error);
      alert(`Failed to ${action} answer: ${error.message}`);
    }
  };

  const handleDeletePost = async (id) => {
    if (!deleteMode) {
      alert('Please enable Delete Mode using the switch at the top to delete items.');
      return;
    }
    if (!window.confirm('Delete this post and all its replies? This cannot be undone.')) return;
    
    try {
      const postReplies = replies.filter(r => r.post_id === id);
      console.log(`Deleting post ${id} and ${postReplies.length} replies`);
      
      for (const reply of postReplies) {
        await deleteDoc(doc(db, 'forum_replies', reply.id));
      }
      
      await deleteDoc(doc(db, 'forum_posts', id));
      
      console.log('✅ Post deleted successfully');
      await loadAllData();
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      alert(`Failed to delete post: ${error.message}`);
    }
  };

  const handleDeleteReply = async (id) => {
    if (!deleteMode) {
      alert('Please enable Delete Mode using the switch at the top to delete items.');
      return;
    }
    if (!window.confirm('Delete this reply?')) return;
    
    try {
      await deleteDoc(doc(db, 'forum_replies', id));
      console.log('✅ Reply deleted successfully');
      await loadAllData();
    } catch (error) {
      console.error('❌ Error deleting reply:', error);
      alert(`Failed to delete reply: ${error.message}`);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="w-6 h-6 text-blue-600" />
              Admin Login
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Access the admin panel to manage content
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full"
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{loginError}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Make sure you've created an admin user in Firebase Authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              Logged in as: <span className="font-medium">{currentUser?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
              <label className="text-sm font-medium text-slate-700">Delete Mode</label>
              <button
                onClick={() => setDeleteMode(!deleteMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  deleteMode ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    deleteMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <Button 
              onClick={handleExportBackup}
              variant="outline"
              disabled={isExporting || loading}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export Backup'}
            </Button>
            <Button 
              onClick={loadAllData} 
              variant="outline"
              disabled={loading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-700">{questions.length}</div>
              <div className="text-sm text-blue-600 mt-1">Questions</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-700">{answers.length}</div>
              <div className="text-sm text-green-600 mt-1">Answers</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-700">{posts.length}</div>
              <div className="text-sm text-purple-600 mt-1">Forum Posts</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-700">{replies.length}</div>
              <div className="text-sm text-orange-600 mt-1">Replies</div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {loadError && (
          <div className="mb-8 flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Notice</p>
              <p className="text-sm text-yellow-700 mt-1">{loadError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-slate-600">Loading data from Firestore...</p>
          </div>
        )}

        {/* Content Sections */}
        {!loading && (
          <div className="space-y-8">
            {/* Questions */}
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-xl">Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {questions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No questions yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {questions.map((q) => (
                      <div key={q.id} className="flex justify-between items-start p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 mb-1 truncate">{q.title}</h3>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{q.content}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <Badge variant="outline" className="text-xs">{q.category}</Badge>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {q.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {q.answer_count || 0}
                            </span>
                            <span>{q.created_at ? format(new Date(q.created_at), 'MMM d, yyyy') : 'Unknown date'}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(q.id)}
                          disabled={!deleteMode}
                          className={`text-red-600 hover:text-red-700 hover:bg-red-50 ml-4 flex-shrink-0 ${!deleteMode ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Answers */}
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-xl">Answers ({answers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {answers.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No answers yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {answers.map((a) => {
                      const relatedQuestion = questions.find(q => q.id === a.question_id);
                      return (
                        <div key={a.id} className="flex justify-between items-start p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            {relatedQuestion && (
                              <div className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                                <p className="text-xs text-blue-600 font-medium mb-1">Answer to:</p>
                                <p className="text-sm text-blue-800 font-semibold truncate">{relatedQuestion.title}</p>
                              </div>
                            )}
                            <p className="text-sm text-slate-700 mb-2 line-clamp-3">{a.content}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="font-medium">{a.author_name || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{a.created_at ? format(new Date(a.created_at), 'MMM d, yyyy') : 'Unknown date'}</span>
                              {a.helpful_count > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">👍 {a.helpful_count}</span>
                                </>
                              )}
                              {a.is_verified && (
                                <>
                                  <span>•</span>
                                  <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVerified(a.id, a.is_verified)}
                              className={a.is_verified 
                                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                                : "text-green-600 hover:text-green-700 hover:bg-green-50"
                              }
                            >
                              {a.is_verified ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Unverify
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnswer(a.id)}
                              disabled={!deleteMode}
                              className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${!deleteMode ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Forum Posts */}
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-xl">Forum Posts ({posts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No forum posts yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {posts.map((p) => (
                      <div key={p.id} className="flex justify-between items-start p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 mb-1 truncate">{p.title}</h3>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{p.content}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <Badge variant="outline" className="text-xs">{p.category}</Badge>
                            <span>{p.author_name || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{p.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : 'Unknown date'}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(p.id)}
                          disabled={!deleteMode}
                          className={`text-red-600 hover:text-red-700 hover:bg-red-50 ml-4 flex-shrink-0 ${!deleteMode ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Replies */}
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-xl">Forum Replies ({replies.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {replies.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No replies yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {replies.map((r) => {
                      const relatedPost = posts.find(p => p.id === r.post_id);
                      return (
                        <div key={r.id} className="flex justify-between items-start p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            {relatedPost && (
                              <div className="mb-2 p-2 bg-purple-50 border-l-4 border-purple-400 rounded">
                                <p className="text-xs text-purple-600 font-medium mb-1">Reply to:</p>
                                <p className="text-sm text-purple-800 font-semibold truncate">{relatedPost.title}</p>
                              </div>
                            )}
                            <p className="text-sm text-slate-700 mb-2 line-clamp-3">{r.content}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="font-medium">{r.author_name || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy') : 'Unknown date'}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReply(r.id)}
                            disabled={!deleteMode}
                            className={`text-red-600 hover:text-red-700 hover:bg-red-50 ml-4 flex-shrink-0 ${!deleteMode ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}