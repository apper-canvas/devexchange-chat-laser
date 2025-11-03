import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import AuthModal from "@/components/organisms/AuthModal";

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
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

  const navItems = [
    { to: "/", label: "Questions", icon: "Home" },
    { to: "/tags", label: "Tags", icon: "Tag" },
    { to: "/users", label: "Users", icon: "Users" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Code" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-gray-600 bg-clip-text text-transparent">
                DevExchange
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.to)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Ask Question Button */}
              <Button
                onClick={handleAskQuestion}
                size="default"
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" size={16} />
                Ask Question
              </Button>

              {/* Mobile Ask Question Button */}
              <motion.button
                onClick={handleAskQuestion}
                className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon name="Plus" size={24} />
              </motion.button>

              {/* Login Button */}
              <Button
                variant="secondary"
                size="default"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex"
              >
                Log in
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 bg-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive(item.to)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    {item.label}
                  </Link>
                ))}
                
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full mt-4"
                >
                  Log in
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;