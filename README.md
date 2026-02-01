# OSS Matchmaker

Find open source projects that match your skills and interests.

## Features

- 🔍 Search GitHub for matching projects
- 🎯 Skill-based recommendations
- ⭐ Bookmark interesting projects
- 📊 Contribution difficulty analysis
- 🏷️ Filter by language, topic, activity

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **APIs**: GitHub REST API
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your API keys
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Search for projects |
| GET | `/api/project` | Get project details |
| GET/POST | `/api/profile` | Manage skills profile |
| GET/POST | `/api/bookmarks` | Manage bookmarks |

## Demo Mode

Works without API keys with sample project data.

## License

MIT
