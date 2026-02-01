import { NextResponse } from 'next/server';
import { getRepoDetails, getGoodFirstIssues } from '@/lib/services/github';
import { analyzeProjectFit } from '@/lib/services/openai';
import { getProfile } from '@/lib/services/storage';
import { calculateMatchScore } from '@/lib/services/matching';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo parameters required' },
        { status: 400 }
      );
    }

    const [details, issues] = await Promise.all([
      getRepoDetails(owner, repo),
      getGoodFirstIssues(owner, repo),
    ]);

    // Get user profile for match analysis
    const profile = await getProfile();
    let matchAnalysis = null;

    if (profile) {
      if (process.env.OPENAI_API_KEY) {
        matchAnalysis = await analyzeProjectFit(profile, details);
      } else {
        // Simple match score
        matchAnalysis = {
          matchScore: calculateMatchScore(profile, details) / 100,
          recommendation: 'Add OPENAI_API_KEY for detailed match analysis',
          demo: true,
        };
      }
    }

    return NextResponse.json({
      ...details,
      goodFirstIssues: issues,
      matchAnalysis,
    });
  } catch (error) {
    console.error('Project details error:', error);
    return NextResponse.json(
      { error: 'Failed to get project details', details: error.message },
      { status: 500 }
    );
  }
}
