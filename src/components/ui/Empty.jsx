import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No questions found", 
  message = "Be the first to ask a question!", 
  actionText = "Ask Question",
  onAction 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="MessageCircle" size={40} className="text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-secondary mb-3 bg-gradient-to-r from-secondary to-gray-600 bg-clip-text text-transparent">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {onAction && (
          <motion.button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" size={18} />
            {actionText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;