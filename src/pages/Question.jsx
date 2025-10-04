import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Question, Answer } from "../entities/all";
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
  MessageCircle, 
  Eye, 
  Clock, 
  Heart,
  CheckCircle,
  Send,
  User,
  ThumbsUp
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

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) {
        navigate(createPageUrl("Questions"));
        return;
      }

      setIsLoading(true);
      
      try {
        const questionData = await Question.get(questionId);
        
        if (!questionData) {
          navigate(createPageUrl("Questions"));
          return;
        }

        await Question.incrementViewCount(questionId);
        
        setQuestion({ ...questionData, view_count: (questionData.view_count || 0) + 1 });
        
        const answersData = await Answer.getByQuestionId(questionId);
        setAnswers(answersData.sort((a, b) => new Date(b.created_date || b.created_at) - new Date(a.created_date || a.created_at)));
      } catch (error) {
        console.error("Error loading question:", error);
        navigate(createPageUrl("Questions"));
      }
      
      setIsLoading(false);
    };

    loadQuestion();
  }, [questionId, navigate]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    
    try {
      const answer = await Answer.create({
        question_id: questionId,
        content: newAnswer.trim(),
        author_name: authorName.trim() || null,
        is_verified: false,
        helpful_count: 0
      });

      await Question.incrementAnswerCount(questionId);
      
      setAnswers(prev => [answer, ...prev]);
      
      setQuestion(prev => ({
        ...prev,
        answer_count: (prev.answer_count || 0) + 1
      }));
      
      setNewAnswer("");
      setAuthorName("");
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
    
    setIsSubmitting(false);
  };

  const handleHelpful = async (answerId) => {
    try {
      await Answer.incrementHelpfulCount(answerId);
      setAnswers(prev => 
        prev.map(answer => 
          answer.id === answerId 
            ? { ...answer, helpful_count: (answer.helpful_count || 0) + 1 }
            : answer
        )
      );
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
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
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Questions"))}
          className="mb-6 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Questions
        </Button>

        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your answer has been posted successfully!
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <Badge className={`${categoryColors[question.category] || categoryColors.other} border font-medium px-3 py-1`}>
                {(question.category || 'other').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
              <span>Asked {format(new Date(question.created_date || question.created_at || Date.now()), "MMMM d, yyyy")}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
              {question.content}
            </p>
          </CardContent>
        </Card>

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
                      {format(new Date(answer.created_date || answer.created_at || Date.now()), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {answer.content}
                  </p>
                  
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
}