import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Question Card Skeleton */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Title Skeleton */}
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-3 animate-pulse"></div>
          
          {/* Content Lines Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          
          {/* Tags Skeleton */}
          <div className="flex gap-2 mb-4">
            {[...Array(3)].map((_, tagIndex) => (
              <div
                key={tagIndex}
                className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          
          {/* Stats Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-14 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;