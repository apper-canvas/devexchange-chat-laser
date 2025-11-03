import answersData from "@/services/mockData/answers.json";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnswerService {
  constructor() {
    this.answers = [...answersData];
  }

  async getAll() {
    await delay(250);
    return [...this.answers];
  }

  async getById(id) {
    await delay(200);
    const answer = this.answers.find(a => a.Id === id);
    if (!answer) {
      throw new Error("Answer not found");
    }
    return { ...answer };
  }

  async getByQuestionId(questionId) {
    await delay(300);
    return this.answers
      .filter(a => a.questionId === questionId)
      .map(a => ({ ...a }));
  }

  async create(answerData) {
    await delay(400);
    const maxId = Math.max(...this.answers.map(a => a.Id), 0);
    const newAnswer = {
      ...answerData,
      Id: maxId + 1,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.answers.push(newAnswer);
    return { ...newAnswer };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.answers.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Answer not found");
    }
    
    this.answers[index] = {
      ...this.answers[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.answers[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.answers.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Answer not found");
    }
    
    const deleted = this.answers.splice(index, 1)[0];
    return { ...deleted };
  }

  async vote(id, userId, voteValue) {
    await delay(200);
    const answer = this.answers.find(a => a.Id === id);
    if (!answer) {
      throw new Error("Answer not found");
    }
    
    // In a real app, you'd store votes separately and aggregate them
    answer.votes += voteValue;
    answer.updatedAt = new Date().toISOString();
    return { ...answer };
  }

  async accept(id) {
    await delay(200);
    const answer = this.answers.find(a => a.Id === id);
    if (!answer) {
      throw new Error("Answer not found");
    }
    
    // Unaccept other answers for the same question
    this.answers.forEach(a => {
      if (a.questionId === answer.questionId) {
        a.isAccepted = false;
      }
    });
    
    // Accept this answer
    answer.isAccepted = true;
answer.updatedAt = new Date().toISOString();
    return { ...answer };
  }

  // Get comments for an answer
  async getComments(answerId) {
    const commentService = await import('./commentService.js');
    return commentService.default.getByParent(answerId, 'answer');
  }

  // Add comment to an answer
  async addComment(answerId, commentData) {
    const commentService = await import('./commentService.js');
    return commentService.default.create({
      ...commentData,
      parentId: answerId,
      parentType: 'answer'
    });
  }
}

export default new AnswerService();