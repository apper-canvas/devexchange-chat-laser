import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import UserInfo from "@/components/molecules/UserInfo";
import CommentForm from "@/components/molecules/CommentForm";

const CommentItem = ({ 
  comment, 
  onEdit, 
  onDelete, 
  currentUserId = 1,
  isLoading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const canEdit = comment.authorId === currentUserId;
  const canDelete = comment.authorId === currentUserId;

  const handleEdit = async (newBody) => {
    setEditLoading(true);
    try {
      await onEdit(comment.Id, newBody);
      setIsEditing(false);
    } catch (error) {
      // Error handling done in parent component
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment.Id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { 
    addSuffix: true 
  });

  if (isEditing) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <UserInfo
            name={comment.authorName}
            reputation={comment.authorReputation}
            timestamp={timeAgo}
            size="sm"
          />
        </div>
        
        <CommentForm
          initialValue={comment.body}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
          isLoading={editLoading}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <UserInfo
              name={comment.authorName}
              reputation={comment.authorReputation}
              timestamp={timeAgo}
              size="sm"
            />
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed break-words">
            {comment.body}
          </div>
          
          {comment.updatedAt !== comment.createdAt && (
            <div className="text-xs text-gray-400 mt-1">
              edited {formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}
            </div>
          )}
        </div>
        
        {(canEdit || canDelete) && !isLoading && (
          <div className="flex gap-1 flex-shrink-0">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                title="Edit comment"
              >
                <ApperIcon name="Edit2" size={12} />
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                title="Delete comment"
              >
                <ApperIcon name="Trash2" size={12} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;