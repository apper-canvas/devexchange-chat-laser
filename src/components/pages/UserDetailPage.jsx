import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import UserInfo from '@/components/molecules/UserInfo';
import userService from '@/services/api/userService';
import { toast } from 'react-toastify';

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getById(parseInt(id));
      if (!userData) {
        setError('User not found');
        return;
      }
      setUser(userData);
    } catch (err) {
      setError('Failed to load user details');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/users')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Users
            </Button>
          </div>
          <Error message={error} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/users')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Users
            </Button>
          </div>
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/users')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Users
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* User Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.displayName}'s avatar`}
                    className="w-24 h-24 rounded-full border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 mb-3">@{user.username}</p>
                
                {/* Reputation */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Award" size={18} className="text-primary" />
                    <span className="font-semibold text-lg text-gray-900">
                      {user.reputation.toLocaleString()}
                    </span>
                    <span className="text-gray-600">reputation</span>
                  </div>
                </div>

                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <ApperIcon name="Medal" size={12} className="mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Join Date */}
                <p className="text-sm text-gray-500">
                  <ApperIcon name="Calendar" size={14} className="inline mr-1" />
                  Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {user.questionsAsked || 0}
              </div>
              <div className="text-sm text-gray-600">Questions Asked</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">
                {user.answersProvided || 0}
              </div>
              <div className="text-sm text-gray-600">Answers Provided</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-info mb-2">
                {user.acceptedAnswers || 0}
              </div>
              <div className="text-sm text-gray-600">Accepted Answers</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-warning mb-2">
                {user.badges?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </Card>
          </div>

          {/* About Section */}
          {user.bio && (
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="User" size={20} />
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Mail" size={20} />
              Contact
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <ApperIcon name="Mail" size={16} className="text-gray-500" />
                <span>{user.email}</span>
              </div>
              {user.website && (
                <div className="flex items-center gap-3 text-gray-700">
                  <ApperIcon name="Globe" size={16} className="text-gray-500" />
                  <a 
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <ApperIcon name="MapPin" size={16} className="text-gray-500" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default UserDetailPage;