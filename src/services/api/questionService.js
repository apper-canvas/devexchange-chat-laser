import questionsData from "@/services/mockData/questions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuestionService {
  constructor() {
    this.questions = [...questionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.questions];
  }

  async getById(id) {
    await delay(200);
    const question = this.questions.find(q => q.Id === id);
    if (!question) {
      throw new Error("Question not found");
    }
    return { ...question };
  }

  async create(questionData) {
    await delay(400);
    const maxId = Math.max(...this.questions.map(q => q.Id), 0);
    const newQuestion = {
      ...questionData,
      Id: maxId + 1,
      votes: 0,
      answerCount: 0,
      views: 1,
      acceptedAnswerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.questions.unshift(newQuestion);
    return { ...newQuestion };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.questions.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Question not found");
    }
    
    this.questions[index] = {
      ...this.questions[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.questions[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.questions.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Question not found");
    }
    
    const deleted = this.questions.splice(index, 1)[0];
    return { ...deleted };
  }

  async incrementViews(id) {
    await delay(100);
    const question = this.questions.find(q => q.Id === id);
    if (question) {
      question.views += 1;
      question.updatedAt = new Date().toISOString();
    }
  }

  async vote(id, userId, voteValue) {
    await delay(200);
    const question = this.questions.find(q => q.Id === id);
    if (!question) {
      throw new Error("Question not found");
    }
    
    // In a real app, you'd store votes separately and aggregate them
    question.votes += voteValue;
    question.updatedAt = new Date().toISOString();
    return { ...question };
  }

  async acceptAnswer(questionId, answerId) {
    await delay(200);
    const question = this.questions.find(q => q.Id === questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    
question.acceptedAnswerId = answerId;
    question.updatedAt = new Date().toISOString();
    return { ...question };
  }

  // Get comments for a question
  async getComments(questionId) {
    const commentService = await import('./commentService.js');
    return commentService.default.getByParent(questionId, 'question');
  }

  // Add comment to a question
  async addComment(questionId, commentData) {
    const commentService = await import('./commentService.js');
    return commentService.default.create({
      ...commentData,
      parentId: questionId,
      parentType: 'question'
    });
  }
}

export default new QuestionService();