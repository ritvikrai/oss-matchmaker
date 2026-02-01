import { NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/services/storage';
import { getUserProfile } from '@/lib/services/github';
import { suggestProjectsFromSkills } from '@/lib/services/openai';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // If GitHub username provided, fetch GitHub profile
    if (data.githubUsername && !data.skills) {
      try {
        const ghProfile = await getUserProfile(data.githubUsername);
        data.skills = data.skills || ghProfile.languages;
        data.name = data.name || ghProfile.name;
      } catch (e) {
        // GitHub fetch failed, continue without
      }
    }
    
    const profile = await saveProfile(data);
    
    // Get project suggestions if AI available
    let suggestions = null;
    if (process.env.OPENAI_API_KEY && data.skills?.length) {
      suggestions = await suggestProjectsFromSkills(data);
    }
    
    return NextResponse.json({ 
      success: true, 
      profile,
      suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
