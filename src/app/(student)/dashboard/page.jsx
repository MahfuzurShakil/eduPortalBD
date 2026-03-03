// app/(student)/dashboard/page.jsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen, Trophy, TrendingUp, Clock, ChevronRight,
  Star, Zap, Target, PlayCircle, Award
} from "lucide-react"
import useAuthStore from "@/lib/store/authStore"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated])

  if (!user) return null

  const subjects = user?.profile?.subjects || []
  const profile = user?.profile || {}
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "শুভ সকাল" : hour < 17 ? "শুভ বিকেল" : "শুভ সন্ধ্যা"

  const stats = [
    { icon: BookOpen, label: "মোট বিষয়", value: subjects.length, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    { icon: Trophy, label: "কুইজ দেওয়া হয়েছে", value: "০", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    { icon: TrendingUp, label: "গড় স্কোর", value: "—", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { icon: Award, label: "র‌্যাংক", value: "—", color: "#9333ea", bg: "#faf5ff", border: "#e9d5ff" },
  ]

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero greeting banner */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        borderRadius: "24px",
        padding: "32px 36px",
        marginBottom: "28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "120px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ color: "#93c5fd", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
                {greeting}, 👋
              </p>
              <h1 style={{ color: "white", fontSize: "26px", fontWeight: "800", marginBottom: "10px", lineHeight: 1.2 }}>
                {user.name}
              </h1>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {profile.class && (
                  <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>
                    📚 {profile.class}
                  </span>
                )}
                {profile.group && (
                  <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>
                    🎯 {profile.group}
                  </span>
                )}
                {profile.medium && (
                  <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>
                    🌐 {profile.medium}
                  </span>
                )}
              </div>
            </div>
            <Link href="/quiz" style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "white", color: "#1e40af",
              padding: "12px 20px", borderRadius: "14px",
              textDecoration: "none", fontWeight: "700", fontSize: "14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)", flexShrink: 0,
            }}>
              <Zap size={16} color="#f59e0b" fill="#f59e0b" />
              কুইজ দিন
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "32px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "16px",
            padding: "18px 20px", border: `1px solid ${s.border}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "11px",
              background: s.bg, display: "flex", alignItems: "center",
              justifyContent: "center", marginBottom: "12px",
            }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "3px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My Subjects */}
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>আমার বিষয়সমূহ</h2>
        <Link href="/subjects" style={{ color: "#2563eb", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
          সব দেখুন <ChevronRight size={14} />
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div style={{ background: "white", borderRadius: "20px", padding: "48px", textAlign: "center", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
          <p style={{ color: "#64748b", fontSize: "15px" }}>কোনো বিষয় পাওয়া যায়নি</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {subjects.map((subject, idx) => (
            <SubjectCard key={subject.id} subject={subject} index={idx} />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "14px" }}>দ্রুত অ্যাক্সেস</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { href: "/quiz", icon: "🎯", label: "কুইজ দিন", desc: "MCQ প্র্যাকটিস করুন", color: "#fef3c7", border: "#fde68a", textColor: "#92400e" },
            { href: "/leaderboard", icon: "🏆", label: "লিডারবোর্ড", desc: "র‌্যাংকিং দেখুন", color: "#faf5ff", border: "#e9d5ff", textColor: "#6b21a8" },
            { href: "/subjects", icon: "📖", label: "পড়াশোনা", desc: "অধ্যায় পড়ুন", color: "#f0fdf4", border: "#bbf7d0", textColor: "#14532d" },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: item.color, border: `1px solid ${item.border}`,
                borderRadius: "16px", padding: "20px",
                transition: "transform 0.15s",
                cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: item.textColor, marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Inline subject card for dashboard
const subjectColors = [
  { bg: "linear-gradient(135deg,#1e3a8a,#2563eb)", badge: "#93c5fd" },
  { bg: "linear-gradient(135deg,#14532d,#16a34a)", badge: "#86efac" },
  { bg: "linear-gradient(135deg,#7c2d12,#ea580c)", badge: "#fdba74" },
  { bg: "linear-gradient(135deg,#4c1d95,#7c3aed)", badge: "#c4b5fd" },
  { bg: "linear-gradient(135deg,#164e63,#0891b2)", badge: "#67e8f9" },
  { bg: "linear-gradient(135deg,#831843,#db2777)", badge: "#f9a8d4" },
]

function SubjectCard({ subject, index }) {
  const colors = subjectColors[index % subjectColors.length]
  return (
    <Link href={`/subjects/${subject.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer", height: "100%",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)" }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* Card top with gradient */}
        <div style={{ background: colors.bg, padding: "24px 20px 20px" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>{subject.icon}</div>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "700", marginBottom: "6px", lineHeight: 1.3 }}>{subject.name}</h3>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "600" }}>
            অধ্যায় শুরু করুন →
          </span>
        </div>
        {/* Card bottom */}
        <div style={{ background: "white", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "12px" }}>
            <BookOpen size={12} /> পড়া শুরু করুন
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "11px", color: "#64748b" }}>সক্রিয়</span>
          </div>
        </div>
      </div>
    </Link>
  )
}