import React, { useState, useEffect } from "react";
import { ForumPost, ForumReply } from "../entities/all";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
  Textarea,
  Alert,
  AlertDescription
} from "../components/ui/all";
import { 
  Search, 
  MessageSquare, // Use MessageSquare instead of MessageCircle
  Eye, 
  Clock, 
  Plus,
  Pin,
  Users,
  BookOpen,
  Heart,
  Globe,
  ArrowLeft,    // ADD THIS
  CheckCircle,  // ADD THIS  
  Send,         // ADD THIS
  User          // ADD THIS (note: singular User, not Users for icon)
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
  testimonies: MessageSquare, // Changed from MessageCircle
  youth: Users,
  family: Heart,
  missions: Globe,
  other: MessageSquare // Changed from MessageCircle
};

export default function Forums() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await ForumPost.list("-created_date", 50);
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Community Forums
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Connect with fellow believers, share experiences, and grow together in faith.
          </p>
          
          <Link to={createPageUrl("CreatePost")}>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />
              Start New Discussion
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Discussions Found</h3>
              <p className="text-slate-500 mb-6">Start the first discussion in this community</p>
              <Link to={createPageUrl("CreatePost")}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Start First Discussion
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => {
              const CategoryIcon = categoryIcons[post.category] || MessageSquare;
              return (
                <Card key={post.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}