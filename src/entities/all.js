
// Simple localStorage-based entities for deployment
class SimpleEntity {
  constructor(name) {
    this.name = name;
  }

  getStorageKey() {
    return `christian_app_${this.name}`;
  }

  async create(data) {
    const items = this.getAll();
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2),
      created_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
    return newItem;
  }

  async list(sortBy, limit) {
    const items = this.getAll();
    // Simple sorting by created_date
    if (sortBy === "-created_date" || sortBy === "-created_at") {
      items.sort((a, b) => new Date(b.created_date || b.created_at) - new Date(a.created_date || a.created_at));
    }
    return limit ? items.slice(0, limit) : items;
  }

  async get(id) {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async update(id, data) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  async find(criteria) {
    const items = this.getAll();
    return items.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${this.name}:`, error);
      return [];
    }
  }

  async incrementViewCount(id) {
    const item = await this.get(id);
    if (item) {
      return await this.update(id, {
        view_count: (item.view_count || 0) + 1
      });
    }
    return null;
  }

  async incrementAnswerCount(id) {
    const item = await this.get(id);
    if (item) {
      return await this.update(id, {
        answer_count: (item.answer_count || 0) + 1
      });
    }
    return null;
  }

  async incrementReplyCount(id) {
    const item = await this.get(id);
    if (item) {
      return await this.update(id, {
        reply_count: (item.reply_count || 0) + 1
      });
    }
    return null;
  }

  async incrementHelpfulCount(id) {
    const item = await this.get(id);
    if (item) {
      return await this.update(id, {
        helpful_count: (item.helpful_count || 0) + 1
      });
    }
    return null;
  }
}

// Extended classes
class QuestionEntity extends SimpleEntity {
  constructor() {
    super('questions');
  }
}

class AnswerEntity extends SimpleEntity {
  constructor() {
    super('answers');
  }

  async getByQuestionId(questionId) {
    return this.find({ question_id: questionId });
  }
}

class ForumPostEntity extends SimpleEntity {
  constructor() {
    super('forum_posts');
  }
}

class ForumReplyEntity extends SimpleEntity {
  constructor() {
    super('forum_replies');
  }

  async getByPostId(postId) {
    return this.find({ post_id: postId });
  }

  async getThreadReplies(postId) {
    const replies = await this.getByPostId(postId);
    return replies.sort((a, b) => new Date(a.created_date || a.created_at) - new Date(b.created_date || b.created_at));
  }
}

// Create instances
export const Question = new QuestionEntity();
export const Answer = new AnswerEntity();
export const ForumPost = new ForumPostEntity();
export const ForumReply = new ForumReplyEntity();

// Default export
export default {
  Question,
  Answer,
  ForumPost,
  ForumReply
};