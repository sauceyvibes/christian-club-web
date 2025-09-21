export const createPageUrl = (pageName) => {
  // Handle both the pageName format and direct URLs
  if (pageName.includes('?')) {
    // Handle URLs like "Question?id=123"
    const [page, query] = pageName.split('?');
    const pageUrl = createPageUrl(page);
    return `${pageUrl}?${query}`;
  }

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
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};