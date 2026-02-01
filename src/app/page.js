'use client'
import { useState } from 'react'
import { Github, Star, GitFork, Heart, Sparkles, Code, Loader2, ExternalLink, Filter } from 'lucide-react'

const MOCK_ISSUES = [
  { id: 1, repo: 'facebook/react', title: 'Add TypeScript types for new hook', labels: ['good first issue', 'typescript'], stars: '220k', difficulty: 'Easy', match: 95, language: 'TypeScript' },
  { id: 2, repo: 'vercel/next.js', title: 'Improve error message for invalid config', labels: ['good first issue', 'documentation'], stars: '118k', difficulty: 'Easy', match: 92, language: 'JavaScript' },
  { id: 3, repo: 'tailwindlabs/tailwindcss', title: 'Add new utility class for aspect-ratio', labels: ['enhancement', 'css'], stars: '75k', difficulty: 'Medium', match: 88, language: 'CSS' },
  { id: 4, repo: 'prisma/prisma', title: 'Fix edge case in query builder', labels: ['bug', 'database'], stars: '35k', difficulty: 'Medium', match: 85, language: 'TypeScript' },
  { id: 5, repo: 'django/django', title: 'Add validation for model field', labels: ['good first issue'], stars: '75k', difficulty: 'Easy', match: 80, language: 'Python' },
]

const SKILLS = ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'CSS', 'Go', 'Rust', 'Java']
const INTERESTS = ['Web Dev', 'AI/ML', 'DevOps', 'Mobile', 'Database', 'Security', 'Documentation']

export default function Home() {
  const [skills, setSkills] = useState(['JavaScript', 'TypeScript', 'React'])
  const [interests, setInterests] = useState(['Web Dev'])
  const [experience, setExperience] = useState('intermediate')
  const [issues, setIssues] = useState([])
  const [searching, setSearching] = useState(false)

  const toggleSkill = (skill) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const toggleInterest = (interest) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest])
  }

  const findMatches = async () => {
    setSearching(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIssues(MOCK_ISSUES)
    setSearching(false)
  }

  const difficultyColors = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-700' }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Github className="text-white" />
          OSS Matchmaker
        </h1>
        <p className="text-gray-400 mb-8">Find open source issues that match your skills</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Code size={18} /> Your Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    skills.includes(skill) ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Heart size={18} /> Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    interests.includes(interest) ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Filter size={18} /> Experience Level
            </h3>
            <div className="space-y-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="experience"
                    checked={experience === level}
                    onChange={() => setExperience(level)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-gray-300 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={findMatches}
          disabled={searching || skills.length === 0}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
        >
          {searching ? <><Loader2 className="animate-spin" /> Finding matches...</> : <><Sparkles /> Find My Matches</>}
        </button>

        {issues.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Top Matches for You</h2>
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-sm">{issue.repo}</span>
                      <span className="flex items-center gap-1 text-gray-500 text-sm">
                        <Star size={14} /> {issue.stars}
                      </span>
                    </div>
                    <h3 className="text-white font-medium text-lg mb-2">{issue.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {issue.labels.map((label) => (
                        <span key={label} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">{label}</span>
                      ))}
                      <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[issue.difficulty]}`}>{issue.difficulty}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">{issue.language}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-400">{issue.match}%</div>
                    <div className="text-xs text-gray-500">match</div>
                    <button className="mt-2 px-3 py-1 bg-white/10 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-white/20">
                      View <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
