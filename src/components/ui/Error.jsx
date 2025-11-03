import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg border border-error/20 p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-xl font-semibold text-secondary mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message || "We encountered an error while loading the content. Please try again."}
        </p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;