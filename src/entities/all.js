// Base Entity class for common functionality
class BaseEntity {
  constructor() {
    this.storageKey = this.constructor.name.toLowerCase() + 's';
  }

  // Get all items from localStorage
  getAll() {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  // Save all items to localStorage
  saveAll(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  // Create a new item
  async create(data) {
    const items = this.getAll();
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  // Get items with optional sorting and limiting
  async list(sortBy = '-created_date', limit = null) {
    let items = this.getAll();
    
    // Sort items
    if (sortBy) {
      const isDesc = sortBy.startsWith('-');
      const sortField = isDesc ? sortBy.slice(1) : sortBy;
      
      items.sort((a, b) => {
        if (sortField === 'created_date' || sortField === 'updated_date') {
          const aDate = new Date(a[sortField]);
          const bDate = new Date(b[sortField]);
          return isDesc ? bDate - aDate : aDate - bDate;
        }
        
        if (a[sortField] < b[sortField]) return isDesc ? 1 : -1;
        if (a[sortField] > b[sortField]) return isDesc ? -1 : 1;
        return 0;
      });
    }
    
    // Limit results if specified
    if (limit) {
      items = items.slice(0, limit);
    }
    
    return items;
  }

  // Get a single item by ID
  async get(id) {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  // Update an item
  async update(id, data) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      this.saveAll(items);
      return items[index];
    }
    
    return null;
  }

  // Delete an item
  async delete(id) {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length < items.length) {
      this.saveAll(filteredItems);
      return true;
    }
    
    return false;
  }

  // Find items by criteria
  async find(criteria) {
    const items = this.getAll();
    return items.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        if (typeof value === 'string') {
          return item[key] && item[key].toLowerCase().includes(value.toLowerCase());
        }
        return item[key] === value;
      });
    });
  }
}

// Question Entity
export class Question extends BaseEntity {
  constructor() {
    super();
  }

  async incrementViewCount(id) {
    const question = await this.get(id);
    if (question) {
      return await this.update(id, {
        view_count: (question.view_count || 0) + 1
      });
    }
    return null;
  }

  async incrementAnswerCount(id) {
    const question = await this.get(id);
    if (question) {
      return await this.update(id, {
        answer_count: (question.answer_count || 0) + 1
      });
    }
    return null;
  }
}

// Answer Entity  
export class Answer extends BaseEntity {
  constructor() {
    super();
  }

  async getByQuestionId(questionId) {
    return await this.find({ question_id: questionId });
  }

  async incrementHelpfulCount(id) {
    const answer = await this.get(id);
    if (answer) {
      return await this.update(id, {
        helpful_count: (answer.helpful_count || 0) + 1
      });
    }
    return null;
  }
}

// ForumPost Entity
export class ForumPost extends BaseEntity {
  constructor() {
    super();
  }

  async incrementViewCount(id) {
    const post = await this.get(id);
    if (post) {
      return await this.update(id, {
        view_count: (post.view_count || 0) + 1
      });
    }
    return null;
  }

  async incrementReplyCount(id) {
    const post = await this.get(id);
    if (post) {
      return await this.update(id, {
        reply_count: (post.reply_count || 0) + 1
      });
    }
    return null;
  }
}

// ForumReply Entity
export class ForumReply extends BaseEntity {
  constructor() {
    super();
  }

  async getByPostId(postId) {
    return await this.find({ post_id: postId });
  }

  async getThreadReplies(postId) {
    const replies = await this.getByPostId(postId);
    // Sort by created_date to show chronological conversation
    return replies.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
  }
}

// Create singleton instances
export const question = new Question();
export const answer = new Answer(); 
export const forumPost = new ForumPost();
export const forumReply = new ForumReply();

// Default exports for backwards compatibility
export default {
  Question: question,
  Answer: answer,
  ForumPost: forumPost, 
  ForumReply: forumReply
};
