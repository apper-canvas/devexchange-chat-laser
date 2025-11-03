import tagsData from "@/services/mockData/tags.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TagService {
  constructor() {
    this.tags = [...tagsData];
  }

  async getAll() {
    await delay(250);
    return [...this.tags];
  }

  async getById(id) {
    await delay(200);
    const tag = this.tags.find(t => t.Id === id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return { ...tag };
  }

  async getPopular(limit = 20) {
    await delay(200);
    return [...this.tags]
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, limit);
  }

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return this.tags
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTerm) ||
        tag.description.toLowerCase().includes(searchTerm)
      )
      .map(tag => ({ ...tag }));
  }

  async create(tagData) {
    await delay(300);
    const maxId = Math.max(...this.tags.map(t => t.Id), 0);
    const newTag = {
      ...tagData,
      Id: maxId + 1,
      questionCount: 0,
      followers: 0,
      createdAt: new Date().toISOString(),
    };
    
    this.tags.push(newTag);
    return { ...newTag };
  }

  async update(id, updateData) {
    await delay(250);
    const index = this.tags.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Tag not found");
    }
    
    this.tags[index] = {
      ...this.tags[index],
      ...updateData,
    };
    
    return { ...this.tags[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.tags.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Tag not found");
    }
    
    const deleted = this.tags.splice(index, 1)[0];
    return { ...deleted };
  }

  async follow(tagId, userId) {
    await delay(150);
    const tag = this.tags.find(t => t.Id === tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }
    
    tag.followers += 1;
    return { ...tag };
  }

  async unfollow(tagId, userId) {
    await delay(150);
    const tag = this.tags.find(t => t.Id === tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }
    
    tag.followers = Math.max(0, tag.followers - 1);
    return { ...tag };
  }
}

export default new TagService();