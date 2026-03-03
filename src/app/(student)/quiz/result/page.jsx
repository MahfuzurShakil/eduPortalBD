"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, MinusCircle, Trophy, RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import useQuizStore from "@/lib/store/quizStore"

export default function QuizResultPage() {
  const router = useRouter()
  const { result, resetQuiz, config } = useQuizStore()
  const [expandedQ, setExpandedQ] = useState(null)

  useEffect(() => {
    if (!result) router.replace("/quiz")
  }, [result])

  if (!result) return null

  const { score, total, percentage, correct, wrong, skipped, review, subjectName, subjectIcon } = result

  const grade = percentage >= 80 ? { label: "অসাধারণ!", color: "#22c55e", bg: "#f0fdf4", emoji: "🏆" }
    : percentage >= 60 ? { label: "ভালো!", color: "#f59e0b", bg: "#fffbeb", emoji: "👍" }
    : percentage >= 40 ? { label: "চেষ্টা করুন", color: "#f97316", bg: "#fff7ed", emoji: "💪" }
    : { label: "আরো পড়ুন", color: "#ef4444", bg: "#fef2f2", emoji: "📚" }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: "720px" }}>

      {/* Score hero */}
      <div style={{
        background: "linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)",
        borderRadius: "24px", padding: "40px", marginBottom: "24px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{grade.emoji}</div>
          <div style={{ color: "#bfdbfe", fontSize: "14px", marginBottom: "8px" }}>{subjectIcon} {subjectName}</div>
          <div style={{ fontSize: "72px", fontWeight: "900", color: "white", lineHeight: 1, marginBottom: "8px" }}>
            {score}<span style={{ fontSize: "32px", fontWeight: "400", color: "#93c5fd" }}>/{total}</span>
          </div>
          <div style={{ display: "inline-block", background: grade.bg, color: grade.color, fontSize: "14px", fontWeight: "700", padding: "6px 18px", borderRadius: "20px" }}>
            {percentage}% — {grade.label}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { icon: CheckCircle, label: "সঠিক", value: correct, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
          { icon: XCircle,     label: "ভুল",  value: wrong,   color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
          { icon: MinusCircle, label: "বাদ",  value: skipped, color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "16px", padding: "20px", textAlign: "center" }}>
            <s.icon size={24} color={s.color} style={{ marginBottom: "8px" }} />
            <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        <button onClick={() => { resetQuiz(); router.push("/quiz") }} style={{
          flex: 1, padding: "13px", background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: "700",
          cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          <RotateCcw size={15} /> আবার কুইজ দিন
        </button>
        <Link href="/leaderboard" style={{
          flex: 1, padding: "13px", background: "linear-gradient(135deg,#7c2d12,#f97316)",
          border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: "700",
          cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          textDecoration: "none",
        }}>
          <Trophy size={15} /> লিডারবোর্ড দেখুন
        </Link>
        <Link href="/dashboard" style={{
          padding: "13px 20px", background: "white", border: "1.5px solid #e2e8f0",
          borderRadius: "12px", color: "#374151", fontSize: "14px", fontWeight: "700",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          textDecoration: "none",
        }}>
          <Home size={15} />
        </Link>
      </div>

      {/* Per-question review */}
      <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "14px" }}>
        প্রশ্নোত্তর পর্যালোচনা
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {review.map((item, idx) => {
          const isOpen = expandedQ === idx
          const optLabels = ["ক", "খ", "গ", "ঘ"]
          return (
            <div key={idx} style={{
              background: "white", borderRadius: "14px",
              border: `1.5px solid ${item.isCorrect ? "#bbf7d0" : item.selectedIndex === null ? "#e2e8f0" : "#fecaca"}`,
              overflow: "hidden",
            }}>
              <button onClick={() => setExpandedQ(isOpen ? null : idx)} style={{
                width: "100%", padding: "16px 20px", background: "transparent", border: "none",
                display: "flex", alignItems: "center", gap: "14px",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  background: item.isCorrect ? "#dcfce7" : item.selectedIndex === null ? "#f1f5f9" : "#fee2e2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.isCorrect
                    ? <CheckCircle size={16} color="#22c55e" />
                    : item.selectedIndex === null
                    ? <MinusCircle size={16} color="#94a3b8" />
                    : <XCircle size={16} color="#ef4444" />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px", fontWeight: "600" }}>প্রশ্ন {idx + 1}</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", lineHeight: 1.4 }}>{item.question}</div>
                </div>
                {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                    {item.options.map((opt, oi) => {
                      let bg = "#f8fafc", border = "#e2e8f0", color = "#374151"
                      if (oi === item.correctIndex) { bg = "#f0fdf4"; border = "#22c55e"; color = "#15803d" }
                      else if (oi === item.selectedIndex) { bg = "#fef2f2"; border = "#ef4444"; color = "#dc2626" }
                      return (
                        <div key={oi} style={{
                          background: bg, border: `1.5px solid ${border}`,
                          borderRadius: "10px", padding: "10px 14px",
                          display: "flex", alignItems: "center", gap: "10px",
                        }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: border === "#e2e8f0" ? "#94a3b8" : color, background: bg === "#f8fafc" ? "#e2e8f0" : border === "#22c55e" ? "#dcfce7" : "#fee2e2", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {optLabels[oi]}
                          </span>
                          <span style={{ fontSize: "13px", color, fontWeight: oi === item.correctIndex ? "700" : "400" }}>{opt}</span>
                          {oi === item.correctIndex && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#22c55e", fontWeight: "700" }}>✓ সঠিক</span>}
                          {oi === item.selectedIndex && oi !== item.correctIndex && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#ef4444", fontWeight: "700" }}>✗ আপনার উত্তর</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}