import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import tagService from "@/services/api/tagService";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 36;

  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allTags = await tagService.getAll();
      setTags(allTags);
      setFilteredTags(allTags);
    } catch (err) {
      setError("Failed to load tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  // Filter and sort tags
  useEffect(() => {
    let filtered = [...tags];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(query) ||
        tag.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.questionCount - a.questionCount);
        break;
    }
    
    setFilteredTags(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [tags, searchQuery, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "name", label: "Name" },
    { value: "newest", label: "Newest" },
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTags} />;

  // Pagination
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const startIndex = (currentPage - 1) * tagsPerPage;
  const paginatedTags = filteredTags.slice(startIndex, startIndex + tagsPerPage);

  if (!tags.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            title="No tags found"
            message="Tags will appear here as questions are posted"
            actionText="Ask First Question"
            onAction={() => window.location.href = "/ask"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Tags
          </h1>
          <p className="text-gray-600 mb-6">
            A tag is a keyword or label that categorizes your question with other, similar questions. 
            Using the right tags makes it easier for others to find and answer your question.
          </p>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search tags..."
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    sortBy === option.value
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          </div>
        </motion.div>

        {/* Tags Grid */}
        {paginatedTags.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {paginatedTags.map((tag, index) => (
                <motion.div
                  key={tag.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                >
                  <Link to={`/?tag=${encodeURIComponent(tag.name)}`}>
                    <Card hover className="p-6 h-full">
                      <div className="flex flex-col h-full">
                        <Badge 
                          variant="primary" 
                          className="self-start mb-3 text-base px-4 py-2"
                        >
                          {tag.name}
                        </Badge>

                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                          {tag.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="MessageSquare" size={12} />
                              <span>{tag.questionCount} questions</span>
                            </div>
                            {tag.followers > 0 && (
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Users" size={12} />
                                <span>{tag.followers} followers</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-2"
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
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
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
                  
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === totalPages
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
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
          </>
        ) : (
          <Empty
            title={searchQuery ? "No tags match your search" : "No tags found"}
            message={searchQuery ? "Try adjusting your search terms" : "Tags will appear here as questions are posted"}
            actionText="Browse Questions"
            onAction={() => window.location.href = "/"}
          />
        )}
      </div>
    </div>
  );
};

export default TagsPage;