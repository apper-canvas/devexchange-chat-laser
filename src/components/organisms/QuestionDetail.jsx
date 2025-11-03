import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import TagList from "@/components/molecules/TagList";
import UserInfo from "@/components/molecules/UserInfo";
import VoteControls from "@/components/molecules/VoteControls";
import CodeBlock from "@/components/molecules/CodeBlock";
import AnswerForm from "@/components/organisms/AnswerForm";
import AnswerList from "@/components/organisms/AnswerList";
import CommentSection from "@/components/organisms/CommentSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import questionService from "@/services/api/questionService";
import answerService from "@/services/api/answerService";
import { toast } from "react-toastify";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError("");
      
      const questionData = await questionService.getById(parseInt(id));
      const answersData = await answerService.getByQuestionId(parseInt(id));
      
      // Increment view count
      await questionService.incrementViews(parseInt(id));
      
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (err) {
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const handleVote = async (voteValue) => {
    // This would integrate with vote service
    console.log("Vote:", voteValue);
  };

  const handleAnswerSubmitted = () => {
    setShowAnswerForm(false);
    loadQuestion(); // Reload to get updated answer count
    toast.success("Answer posted successfully!");
  };

  const renderQuestionBody = (body) => {
    // Simple markdown-like rendering for code blocks
    const parts = body.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract language and code
        const lines = part.slice(3, -3).split("\n");
        const language = lines[0].trim() || "javascript";
        const code = lines.slice(1).join("\n");
        
        return (
          <div key={index} className="my-4">
            <CodeBlock code={code} language={language} />
          </div>
        );
      }
      
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed">
          {part}
        </p>
      );
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestion} />;
  if (!question) return <Error message="Question not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-primary">Questions</Link>
        <ApperIcon name="ChevronRight" size={14} />
        <span className="truncate">{question.title}</span>
      </nav>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex gap-6">
            {/* Vote Controls */}
            <div className="flex-shrink-0">
              <VoteControls
                votes={question.votes}
                onVote={handleVote}
                vertical={true}
              />
            </div>

            {/* Question Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-secondary mb-4">
                {question.title}
              </h1>

              <div className="prose max-w-none mb-6 text-gray-800">
                {renderQuestionBody(question.body)}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <TagList
                  tags={question.tags}
                  onTagClick={(tag) => {
                    window.location.href = `/?tag=${encodeURIComponent(tag)}`;
                  }}
                />
              </div>

              {/* Question Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
<span>Asked {(() => {
                    const date = new Date(question.createdAt);
                    return isNaN(date.getTime()) ? 'Invalid date' : formatDistanceToNow(date, { addSuffix: true });
                  })()}</span>
                  <span>Viewed {question.views} times</span>
{question.updatedAt !== question.createdAt && (
                    <span>Modified {(() => {
                      const date = new Date(question.updatedAt);
                      return isNaN(date.getTime()) ? 'Invalid date' : formatDistanceToNow(date, { addSuffix: true });
                    })()}</span>
                  )}
                </div>

                <UserInfo
                  authorName={question.authorName}
                  authorReputation={question.authorReputation}
                  createdAt={question.createdAt}
                  updatedAt={question.updatedAt}
                />
              </div>
</div>
            
            {/* Comment Section for Question */}
            <CommentSection
              parentId={question.Id}
              parentType="question"
              currentUserId={1}
            />
          </div>
        </Card>
      </motion.div>

      {/* Answers Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary">
          {answers.length} Answer{answers.length !== 1 ? "s" : ""}
        </h2>
        
        <Button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          variant={showAnswerForm ? "secondary" : "primary"}
        >
          {showAnswerForm ? (
            <>
              <ApperIcon name="X" size={16} />
              Cancel
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={16} />
              Your Answer
            </>
          )}
        </Button>
      </div>

      {/* Answer Form */}
      {showAnswerForm && (
        <AnswerForm
          questionId={parseInt(id)}
          onSubmit={handleAnswerSubmitted}
          onCancel={() => setShowAnswerForm(false)}
        />
      )}

      {/* Answers */}
      <AnswerList
        answers={answers}
        questionAuthorId={question.authorId}
        acceptedAnswerId={question.acceptedAnswerId}
        onAnswerUpdate={loadQuestion}
      />
    </div>
  );
};

export default QuestionDetail;