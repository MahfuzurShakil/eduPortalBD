// app/(student)/layout.jsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/student/Sidebar"
import TopBar from "@/components/student/TopBar"
import useAuthStore from "@/lib/store/authStore"

export default function StudentLayout({ children }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated])

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  )
}