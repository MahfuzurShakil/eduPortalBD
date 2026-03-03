"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Shuffle, Clock, ChevronRight, Target, Zap } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import useQuizStore from "@/lib/store/quizStore"
import { pickQuestions, getAvailableCount } from "@/lib/utils/questionPicker"
import chaptersData from "@/data/chapters.json"

const TIME_OPTIONS = [
  { label: "৩০ সেকেন্ড", value: 30 },
  { label: "৪৫ সেকেন্ড", value: 45 },
  { label: "১ মিনিট", value: 60 },
  { label: "২ মিনিট", value: 120 },
]

export default function QuizPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { setConfig, setQuestions } = useQuizStore()

  const subjects = user?.profile?.subjects || []
  const [mode, setMode] = useState(null)            // "chapter" | "custom"
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedChapters, setSelectedChapters] = useState([])
  const [questionCount, setQuestionCount] = useState(10)
  const [timePerQ, setTimePerQ] = useState(60)
  const [step, setStep] = useState("select-subject") // "select-subject" | "config"

  const subject = subjects.find(s => s.id === selectedSubject)
  const chapters = selectedSubject ? (chaptersData[selectedSubject] || []) : []
  const available = selectedSubject ? getAvailableCount({ subjectId: selectedSubject, chapterIds: selectedChapters }) : 0
  const maxQ = Math.min(available, 20)

  const toggleChapter = (id) => {
    setSelectedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleStart = () => {
    const questions = pickQuestions({
      subjectId: selectedSubject,
      chapterIds: selectedChapters,
      count: questionCount,
    })
    if (questions.length === 0) return

    setConfig({
      subjectId: selectedSubject,
      subjectName: subject?.name,
      subjectIcon: subject?.icon,
      chapters: selectedChapters,
      questionCount: questions.length,
      timePerQuestion: timePerQ,
    })
    setQuestions(questions)
    router.push("/quiz/play")
  }

  // ─── Subject Selection ───────────────────────────────
  if (step === "select-subject") return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>কুইজ দিন</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>বিষয় বেছে নিন এবং কুইজ শুরু করুন</p>
      </div>

      {/* Mode cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {[
          { key: "chapter", icon: "📖", title: "অধ্যায়ভিত্তিক কুইজ", desc: "নির্দিষ্ট অধ্যায় থেকে প্রশ্ন", color: "#eff6ff", border: "#bfdbfe", accent: "#2563eb" },
          { key: "custom", icon: "🎯", title: "কাস্টম কুইজ", desc: "একাধিক অধ্যায় মিলিয়ে প্রশ্ন", color: "#faf5ff", border: "#e9d5ff", accent: "#7c3aed" },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            background: mode === m.key ? m.color : "white",
            border: `2px solid ${mode === m.key ? m.accent : "#e2e8f0"}`,
            borderRadius: "16px", padding: "24px 20px", cursor: "pointer",
            textAlign: "left", fontFamily: "inherit",
            transition: "all 0.15s",
            boxShadow: mode === m.key ? `0 0 0 3px ${m.border}` : "none",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{m.icon}</div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{m.title}</div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>{m.desc}</div>
            {mode === m.key && (
              <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "4px", color: m.accent, fontSize: "12px", fontWeight: "700" }}>
                ✓ নির্বাচিত
              </div>
            )}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "14px" }}>বিষয় বেছে নিন</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
        {subjects.map((sub, idx) => {
          const colors = ["#2563eb","#16a34a","#ea580c","#7c3aed","#0891b2","#db2777"]
          const color = colors[idx % colors.length]
          const isSelected = selectedSubject === sub.id
          return (
            <button key={sub.id} onClick={() => { setSelectedSubject(sub.id); setSelectedChapters([]) }} style={{
              background: isSelected ? color : "white",
              border: `2px solid ${isSelected ? color : "#e2e8f0"}`,
              borderRadius: "14px", padding: "16px",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              transition: "all 0.15s",
              boxShadow: isSelected ? `0 4px 16px ${color}40` : "none",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{sub.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: isSelected ? "white" : "#0f172a" }}>{sub.name}</div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => setStep("config")}
        disabled={!selectedSubject || !mode}
        style={{
          background: (!selectedSubject || !mode) ? "#e2e8f0" : "linear-gradient(135deg,#1e3a8a,#2563eb)",
          color: (!selectedSubject || !mode) ? "#94a3b8" : "white",
          border: "none", borderRadius: "14px", padding: "14px 32px",
          fontSize: "15px", fontWeight: "700", cursor: (!selectedSubject || !mode) ? "not-allowed" : "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px",
          boxShadow: (!selectedSubject || !mode) ? "none" : "0 4px 16px rgba(37,99,235,0.35)",
        }}
      >
        পরবর্তী ধাপ <ChevronRight size={16} />
      </button>
    </div>
  )

  // ─── Config Screen ───────────────────────────────────
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: "700px" }}>
      <button onClick={() => setStep("select-subject")} style={{
        background: "none", border: "none", cursor: "pointer", color: "#64748b",
        fontSize: "13px", fontFamily: "inherit", marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "6px", padding: 0,
      }}>
        ← ফিরে যান
      </button>

      {/* Subject header */}
      <div style={{
        background: "linear-gradient(135deg,#1e3a8a,#2563eb)", borderRadius: "20px",
        padding: "24px 28px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px",
      }}>
        <div style={{ fontSize: "40px" }}>{subject?.icon}</div>
        <div>
          <div style={{ color: "#93c5fd", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>
            {mode === "chapter" ? "অধ্যায়ভিত্তিক কুইজ" : "কাস্টম কুইজ"}
          </div>
          <div style={{ color: "white", fontSize: "20px", fontWeight: "800" }}>{subject?.name}</div>
        </div>
      </div>

      {/* Chapter selection */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>অধ্যায় নির্বাচন</h3>
          <button onClick={() => setSelectedChapters(selectedChapters.length === chapters.length ? [] : chapters.map(c => c.id))} style={{
            background: "#eff6ff", border: "none", borderRadius: "8px", padding: "5px 12px",
            fontSize: "12px", color: "#2563eb", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
          }}>
            {selectedChapters.length === chapters.length ? "সব বাতিল" : "সব নির্বাচন"}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {chapters.map(ch => {
            const sel = selectedChapters.includes(ch.id)
            return (
              <button key={ch.id} onClick={() => toggleChapter(ch.id)} style={{
                background: sel ? "#eff6ff" : "#f8fafc",
                border: `1.5px solid ${sel ? "#2563eb" : "#e2e8f0"}`,
                borderRadius: "10px", padding: "11px 14px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                transition: "all 0.12s",
              }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "5px",
                  background: sel ? "#2563eb" : "white",
                  border: `2px solid ${sel ? "#2563eb" : "#cbd5e1"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {sel && <span style={{ color: "white", fontSize: "12px", fontWeight: "800" }}>✓</span>}
                </div>
                <div style={{ fontSize: "14px", fontWeight: sel ? "600" : "400", color: sel ? "#1e40af" : "#374151" }}>
                  অধ্যায় {ch.chapterNo}: {ch.title}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Question count + timer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Question count */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px 24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>প্রশ্নের সংখ্যা</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>সর্বোচ্চ {maxQ} টি</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[5, 10, 15, 20].filter(n => n <= maxQ || n === 5).map(n => (
              <button key={n} onClick={() => setQuestionCount(Math.min(n, maxQ))} style={{
                padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
                background: questionCount === n ? "#2563eb" : "#f8fafc",
                color: questionCount === n ? "white" : "#374151",
                border: `1.5px solid ${questionCount === n ? "#2563eb" : "#e2e8f0"}`,
                fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
              }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Time per question */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px 24px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>প্রশ্নপ্রতি সময়</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>কতটুকু সময় পাবেন</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {TIME_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setTimePerQ(opt.value)} style={{
                padding: "7px 12px", borderRadius: "8px", cursor: "pointer",
                background: timePerQ === opt.value ? "#eff6ff" : "transparent",
                color: timePerQ === opt.value ? "#1e40af" : "#374151",
                border: `1.5px solid ${timePerQ === opt.value ? "#2563eb" : "transparent"}`,
                fontSize: "13px", fontWeight: timePerQ === opt.value ? "700" : "400",
                fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <Clock size={12} color={timePerQ === opt.value ? "#2563eb" : "#94a3b8"} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary + Start */}
      <div style={{
        background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius: "16px",
        padding: "20px 24px", marginBottom: "20px", border: "1px solid #bbf7d0",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { label: "প্রশ্ন", value: questionCount },
            { label: "মোট সময়", value: `${Math.floor((questionCount * timePerQ) / 60)} মি ${(questionCount * timePerQ) % 60} সে` },
            { label: "অধ্যায়", value: selectedChapters.length || chapters.length },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#15803d" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={handleStart} disabled={questionCount === 0} style={{
          background: "linear-gradient(135deg,#15803d,#16a34a)", color: "white",
          border: "none", borderRadius: "12px", padding: "13px 28px",
          fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: "8px",
          boxShadow: "0 4px 16px rgba(21,128,61,0.35)",
        }}>
          <Zap size={16} fill="white" /> কুইজ শুরু করুন
        </button>
      </div>
    </div>
  )
}