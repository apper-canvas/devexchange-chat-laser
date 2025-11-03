import commentsData from '../mockData/comments.json';

let comments = [...commentsData];
let nextId = Math.max(...comments.map(c => c.Id)) + 1;

const commentService = {
  // Get all comments for a specific parent (question or answer)
  getByParent: async (parentId, parentType) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return comments
      .filter(comment => comment.parentId === parentId && comment.parentType === parentType)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  // Get all comments
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...comments];
  },

  // Get comment by ID
  getById: async (id) => {
    if (!Number.isInteger(id)) {
      throw new Error('Comment ID must be an integer');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    const comment = comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    return { ...comment };
  },

  // Create new comment
  create: async (commentData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newComment = {
      Id: nextId++,
      parentId: commentData.parentId,
      parentType: commentData.parentType,
      authorId: commentData.authorId || 1,
      authorName: commentData.authorName || 'Anonymous User',
      authorReputation: commentData.authorReputation || 0,
      body: commentData.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    comments.push(newComment);
    return { ...newComment };
  },

  // Update comment
  update: async (id, updateData) => {
    if (!Number.isInteger(id)) {
      throw new Error('Comment ID must be an integer');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Comment with ID ${id} not found`);
    }

    const updatedComment = {
      ...comments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    comments[index] = updatedComment;
    return { ...updatedComment };
  },

  // Delete comment
  delete: async (id) => {
    if (!Number.isInteger(id)) {
      throw new Error('Comment ID must be an integer');
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Comment with ID ${id} not found`);
    }

    const deletedComment = comments[index];
    comments.splice(index, 1);
    return { ...deletedComment };
  },

  // Count comments for a parent
  countByParent: async (parentId, parentType) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return comments.filter(comment => 
      comment.parentId === parentId && comment.parentType === parentType
    ).length;
  }
};

export default commentService;