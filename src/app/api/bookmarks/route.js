import { NextResponse } from 'next/server';
import { getBookmarks, addBookmark, removeBookmark } from '@/lib/services/storage';

export async function GET() {
  try {
    const bookmarks = await getBookmarks();
    return NextResponse.json({ bookmarks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const project = await request.json();
    const bookmarks = await addBookmark(project);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add bookmark' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { projectId } = await request.json();
    const bookmarks = await removeBookmark(projectId);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}
