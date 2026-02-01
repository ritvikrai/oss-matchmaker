const GITHUB_API = 'https://api.github.com';

function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OSS-Matchmaker',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

export async function searchRepositories({ query, language, sort = 'stars', page = 1 }) {
  let searchQuery = query;
  
  if (language) {
    searchQuery += ` language:${language}`;
  }
  
  // Filter for repos with good first issues
  searchQuery += ' good-first-issues:>0';
  
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sort}&per_page=20&page=${page}`;
  
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    total: data.total_count,
    repos: data.items.map(repo => ({
      id: repo.id,
      name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      languages: [repo.language].filter(Boolean),
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
      license: repo.license?.spdx_id,
    })),
  };
}

export async function getRepoDetails(owner, repo) {
  const [repoData, languages, contributors] = await Promise.all([
    fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=5`, { headers: getHeaders() }).then(r => r.json()),
  ]);
  
  return {
    name: repoData.full_name,
    description: repoData.description,
    url: repoData.html_url,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    languages: Object.keys(languages),
    languageBreakdown: languages,
    topics: repoData.topics || [],
    license: repoData.license?.spdx_id,
    hasWiki: repoData.has_wiki,
    hasDiscussions: repoData.has_discussions,
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    homepage: repoData.homepage,
    contributorCount: Array.isArray(contributors) ? contributors.length : 0,
  };
}

export async function getGoodFirstIssues(owner, repo) {
  const labels = ['good first issue', 'good-first-issue', 'beginner', 'easy', 'starter'];
  const labelQuery = labels.map(l => `label:"${l}"`).join(' OR ');
  
  const url = `${GITHUB_API}/search/issues?q=repo:${owner}/${repo}+is:issue+is:open+(${labelQuery})&per_page=10`;
  
  const response = await fetch(url, { headers: getHeaders() });
  const data = await response.json();
  
  return (data.items || []).map(issue => ({
    id: issue.id,
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    labels: issue.labels.map(l => l.name),
    createdAt: issue.created_at,
    comments: issue.comments,
  }));
}

export async function getUserProfile(username) {
  const [user, repos] = await Promise.all([
    fetch(`${GITHUB_API}/users/${username}`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=10`, { headers: getHeaders() }).then(r => r.json()),
  ]);
  
  // Extract languages from repos
  const languages = new Set();
  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language);
  });
  
  return {
    username: user.login,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    languages: Array.from(languages),
    recentRepos: repos.slice(0, 5).map(r => ({
      name: r.name,
      language: r.language,
      stars: r.stargazers_count,
    })),
  };
}
