import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ForumPost, ForumReply } from "../entities/all";
import { createPageUrl } from "../utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Textarea,
  Alert,
  AlertDescription
} from "../components/ui/all";
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Clock, 
  Send,
  CheckCircle,
  User,
  Pin,
  Users,
  BookOpen,
  Heart,
  Globe
} from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  general_discussion: "bg-blue-100 text-blue-800 border-blue-200",
  bible_study: "bg-amber-100 text-amber-800 border-amber-200",
  prayer_requests: "bg-purple-100 text-purple-800 border-purple-200",
  testimonies: "bg-green-100 text-green-800 border-green-200",
  youth: "bg-pink-100 text-pink-800 border-pink-200",
  family: "bg-orange-100 text-orange-800 border-orange-200",
  missions: "bg-indigo-100 text-indigo-800 border-indigo-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

const categoryIcons = {
  general_discussion: Users,
  bible_study: BookOpen,
  prayer_requests: Heart,
  testimonies: MessageSquare,
  youth: Users,
  family: Heart,
  missions: Globe,
  other: MessageSquare
};

export default function ForumPostPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId = searchParams.get('id');
  
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReply, setNewReply] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        navigate(createPageUrl("Forums"));
        return;
      }

      setIsLoading(true);
      
      try {
        const postData = await ForumPost.get(postId);
        
        if (!postData) {
          navigate(createPageUrl("Forums"));
          return;
        }

        await ForumPost.incrementViewCount(postId);
        
        setPost({ ...postData, view_count: (postData.view_count || 0) + 1 });
        
        const repliesData = await ForumReply.getThreadReplies(postId);
        setReplies(repliesData);
      } catch (error) {
        console.error("Error loading post:", error);
        navigate(createPageUrl("Forums"));
      }
      
      setIsLoading(false);
    };

    loadPost();
  }, [postId, navigate]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setIsSubmitting(true);
    
    try {
      const reply = await ForumReply.create({
        post_id: postId,
        content: newReply.trim(),
        author_name: authorName.trim() || null,
        parent_reply_id: null
      });

      await ForumPost.incrementReplyCount(postId);
      
      setReplies(prev => [...prev, reply]);
      
      setPost(prev => ({
        ...prev,
        reply_count: (prev.reply_count || 0) + 1
      }));
      
      setNewReply("");
      setAuthorName("");
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-slate-600 mb-4">Post Not Found</h2>
              <p className="text-slate-500 mb-6">The discussion you're looking for doesn't exist.</p>
              <Button onClick={() => navigate(createPageUrl("Forums"))}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forums
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[post.category] || MessageSquare;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Forums"))}
          className="mb-6 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forums
        </Button>

        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your reply has been posted successfully!
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-amber-500" />
                )}
                <Badge className={`${categoryColors[post.category] || categoryColors.other} border font-medium px-3 py-1 flex items-center gap-1`}>
                  <CategoryIcon className="w-3 h-3" />
                  {(post.category || 'other').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {replies.length}
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl text-slate-800 mb-4">
              {post.title}
            </CardTitle>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="w-4 h-4" />
                <span>{post.author_name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Posted {format(new Date(post.created_date || post.created_at || Date.now()), "MMMM d, yyyy")}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Join the Discussion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Leave blank to post anonymously"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Reply *
                </label>
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share your thoughts, ask questions, or contribute to the discussion..."
                  rows={5}
                  className="resize-none bg-white/70"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !newReply.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting Reply...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            Discussion ({replies.length})
          </h2>
          
          {replies.length === 0 ? (
            <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-purple-100">
              <CardContent>
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Replies Yet</h3>
                <p className="text-slate-500">Be the first to join this discussion and share your thoughts.</p>
              </CardContent>
            </Card>
          ) : (
            replies.map((reply, index) => (
              <Card key={reply.id} className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-6" style={{paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {reply.author_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-400">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {format(new Date(reply.created_date || reply.created_at || Date.now()), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}