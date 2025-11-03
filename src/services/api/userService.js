import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getByUsername(username) {
    await delay(250);
    const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const maxId = Math.max(...this.users.map(u => parseInt(u.Id.replace('user', '') || '0')), 0);
    const newUser = {
      ...userData,
      Id: `user${maxId + 1}`,
      reputation: 1,
      badges: [{ name: "Student", type: "bronze" }],
      joinedAt: new Date().toISOString(),
      questionIds: [],
      answerIds: [],
    };
    
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updateData,
    };
    
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    
    const deleted = this.users.splice(index, 1)[0];
    return { ...deleted };
  }

  async updateReputation(id, points) {
    await delay(150);
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.reputation += points;
    user.reputation = Math.max(0, user.reputation); // Don't go below 0
    
    // Award badges based on reputation milestones
    this.checkAndAwardBadges(user);
    
    return { ...user };
  }

  checkAndAwardBadges(user) {
    const badges = user.badges || [];
    const reputation = user.reputation;
    
    // Bronze badges
    if (reputation >= 100 && !badges.some(b => b.name === "Supporter")) {
      badges.push({ name: "Supporter", type: "bronze" });
    }
    
    if (reputation >= 500 && !badges.some(b => b.name === "Teacher")) {
      badges.push({ name: "Teacher", type: "bronze" });
    }
    
    // Silver badges
    if (reputation >= 1000 && !badges.some(b => b.name === "Scholar")) {
      badges.push({ name: "Scholar", type: "silver" });
    }
    
    if (reputation >= 2000 && !badges.some(b => b.name === "Enlightened")) {
      badges.push({ name: "Enlightened", type: "silver" });
    }
    
    // Gold badges
    if (reputation >= 5000 && !badges.some(b => b.name === "Guru")) {
      badges.push({ name: "Guru", type: "gold" });
    }
    
    user.badges = badges;
  }

  async login(email, password) {
    await delay(500);
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // In a real app, you'd verify the password hash
    return { ...user };
  }

  async register(userData) {
    await delay(600);
    
    // Check if username or email already exists
    const existingUser = this.users.find(u => 
      u.username.toLowerCase() === userData.username.toLowerCase() ||
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error("Username or email already exists");
    }
    
    return await this.create(userData);
  }
}

export default new UserService();