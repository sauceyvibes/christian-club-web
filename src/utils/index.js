// Utility functions for the app

export const createPageUrl = (pageName) => {
  const pageMap = {
    'Questions': '/questions',
    'AskQuestion': '/ask-question', 
    'Forums': '/forums',
    'Question': '/question',
    'CreatePost': '/create-post',
    'ForumPost': '/forum-post'
  };
  
  return pageMap[pageName] || '/';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};
