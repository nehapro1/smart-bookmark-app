"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import BookmarkList from "@/components/BookmarkList"

export default function Dashboard() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const addBookmark = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    })

    setTitle("")
    setUrl("")
  }

  const logout = async () => {
    await supabase.auth.signOut()
    location.href = "/"
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="w-full bg-black text-white py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <BookmarkList />
    </div>
  )
}
