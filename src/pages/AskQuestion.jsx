import React, { useState } from "react";
import { Question } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  MessageCircle,
  Heart,
  CheckCircle,
  ArrowLeft,
  Lock } from
"lucide-react";

export default function AskQuestion() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "other"
  });

  const categories = [
  { value: "theology", label: "Theology & Doctrine" },
  { value: "prayer", label: "Prayer & Worship" },
  { value: "daily_life", label: "Daily Christian Life" },
  { value: "bible_study", label: "Bible Study & Scripture" },
  { value: "relationships", label: "Relationships & Family" },
  { value: "faith_journey", label: "Faith Journey & Testimony" },
  { value: "church_life", label: "Church & Community" },
  { value: "other", label: "Other Questions" }];


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await Question.create({
        ...formData,
        is_anonymous: true,
        view_count: 0,
        answer_count: 0
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting question:", error);
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardContent>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Question Submitted Successfully!
              </h2>
              <p className="text-green-700 mb-8 max-w-md mx-auto">
                Your question has been posted anonymously and will be visible to the community. 
                You should receive thoughtful responses soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate(createPageUrl("Questions"))}
                  className="bg-green-600 hover:bg-green-700 text-white">

                  View All Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ title: "", content: "", category: "other" });
                  }}
                  className="border-green-600 text-green-600 hover:bg-green-50">

                  Ask Another Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>);

  }

  return (
    <div className="bg-[#FAFAFA] py-8 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Questions"))}
            className="mb-6 border-blue-200 text-blue-600 hover:bg-blue-50">

            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>

          <div className="text-center mb-8">
            <h1 className="bg-clip-text text-[#4058c4] mb-4 font-bold md:text-4xl from-blue-600 to-indigo-600">Ask Your Question

            </h1>
            <p className="text-lg text-slate-600">
              Share your question anonymously with our caring community
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Complete Privacy:</strong> Your question will be posted anonymously. 
                No personal information is collected or stored.
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Your Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category" className="text-slate-700 font-medium">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger className="mt-2 border-slate-200 focus:border-blue-400 bg-white/70">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) =>
                    <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Question Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="What would you like to ask about?"
                  className="mt-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70"
                  required />

              </div>

              <div>
                <Label htmlFor="content" className="text-slate-700 font-medium">
                  Question Details
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Please provide more details about your question. The more context you give, the better answers you'll receive."
                  rows={8}
                  className="mt-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400 resize-none bg-white/70"
                  required />

              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">

                  {isSubmitting ?
                  <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting Question...
                    </> :

                  <>
                      <Heart className="w-4 h-4 mr-2" />
                      Post Question Anonymously
                    </>
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Encouragement */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="py-6 text-center">
            <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-purple-800 font-medium">
              "Cast all your anxiety on Him because He cares for you." - 1 Peter 5:7
            </p>
            <p className="text-purple-700 text-sm mt-2">
              Our community is here to support you with wisdom and encouragement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>);

}