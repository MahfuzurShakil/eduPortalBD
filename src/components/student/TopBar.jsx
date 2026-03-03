// components/student/TopBar.jsx
"use client"
import { Bell, Search, User } from "lucide-react"
import { useState } from "react"
import useAuthStore from "@/lib/store/authStore"

export default function TopBar() {
  const { user } = useAuthStore()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header style={{
      height: "64px", background: "white",
      borderBottom: "1px solid #f1f5f9",
      display: "flex", alignItems: "center",
      padding: "0 32px", gap: "16px",
      position: "sticky", top: 0, zIndex: 20,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
        <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          placeholder="বিষয়, অধ্যায় বা কুইজ খুঁজুন..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: "100%", padding: "9px 14px 9px 36px",
            background: searchFocused ? "white" : "#f8fafc",
            border: searchFocused ? "1.5px solid #2563eb" : "1.5px solid #f1f5f9",
            borderRadius: "12px", fontSize: "13px", outline: "none",
            fontFamily: "inherit", color: "#0f172a",
            transition: "all 0.15s", boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notifications */}
      <button style={{
        width: "38px", height: "38px", borderRadius: "10px",
        border: "1.5px solid #f1f5f9", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", position: "relative",
      }}>
        <Bell size={16} color="#64748b" />
        <span style={{
          position: "absolute", top: "6px", right: "6px",
          width: "8px", height: "8px", borderRadius: "50%",
          background: "#ef4444", border: "2px solid white",
        }} />
      </button>

      {/* User avatar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "6px 12px", borderRadius: "12px",
        border: "1.5px solid #f1f5f9", background: "white",
        cursor: "pointer",
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <User size={14} color="white" />
        </div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{user?.name?.split(" ")[0] || "শিক্ষার্থী"}</div>
          <div style={{ fontSize: "10px", color: "#94a3b8" }}>{user?.profile?.class || "Student"}</div>
        </div>
      </div>
    </header>
  )
}