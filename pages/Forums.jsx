
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
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
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
    { value: "missions", label: "Missions", icon: Handshake }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
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

        {/* Search and Filter */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-1 bg-slate-100 p-1 rounded-xl">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="flex items-center gap-1 px-3 py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <category.icon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Forum Posts */}
        {isLoading ? (
          <div className="grid gap-6">
            {Array(8).fill(0).map((_, i) => (
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
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => {
              const CategoryIcon = categoryIcons[post.category] || MessageSquare;
              return (
                <Link key={post.id} to={createPageUrl(`ForumPost?id=${post.id}`)}>
                  <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100 cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-3">
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
                            <MessageSquare className="w-4 h-4" />
                            {post.reply_count || 0}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.author_name && (
                        <p className="text-sm text-slate-500">
                          by {post.author_name}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-600 line-clamp-3 mb-4">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>Posted {format(new Date(post.created_date), "MMM d, yyyy")}</span>
                        </div>
                        
                        <div className="text-sm text-purple-600 font-medium">
                          Join Discussion →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            
            {filteredPosts.length === 0 && !isLoading && (
              <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-blue-100">
                <CardContent>
                  <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No Discussions Found</h3>
                  <p className="text-slate-500 mb-6">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Start the first discussion in this community"}
                  </p>
                  <Link to={createPageUrl("CreatePost")}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start First Discussion
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
