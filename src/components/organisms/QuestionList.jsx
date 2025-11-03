import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import QuestionCard from "@/components/organisms/QuestionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import questionService from "@/services/api/questionService";

const QuestionList = ({ searchQuery, tagFilter, sortBy = "newest" }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const questionsPerPage = 10;

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      
      let allQuestions = await questionService.getAll();
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        allQuestions = allQuestions.filter(q => 
          q.title.toLowerCase().includes(query) || 
          q.body.toLowerCase().includes(query) ||
          q.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply tag filter
      if (tagFilter) {
        allQuestions = allQuestions.filter(q => 
          q.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case "votes":
          allQuestions.sort((a, b) => b.votes - a.votes);
          break;
        case "activity":
          allQuestions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case "newest":
        default:
          allQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      // Calculate pagination
      const totalPages = Math.ceil(allQuestions.length / questionsPerPage);
      const startIndex = (currentPage - 1) * questionsPerPage;
      const paginatedQuestions = allQuestions.slice(startIndex, startIndex + questionsPerPage);
      
      setQuestions(paginatedQuestions);
      setTotalPages(totalPages);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, tagFilter, sortBy]);

  useEffect(() => {
    loadQuestions();
  }, [searchQuery, tagFilter, sortBy, currentPage]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestions} />;
  if (!questions.length) {
    return (
      <Empty
        title={searchQuery || tagFilter ? "No questions found" : "No questions yet"}
        message={
          searchQuery || tagFilter
            ? "Try adjusting your search or filters."
            : "Be the first to ask a question in our community!"
        }
        actionText="Ask the First Question"
        onAction={() => window.location.href = "/ask"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.Id}
            question={question}
            index={index}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-2 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ApperIcon name="ChevronLeft" size={16} />
            Previous
          </Button>

          <div className="flex items-center gap-2 mx-4">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isCurrentPage = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isCurrentPage
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default QuestionList;