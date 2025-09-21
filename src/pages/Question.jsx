
import React, { useState, useEffect, useCallback } from "react";
import { Question, Answer, User } from "@/entities/all";
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
  MessageCircle, 
  Eye, 
  Clock,
  Heart,
  User as UserIcon,
  Send,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  theology: "bg-purple-50 text-purple-700 border-purple-200",
  prayer: "bg-blue-50 text-blue-700 border-blue-200",
  daily_life: "bg-green-50 text-green-700 border-green-200",
  bible_study: "bg-amber-50 text-amber-700 border-amber-200",
  relationships: "bg-rose-50 text-rose-700 border-rose-200",
  faith_journey: "bg-indigo-50 text-indigo-700 border-indigo-200",
  church_life: "bg-orange-50 text-orange-700 border-orange-200",
  other: "bg-slate-50 text-slate-700 border-slate-200"
};

export default function QuestionPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('id');

  const loadQuestion = useCallback(async () => {
    try {
      const questionData = await Question.filter({id: questionId});
      if (questionData.length === 0) {
        navigate(createPageUrl("Questions"));
        return;
      }
      
      const q = questionData[0];
      setQuestion(q);
      
      // Update view count
      await Question.update(questionId, { view_count: (q.view_count || 0) + 1 });
      
      // Load answers
      const answerData = await Answer.filter({question_id: questionId}, "-created_date");
      setAnswers(answerData);
      
    } catch (error) {
      console.error("Error loading question:", error);
      navigate(createPageUrl("Questions"));
    } finally {
      setIsLoading(false);
    }
  }, [questionId, navigate]);

  useEffect(() => {
    if (!questionId) {
      navigate(createPageUrl("Questions"));
      return;
    }
    loadQuestion();
  }, [questionId, navigate, loadQuestion]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      await Answer.create({
        question_id: questionId,
        content: newAnswer,
        author_name: authorName.trim() || null,
        helpful_count: 0
      });

      // Update answer count
      await Question.update(questionId, { 
        answer_count: (question.answer_count || 0) + 1 
      });

      setNewAnswer("");
      setAuthorName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadQuestion();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-4 sm:py-6">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-slate-200 rounded w-1/4 mb-6 sm:mb-8"></div>
            <Card className="mb-6">
              <CardHeader className="p-4 sm:p-6">
                <div className="h-4 sm:h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="h-3 sm:h-4 bg-slate-200 rounded"></div>
                  <div className="h-3 sm:h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-3 sm:h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Questions"))}
          className="mb-4 sm:mb-6 text-slate-600 hover:text-slate-800 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Questions</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Question */}
        <Card className="mb-6 sm:mb-8 bg-white border-slate-200 shadow-sm">
          <CardHeader className="p-4 sm:pb-4 sm:px-6 sm:pt-6">
            <div className="flex flex-wrap items-start gap-3 mb-3 sm:mb-4">
              <Badge className={`${categoryColors[question.category]} border text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                {question.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 ml-auto">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {question.view_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {answers.length}
                </div>
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 leading-tight sm:leading-relaxed">
              {question.title}
            </h1>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-3">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Asked {format(new Date(question.created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
              <span className="sm:hidden">Asked {format(new Date(question.created_date), "MMM d")}</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-sm sm:text-lg leading-relaxed whitespace-pre-wrap">
                {question.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 px-2 sm:px-0">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            {answers.length === 0 ? "No answers yet" : `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {answers.map((answer, index) => (
              <Card key={answer.id} className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2 sm:mb-3">
                        <span className="font-medium text-slate-700 text-sm sm:text-base truncate">
                          {answer.author_name || "Anonymous"}
                        </span>
                        {answer.is_verified && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs self-start">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <span className="text-xs sm:text-sm text-slate-500">
                          {format(new Date(answer.created_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="prose prose-slate prose-sm max-w-none">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                          {answer.content}
                        </p>
                      </div>
                      
                      {answer.helpful_count > 0 && (
                        <div className="flex items-center gap-1 mt-3 text-xs sm:text-sm text-slate-500">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                          <span>{answer.helpful_count} found this helpful</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submit Answer */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Share Your Answer
            </h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {submitted && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  Thank you! Your answer has been posted and will help others.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <Input
                placeholder="Your name (optional - leave blank to post anonymously)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-white border-slate-300 focus:border-blue-400 text-sm"
              />
              
              <Textarea
                placeholder="Share your thoughts, biblical insights, or personal experience that might help answer this question..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={5}
                className="bg-white border-slate-300 focus:border-blue-400 resize-none text-sm"
                required
              />
              
              <Button
                type="submit"
                disabled={isSubmitting || !newAnswer.trim()}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
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
      </div>
    </div>
  );
}
