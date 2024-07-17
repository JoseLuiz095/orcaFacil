import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/projects' };

export async function middleware() {
  const projectSettings = await get('projectSettings');
  return NextResponse.json(projectSettings);
}
