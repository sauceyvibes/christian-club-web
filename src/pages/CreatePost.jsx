import React, { useState } from "react";
import { ForumPost } from "../entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/all";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Heart, 
  MessageCircle,
  Globe,
  CheckCircle,
  Plus
} from "lucide-react";

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

  const getSelectedLabel = () => {
    const selected = categories.find(cat => cat.value === formData.category);
    return selected ? selected.label : "Select a category";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      await ForumPost.create({
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
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Discussion Posted Successfully!
              </h2>
              <p className="text-green-700 mb-8">
                Your discussion has been created and is now visible to the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate(createPageUrl("Forums"))}>
                  View All Discussions
                </Button>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Forums"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forums
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Start New Discussion
          </h1>
          <p className="text-lg text-slate-600">
            Share your thoughts with the community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="author_name">Your Name (Optional)</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Leave blank to post anonymously"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue>
                      {getSelectedLabel()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Discussion Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What would you like to discuss?"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Discussion Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts..."
                  rows={10}
                  className="mt-2"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Discussion"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}