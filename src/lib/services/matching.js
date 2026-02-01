// Skill-based matching without AI

export const SKILL_TO_PROJECT_MAP = {
  javascript: {
    keywords: ['javascript', 'nodejs', 'react', 'vue', 'angular'],
    topics: ['web', 'frontend', 'fullstack'],
  },
  typescript: {
    keywords: ['typescript', 'deno', 'angular'],
    topics: ['web', 'enterprise'],
  },
  python: {
    keywords: ['python', 'django', 'flask', 'fastapi', 'machine-learning'],
    topics: ['data-science', 'ml', 'automation', 'backend'],
  },
  rust: {
    keywords: ['rust', 'systems', 'performance'],
    topics: ['systems', 'cli', 'embedded'],
  },
  go: {
    keywords: ['golang', 'go', 'kubernetes', 'docker'],
    topics: ['devops', 'cloud', 'infrastructure'],
  },
  java: {
    keywords: ['java', 'spring', 'android'],
    topics: ['enterprise', 'mobile', 'backend'],
  },
};

export const EXPERIENCE_FILTERS = {
  beginner: {
    maxStars: 50000,
    minIssues: 10,
    preferredLabels: ['good first issue', 'beginner', 'easy'],
  },
  intermediate: {
    maxStars: 100000,
    minIssues: 5,
    preferredLabels: ['help wanted', 'good first issue'],
  },
  advanced: {
    maxStars: null,
    minIssues: 0,
    preferredLabels: ['help wanted', 'enhancement'],
  },
};

export function calculateMatchScore(userProfile, project) {
  let score = 0;
  const maxScore = 100;
  
  // Language match (40 points)
  const userLanguages = userProfile.skills?.map(s => s.toLowerCase()) || [];
  const projectLanguages = project.languages?.map(l => l.toLowerCase()) || [];
  
  const languageMatch = userLanguages.some(ul => 
    projectLanguages.some(pl => pl.includes(ul) || ul.includes(pl))
  );
  if (languageMatch) score += 40;
  
  // Topic/interest match (20 points)
  const interests = userProfile.interests?.map(i => i.toLowerCase()) || [];
  const topics = project.topics?.map(t => t.toLowerCase()) || [];
  
  const topicMatch = interests.some(i => 
    topics.some(t => t.includes(i) || i.includes(t))
  );
  if (topicMatch) score += 20;
  
  // Activity level (15 points)
  const daysSinceUpdate = (Date.now() - new Date(project.updatedAt)) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) score += 15;
  else if (daysSinceUpdate < 30) score += 10;
  else if (daysSinceUpdate < 90) score += 5;
  
  // Good first issues available (15 points)
  if (project.openIssues > 0) score += 15;
  
  // Community size (10 points) - not too small, not overwhelming
  if (project.stars > 100 && project.stars < 10000) score += 10;
  else if (project.stars >= 10000 && project.stars < 50000) score += 5;
  
  return Math.round((score / maxScore) * 100);
}

export function buildSearchQuery(profile) {
  const queries = [];
  
  // Add skill-based keywords
  profile.skills?.forEach(skill => {
    const mapping = SKILL_TO_PROJECT_MAP[skill.toLowerCase()];
    if (mapping) {
      queries.push(...mapping.keywords);
    } else {
      queries.push(skill);
    }
  });
  
  // Add interests
  profile.interests?.forEach(interest => {
    queries.push(interest);
  });
  
  // Remove duplicates and join
  return [...new Set(queries)].slice(0, 3).join(' OR ');
}
