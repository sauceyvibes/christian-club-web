import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment
} from 'firebase/firestore';
import { db } from './config';

class FirebaseEntity {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async create(data) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        created_at: new Date().toISOString(),
        created_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: new Date().toISOString(),
        created_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async get(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      return null;
    }
  }

  async list(sortField = '-created_at', limitCount = 50) {
    try {
      // Handle '-' prefix for descending order
      const isDescending = sortField.startsWith('-');
      const actualField = isDescending ? sortField.substring(1) : sortField;
      const direction = isDescending ? 'desc' : 'asc';
      
      // Map old field names to new ones
      const fieldMap = {
        'created_date': 'created_at',
        'updated_date': 'updated_at'
      };
      const mappedField = fieldMap[actualField] || actualField;
      
      const q = query(
        collection(db, this.collectionName),
        orderBy(mappedField, direction),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error listing ${this.collectionName}:`, error);
      return [];
    }
  }

  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      return false;
    }
  }

  async deleteItem(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      return false;
    }
  }

  async find(criteria) {
    try {
      const fieldName = Object.keys(criteria)[0];
      const fieldValue = criteria[fieldName];
      
      const q = query(
        collection(db, this.collectionName),
        where(fieldName, '==', fieldValue)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error finding ${this.collectionName}:`, error);
      return [];
    }
  }

  async incrementField(id, field, amount = 1) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        [field]: increment(amount)
      });
      return true;
    } catch (error) {
      console.error(`Error incrementing field:`, error);
      return false;
    }
  }
}

// Question Entity
class QuestionEntity extends FirebaseEntity {
  constructor() {
    super('questions');
  }

  async incrementViewCount(id) {
    return await this.incrementField(id, 'view_count', 1);
  }

  async incrementAnswerCount(id) {
    return await this.incrementField(id, 'answer_count', 1);
  }

  async decrementAnswerCount(id) {
    return await this.incrementField(id, 'answer_count', -1);
  }
}

// Answer Entity
class AnswerEntity extends FirebaseEntity {
  constructor() {
    super('answers');
  }

  async getByQuestionId(questionId) {
    return await this.find({ question_id: questionId });
  }

  async incrementHelpfulCount(id) {
    return await this.incrementField(id, 'helpful_count', 1);
  }
}

// ForumPost Entity
class ForumPostEntity extends FirebaseEntity {
  constructor() {
    super('forum_posts');
  }

  async incrementViewCount(id) {
    return await this.incrementField(id, 'view_count', 1);
  }

  async incrementReplyCount(id) {
    return await this.incrementField(id, 'reply_count', 1);
  }

  async decrementReplyCount(id) {
    return await this.incrementField(id, 'reply_count', -1);
  }
}

// ForumReply Entity
class ForumReplyEntity extends FirebaseEntity {
  constructor() {
    super('forum_replies');
  }

  async getByPostId(postId) {
    return await this.find({ post_id: postId });
  }

  async getThreadReplies(postId) {
    const replies = await this.getByPostId(postId);
    return replies.sort((a, b) => 
      new Date(a.created_at || a.created_date) - new Date(b.created_at || b.created_date)
    );
  }
}

// Export instances
export const Question = new QuestionEntity();
export const Answer = new AnswerEntity();
export const ForumPost = new ForumPostEntity();
export const ForumReply = new ForumReplyEntity();