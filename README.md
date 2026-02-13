Smart Bookmark App

A simple, real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

Users can log in using Google OAuth, add private bookmarks, and see real-time updates across multiple tabs.

🚀 Live Demo

Vercel URL:
https://smart-bookmark-app-coral.vercel.app/

GitHub Repository:
https://github.com/nehapro1/smart-bookmark-app

📌 Features

🔐 Google OAuth authentication (no email/password)

➕ Add bookmarks (title + URL)

🔒 Private bookmarks per user (RLS enforced)

🔄 Real-time updates (across multiple tabs)

🗑️ Delete your own bookmarks

☁️ Deployed on Vercel

🛠 Tech Stack

Frontend: Next.js (App Router)

Backend: Supabase

Authentication (Google OAuth)

PostgreSQL Database

Realtime subscriptions

Styling: Tailwind CSS

Deployment: Vercel

🧠 Architecture Overview
Authentication

Implemented using Supabase Auth with Google OAuth.

Users must log in before accessing the dashboard.

Auth session is restored on page load.

Database

Table: bookmarks

Column	Type
id	uuid
title	text
url	text
user_id	uuid
created_at	timestamp
Row Level Security (RLS)

RLS is enabled to ensure bookmarks are private.

Policies:

Users can SELECT their own bookmarks

Users can INSERT their own bookmarks

Users can DELETE their own bookmarks

Example policy:

USING (auth.uid() = user_id)

🔄 Real-Time Implementation

Supabase Realtime is used to listen for changes on the bookmarks table.

Each user subscribes only to their own bookmarks using:

filter: `user_id=eq.${user.id}`


When an INSERT or DELETE happens, the client refetches bookmarks to keep UI in sync.

Opening two tabs:

Add bookmark in Tab 1 → instantly appears in Tab 2

Add in Tab 2 → instantly appears in Tab 1

⚠️ Problems Faced & How They Were Solved
1️⃣ Realtime Not Working After Deployment (But Worked Locally)

Issue:
After deploying to Vercel, real-time updates stopped working. Bookmarks only appeared after refreshing the page.

Cause:
The realtime subscription was being created before the Supabase authentication session was fully restored.
Since RLS depends on auth.uid(), the subscription silently failed to receive events.

Solution:
Wait for the authenticated user before creating the realtime subscription:

const {
  data: { user },
} = await supabase.auth.getUser()


Then create the channel subscription.

This ensured:

JWT was attached

RLS allowed event delivery

Realtime worked consistently in production

2️⃣ Subscription Lifecycle Issues

Issue:
Realtime sometimes worked randomly and then stopped.

Cause:
Subscription was created without confirming auth state, causing inconsistent behavior depending on session restoration timing.

Solution:
Moved subscription logic inside an async setup function inside useEffect and ensured it runs only after auth is available.

3️⃣ Ensuring Privacy with Realtime

Row Level Security (RLS) is enabled on the bookmarks table.
Policies ensure users can only SELECT, INSERT, and DELETE their own bookmarks using:

auth.uid() = user_id


This guarantees complete data isolation between users.

🧪 How to Run Locally

Clone the repo

git clone <repo-url>
cd project-folder


Install dependencies

npm install


Create .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key


Run the development server

npm run dev

✅ Submission Checklist

 Google OAuth login

 Add bookmark

 Delete bookmark

 Private per user (RLS)

 Real-time sync across tabs

 Deployed on Vercel

🎯 Final Notes

This project demonstrates:

Authentication handling in Next.js App Router

Supabase Realtime integration

Proper RLS usage

Handling auth + subscription lifecycle issues in production

Deployment troubleshooting on Vercel
