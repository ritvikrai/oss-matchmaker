import { NextResponse } from 'next/server';
import { searchRepositories } from '@/lib/services/github';
import { calculateMatchScore, buildSearchQuery } from '@/lib/services/matching';
import { getProfile } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const language = searchParams.get('language');
    const page = parseInt(searchParams.get('page') || '1');

    let searchQuery = query;
    let profile = null;

    // If no query, build from user profile
    if (!searchQuery) {
      profile = await getProfile();
      if (profile) {
        searchQuery = buildSearchQuery(profile);
      } else {
        searchQuery = 'good-first-issues:>5';
      }
    }

    const results = await searchRepositories({
      query: searchQuery,
      language,
      page,
    });

    // Calculate match scores if profile exists
    if (profile || !query) {
      profile = profile || await getProfile();
      if (profile) {
        results.repos = results.repos.map(repo => ({
          ...repo,
          matchScore: calculateMatchScore(profile, repo),
        }));
        // Sort by match score
        results.repos.sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search projects', details: error.message },
      { status: 500 }
    );
  }
}
