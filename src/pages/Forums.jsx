<<<<<<< HEAD

import React, { useState, useEffect, useCallback } from "react";
import { ForumPost } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageSquare,
  Eye,
  Clock,
  Plus,
  Pin,
  Users,
  BookOpen,
  Heart,
  Handshake } from
"lucide-react";
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
  missions: Handshake,
  other: MessageSquare
};

export default function Forums() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await ForumPost.list("-created_date", 50);
    setPosts(data);
    setIsLoading(false);
  };

  const filterPosts = useCallback(() => {
    let filtered = posts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]); // Dependencies for useCallback

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]); // Dependency for useEffect is the memoized filterPosts function

  const categories = [
  { value: "all", label: "All Topics", icon: Users },
  { value: "general_discussion", label: "General", icon: Users },
  { value: "bible_study", label: "Bible Study", icon: BookOpen },
  { value: "prayer_requests", label: "Prayer", icon: Heart },
  { value: "testimonies", label: "Testimonies", icon: MessageSquare },
  { value: "youth", label: "Youth", icon: Users },
  { value: "family", label: "Family", icon: Heart },
  { value: "missions", label: "Missions", icon: Handshake }];


  return (
    <div className="min-h-screen py-6">
      <div className="bg-[#FAFAFA] mx-auto px-4 max-w-6xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Community Forums
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Connect with other believers, share experiences, and discuss faith topics together.
          </p>
          
          <Link to={createPageUrl("CreatePost")}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Start Discussion
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-purple-400" />

              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-1 bg-slate-100 p-1">
                {categories.map((category) =>
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-600 transition-all duration-200">

                    <category.icon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Forum Posts */}
        {isLoading ?
        <div className="grid gap-4">
            {Array(8).fill(0).map((_, i) =>
          <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
          )}
          </div> :

        <div className="grid gap-4">
            {filteredPosts.map((post) => {
            const CategoryIcon = categoryIcons[post.category] || MessageSquare;
            return (
              <Link key={post.id} to={createPageUrl(`ForumPost?id=${post.id}`)}>
                  <Card className="hover:shadow-md transition-all duration-200 bg-white border-slate-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {post.is_pinned &&
                        <Pin className="w-4 h-4 text-amber-500" />
                        }
                          <Badge className={`${categoryColors[post.category]} border text-xs px-2 py-1 flex items-center gap-1`}>
                            <CategoryIcon className="w-3 h-3" />
                            {post.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.view_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.reply_count || 0}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.author_name &&
                    <p className="text-xs text-slate-500">
                          by {post.author_name}
                        </p>
                    }
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-slate-600 line-clamp-2 mb-3 text-sm">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Posted {format(new Date(post.created_date), "MMM d")}</span>
                        </div>
                        
                        <div className="text-xs text-purple-600 font-medium">
                          Join Discussion →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>);

          })}
            
            {filteredPosts.length === 0 && !isLoading &&
          <Card className="text-center py-8 bg-slate-50 border-slate-200">
                <CardContent>
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No Discussions Found</h3>
                  <p className="text-slate-500 mb-4 text-sm">
                    {searchTerm || selectedCategory !== "all" ?
                "Try adjusting your search or filters" :
                "Start the first discussion"}
                  </p>
                  <Link to={createPageUrl("CreatePost")}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Start First Discussion
                    </Button>
                  </Link>
                </CardContent>
              </Card>
          }
          </div>
        }
      </div>
    </div>);

}
=======
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ForumPost, ForumReply } from "../entities/all";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/all";
import { Button } from "../components/ui/all";
import { Textarea } from "../components/ui/all";
import { Badge } from "../components/ui/all";
import { Alert, AlertDescription } from "../components/ui/all";
import { 
  ArrowLeft, 
  MessageCircle, 
  Eye, 
  Clock, 
  Send,
  CheckCircle,
  User,
  Pin,
  Users,
  BookOpen,
  Heart,
  Handshake
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
  testimonies: MessageCircle,
  youth: Users,
  family: Heart,
  missions: Handshake,
  other: MessageCircle
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

  const forumPostEntity = new ForumPost();
  const forumReplyEntity = new ForumReply();

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        navigate(createPageUrl("Forums"));
        return;
      }

      setIsLoading(true);
      const postData = await forumPostEntity.get(postId);
      
      if (!postData) {
        navigate(createPageUrl("Forums"));
        return;
      }

      // Increment view count
      await forumPostEntity.incrementViewCount(postId);
      
      setPost({ ...postData, view_count: (postData.view_count || 0) + 1 });
      
      // Load replies
      const repliesData = await forumReplyEntity.getThreadReplies(postId);
      setReplies(repliesData);
      
      setIsLoading(false);
    };

    loadPost();
  }, [postId]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setIsSubmitting(true);
    
    try {
      const reply = await forumReplyEntity.create({
        post_id: postId,
        content: newReply.trim(),
        author_name: authorName.trim() || null,
        parent_reply_id: null
      });

      // Update post reply count
      await forumPostEntity.incrementReplyCount(postId);
      
      // Add to replies list
      setReplies(prev => [...prev, reply]);
      
      // Update post state
      setPost(prev => ({
        ...prev,
        reply_count: (prev.reply_count || 0) + 1
      }));
      
      // Clear form
      setNewReply("");
      setAuthorName("");
      
      // Show success message
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
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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

  const CategoryIcon = categoryIcons[post.category] || MessageCircle;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Forums"))}
          className="mb-6 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forums
        </Button>

        {/* Success Message */}
        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your reply has been posted successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Forum Post */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-amber-500" />
                )}
                <Badge className={`${categoryColors[post.category]} border font-medium px-3 py-1 flex items-center gap-1`}>
                  <CategoryIcon className="w-3 h-3" />
                  {post.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
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
                <span>Posted {format(new Date(post.created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
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

        {/* Reply Form */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MessageCircle className="w-5 h-5 text-purple-600" />
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

        {/* Replies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            Discussion ({replies.length})
          </h2>
          
          {replies.length === 0 ? (
            <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-purple-100">
              <CardContent>
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Replies Yet</h3>
                <p className="text-slate-500">Be the first to join this discussion and share your thoughts.</p>
              </CardContent>
            </Card>
          ) : (
            replies.map((reply, index) => (
              <Card key={reply.id} className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-6">
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
                      {format(new Date(reply.created_date), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
>>>>>>> f272c81638847e975ee88d8ab925e4b32e1dc558
