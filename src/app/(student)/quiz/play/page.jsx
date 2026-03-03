"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Clock, AlertTriangle, X, CheckCircle } from "lucide-react"
import useQuizStore from "@/lib/store/quizStore"
import useAuthStore from "@/lib/store/authStore"

export default function QuizPlayPage() {
  const router = useRouter()
  const { user, updateQuizHistory } = useAuthStore()
  const {
    config, questions, currentIndex, answers, timeLeft,
    setAnswer, setCurrentIndex, setTimeLeft, finishQuiz, setResult, resetQuiz,
  } = useQuizStore()

  const [showExitModal, setShowExitModal] = useState(false)
  const [answered, setAnswered] = useState(null)  // null | index — for flash feedback
  const timerRef = useRef(null)
  const totalTime = config ? config.timePerQuestion : 60

  // Guard: redirect if no quiz loaded
  useEffect(() => {
    if (!config || questions.length === 0) {
      router.replace("/quiz")
    }
  }, [config, questions])

  // Timer logic per question
  useEffect(() => {
    if (!config || questions.length === 0) return
    setTimeLeft(totalTime)
    setAnswered(null)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentIndex])

  // Block navigation (screen freeze)
  useEffect(() => {
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = "" }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const handleTimeUp = () => {
    // Auto-advance without answer
    goNext()
  }

  const handleAnswer = (optionIdx) => {
    if (answered !== null) return // already answered
    clearInterval(timerRef.current)
    const q = questions[currentIndex]
    setAnswer(q.id, optionIdx)
    setAnswered(optionIdx)

    // Short delay before auto-advance
    setTimeout(() => goNext(), 900)
  }

  const goNext = () => {
    if (currentIndex >= questions.length - 1) {
      submitQuiz()
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const submitQuiz = () => {
    clearInterval(timerRef.current)
    finishQuiz()

    // Calculate score
    let correct = 0
    const review = questions.map(q => {
      const selected = answers[q.id] ?? null
      const isCorrect = selected === q.correct
      if (isCorrect) correct++
      return { question: q.question, options: q.options, correctIndex: q.correct, selectedIndex: selected, isCorrect }
    })

    const score = correct
    const total = questions.length
    const percentage = Math.round((correct / total) * 100)

    const result = { score, total, percentage, correct, wrong: total - correct, skipped: total - Object.keys(answers).length, review, subjectName: config?.subjectName, subjectIcon: config?.subjectIcon }
    setResult(result)

    // Save to user history
    updateQuizHistory({ date: new Date().toISOString(), subjectId: config?.subjectId, score, total, percentage })

    router.push("/quiz/result")
  }

  const handleExitConfirm = () => {
    clearInterval(timerRef.current)
    resetQuiz()
    router.push("/quiz")
  }

  if (!config || questions.length === 0) return null

  const q = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100
  const timerPercent = (timeLeft / totalTime) * 100
  const timerColor = timeLeft <= 10 ? "#ef4444" : timeLeft <= 20 ? "#f59e0b" : "#22c55e"

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      userSelect: "none",
    }}>
      {/* Top bar */}
      <div style={{
        background: "white", borderBottom: "1px solid #e2e8f0",
        padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center", gap: "16px",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <button onClick={() => setShowExitModal(true)} style={{
          background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "8px",
          padding: "7px 14px", cursor: "pointer", color: "#dc2626",
          fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <X size={13} /> বের হন
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{config.subjectIcon} {config.subjectName}</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{currentIndex + 1} / {questions.length}</span>
          </div>
          <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#2563eb,#7c3aed)", borderRadius: "3px", transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: timeLeft <= 10 ? "#fef2f2" : "#f0fdf4",
          border: `1.5px solid ${timerColor}`,
          borderRadius: "10px", padding: "8px 14px",
        }}>
          <Clock size={14} color={timerColor} />
          <span style={{ fontSize: "16px", fontWeight: "800", color: timerColor, minWidth: "28px", textAlign: "center" }}>
            {timeLeft}
          </span>
          <div style={{ width: "40px", height: "5px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${timerPercent}%`, background: timerColor, transition: "width 1s linear" }} />
          </div>
        </div>
      </div>

      {/* Main question area */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Question card */}
        <div style={{
          background: "white", borderRadius: "20px",
          padding: "32px 36px", marginBottom: "24px",
          border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "#eff6ff", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#2563eb" }}>{currentIndex + 1}</span>
            </div>
            <p style={{ fontSize: "17px", fontWeight: "600", color: "#0f172a", lineHeight: 1.6, flex: 1, margin: 0 }}>
              {q.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, idx) => {
            let bg = "white", border = "#e2e8f0", color = "#0f172a", shadow = "none"

            if (answered !== null) {
              if (idx === q.correct) {
                bg = "#f0fdf4"; border = "#22c55e"; color = "#15803d"
              } else if (idx === answered && answered !== q.correct) {
                bg = "#fef2f2"; border = "#ef4444"; color = "#dc2626"
              }
            } else if (answers[q.id] === idx) {
              bg = "#eff6ff"; border = "#2563eb"; color = "#1e40af"
            }

            const optLabels = ["ক", "খ", "গ", "ঘ"]

            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered !== null} style={{
                background: bg, border: `2px solid ${border}`,
                borderRadius: "14px", padding: "16px 20px",
                display: "flex", alignItems: "center", gap: "14px",
                cursor: answered !== null ? "default" : "pointer",
                textAlign: "left", fontFamily: "inherit",
                transition: "all 0.15s",
                boxShadow: shadow,
              }}
                onMouseEnter={e => { if (answered === null) e.currentTarget.style.borderColor = "#93c5fd" }}
                onMouseLeave={e => { if (answered === null) e.currentTarget.style.borderColor = "#e2e8f0" }}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                  background: border === "#e2e8f0" ? "#f8fafc" : bg === "white" ? "#f8fafc" : border === "#22c55e" ? "#dcfce7" : border === "#ef4444" ? "#fee2e2" : "#dbeafe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1.5px solid ${border}`,
                }}>
                  {answered !== null && idx === q.correct ? (
                    <CheckCircle size={16} color="#22c55e" />
                  ) : answered !== null && idx === answered && answered !== q.correct ? (
                    <X size={16} color="#ef4444" />
                  ) : (
                    <span style={{ fontSize: "13px", fontWeight: "700", color }}>{optLabels[idx]}</span>
                  )}
                </div>
                <span style={{ fontSize: "15px", fontWeight: answered !== null && idx === q.correct ? "700" : "500", color }}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "white", borderRadius: "20px", padding: "32px 36px",
            maxWidth: "380px", width: "90%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>কুইজ ছেড়ে যাবেন?</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
              এখন বের হলে আপনার অগ্রগতি হারিয়ে যাবে। এই কুইজের ফলাফল সংরক্ষিত হবে না।
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowExitModal(false)} style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                background: "#f8fafc", border: "1.5px solid #e2e8f0",
                fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", color: "#374151",
              }}>
                চালিয়ে যান
              </button>
              <button onClick={handleExitConfirm} style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                background: "#ef4444", border: "none",
                fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", color: "white",
              }}>
                বের হই
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}