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
  fetchBookmarks()

  const channel = supabase
    .channel("bookmarks-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "bookmarks",
      },
      (payload) => {
        const newBookmark = payload.new as Bookmark
        setBookmarks((prev) => [newBookmark, ...prev])
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "bookmarks",
      },
      (payload) => {
        const deletedId = payload.old.id
        setBookmarks((prev) =>
          prev.filter((b) => b.id !== deletedId)
        )
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
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
