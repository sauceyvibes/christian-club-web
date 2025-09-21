<<<<<<< HEAD

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
  Users } from
"lucide-react";
=======
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Question, Answer } from "../entities/all";
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
  ThumbsUp,
  Heart,
  Send,
  CheckCircle,
  User
} from "lucide-react";
>>>>>>> f272c81638847e975ee88d8ab925e4b32e1dc558
import { format } from "date-fns";

const categoryColors = {
  theology: "bg-purple-100 text-purple-800 border-purple-200",
<<<<<<< HEAD
  prayer: "bg-blue-100 text-blue-800 border-blue-200",
=======
  prayer: "bg-blue-100 text-blue-800 border-blue-200", 
>>>>>>> f272c81638847e975ee88d8ab925e4b32e1dc558
  daily_life: "bg-green-100 text-green-800 border-green-200",
  bible_study: "bg-amber-100 text-amber-800 border-amber-200",
  relationships: "bg-pink-100 text-pink-800 border-pink-200",
  faith_journey: "bg-indigo-100 text-indigo-800 border-indigo-200",
  church_life: "bg-orange-100 text-orange-800 border-orange-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

<<<<<<< HEAD
// Sample data for development and fallback
const sampleQuestionsData = [
  {
    id: "q1",
    title: "What is the meaning of life from a Christian perspective?",
    content:
      "I've been wondering about the ultimate purpose of our existence. How does Christianity answer this fundamental question? Is it about serving God, loving others, or something more?",
    category: "theology",
    created_date: "2023-10-26T10:00:00Z",
    view_count: 154,
    answer_count: 8,
  },
  {
    id: "q2",
    title: "How can I deepen my daily prayer life?",
    content:
      "My prayer life feels a bit stagnant. I want to connect more deeply with God on a daily basis. Any practical tips, resources, or methods that have worked for you?",
    category: "prayer",
    created_date: "2023-10-25T14:30:00Z",
    view_count: 210,
    answer_count: 12,
  },
  {
    id: "q3",
    title: "Dealing with stress and anxiety as a Christian",
    content:
      "Life can be overwhelming, and I often find myself stressed and anxious. How do I reconcile this with my faith? Are there biblical principles or practices that help manage these feelings?",
    category: "daily_life",
    created_date: "2023-10-24T09:15:00Z",
    view_count: 188,
    answer_count: 7,
  },
  {
    id: "q4",
    title: "Understanding the Book of Revelation: A beginner's guide?",
    content:
      "I've always found the Book of Revelation intimidating and hard to understand. Can anyone recommend a good beginner-friendly guide or share insights on how to approach studying it?",
    category: "bible_study",
    created_date: "2023-10-23T11:45:00Z",
    view_count: 95,
    answer_count: 4,
  },
  {
    id: "q5",
    title: "How to maintain Christian friendships in a busy world?",
    content:
      "It's tough to keep up with friends, especially Christian ones, with everyone's busy schedules. What are some ways to nurture these relationships and keep Christ at the center?",
    category: "relationships",
    created_date: "2023-10-22T16:00:00Z",
    view_count: 130,
    answer_count: 6,
  },
  {
    id: "q6",
    title: "Doubting my faith: Is it normal and how do I navigate it?",
    content:
      "Lately, I've been struggling with doubts about my faith. It feels scary and isolating. Is this a normal part of a faith journey, and what steps can I take to strengthen my beliefs?",
    category: "faith_journey",
    created_date: "2023-10-21T08:00:00Z",
    view_count: 250,
    answer_count: 15,
  },
  {
    id: "q7",
    title: "What are the core differences between Calvinism and Arminianism?",
    content:
      "I'm trying to understand Reformed theology better. Can someone explain the main points of divergence and agreement between Calvinism and Arminianism in simple terms?",
    category: "theology",
    created_date: "2023-10-20T13:00:00Z",
    view_count: 170,
    answer_count: 9,
  },
  {
    id: "q8",
    title: "Effective ways to pray for non-believing friends and family.",
    content:
      "I have many loved ones who don't share my faith, and I constantly pray for them. Are there specific prayer strategies or attitudes that are particularly effective when praying for their salvation?",
    category: "prayer",
    created_date: "2023-10-19T10:30:00Z",
    view_count: 190,
    answer_count: 10,
  },
  {
    id: "q9",
    title: "Balancing work, family, and church commitments without burnout.",
    content:
      "It feels like I'm constantly juggling responsibilities. How do other Christians manage their work, family life, and church involvement without feeling completely drained and burnt out?",
    category: "daily_life",
    created_date: "2023-10-18T15:00:00Z",
    view_count: 160,
    answer_count: 5,
  },
  {
    id: "q10",
    title: "Tips for leading a small group Bible study effectively.",
    content:
      "I'm about to start leading a small group Bible study for the first time. Any advice on preparation, facilitating discussions, and encouraging participation?",
    category: "bible_study",
    created_date: "2023-10-17T09:00:00Z",
    view_count: 110,
    answer_count: 3,
  },
];


export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadQuestions = async () => {
    setIsLoading(true);
    let fetchedData = [];
    try {
      // Attempt to load questions from the backend
      const result = await Question.list("-created_date", 50);
      fetchedData = result || []; // Ensure it's an array even if result is null/undefined
    } catch (error) {
      console.warn("Failed to load questions from backend, using sample data. Error:", error);
      fetchedData = []; // Ensure it's an empty array if error
    }

    // If no data was fetched or an error occurred, use sample data.
    // Otherwise, prioritize fetched data.
    const finalData = fetchedData.length > 0 ? fetchedData : sampleQuestionsData;

    setQuestions(finalData);
    setIsLoading(false);
  };

  const filterQuestions = useCallback(() => {
    let filtered = questions;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((q) =>
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
  { value: "other", label: "Other", icon: MessageCircle }];


  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="bg-[#FAFAFA] mx-auto px-3 sm:px-4 max-w-6xl lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2 sm:mb-3">
            Questions & Answers
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
            Ask your faith questions anonymously and get thoughtful responses from our Christian community.
          </p>
          
          <Link to={createPageUrl("AskQuestion")}>
            <Button className="bg-[#4058c4] text-white px-4 sm:px-6 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 sm:h-10 hover:bg-blue-700 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Ask a Question</span>
              <span className="xs:hidden sm:hidden">Ask</span>
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card className="mb-4 sm:mb-6 bg-white border-slate-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 mb-3 sm:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-blue-400 text-sm" />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1 bg-slate-100 p-1">
                {categories.map((category) =>
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="flex items-center gap-1 px-1 sm:px-2 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200">
                    <category.icon className="w-3 h-3" />
                    <span className="hidden sm:inline truncate">{category.label}</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Questions Grid */}
        {isLoading ?
        <div className="grid gap-3 sm:gap-4">
            {Array(6).fill(0).map((_, i) =>
          <Card key={i} className="animate-pulse">
                <CardHeader className="p-4 sm:p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
          )}
          </div> :

        <div className="grid gap-3 sm:gap-4">
            {filteredQuestions.map((question) =>
          <Link key={question.id} to={createPageUrl(`Question?id=${question.id}`)}>
                <Card className="hover:shadow-md transition-all duration-200 bg-white border-slate-200 cursor-pointer">
                  <CardHeader className="bg-slate-100 p-4 sm:p-6 flex flex-col space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <Badge className={`${categoryColors[question.category]} border text-xs px-2 py-1 self-start`}>
                        {question.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {question.view_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {question.answer_count || 0}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 line-clamp-2 leading-tight">
                      {question.title}
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="bg-slate-50 p-4 sm:p-6">
                    <p className="text-slate-600 line-clamp-2 mb-3 text-sm leading-relaxed">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(question.created_date), "MMM d")}</span>
                      </div>
                      
                      <div className="text-xs text-blue-600 font-medium">
                        Read More →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
          )}
            
            {filteredQuestions.length === 0 && !isLoading &&
          <Card className="text-center py-6 sm:py-8 bg-slate-50 border-slate-200">
                <CardContent className="px-4">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-medium text-slate-600 mb-2">No Questions Found</h3>
                  <p className="text-slate-500 mb-4 text-sm px-4">
                    {searchTerm || selectedCategory !== "all" ?
                "Try adjusting your search or filters" :
                "Be the first to ask a question"}
                  </p>
                  <Link to={createPageUrl("AskQuestion")}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ask the First Question
                    </Button>
                  </Link>
                </CardContent>
              </Card>
          }
          </div>
        }
      </div>
    </div>);
=======
export default function QuestionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const questionId = searchParams.get('id');
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const questionEntity = new Question();
  const answerEntity = new Answer();

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) {
        navigate(createPageUrl("Questions"));
        return;
      }

      setIsLoading(true);
      const questionData = await questionEntity.get(questionId);
      
      if (!questionData) {
        navigate(createPageUrl("Questions"));
        return;
      }

      // Increment view count
      await questionEntity.incrementViewCount(questionId);
      
      setQuestion({ ...questionData, view_count: (questionData.view_count || 0) + 1 });
      
      // Load answers
      const answersData = await answerEntity.getByQuestionId(questionId);
      setAnswers(answersData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      
      setIsLoading(false);
    };

    loadQuestion();
  }, [questionId]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    
    try {
      const answer = await answerEntity.create({
        question_id: questionId,
        content: newAnswer.trim(),
        author_name: authorName.trim() || null,
        is_verified: false,
        helpful_count: 0
      });

      // Update question answer count
      await questionEntity.incrementAnswerCount(questionId);
      
      // Add to answers list
      setAnswers(prev => [answer, ...prev]);
      
      // Update question state
      setQuestion(prev => ({
        ...prev,
        answer_count: (prev.answer_count || 0) + 1
      }));
      
      // Clear form
      setNewAnswer("");
      setAuthorName("");
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
    
    setIsSubmitting(false);
  };

  const handleHelpful = async (answerId) => {
    await answerEntity.incrementHelpfulCount(answerId);
    setAnswers(prev => 
      prev.map(answer => 
        answer.id === answerId 
          ? { ...answer, helpful_count: (answer.helpful_count || 0) + 1 }
          : answer
      )
    );
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

  if (!question) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-slate-600 mb-4">Question Not Found</h2>
              <p className="text-slate-500 mb-6">The question you're looking for doesn't exist.</p>
              <Button onClick={() => navigate(createPageUrl("Questions"))}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Questions"))}
          className="mb-6 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Questions
        </Button>

        {/* Success Message */}
        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your answer has been posted successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Question */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
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
                  {answers.length}
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl text-slate-800 mb-4">
              {question.title}
            </CardTitle>
            
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Asked {format(new Date(question.created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {question.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Answer Form */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Heart className="w-5 h-5 text-red-500" />
              Share Your Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Leave blank to post anonymously"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Answer *
                </label>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Share your thoughts, wisdom, or encouragement..."
                  rows={6}
                  className="resize-none"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !newAnswer.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting Answer...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Answer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Answers ({answers.length})
          </h2>
          
          {answers.length === 0 ? (
            <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-blue-100">
              <CardContent>
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Answers Yet</h3>
                <p className="text-slate-500">Be the first to share your thoughts and help answer this question.</p>
              </CardContent>
            </Card>
          ) : (
            answers.map((answer) => (
              <Card key={answer.id} className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {answer.author_name || "Anonymous"}
                      </span>
                      {answer.is_verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {format(new Date(answer.created_date), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none mb-4">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {answer.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(answer.id)}
                      className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({answer.helpful_count || 0})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
>>>>>>> f272c81638847e975ee88d8ab925e4b32e1dc558
}
