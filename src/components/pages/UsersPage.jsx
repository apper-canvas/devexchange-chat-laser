import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import userService from "@/services/api/userService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("reputation");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 36;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allUsers = await userService.getAll();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        break;
      case "name":
        filtered.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case "reputation":
      default:
        filtered.sort((a, b) => b.reputation - a.reputation);
        break;
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [users, searchQuery, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortOptions = [
    { value: "reputation", label: "Reputation" },
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name" },
  ];

  const getReputationColor = (reputation) => {
    if (reputation >= 10000) return "text-yellow-600"; // Gold
    if (reputation >= 1000) return "text-gray-600"; // Silver  
    return "text-orange-600"; // Bronze
  };

  const getReputationLevel = (reputation) => {
    if (reputation >= 10000) return "Expert";
    if (reputation >= 1000) return "Experienced";
    return "Member";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  if (!users.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            title="No users found"
            message="Users will appear here as they join the community"
            actionText="Ask a Question"
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
            Users
          </h1>
          <p className="text-gray-600 mb-6">
            Discover our community of developers who help make DevExchange great by asking and answering questions.
          </p>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search users..."
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
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          </div>
        </motion.div>

        {/* Users Grid */}
        {paginatedUsers.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                >
                  <Link to={`/users/${user.Id}`}>
                    <Card hover className="p-6 text-center">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ApperIcon name="User" size={32} className="text-primary" />
                      </div>

                      {/* Username */}
                      <h3 className="font-semibold text-lg text-secondary mb-2 truncate">
                        {user.username}
                      </h3>

                      {/* Reputation */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className={`font-bold text-xl ${getReputationColor(user.reputation)}`}>
                          {user.reputation.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getReputationLevel(user.reputation)}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="text-center">
                          <div className="font-medium text-secondary">
                            {user.questionIds?.length || 0}
                          </div>
                          <div>questions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-secondary">
                            {user.answerIds?.length || 0}
                          </div>
                          <div>answers</div>
                        </div>
                      </div>

                      {/* Badges */}
                      {user.badges && user.badges.length > 0 && (
                        <div className="flex justify-center gap-2">
                          {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                            <div
                              key={badgeIndex}
                              className={`w-3 h-3 rounded-full ${
                                badge.type === 'gold' ? 'bg-yellow-500' :
                                badge.type === 'silver' ? 'bg-gray-400' : 'bg-orange-500'
                              }`}
                              title={badge.name}
                            />
                          ))}
                          {user.badges.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{user.badges.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Join Date */}
                      <p className="text-xs text-gray-500 mt-3">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
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
            title={searchQuery ? "No users match your search" : "No users found"}
            message={searchQuery ? "Try adjusting your search terms" : "Users will appear here as they join the community"}
            actionText="Browse Questions"
            onAction={() => window.location.href = "/"}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;