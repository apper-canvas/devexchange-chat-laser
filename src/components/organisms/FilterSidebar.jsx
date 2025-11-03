import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import tagService from "@/services/api/tagService";
import questionService from "@/services/api/questionService";

const FilterSidebar = ({ 
  onSortChange, 
  onTagFilter, 
  activeTags = [],
  currentSort = "newest" 
}) => {
  const [popularTags, setPopularTags] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: "newest", label: "Newest", icon: "Clock" },
    { value: "votes", label: "Most Votes", icon: "TrendingUp" },
    { value: "activity", label: "Activity", icon: "Activity" },
  ];

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setLoading(true);
        
        // Load popular tags
        const tags = await tagService.getPopular();
        setPopularTags(tags);
        
        // Load recent questions for "Related" section
        const questions = await questionService.getAll();
        const recentQuestions = questions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRelatedQuestions(recentQuestions);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  const handleTagClick = (tagName) => {
    onTagFilter?.(tagName);
  };

  const handleSortClick = (sortValue) => {
    onSortChange?.(sortValue);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loaders */}
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Filter" size={18} />
            Sort By
          </h3>
          
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortClick(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentSort === option.value
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <ApperIcon name={option.icon} size={16} />
                {option.label}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Active Filters */}
      {activeTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ApperIcon name="CheckSquare" size={18} />
              Active Filters
            </h3>
            
            <div className="space-y-2">
              {activeTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between">
                  <Badge variant="primary" className="text-sm">
                    {tag}
                  </Badge>
                  <button
                    onClick={() => handleTagClick(tag)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <ApperIcon name="X" size={14} />
                  </button>
                </div>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagFilter?.(null)}
                className="w-full mt-2"
              >
                Clear All
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Tag" size={18} />
            Popular Tags
          </h3>
          
          <div className="space-y-3">
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.name)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <div>
                  <Badge variant="default" className="text-sm">
                    {tag.name}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {tag.questionCount} questions
                  </p>
                </div>
                <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Questions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Clock" size={18} />
            Recent Questions
          </h3>
          
          <div className="space-y-3">
            {relatedQuestions.map((question) => (
              <a
                key={question.Id}
                href={`/questions/${question.Id}`}
                className="block text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {question.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{question.votes} votes</span>
                  <span>•</span>
                  <span>{question.answerCount} answers</span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Help Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="HelpCircle" size={24} className="text-primary" />
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2">
              Need Help?
            </h4>
            
            <p className="text-sm text-gray-600 mb-3">
              Check out our guide on how to ask great questions
            </p>
            
            <Button variant="primary" size="sm" className="w-full">
              Learn More
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FilterSidebar;