import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');
const CONTRIBUTIONS_FILE = path.join(DATA_DIR, 'contributions.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// User profile
export async function getProfile(userId = 'default') {
  await ensureDataDir();
  try {
    const file = await fs.readFile(PROFILES_FILE, 'utf-8');
    const data = JSON.parse(file);
    return data[userId] || null;
  } catch (e) {
    return null;
  }
}

export async function saveProfile(profile, userId = 'default') {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(PROFILES_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = {};
  }
  
  data[userId] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  await fs.writeFile(PROFILES_FILE, JSON.stringify(data, null, 2));
  return data[userId];
}

// Bookmarked projects
export async function getBookmarks(userId = 'default') {
  await ensureDataDir();
  try {
    const file = await fs.readFile(BOOKMARKS_FILE, 'utf-8');
    const data = JSON.parse(file);
    return data[userId] || [];
  } catch (e) {
    return [];
  }
}

export async function addBookmark(project, userId = 'default') {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(BOOKMARKS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = {};
  }
  
  if (!data[userId]) data[userId] = [];
  
  // Check if already bookmarked
  if (!data[userId].some(b => b.id === project.id)) {
    data[userId].unshift({
      ...project,
      bookmarkedAt: new Date().toISOString(),
    });
  }
  
  await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(data, null, 2));
  return data[userId];
}

export async function removeBookmark(projectId, userId = 'default') {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(BOOKMARKS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    return [];
  }
  
  if (data[userId]) {
    data[userId] = data[userId].filter(b => b.id !== projectId);
    await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(data, null, 2));
  }
  
  return data[userId] || [];
}

// Contribution tracking
export async function trackContribution(contribution, userId = 'default') {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(CONTRIBUTIONS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = {};
  }
  
  if (!data[userId]) data[userId] = [];
  
  data[userId].unshift({
    id: Date.now().toString(),
    ...contribution,
    createdAt: new Date().toISOString(),
  });
  
  await fs.writeFile(CONTRIBUTIONS_FILE, JSON.stringify(data, null, 2));
  return data[userId];
}

export async function getContributions(userId = 'default') {
  await ensureDataDir();
  try {
    const file = await fs.readFile(CONTRIBUTIONS_FILE, 'utf-8');
    const data = JSON.parse(file);
    return data[userId] || [];
  } catch (e) {
    return [];
  }
}
