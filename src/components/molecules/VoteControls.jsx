import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const VoteControls = ({ 
  votes = 0, 
  userVote = 0, 
  onVote, 
  showAccept = false, 
  isAccepted = false, 
  onAccept,
  vertical = true 
}) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [currentUserVote, setCurrentUserVote] = useState(userVote);

  const handleVote = async (value) => {
    // Check if user is authenticated
    const isAuthenticated = false; // This would come from auth context
    if (!isAuthenticated) {
      toast.error("Please log in to vote");
      return;
    }

    const oldVote = currentUserVote;
    const newVote = currentUserVote === value ? 0 : value;
    const voteDiff = newVote - oldVote;
    
    // Optimistic update
    setCurrentUserVote(newVote);
    setCurrentVotes(prev => prev + voteDiff);
    
    try {
      await onVote?.(newVote);
      toast.success(newVote === 1 ? "Upvoted!" : newVote === -1 ? "Downvoted!" : "Vote removed");
    } catch (error) {
      // Revert on error
      setCurrentUserVote(oldVote);
      setCurrentVotes(prev => prev - voteDiff);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleAccept = async () => {
    const isAuthenticated = false; // This would come from auth context
    if (!isAuthenticated) {
      toast.error("Please log in to accept answers");
      return;
    }

    try {
      await onAccept?.();
      toast.success(isAccepted ? "Answer unaccepted" : "Answer accepted!");
    } catch (error) {
      toast.error("Failed to accept answer. Please try again.");
    }
  };

  const containerClass = vertical 
    ? "flex flex-col items-center gap-2" 
    : "flex items-center gap-4";

  const voteButtonClass = vertical 
    ? "vote-button" 
    : "vote-button w-8 h-8";

  return (
    <div className={containerClass}>
      {/* Upvote Button */}
      <motion.button
        onClick={() => handleVote(1)}
        className={`${voteButtonClass} ${currentUserVote === 1 ? 'active' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ApperIcon name="ChevronUp" size={vertical ? 20 : 16} />
      </motion.button>

      {/* Vote Count */}
      <motion.span
        key={currentVotes}
        className={`font-bold ${vertical ? 'text-lg' : 'text-base'} ${
          currentVotes > 0 ? 'text-success' : currentVotes < 0 ? 'text-error' : 'text-gray-600'
        }`}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {currentVotes}
      </motion.span>

      {/* Downvote Button */}
      <motion.button
        onClick={() => handleVote(-1)}
        className={`${voteButtonClass} ${currentUserVote === -1 ? 'active' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ApperIcon name="ChevronDown" size={vertical ? 20 : 16} />
      </motion.button>

      {/* Accept Answer Button (only for question authors) */}
      {showAccept && (
        <motion.button
          onClick={handleAccept}
          className={`vote-button mt-2 ${isAccepted ? 'active bg-success border-success' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon name="Check" size={vertical ? 20 : 16} />
        </motion.button>
      )}
    </div>
  );
};

export default VoteControls;