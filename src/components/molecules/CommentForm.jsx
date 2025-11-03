import { useState } from "react";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import { toast } from "react-toastify";

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  initialValue = "", 
  isEditing = false,
  isLoading = false 
}) => {
  const [comment, setComment] = useState(initialValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long");
      return;
    }

    if (comment.trim().length > 1000) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }

    try {
      await onSubmit(comment.trim());
      if (!isEditing) {
        setComment("");
      }
    } catch (error) {
      toast.error("Failed to save comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isEditing ? "Edit your comment..." : "Add a comment..."}
          rows={3}
          className="w-full text-sm"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {comment.length}/1000 characters
          </span>
          {comment.length < 10 && comment.length > 0 && (
            <span className="text-xs text-error">
              Minimum 10 characters
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading || !comment.trim() || comment.trim().length < 10}
          className="text-sm px-3 py-1 h-8"
        >
          {isLoading ? "Saving..." : isEditing ? "Update" : "Add Comment"}
        </Button>
        
        {(isEditing || onCancel) && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="text-sm px-3 py-1 h-8"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;