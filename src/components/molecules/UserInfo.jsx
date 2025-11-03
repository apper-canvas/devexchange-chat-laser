import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const UserInfo = ({ 
  authorName, 
  authorReputation, 
  createdAt, 
  updatedAt,
  showAvatar = true,
  size = "default" 
}) => {
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  const isUpdated = updatedAt && isValidDate(updatedAt) && isValidDate(createdAt) && 
                   new Date(updatedAt) > new Date(createdAt);
  const displayDate = isUpdated ? updatedAt : createdAt;
  const dateLabel = isUpdated ? "edited" : "asked";
  const avatarSize = size === "small" ? "w-8 h-8" : "w-10 h-10";
  const textSize = size === "small" ? "text-xs" : "text-sm";

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {showAvatar && (
        <div className={`${avatarSize} bg-gradient-to-br from-primary/20 to-accent/30 rounded-full flex items-center justify-center`}>
          <ApperIcon name="User" size={size === "small" ? 16 : 20} className="text-primary" />
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-info hover:underline cursor-pointer ${textSize}`}>
            {authorName}
          </span>
          <span className={`reputation-badge ${size === "small" ? 'text-xs px-2 py-0.5' : ''}`}>
            {authorReputation?.toLocaleString() || '1'}
          </span>
        </div>
        
        <span className={`text-gray-500 ${textSize}`}>
          {dateLabel} {formatDistanceToNow(new Date(displayDate), { addSuffix: true })}
{displayDate && isValidDate(displayDate) ? 
            formatDistanceToNow(new Date(displayDate), { addSuffix: true }) : 
            'Date unavailable'
          }
        </span>
      </div>
    </motion.div>
  );
};

export default UserInfo;