import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";

const TagList = ({ tags = [], onTagClick, variant = "default", limit }) => {
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remainingCount = limit && tags.length > limit ? tags.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag, index) => (
        <motion.div
          key={typeof tag === "string" ? tag : tag.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Badge
            variant={variant}
            className={onTagClick ? "cursor-pointer hover:scale-105 transition-transform duration-150" : ""}
            onClick={() => onTagClick?.(typeof tag === "string" ? tag : tag.name)}
          >
            {typeof tag === "string" ? tag : tag.name}
          </Badge>
        </motion.div>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="default" className="bg-gray-200 text-gray-600">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};

export default TagList;