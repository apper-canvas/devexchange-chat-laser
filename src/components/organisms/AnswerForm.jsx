import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import answerService from "@/services/api/answerService";
import { toast } from "react-toastify";

const AnswerForm = ({ questionId, onSubmit, onCancel }) => {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!body.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    // Check if user is authenticated
    const isAuthenticated = false; // This would come from auth context
    if (!isAuthenticated) {
      toast.error("Please log in to post an answer");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const answerData = {
        questionId,
        body: body.trim(),
        authorId: "current-user-id", // This would come from auth context
        authorName: "Current User", // This would come from auth context
        authorReputation: 1,
        votes: 0,
        isAccepted: false,
      };

      await answerService.create(answerData);
      setBody("");
      onSubmit?.();
    } catch (error) {
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertCodeBlock = () => {
    const codeTemplate = "\n```javascript\n// Your code here\n\n```\n";
    setBody(prev => prev + codeTemplate);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Your Answer
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
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
            </div>

            <div className="flex items-center gap-2">
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

          {/* Editor/Preview */}
          <div className="min-h-[200px]">
            {showPreview ? (
              <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
                {body ? (
                  <div className="prose max-w-none">
                    {renderPreview(body)}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Nothing to preview</p>
                )}
              </div>
            ) : (
              <TextArea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter your answer here. Use ```language to format code blocks."
                rows={10}
                className="resize-y"
              />
            )}
          </div>

          {/* Help Text */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <ApperIcon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Formatting Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Use ``` to create code blocks</li>
                  <li>• Specify language: ```javascript, ```python, etc.</li>
                  <li>• Be specific and provide examples</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !body.trim()}
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
                  Post Your Answer
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default AnswerForm;