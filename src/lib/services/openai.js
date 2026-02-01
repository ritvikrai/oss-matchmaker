import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeProjectFit(userProfile, project) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an open source contribution advisor. Analyze how well a developer matches with a project.

Return JSON:
{
  "matchScore": 0.85,
  "strengths": ["Skill matches", "Experience relevant"],
  "gaps": ["May need to learn X"],
  "suggestedStartingPoints": ["Good first issue area", "Documentation"],
  "learningOpportunities": ["What they'll learn"],
  "estimatedOnboardingTime": "1-2 weeks",
  "recommendation": "Short recommendation"
}`,
      },
      {
        role: 'user',
        content: `Developer Profile:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience Level: ${userProfile.experienceLevel || 'intermediate'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Time Available: ${userProfile.hoursPerWeek || 5} hours/week
- Goals: ${userProfile.goals?.join(', ') || 'Learn and contribute'}

Project:
- Name: ${project.name}
- Description: ${project.description}
- Languages: ${project.languages?.join(', ') || 'Unknown'}
- Topics: ${project.topics?.join(', ') || 'None'}
- Stars: ${project.stars}
- Open Issues: ${project.openIssues}
- Contributors: ${project.contributors || 'Unknown'}`,
      },
    ],
    max_tokens: 600,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { matchScore: 0.5, recommendation: content };
}

export async function suggestProjectsFromSkills(profile) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Based on a developer's profile, suggest types of open source projects they should look for.

Return JSON:
{
  "projectTypes": ["Type of project"],
  "keywords": ["search keywords for GitHub"],
  "ecosystems": ["npm", "pypi", etc],
  "difficultyLevel": "beginner-friendly",
  "advice": "Personalized advice"
}`,
      },
      {
        role: 'user',
        content: `Skills: ${profile.skills?.join(', ')}
Interests: ${profile.interests?.join(', ')}
Experience: ${profile.experienceLevel}
Goals: ${profile.goals?.join(', ')}`,
      },
    ],
    max_tokens: 400,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { keywords: profile.skills || [], advice: content };
}
