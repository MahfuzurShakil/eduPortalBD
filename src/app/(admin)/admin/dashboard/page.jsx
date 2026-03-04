"use client"
import { useMemo } from "react"
import { Users, HelpCircle, Video, Trophy, TrendingUp, BookOpen, ArrowUpRight, Activity } from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import Link from "next/link"

function StatCard({ icon: Icon, label, value, color, bg, href, trend }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "24px",
        border: "1px solid #e2e8f0", cursor: "pointer",
        transition: "all 0.2s", position: "relative", overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)" }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", borderRadius: "0 16px 0 80px", background: bg, opacity: 0.15 }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={20} color={color} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "#f0fdf4", borderRadius: "99px", padding: "3px 8px" }}>
            <ArrowUpRight size={11} color="#22c55e" />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#22c55e" }}>{trend}</span>
          </div>
        </div>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{value}</div>
        <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>{label}</div>
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const { getStats, questions, students, videos } = useAdminStore()
  const stats = getStats()

  // Recent questions
  const recentQuestions = useMemo(() =>
    [...questions].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5),
    [questions]
  )

  // Subject distribution for questions
  const subjectCounts = useMemo(() => {
    const counts = {}
    questions.forEach(q => {
      counts[q.subject] = (counts[q.subject] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [questions])

  // Recent students
  const recentStudents = useMemo(() =>
    [...students].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5),
    [students]
  )

  const today = new Date().toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>অ্যাডমিন ড্যাশবোর্ড</h1>
        <p style={{ fontSize: "14px", color: "#64748b" }}>{today}</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <StatCard icon={Users} label="মোট শিক্ষার্থী" value={stats.totalStudents} color="#2563eb" bg="#eff6ff" href="/admin/students" trend="+12%" />
        <StatCard icon={HelpCircle} label="মোট প্রশ্ন" value={stats.totalQuestions} color="#7c3aed" bg="#f5f3ff" href="/admin/questions" trend="+8%" />
        <StatCard icon={Video} label="মোট ভিডিও" value={stats.totalVideos} color="#0891b2" bg="#ecfeff" href="/admin/videos" trend="+5%" />
        <StatCard icon={Trophy} label="কুইজ দেওয়া হয়েছে" value={stats.totalQuizzesTaken} color="#d97706" bg="#fffbeb" href="/admin/students" trend="+23%" />
      </div>

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Recent Questions */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <HelpCircle size={18} color="#7c3aed" />
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>সাম্প্রতিক প্রশ্নসমূহ</span>
            </div>
            <Link href="/admin/questions" style={{ fontSize: "12px", color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>সব দেখুন →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentQuestions.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>কোনো প্রশ্ন নেই</p>
            ) : recentQuestions.map((q, i) => (
              <div key={q.id || i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px", background: "#f8fafc", borderRadius: "10px" }}>
                <div style={{ width: "28px", height: "28px", background: "#f5f3ff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed" }}>Q</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12.5px", color: "#0f172a", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question}</p>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{q.subject} · {q.chapter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="#2563eb" />
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>শিক্ষার্থী তালিকা</span>
            </div>
            <Link href="/admin/students" style={{ fontSize: "12px", color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>সব দেখুন →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentStudents.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "#f8fafc", borderRadius: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `hsl(${(i * 60) + 200},70%,55%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{s.name?.[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", marginBottom: "1px" }}>{s.name}</p>
                  <p style={{ fontSize: "11px", color: "#64748b" }}>{s.profile?.class || "অনবোর্ড করা হয়নি"} · {s.school || "স্কুল নেই"}</p>
                </div>
                <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "99px", background: s.isOnboarded ? "#f0fdf4" : "#fef9c3", color: s.isOnboarded ? "#22c55e" : "#d97706", fontWeight: "600" }}>
                  {s.isOnboarded ? "সক্রিয়" : "অসম্পূর্ণ"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Question Distribution */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Activity size={18} color="#0891b2" />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>বিষয়ভিত্তিক প্রশ্ন বিতরণ</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {subjectCounts.map(([subject, count], i) => {
            const colors = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#22c55e", "#ef4444"]
            const pct = Math.round((count / questions.length) * 100)
            return (
              <div key={subject} style={{ padding: "14px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "capitalize" }}>{subject}</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{count}</span>
                </div>
                <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: colors[i % colors.length], borderRadius: "99px", transition: "width 0.6s ease" }} />
                </div>
                <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", display: "block" }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}