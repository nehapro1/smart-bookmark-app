# Smart Bookmark App

## Features
- Google OAuth login
- Private bookmarks per user
- Real-time updates
- Delete support
- Deployed on Vercel

## Problems Faced

1. Realtime not updating initially
   - Fixed by enabling Supabase Realtime and using postgres_changes

2. Session not persisting
   - Fixed using Supabase auth helpers and middleware

3. Private bookmarks
   - Solved using Row Level Security policies
