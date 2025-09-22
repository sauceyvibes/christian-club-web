import React, { useState, useEffect } from "react";
import { Question, Answer } from "../entities/all";
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
  MessageCircle, 
  Eye, 
  Clock, 
  Plus,
  BookOpen,
  Heart,
  Users,
  Filter,
  ArrowLeft,    // ADD THIS
  CheckCircle,  // ADD THIS
  Send,         // ADD THIS
  User,         // ADD THIS
  ThumbsUp      // ADD THIS
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await Question.list("-created_date", 50);
      setQuestions(data || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => 
    !searchTerm.trim() || 
    (q.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Questions & Answers
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Explore anonymous questions about faith and Christianity.
          </p>
          
          <Link to={createPageUrl("AskQuestion")}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              Ask Your Question
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
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
        ) : filteredQuestions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Questions Found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm ? "Try a different search" : "Be the first to ask a question"}
              </p>
              <Link to={createPageUrl("AskQuestion")}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ask the First Question
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredQuestions.map((question) => (
              <Link key={question.id} to={createPageUrl(`Question?id=${question.id}`)}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${categoryColors[question.category] || categoryColors.other}`}>
                        {(question.category || 'other').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                    <h3 className="text-xl font-semibold">{question.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      {(question.content || '').substring(0, 200)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>Asked {format(new Date(question.created_date || question.created_at || Date.now()), "MMM d, yyyy")}</span>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        Read More →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}