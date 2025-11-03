import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuestionList from "@/components/organisms/QuestionList";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import AuthModal from "@/components/organisms/AuthModal";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const tag = params.get("tag");
    const sort = params.get("sort");

    if (search) setSearchQuery(search);
    if (tag) {
      setTagFilter(tag);
      setActiveTags([tag]);
    }
    if (sort) setSortBy(sort);
  }, [location.search]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateURL({ sort: newSort });
  };

  const handleTagFilter = (tag) => {
    if (tag === null) {
      // Clear all filters
      setTagFilter("");
      setActiveTags([]);
      updateURL({ tag: null });
    } else if (activeTags.includes(tag)) {
      // Remove tag
      const newTags = activeTags.filter(t => t !== tag);
      setActiveTags(newTags);
      setTagFilter(newTags[0] || "");
      updateURL({ tag: newTags[0] || null });
    } else {
      // Add tag
      setTagFilter(tag);
      setActiveTags([tag]);
      updateURL({ tag });
    }
  };

  const updateURL = (params) => {
    const searchParams = new URLSearchParams(location.search);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    const newSearch = searchParams.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, { replace: true });
  };

  const handleAskQuestion = () => {
    // Check if user is authenticated
    const isAuthenticated = false; // This would come from auth context
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate("/ask");
  };

  const totalQuestions = 1247; // This would come from API
  const activeFiltersCount = activeTags.length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-secondary mb-2">
                    {searchQuery ? `Search Results` : tagFilter ? `Questions tagged [${tagFilter}]` : "All Questions"}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{totalQuestions.toLocaleString()} questions</span>
                    {activeFiltersCount > 0 && (
                      <span className="text-primary">
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAskQuestion}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Plus" size={18} />
                  Ask Question
                </Button>
              </div>

              {/* Search Query Display */}
              {searchQuery && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <ApperIcon name="Search" size={16} />
                    <span className="font-medium">
                      Searching for: "{searchQuery}"
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        updateURL({ search: null });
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Sort Tabs */}
              <div className="flex items-center gap-1 mt-4">
                {["newest", "votes", "activity"].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 capitalize ${
                      sortBy === sort
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    {sort === "newest" && <ApperIcon name="Clock" size={16} className="inline mr-2" />}
                    {sort === "votes" && <ApperIcon name="TrendingUp" size={16} className="inline mr-2" />}
                    {sort === "activity" && <ApperIcon name="Activity" size={16} className="inline mr-2" />}
                    {sort}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Questions List */}
            <QuestionList
              searchQuery={searchQuery}
              tagFilter={tagFilter}
              sortBy={sortBy}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                currentSort={sortBy}
                activeTags={activeTags}
                onSortChange={handleSortChange}
                onTagFilter={handleTagFilter}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;