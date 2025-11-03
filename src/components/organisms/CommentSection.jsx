import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import CommentItem from "@/components/molecules/CommentItem";
import CommentForm from "@/components/molecules/CommentForm";
import commentService from "@/services/api/commentService";
import { toast } from "react-toastify";

const CommentSection = ({ 
  parentId, 
  parentType, 
  currentUserId = 1 
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadComments();
  }, [parentId, parentType]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getByParent(parentId, parentType);
      setComments(data);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (body) => {
    setAddLoading(true);
    try {
      const newComment = await commentService.create({
        parentId,
        parentType,
        authorId: currentUserId,
        authorName: "Current User", // In real app, get from auth context
        authorReputation: 100,
        body
      });
      
      setComments(prev => [...prev, newComment]);
      setShowAddForm(false);
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      throw error;
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditComment = async (commentId, newBody) => {
    setActionLoading(commentId);
    try {
      const updatedComment = await commentService.update(commentId, { 
        body: newBody 
      });
      
      setComments(prev => 
        prev.map(comment => 
          comment.Id === commentId ? updatedComment : comment
        )
      );
      
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setActionLoading(commentId);
    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(comment => comment.Id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="MessageCircle" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Comments</span>
        </div>
        <Loading size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="MessageCircle" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Comments</span>
        </div>
        <Error message={error} onRetry={loadComments} />
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="MessageCircle" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Comments ({comments.length})
          </span>
        </div>
        
        {!showAddForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="text-sm"
          >
            <ApperIcon name="Plus" size={14} className="mr-1" />
            Add Comment
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <CommentForm
            onSubmit={handleAddComment}
            onCancel={() => setShowAddForm(false)}
            isLoading={addLoading}
          />
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="MessageCircle" size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No comments yet</p>
          {!showAddForm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-sm"
            >
              Be the first to comment
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.Id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={currentUserId}
              isLoading={actionLoading === comment.Id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;