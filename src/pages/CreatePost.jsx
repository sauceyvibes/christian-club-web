import React, { useState } from "react";
import { ForumPost } from "../entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/all";
import { Button } from "../components/ui/all";
import { Input } from "../components/ui/all";
import { Textarea } from "../components/ui/all";
import { Label } from "../components/ui/all";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/all";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Heart, 
  MessageSquare,
  Globe,
  CheckCircle,
  Plus
} from "lucide-react";

const categoryIcons = {
  general_discussion: Users,
  bible_study: BookOpen,
  prayer_requests: Heart,
  testimonies: MessageSquare,
  youth: Users,
  family: Heart,
  missions: Globe,
  other: MessageSquare
};

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general_discussion",
    author_name: ""
  });

  const forumPostEntity = new ForumPost();

  const categories = [
    { value: "general_discussion", label: "General Discussion" },
    { value: "bible_study", label: "Bible Study" },
    { value: "prayer_requests", label: "Prayer Requests" },
    { value: "testimonies", label: "Testimonies" },
    { value: "youth", label: "Youth" },
    { value: "family", label: "Family" },
    { value: "missions", label: "Missions" },
    { value: "other", label: "Other" }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
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
      const post = await forumPostEntity.create({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        author_name: formData.author_name.trim() || null,
        is_pinned: false,
        reply_count: 0,
        view_count: 0
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating post:", error);
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
                Discussion Posted Successfully!
              </h2>
              <p className="text-green-700 mb-8 max-w-md mx-auto">
                Your discussion has been created and is now visible to the community. 
                Others can now join the conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate(createPageUrl("Forums"))}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  View All Discussions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ 
                      title: "", 
                      content: "", 
                      category: "general_discussion", 
                      author_name: "" 
                    });
                  }}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Start Another Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[formData.category] || MessageSquare;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Forums"))}
            className="mb-6 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forums
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Start New Discussion
            </h1>
            <p className="text-lg text-slate-600">
              Share your thoughts and connect with the community
            </p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <CategoryIcon className="w-5 h-5 text-purple-600" />
              Your Discussion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="author_name" className="text-slate-700 font-medium">
                  Your Name (Optional)
                </Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => handleChange("author_name", e.target.value)}
                  placeholder="Leave blank to post anonymously"
                  className="mt-2 border-slate-200 focus:border-purple-400 bg-white/70"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-slate-700 font-medium">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger className="mt-2 border-slate-200 focus:border-purple-400 bg-white/70">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const Icon = categoryIcons[category.value];
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Discussion Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="mt-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-white/70"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-slate-700 font-medium">
                  Discussion Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Share your thoughts, ask for advice, or start a meaningful conversation..."
                  rows={10}
                  className="mt-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400 resize-none bg-white/70"
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Discussion...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Discussion
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Community Guidelines
            </h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Be respectful and kind to all community members</li>
              <li>• Share thoughtfully and constructively</li>
              <li>• Keep discussions relevant to faith and Christian living</li>
              <li>• Support and encourage one another</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}