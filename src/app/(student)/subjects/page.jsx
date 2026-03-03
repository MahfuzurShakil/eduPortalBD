// app/(student)/subjects/page.jsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, ChevronRight, PlayCircle, FileText, Search } from "lucide-react"
import { useState } from "react"
import useAuthStore from "@/lib/store/authStore"

const subjectColors = [
  { bg: "linear-gradient(135deg,#1e3a8a,#2563eb)", light: "#eff6ff", accent: "#2563eb" },
  { bg: "linear-gradient(135deg,#14532d,#16a34a)", light: "#f0fdf4", accent: "#16a34a" },
  { bg: "linear-gradient(135deg,#7c2d12,#ea580c)", light: "#fff7ed", accent: "#ea580c" },
  { bg: "linear-gradient(135deg,#4c1d95,#7c3aed)", light: "#faf5ff", accent: "#7c3aed" },
  { bg: "linear-gradient(135deg,#164e63,#0891b2)", light: "#ecfeff", accent: "#0891b2" },
  { bg: "linear-gradient(135deg,#831843,#db2777)", light: "#fdf2f8", accent: "#db2777" },
  { bg: "linear-gradient(135deg,#713f12,#ca8a04)", light: "#fefce8", accent: "#ca8a04" },
  { bg: "linear-gradient(135deg,#134e4a,#0d9488)", light: "#f0fdfa", accent: "#0d9488" },
]

export default function SubjectsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated])

  const subjects = user?.profile?.subjects || []
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>আমার বিষয়সমূহ</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          {subjects.length} টি বিষয় পাওয়া গেছে — একটি বেছে নিন পড়া শুরু করুন
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "28px", maxWidth: "400px" }}>
        <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          placeholder="বিষয় খুঁজুন..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "11px 14px 11px 40px",
            border: "1.5px solid #e2e8f0", borderRadius: "12px",
            fontSize: "14px", outline: "none", background: "white",
            fontFamily: "inherit", color: "#0f172a", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "#2563eb"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {filtered.map((subject, idx) => {
          const color = subjectColors[idx % subjectColors.length]
          return (
            <Link key={subject.id} href={`/subjects/${subject.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                borderRadius: "20px", overflow: "hidden", background: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
                transition: "all 0.2s", cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)" }}
              >
                {/* Top gradient */}
                <div style={{ background: color.bg, padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                  <div style={{ fontSize: "42px", marginBottom: "12px", position: "relative", zIndex: 1 }}>{subject.icon}</div>
                  <h3 style={{ color: "white", fontSize: "17px", fontWeight: "700", position: "relative", zIndex: 1, lineHeight: 1.3 }}>{subject.name}</h3>
                </div>
                {/* Bottom */}
                <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <PlayCircle size={12} color={color.accent} /> ভিডিও
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <FileText size={12} color={color.accent} /> PDF
                    </span>
                  </div>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: color.light, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <ChevronRight size={14} color={color.accent} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <p>কোনো বিষয় পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  )
}