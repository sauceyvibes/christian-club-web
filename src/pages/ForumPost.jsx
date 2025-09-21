
import React, { useState, useEffect, useCallback } from "react";
import { ForumPost, ForumReply, User } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Clock,
  User as UserIcon,
  Send,
  CheckCircle,
  Pin,
  Reply
} from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  general_discussion: "bg-blue-50 text-blue-700 border-blue-200",
  bible_study: "bg-amber-50 text-amber-700 border-amber-200",
  prayer_requests: "bg-purple-50 text-purple-700 border-purple-200",
  testimonies: "bg-green-50 text-green-700 border-green-200",
  youth: "bg-pink-50 text-pink-700 border-pink-200",
  family: "bg-orange-50 text-orange-700 border-orange-200",
  missions: "bg-indigo-50 text-indigo-700 border-indigo-200",
  other: "bg-slate-50 text-slate-700 border-slate-200"
};

export default function ForumPostPage() {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const loadPost = useCallback(async () => {
    try {
      const postData = await ForumPost.filter({id: postId});
      if (postData.length === 0) {
        navigate(createPageUrl("Forums"));
        return;
      }
      
      const p = postData[0];
      setPost(p);
      
      // Update view count
      await ForumPost.update(postId, { view_count: (p.view_count || 0) + 1 });
      
      // Load replies
      const replyData = await ForumReply.filter({post_id: postId}, "-created_date");
      setReplies(replyData);
      
    } catch (error) {
      console.error("Error loading post:", error);
      navigate(createPageUrl("Forums"));
    } finally {
      setIsLoading(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    if (!postId) {
      navigate(createPageUrl("Forums"));
      return;
    }
    loadPost();
  }, [postId, navigate, loadPost]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setIsSubmitting(true);
    try {
      await ForumReply.create({
        post_id: postId,
        content: newReply,
        author_name: authorName.trim() || null
      });

      // Update reply count
      await ForumPost.update(postId, { 
        reply_count: (post.reply_count || 0) + 1 
      });

      setNewReply("");
      setAuthorName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadPost();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
            <Card className="mb-6">
              <CardHeader>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Forums"))}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forums
        </Button>

        {/* Forum Post */}
        <Card className="mb-8 bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              {post.is_pinned && (
                <Pin className="w-4 h-4 text-amber-500 mt-1" />
              )}
              <Badge className={`${categoryColors[post.category]} border text-sm px-3 py-1`}>
                {post.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-slate-500 ml-auto">
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
            
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-relaxed">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-3">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>by {post.author_name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(post.created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Reply className="w-5 h-5 text-purple-600" />
            {replies.length === 0 ? "No replies yet" : `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
          </h2>
          
          <div className="space-y-6">
            {replies.map((reply, index) => (
              <Card key={reply.id} className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-medium text-slate-700">
                          {reply.author_name || "Anonymous"}
                        </span>
                        <span className="text-sm text-slate-500">
                          {format(new Date(reply.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      
                      <div className="prose prose-slate prose-sm max-w-none">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submit Reply */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              Join the Discussion
            </h3>
          </CardHeader>
          <CardContent>
            {submitted && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your reply has been posted! Thanks for contributing to the discussion.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <Input
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-white border-slate-300 focus:border-purple-400"
              />
              
              <Textarea
                placeholder="What are your thoughts on this topic?"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={5}
                className="bg-white border-slate-300 focus:border-purple-400 resize-none"
                required
              />
              
              <Button
                type="submit"
                disabled={isSubmitting || !newReply.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
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
      </div>
    </div>
  );
}
