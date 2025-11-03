import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import UserInfo from "@/components/molecules/UserInfo";
import VoteControls from "@/components/molecules/VoteControls";
import CodeBlock from "@/components/molecules/CodeBlock";
import CommentSection from "@/components/organisms/CommentSection";
const AnswerList = ({ 
  answers = [], 
  questionAuthorId, 
  acceptedAnswerId, 
  onAnswerUpdate 
}) => {
  const handleVote = async (answerId, voteValue) => {
    // This would integrate with vote service
    console.log("Vote answer:", answerId, voteValue);
  };

  const handleAcceptAnswer = async (answerId) => {
    // This would integrate with question service to accept answer
    console.log("Accept answer:", answerId);
    onAnswerUpdate?.();
  };

  const renderAnswerBody = (body) => {
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

  // Sort answers: accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  if (!answers.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="MessageSquare" size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No answers yet
        </h3>
        <p className="text-gray-500">
          Be the first to answer this question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAnswers.map((answer, index) => (
        <motion.div
          key={answer.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Card className={`answer-card ${answer.isAccepted ? 'accepted' : ''}`}>
            <div className="flex gap-6">
              {/* Vote Controls */}
              <div className="flex-shrink-0">
                <VoteControls
                  votes={answer.votes}
                  onVote={(voteValue) => handleVote(answer.Id, voteValue)}
                  showAccept={questionAuthorId === "current-user-id"} // This would come from auth context
                  isAccepted={answer.isAccepted}
                  onAccept={() => handleAcceptAnswer(answer.Id)}
                  vertical={true}
                />
              </div>

              {/* Answer Content */}
              <div className="flex-1 min-w-0">
                {/* Accepted Badge */}
                {answer.isAccepted && (
                  <div className="flex items-center gap-2 mb-4 text-success">
                    <ApperIcon name="CheckCircle" size={20} />
                    <span className="font-medium">Accepted Answer</span>
                  </div>
                )}

                {/* Answer Body */}
                <div className="prose max-w-none mb-6 text-gray-800">
                  {renderAnswerBody(answer.body)}
                </div>

                {/* Answer Footer */}
                <div className="flex items-center justify-end">
                  <UserInfo
                    authorName={answer.authorName}
                    authorReputation={answer.authorReputation}
                    createdAt={answer.createdAt}
                    updatedAt={answer.updatedAt}
                  />
                </div>
</div>
              
              {/* Comment Section for Answer */}
              <CommentSection
                parentId={answer.Id}
                parentType="answer"
                currentUserId={1}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AnswerList;