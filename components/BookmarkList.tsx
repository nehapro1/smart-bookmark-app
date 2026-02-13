"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Bookmark {
  id: string
  title: string
  url: string
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
  const setup = async () => {
    // Wait for user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    
    await fetchBookmarks()

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Realtime triggered:", payload)
          console.log("EVENT TYPE:", payload.eventType)
          fetchBookmarks()
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  setup()
}, [])


  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center bg-white p-3 rounded shadow"
        >
          <a href={b.url} target="_blank" className="text-blue-600">
            {b.title}
          </a>
          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}