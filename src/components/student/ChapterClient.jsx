// components/student/ChapterClient.jsx
"use client"
import { useState } from "react"
import Link from "next/link"
import {
  Download, PlayCircle, FileText, ChevronLeft, ChevronRight,
  User, Clock, BookOpen, ExternalLink, Maximize2
} from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import chaptersData from "@/data/chapters.json"
import videosData from "@/data/videos.json"

export default function ChapterClient({ subjectId, chapterId }) {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("both") // "pdf" | "video" | "both"

  const subjects = user?.profile?.subjects || []
  const subject = subjects.find(s => s.id === subjectId)
  const chapters = chaptersData[subjectId] || []
  const chapter = chapters.find(c => c.id === chapterId)
  const video = videosData[chapterId]

  const currentIndex = chapters.findIndex(c => c.id === chapterId)
  const prevChapter = chapters[currentIndex - 1]
  const nextChapter = chapters[currentIndex + 1]

  if (!chapter) return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>😕</div>
      <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>অধ্যায়টি পাওয়া যায়নি</h2>
      <Link href={`/subjects/${subjectId}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
        ← বিষয়ে ফিরুন
      </Link>
    </div>
  )

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "13px", flexWrap: "wrap" }}>
        <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none" }}>হোম</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <Link href="/subjects" style={{ color: "#64748b", textDecoration: "none" }}>বিষয়সমূহ</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <Link href={`/subjects/${subjectId}`} style={{ color: "#64748b", textDecoration: "none" }}>{subject?.name || subjectId}</Link>
        <ChevronRight size={12} color="#cbd5e1" />
        <span style={{ color: "#0f172a", fontWeight: "600" }}>{chapter.title}</span>
      </nav>

      {/* Chapter header card */}
      <div style={{
        background: "white", borderRadius: "20px",
        border: "1px solid #e2e8f0", marginBottom: "20px",
        overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        {/* Top accent stripe */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)" }} />
        <div style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            border: "1px solid #bfdbfe",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", flexShrink: 0,
          }}>
            <span style={{ fontSize: "9px", color: "#93c5fd", fontWeight: "700" }}>অধ্যায়</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#2563eb" }}>
              {String(chapter.chapterNo).padStart(2, "0")}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "5px" }}>{chapter.title}</h1>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>{chapter.description}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            <a href="/pdfs/sample.pdf" download style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: "#f0fdf4", border: "1.5px solid #bbf7d0",
              color: "#16a34a", padding: "10px 18px", borderRadius: "12px",
              textDecoration: "none", fontSize: "13px", fontWeight: "700",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4" }}
            >
              <Download size={14} /> PDF ডাউনলোড
            </a>
          </div>
        </div>

        {/* View mode tabs */}
        <div style={{ padding: "0 28px 18px", display: "flex", gap: "8px" }}>
          {[
            { key: "both", label: "📄 PDF + ভিডিও", desc: "পাশাপাশি দেখুন" },
            { key: "pdf", label: "📄 শুধু PDF", desc: "বড় PDF পাঠ" },
            { key: "video", label: "🎬 শুধু ভিডিও", desc: "বড় ভিডিও" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "8px 16px", borderRadius: "10px", cursor: "pointer",
              background: activeTab === tab.key ? "#2563eb" : "#f8fafc",
              color: activeTab === tab.key ? "white" : "#64748b",
              border: activeTab === tab.key ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
              fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div style={{
        display: "grid",
        gridTemplateColumns: activeTab === "both" ? "1fr 1fr" : "1fr",
        gap: "16px",
        marginBottom: "20px",
      }}>

        {/* PDF Panel */}
        {(activeTab === "pdf" || activeTab === "both") && (
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #e2e8f0", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column",
          }}>
            {/* Panel header */}
            <div style={{
              padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", gap: "10px",
              background: "linear-gradient(135deg, #f8faff, #eff6ff)",
            }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={15} color="#2563eb" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>পাঠ্যবই পিডিএফ</div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{chapter.pages} পৃষ্ঠা</div>
              </div>
              <a href="/pdfs/sample.pdf" target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: "5px", fontSize: "11px",
                color: "#2563eb", textDecoration: "none", fontWeight: "600",
                background: "#eff6ff", padding: "5px 10px", borderRadius: "8px",
              }}>
                <ExternalLink size={11} /> নতুন ট্যাব
              </a>
            </div>

            {/* PDF iframe */}
            <iframe
              src="/pdfs/sample.pdf#toolbar=1&view=FitH"
              style={{
                width: "100%",
                height: activeTab === "both" ? "520px" : "680px",
                border: "none", display: "block",
              }}
              title="PDF Viewer"
            />
          </div>
        )}

        {/* Video Panel */}
        {(activeTab === "video" || activeTab === "both") && (
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #e2e8f0", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column",
          }}>
            {/* Panel header */}
            <div style={{
              padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", gap: "10px",
              background: "linear-gradient(135deg, #fff8f8, #fef2f2)",
            }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlayCircle size={15} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>বিশেষজ্ঞ ভিডিও</div>
                {video && <div style={{ fontSize: "11px", color: "#94a3b8" }}>{video.duration}</div>}
              </div>
            </div>

            {video ? (
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Video embed */}
                <div style={{
                  position: "relative",
                  paddingTop: activeTab === "video" ? "0" : "56.25%",
                  height: activeTab === "video" ? "480px" : undefined,
                  background: "#000",
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&color=white`}
                    style={{
                      position: activeTab === "video" ? "static" : "absolute",
                      top: 0, left: 0,
                      width: "100%",
                      height: activeTab === "video" ? "100%" : "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>

                {/* Video info */}
                <div style={{ padding: "18px 20px", background: "#fafafa", borderTop: "1px solid #f1f5f9", flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", lineHeight: 1.4 }}>{video.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={13} color="#ef4444" />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{video.teacher}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>বিশেষজ্ঞ শিক্ষক</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                flex: 1, minHeight: "380px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "16px",
                background: "#fafafa",
              }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PlayCircle size={32} color="#ef4444" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#374151", fontWeight: "600", marginBottom: "4px" }}>ভিডিও পাওয়া যায়নি</p>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>এই অধ্যায়ের ভিডিও এখনো যোগ করা হয়নি</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chapter navigation */}
      <div style={{
        display: "flex", gap: "12px", justifyContent: "space-between",
        background: "white", borderRadius: "16px",
        border: "1px solid #e2e8f0", padding: "16px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        {prevChapter ? (
          <Link href={`/subjects/${subjectId}/${prevChapter.id}`} style={{
            display: "flex", alignItems: "center", gap: "12px",
            textDecoration: "none", flex: 1, maxWidth: "340px",
            padding: "12px 16px", borderRadius: "12px",
            border: "1px solid #e2e8f0", background: "#fafafa",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.background = "#eff6ff" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafafa" }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ChevronLeft size={16} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px", fontWeight: "500" }}>← পূর্ববর্তী অধ্যায়</div>
              <div style={{ color: "#0f172a", fontWeight: "700", fontSize: "13px" }}>{prevChapter.title}</div>
            </div>
          </Link>
        ) : <div style={{ flex: 1 }} />}

        <div style={{ display: "flex", alignItems: "center", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>
          {currentIndex + 1} / {chapters.length}
        </div>

        {nextChapter ? (
          <Link href={`/subjects/${subjectId}/${nextChapter.id}`} style={{
            display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end",
            textDecoration: "none", flex: 1, maxWidth: "340px",
            padding: "12px 16px", borderRadius: "12px",
            border: "1px solid #bfdbfe", background: "#eff6ff",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.borderColor = "#93c5fd" }}
            onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#bfdbfe" }}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#93c5fd", marginBottom: "2px", fontWeight: "500" }}>পরবর্তী অধ্যায় →</div>
              <div style={{ color: "#1d4ed8", fontWeight: "700", fontSize: "13px" }}>{nextChapter.title}</div>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ChevronRight size={16} color="#2563eb" />
            </div>
          </Link>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  )
}