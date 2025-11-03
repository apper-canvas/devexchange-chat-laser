import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import TagList from "@/components/molecules/TagList";
import UserInfo from "@/components/molecules/UserInfo";

const QuestionCard = ({ question, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card hover className="question-card">
        {/* Question Stats */}
        <div className="flex items-start gap-4">
          {/* Votes and Stats */}
          <div className="flex flex-col items-center gap-3 text-sm text-gray-600 min-w-0 flex-shrink-0">
            <div className="flex flex-col items-center">
              <span className={`font-bold text-lg ${question.votes > 0 ? 'text-success' : question.votes < 0 ? 'text-error' : 'text-gray-600'}`}>
                {question.votes}
              </span>
              <span>votes</span>
            </div>
            
            <div className={`flex flex-col items-center ${question.acceptedAnswerId ? 'text-success' : ''}`}>
              <span className={`font-bold text-lg ${question.acceptedAnswerId ? 'text-success' : 'text-gray-600'}`}>
                {question.answerCount}
              </span>
              <span>answers</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-gray-600">
                {question.views}
              </span>
              <span>views</span>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <Link 
              to={`/questions/${question.Id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-secondary group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                {question.title}
              </h3>
            </Link>

            {/* Body Preview */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
              {question.body.replace(/```[\s\S]*?```/g, '[code]').slice(0, 200)}...
            </p>

            {/* Tags */}
            <div className="mb-4">
              <TagList 
                tags={question.tags} 
                limit={5}
                onTagClick={(tag) => {
                  // Navigate to tag filter
                  window.location.href = `/?tag=${encodeURIComponent(tag)}`;
                }}
              />
            </div>

            {/* Author and Time */}
            <div className="flex items-center justify-between">
              <UserInfo
                authorName={question.authorName}
                authorReputation={question.authorReputation}
                createdAt={question.createdAt}
                updatedAt={question.updatedAt}
                size="small"
              />
              
              {question.acceptedAnswerId && (
                <div className="flex items-center gap-1 text-success text-sm">
                  <ApperIcon name="CheckCircle" size={16} />
                  <span>Solved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;