"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen, ChevronRight, PlayCircle, FileText,
  Trophy, Target, Clock, TrendingUp, Zap, ArrowRight, Star
} from "lucide-react"
import useAuthStore from "@/lib/store/authStore"

// ─── Subject Card — clean, uniform, Coursera-style ───────────────────────────
function SubjectCard({ subject, chapterCount }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/subjects/${subject.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "white", borderRadius: "14px",
          border: `1px solid ${hovered ? "#bfdbfe" : "#e8f0fe"}`,
          overflow: "hidden", cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: hovered
            ? "0 8px 24px rgba(37,99,235,0.12)"
            : "0 1px 4px rgba(0,0,0,0.05)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {/* Top accent bar — single consistent blue */}
        <div style={{ height: "4px", background: "#2563eb", opacity: hovered ? 1 : 0.7, transition: "opacity 0.2s" }} />

        <div style={{ padding: "16px 18px" }}>
          {/* Icon + name row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#eff6ff", border: "1px solid #dbeafe",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0,
            }}>
              {subject.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "14px", fontWeight: "700", color: "#0f172a",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                letterSpacing: "-0.2px",
              }}>
                {subject.name}
              </div>
              <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
                {chapterCount} টি অধ্যায়
              </div>
            </div>
          </div>

          {/* Tags */}
          {/* <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{
              background: "#f0fdf4", color: "#16a34a", fontSize: "10.5px",
              fontWeight: "600", padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px",
            }}>
              <FileText size={9} /> PDF
            </span>
            <span style={{
              background: "#fff7ed", color: "#ea580c", fontSize: "10.5px",
              fontWeight: "600", padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px",
            }}>
              <PlayCircle size={9} /> ভিডিও
            </span>
            <span style={{
              background: "#f5f3ff", color: "#7c3aed", fontSize: "10.5px",
              fontWeight: "600", padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px",
            }}>
              <Target size={9} /> কুইজ
            </span>
          </div> */}

          {/* CTA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "12px", borderTop: "1px solid #f1f5f9",
          }}>
            <span style={{ fontSize: "12.5px", fontWeight: "600", color: hovered ? "#1d4ed8" : "#2563eb", transition: "color 0.15s" }}>
              পড়া শুরু করুন
            </span>
            <div style={{
              width: "26px", height: "26px", borderRadius: "7px",
              background: hovered ? "#2563eb" : "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              <ArrowRight size={13} color={hovered ? "white" : "#2563eb"} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div style={{
      background: "white", borderRadius: "14px", padding: "18px 20px",
      border: "1px solid #e8f0fe",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px", background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px",
      }}>
        <Icon size={17} color={iconColor} />
      </div>
      <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{sub}</div>}
    </div>
  )
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [chaptersData, setChaptersData] = useState({})
  const [greeting, setGreeting] = useState("শুভেচ্ছা")

  useEffect(() => {
    if (!isAuthenticated || !user) { router.replace("/login"); return }
    // Greeting based on time
    const h = new Date().getHours()
    if (h < 12) setGreeting("সুপ্রভাত")
    else if (h < 17) setGreeting("শুভ দুপুর")
    else setGreeting("শুভ সন্ধ্যা")
    // Load chapters
    import("@/data/chapters.json").then(m => setChaptersData(m.default || m))
  }, [isAuthenticated, user])

  if (!user) return null

  const subjects = user?.profile?.subjects || []
  const quizHistory = user?.quizHistory || []
  const totalQuizzes = quizHistory.length
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((a, q) => a + q.score, 0) / totalQuizzes)
    : 0
  const firstName = user.name?.split(" ")[0] || "শিক্ষার্থী"
  const profile = user.profile || {}

  const profileSummary = [
    profile.educationType === "general" ? "সাধারণ শিক্ষা" : profile.educationType === "madrasa" ? "মাদ্রাসা" : "কারিগরি",
    profile.className,
    profile.group === "science" ? "বিজ্ঞান" : profile.group === "commerce" ? "ব্যবসায়" : profile.group === "arts" ? "মানবিক" : null,
  ].filter(Boolean).join(" · ")

  const quickActions = [
    { href: "/quiz", icon: "🎯", label: "কুইজ দিন", desc: "MCQ প্র্যাকটিস", color: "#eff6ff", border: "#dbeafe", text: "#1d4ed8" },
    { href: "/leaderboard", icon: "🏆", label: "র‌্যাংকিং", desc: "লিডারবোর্ড দেখুন", color: "#fefce8", border: "#fde68a", text: "#92400e" },
    { href: "/subjects", icon: "📖", label: "সব বিষয়", desc: "অধ্যায় তালিকা", color: "#f0fdf4", border: "#bbf7d0", text: "#14532d" },
  ]

  return (
    <>
      <style>{`
        .dash-grid-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .dash-subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
        }
        .dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .dash-hero-text { font-size: 20px; }
        .dash-hero-sub { font-size: 13px; }

        @media (max-width: 1024px) {
          .dash-grid-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .dash-grid-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dash-subjects-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dash-quick-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .dash-hero-text { font-size: 17px !important; }
        }
        @media (max-width: 480px) {
          .dash-grid-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .dash-subjects-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .dash-quick-grid { grid-template-columns: 1fr; gap: 8px; }
          .dash-hero-text { font-size: 16px !important; }
          .dash-hero-sub { font-size: 12px !important; }
        }
      `}</style>

      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "24px",
        maxWidth: "1700px",
      }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
          borderRadius: "18px", padding: "28px 32px", marginBottom: "24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "20px", position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{
            position: "absolute", right: "-40px", top: "-40px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: "80px", bottom: "-60px",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)", pointerEvents: "none",
          }} />

          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div style={{ fontSize: "12px", color: "#93c5fd", fontWeight: "600", marginBottom: "6px", letterSpacing: "0.05em" }}>
              {greeting} 👋
            </div>
            <h2 className="dash-hero-text" style={{
              color: "white", fontWeight: "800", marginBottom: "6px",
              letterSpacing: "-0.4px", lineHeight: "1.25",
            }}>
              {firstName}, আজকে কী পড়বেন?
            </h2>
            <p className="dash-hero-sub" style={{ color: "#bfdbfe", lineHeight: "1.5", marginBottom: "16px" }}>
              {profileSummary || "আপনার শিক্ষা যাত্রা শুরু করুন"}
            </p>
            <Link href="/subjects" style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "white", color: "#1d4ed8",
              padding: "9px 18px", borderRadius: "10px",
              fontSize: "13px", fontWeight: "700", textDecoration: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              transition: "all 0.15s",
            }}>
              বিষয় দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right badge */}
          <div style={{
            flexShrink: 0, background: "rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "16px 20px", textAlign: "center",
            backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)",
          }}
            className="dash-hero-badge"
          >
            <div style={{ fontSize: "28px", fontWeight: "800", color: "white", lineHeight: 1 }}>
              {subjects.length}
            </div>
            <div style={{ fontSize: "11px", color: "#93c5fd", marginTop: "4px", fontWeight: "500" }}>টি বিষয়</div>
          </div>

          <style>{`
            @media (max-width: 480px) { .dash-hero-badge { display: none; } }
          `}</style>
        </div>

        {/* ── Stats Row ── */}
        <div className="dash-grid-stats" style={{ marginBottom: "28px" }}>
          <StatCard icon={BookOpen} iconBg="#eff6ff" iconColor="#2563eb"
            label="মোট বিষয়" value={subjects.length} sub="সক্রিয় সিলেবাস" />
          <StatCard icon={Trophy} iconBg="#fefce8" iconColor="#d97706"
            label="কুইজ দেওয়া হয়েছে" value={totalQuizzes} sub="মোট অংশগ্রহণ" />
          <StatCard icon={TrendingUp} iconBg="#f0fdf4" iconColor="#16a34a"
            label="গড় স্কোর" value={avgScore > 0 ? `${avgScore}%` : "—"} sub="কুইজে পারফরমেন্স" />
          <StatCard icon={Zap} iconBg="#f5f3ff" iconColor="#7c3aed"
            label="স্ট্রিক" value="৫ দিন" sub="ধারাবাহিক পড়াশোনা" />
        </div>

        {/* ── Quick Actions ── */}
        <div className="dash-quick-grid" style={{ marginBottom: "28px" }}>
          {quickActions.map((a, i) => (
            <Link key={i} href={a.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: a.color, border: `1px solid ${a.border}`,
                borderRadius: "14px", padding: "16px 18px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: "700", color: a.text }}>{a.label}</div>
                  <div style={{ fontSize: "11px", color: a.text, opacity: 0.7, marginTop: "1px" }}>{a.desc}</div>
                </div>
                <ChevronRight size={14} color={a.text} style={{ marginLeft: "auto", opacity: 0.5, flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Subjects ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
              আমার বিষয়সমূহ
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              {subjects.length} টি বিষয় নির্বাচিত হয়েছে
            </p>
          </div>
          <Link href="/subjects" style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: "600",
          }}>
            সব দেখুন <ChevronRight size={13} />
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "16px", padding: "48px", textAlign: "center",
            border: "1px solid #e8f0fe",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📚</div>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              কোনো বিষয় পাওয়া যায়নি। প্রোফাইল সেটআপ করুন।
            </p>
            <Link href="/setup" style={{
              display: "inline-block", background: "#2563eb", color: "white",
              padding: "10px 24px", borderRadius: "10px", textDecoration: "none",
              fontSize: "13px", fontWeight: "700",
            }}>
              সেটআপ করুন →
            </Link>
          </div>
        ) : (
          <div className="dash-subjects-grid">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                chapterCount={(chaptersData[subject.id] || []).length || 5}
              />
            ))}
          </div>
        )}

        {/* ── Recent Quiz Activity ── */}
        {quizHistory.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
                সাম্প্রতিক কুইজ ফলাফল
              </h3>
              <Link href="/quiz" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                কুইজ দিন <ChevronRight size={13} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {quizHistory.slice(-4).reverse().map((q, i) => {
                const sub = subjects.find(s => s.id === q.subject)
                const scoreColor = q.score >= 80 ? "#16a34a" : q.score >= 60 ? "#d97706" : "#dc2626"
                const scoreBg = q.score >= 80 ? "#f0fdf4" : q.score >= 60 ? "#fefce8" : "#fef2f2"
                return (
                  <div key={i} style={{
                    background: "white", borderRadius: "12px", padding: "14px 18px",
                    border: "1px solid #e8f0fe",
                    display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "9px",
                      background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", flexShrink: 0,
                    }}>
                      {sub?.icon || "📝"}
                    </div>
                    <div style={{ flex: 1, minWidth: "100px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                        {sub?.name || q.subject}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
                        {q.correct}/{q.total} সঠিক
                      </div>
                    </div>
                    <div style={{
                      background: scoreBg, color: scoreColor,
                      fontSize: "14px", fontWeight: "800", padding: "5px 12px",
                      borderRadius: "8px", flexShrink: 0,
                    }}>
                      {q.score}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Bottom padding ── */}
        <div style={{ height: "24px" }} />
      </div>
    </>
  )
}