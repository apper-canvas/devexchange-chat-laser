import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Badge from "@/components/atoms/Badge";
import questionService from "@/services/api/questionService";
import { toast } from "react-toastify";

const AskQuestionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const popularTags = [
    "javascript", "python", "java", "react", "node.js", "html", "css",
    "php", "c#", "c++", "sql", "mysql", "mongodb", "express", "vue.js",
    "angular", "typescript", "git", "docker", "api"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const addTag = (tag) => {
    const tagName = tag.trim().toLowerCase();
    if (tagName && !formData.tags.includes(tagName) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(currentTag);
    }
  };

  const insertCodeBlock = () => {
    const codeTemplate = "\n```javascript\n// Your code here\n\n```\n";
    setFormData(prev => ({
      ...prev,
      body: prev.body + codeTemplate
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }
    
    if (!formData.body.trim()) {
      newErrors.body = "Question body is required";
    } else if (formData.body.length < 20) {
      newErrors.body = "Question body must be at least 20 characters";
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    // Check if user is authenticated
    const isAuthenticated = false; // This would come from auth context
    if (!isAuthenticated) {
      toast.error("Please log in to ask a question");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const questionData = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        tags: formData.tags,
        authorId: "current-user-id", // This would come from auth context
        authorName: "Current User", // This would come from auth context
        authorReputation: 1,
        votes: 0,
        answerCount: 0,
        views: 0,
        acceptedAnswerId: null,
      };

      const newQuestion = await questionService.create(questionData);
      toast.success("Question posted successfully!");
      navigate(`/questions/${newQuestion.Id}`);
    } catch (error) {
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = (content) => {
    // Simple markdown-like rendering
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const language = lines[0].trim() || "javascript";
        const code = lines.slice(1).join("\n");
        
        return (
          <div key={index} className="my-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <div className="text-gray-400 text-sm mb-2">{language}</div>
            <pre className="text-sm leading-relaxed">{code}</pre>
          </div>
        );
      }
      
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed mb-4">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary mb-2">
              Ask a Question
            </h1>
            <p className="text-gray-600">
              Get help from our community of developers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., How to center a div in CSS?"
                error={errors.title}
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific and imagine you're asking a question to another person
              </p>
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  What are the details of your problem?
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={insertCodeBlock}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Code" size={16} />
                    Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className={showPreview ? "bg-primary/10 text-primary" : ""}
                  >
                    <ApperIcon name={showPreview ? "Edit" : "Eye"} size={16} />
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
              </div>

              {showPreview ? (
                <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
                  {formData.body ? (
                    <div className="prose max-w-none">
                      {renderPreview(formData.body)}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Nothing to preview</p>
                  )}
                </div>
              ) : (
                <TextArea
                  value={formData.body}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  placeholder="Describe your problem in detail. Include what you tried and what you expected to happen."
                  rows={10}
                  error={errors.body}
                />
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                Include relevant code, error messages, and context
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              
              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} className="flex items-center gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Tag Input */}
              {formData.tags.length < 5 && (
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag (press Enter or comma)"
                  error={errors.tags}
                />
              )}

              {/* Popular Tags */}
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Popular Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 10)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-150"
                        disabled={formData.tags.length >= 5}
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-1">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <ApperIcon name="Lightbulb" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-2">Writing a good question</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Summarize the problem in the title</li>
                    <li>• Describe what you tried and what you expected</li>
                    <li>• Include minimal code that reproduces the issue</li>
                    <li>• Use relevant tags to help others find your question</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} />
                    Post Your Question
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AskQuestionForm;