
import React, { useState, useEffect, useCallback } from "react";
import { Question, Answer } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MessageCircle, 
  Eye, 
  Clock, 
  Filter,
  Plus,
  BookOpen,
  Heart,
  Users
} from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  theology: "bg-purple-100 text-purple-800 border-purple-200",
  prayer: "bg-blue-100 text-blue-800 border-blue-200",
  daily_life: "bg-green-100 text-green-800 border-green-200",
  bible_study: "bg-amber-100 text-amber-800 border-amber-200",
  relationships: "bg-pink-100 text-pink-800 border-pink-200",
  faith_journey: "bg-indigo-100 text-indigo-800 border-indigo-200",
  church_life: "bg-orange-100 text-orange-800 border-orange-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadQuestions = async () => {
    setIsLoading(true);
    const data = await Question.list("-created_date", 50);
    setQuestions(data);
    setIsLoading(false);
  };

  const filterQuestions = useCallback(() => {
    let filtered = questions;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, searchTerm, selectedCategory]);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  const categories = [
    { value: "all", label: "All Categories", icon: Filter },
    { value: "theology", label: "Theology", icon: BookOpen },
    { value: "prayer", label: "Prayer", icon: Heart },
    { value: "daily_life", label: "Daily Life", icon: Users },
    { value: "bible_study", label: "Bible Study", icon: BookOpen },
    { value: "relationships", label: "Relationships", icon: Heart },
    { value: "faith_journey", label: "Faith Journey", icon: Users },
    { value: "church_life", label: "Church Life", icon: Users },
    { value: "other", label: "Other", icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Questions & Answers
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Explore anonymous questions about faith and Christianity. Find wisdom through community.
          </p>
          
          <Link to={createPageUrl("AskQuestion")}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />
              Ask Your Question
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
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1 bg-slate-100 p-1 rounded-xl">
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

        {/* Questions Grid */}
        {isLoading ? (
          <div className="grid gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
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
            {filteredQuestions.map((question) => (
              <Link key={question.id} to={createPageUrl(`Question?id=${question.id}`)}>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100 cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${categoryColors[question.category]} border font-medium px-3 py-1`}>
                        {question.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {question.view_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {question.answer_count || 0}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">
                      {question.title}
                    </h3>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600 line-clamp-3 mb-4">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>Asked {format(new Date(question.created_date), "MMM d, yyyy")}</span>
                      </div>
                      
                      <div className="text-sm text-blue-600 font-medium">
                        Read More →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {filteredQuestions.length === 0 && !isLoading && (
              <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-blue-100">
                <CardContent>
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No Questions Found</h3>
                  <p className="text-slate-500 mb-6">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Be the first to ask a question in this community"}
                  </p>
                  <Link to={createPageUrl("AskQuestion")}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Ask the First Question
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
