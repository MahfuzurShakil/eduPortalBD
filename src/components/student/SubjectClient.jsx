// components/student/SubjectClient.jsx
"use client"
import Link from "next/link"
import { BookOpen, ChevronRight, PlayCircle, FileText, Clock, ArrowLeft } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import chaptersData from "@/data/chapters.json"

export default function SubjectClient({ subjectId }) {
  const { user } = useAuthStore()
  const subjects = user?.profile?.subjects || []
  const subject = subjects.find(s => s.id === subjectId)
  const chapters = chaptersData[subjectId] || []

  if (!subject) return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
      <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>বিষয়টি পাওয়া যায়নি</h2>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>এই বিষয়টি আপনার প্রোফাইলে নেই।</p>
      <Link href="/subjects" style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "#2563eb", color: "white", padding: "12px 24px",
        borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
      }}>
        <ArrowLeft size={14} /> বিষয়সমূহে ফিরুন
      </Link>
    </div>
  )

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "13px" }}>
        <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none" }}>হোম</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <Link href="/subjects" style={{ color: "#64748b", textDecoration: "none" }}>বিষয়সমূহ</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <span style={{ color: "#0f172a", fontWeight: "600" }}>{subject.name}</span>
      </nav>

      {/* Hero subject banner */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
        borderRadius: "24px", padding: "36px 40px", marginBottom: "32px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: "-50px", right: "80px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "20px",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "38px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)",
          }}>
            {subject.icon}
          </div>
          <div>
            <h1 style={{ color: "white", fontSize: "26px", fontWeight: "800", marginBottom: "10px" }}>{subject.name}</h1>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { icon: BookOpen, text: `${chapters.length} টি অধ্যায়` },
                { icon: PlayCircle, text: "ভিডিও সহ" },
                { icon: FileText, text: "PDF সহ" },
              ].map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#bfdbfe", fontSize: "13px", background: "rgba(255,255,255,0.12)", padding: "5px 12px", borderRadius: "20px" }}>
                  <item.icon size={12} /> {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
        সকল অধ্যায় <span style={{ color: "#94a3b8", fontWeight: "500", fontSize: "14px" }}>({chapters.length} টি)</span>
      </h2>

      {chapters.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "#64748b" }}>এই বিষয়ের জন্য অধ্যায় পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {chapters.map((chapter, idx) => (
            <Link key={chapter.id} href={`/subjects/${subjectId}/${chapter.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: "16px",
                border: "1.5px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", gap: "0",
                transition: "all 0.18s", cursor: "pointer", overflow: "hidden",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#bfdbfe"
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.1)"
                  e.currentTarget.style.transform = "translateX(4px)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#f1f5f9"
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                {/* Left accent bar */}
                <div style={{ width: "5px", alignSelf: "stretch", background: `hsl(${220 + idx * 15}, 80%, 55%)`, flexShrink: 0 }} />

                {/* Chapter number */}
                <div style={{
                  width: "54px", height: "54px", margin: "14px 16px",
                  borderRadius: "14px", background: "#eff6ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, flexDirection: "column",
                }}>
                  <span style={{ fontSize: "9px", color: "#93c5fd", fontWeight: "700", letterSpacing: "0.5px" }}>অধ্যায়</span>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#2563eb", lineHeight: 1 }}>
                    {String(chapter.chapterNo).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "16px 0" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "6px", lineHeight: 1.4 }}>
                    {chapter.title}
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <FileText size={11} color="#2563eb" /> {chapter.pages} পৃষ্ঠা
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <PlayCircle size={11} color="#ef4444" /> ভিডিও
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <Clock size={11} color="#f59e0b" /> পড়তে শুরু করুন
                    </span>
                  </div>
                </div>

                {/* Right badges + arrow */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "0 20px 0 0" }}>
                  <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "10px", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", border: "1px solid #bbf7d0" }}>PDF</span>
                  <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "10px", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", border: "1px solid #fde68a" }}>Video</span>
                  <div style={{ marginLeft: "8px", width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={14} color="#2563eb" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}