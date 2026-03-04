"use client"
import { useState, useMemo } from "react"
import { Plus, Trash2, Search, Filter, HelpCircle, X, CheckCircle, ChevronDown } from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import toast from "react-hot-toast"

const SUBJECTS = ["bangla", "english", "math", "physics", "chemistry", "biology", "ict", "higher_math", "gen_science", "finance", "accounting", "arabic", "trade_theory"]

const CHAPTERS = {
  bangla: ["c1","c2","c3","c4","c5"],
  english: ["c1","c2","c3","c4","c5"],
  math: ["c1","c2","c3","c4","c5"],
  physics: ["c1","c2","c3","c4","c5"],
  chemistry: ["c1","c2","c3","c4","c5"],
  biology: ["c1","c2","c3","c4","c5"],
  ict: ["c1","c2","c3","c4","c5"],
  higher_math: ["c1","c2","c3","c4","c5"],
  gen_science: ["c1","c2","c3","c4","c5"],
  finance: ["c1","c2","c3","c4","c5"],
  accounting: ["c1","c2","c3","c4","c5"],
  arabic: ["c1","c2","c3","c4","c5"],
  trade_theory: ["c1","c2","c3","c4","c5"],
}

const emptyForm = {
  question: "", options: ["", "", "", ""], correctAnswer: 0, subject: "physics", chapter: "c1", difficulty: "medium"
}

export default function AdminQuestionsPage() {
  const { questions, addQuestion, deleteQuestion } = useAdminStore()
  const [filterSubject, setFilterSubject] = useState("")
  const [filterChapter, setFilterChapter] = useState("")
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (filterSubject && q.subject !== filterSubject) return false
      if (filterChapter && q.chapter !== filterChapter) return false
      if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [questions, filterSubject, filterChapter, search])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const handleAdd = () => {
    if (!form.question.trim()) return toast.error("প্রশ্ন লিখুন")
    if (form.options.some(o => !o.trim())) return toast.error("সব অপশন পূরণ করুন")
    addQuestion({ ...form, chapter: `${form.subject}-${form.chapter}` })
    toast.success("প্রশ্ন সফলভাবে যোগ হয়েছে!")
    setShowAddModal(false)
    setForm(emptyForm)
  }

  const handleDelete = (id) => {
    deleteQuestion(id)
    setDeleteConfirm(null)
    toast.success("প্রশ্ন মুছে ফেলা হয়েছে")
  }

  const diffColor = { easy: "#22c55e", medium: "#d97706", hard: "#ef4444" }
  const diffLabel = { easy: "সহজ", medium: "মাঝারি", hard: "কঠিন" }

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>প্রশ্ন ব্যবস্থাপনা</h1>
          <p style={{ fontSize: "13px", color: "#64748b" }}>মোট {questions.length}টি প্রশ্ন · ফিল্টার করা: {filtered.length}টি</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setForm(emptyForm) }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: "12px", color: "white", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)", fontFamily: "inherit" }}
        >
          <Plus size={16} />
          নতুন প্রশ্ন যোগ করুন
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "14px", padding: "18px 20px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="প্রশ্ন খুঁজুন..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>

        <select
          value={filterSubject}
          onChange={(e) => { setFilterSubject(e.target.value); setFilterChapter(""); setPage(1) }}
          style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white", fontFamily: "inherit", cursor: "pointer" }}
        >
          <option value="">সব বিষয়</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {filterSubject && (
          <select
            value={filterChapter}
            onChange={(e) => { setFilterChapter(e.target.value); setPage(1) }}
            style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white", fontFamily: "inherit", cursor: "pointer" }}
          >
            <option value="">সব অধ্যায়</option>
            {(CHAPTERS[filterSubject] || []).map(c => <option key={c} value={`${filterSubject}-${c}`}>{c.toUpperCase()}</option>)}
          </select>
        )}

        {(filterSubject || filterChapter || search) && (
          <button
            onClick={() => { setFilterSubject(""); setFilterChapter(""); setSearch(""); setPage(1) }}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "9px 12px", border: "1px solid #fca5a5", borderRadius: "10px", background: "#fef2f2", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
          >
            <X size={13} /> ফিল্টার মুছুন
          </button>
        )}
      </div>

      {/* Questions Table */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "প্রশ্ন", "বিষয়", "অধ্যায়", "কঠিনত্ব", "অপশন", ""].map((h, i) => (
                <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11.5px", fontWeight: "700", color: "#64748b", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                  <HelpCircle size={36} color="#e2e8f0" style={{ display: "block", margin: "0 auto 12px" }} />
                  কোনো প্রশ্ন পাওয়া যায়নি
                </td>
              </tr>
            ) : paginated.map((q, i) => (
              <tr key={q.id || i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                  {(page - 1) * PER_PAGE + i + 1}
                </td>
                <td style={{ padding: "12px 16px", maxWidth: "280px" }}>
                  <p style={{ fontSize: "13px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question}</p>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "99px", background: "#f5f3ff", color: "#7c3aed", fontWeight: "600" }}>{q.subject}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>{q.chapter}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "99px", background: `${diffColor[q.difficulty] || "#94a3b8"}18`, color: diffColor[q.difficulty] || "#94a3b8", fontWeight: "600" }}>
                    {diffLabel[q.difficulty] || q.difficulty}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {q.options?.map((opt, oi) => (
                      <span key={oi} style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "6px", background: oi === q.correctAnswer ? "#f0fdf4" : "#f8fafc", color: oi === q.correctAnswer ? "#22c55e" : "#94a3b8", border: `1px solid ${oi === q.correctAnswer ? "#bbf7d0" : "#e2e8f0"}`, fontWeight: oi === q.correctAnswer ? "700" : "400" }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => setDeleteConfirm(q.id || i)}
                    style={{ width: "32px", height: "32px", border: "1px solid #fca5a5", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>পৃষ্ঠা {page} / {totalPages}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  border: p === page ? "none" : "1px solid #e2e8f0",
                  background: p === page ? "#2563eb" : "white",
                  color: p === page ? "white" : "#64748b",
                  fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>নতুন প্রশ্ন যোগ করুন</h2>
              <button onClick={() => setShowAddModal(false)} style={{ width: "32px", height: "32px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Subject + Chapter */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>বিষয়</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value, chapter: "c1" }))} style={inputStyle}>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>অধ্যায়</label>
                  <select value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))} style={inputStyle}>
                    {(CHAPTERS[form.subject] || []).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label style={labelStyle}>কঠিনত্বের স্তর</label>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                  <option value="easy">সহজ</option>
                  <option value="medium">মাঝারি</option>
                  <option value="hard">কঠিন</option>
                </select>
              </div>

              {/* Question */}
              <div>
                <label style={labelStyle}>প্রশ্ন *</label>
                <textarea
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  placeholder="প্রশ্নটি লিখুন..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                />
              </div>

              {/* Options */}
              <div>
                <label style={labelStyle}>অপশনসমূহ (সঠিক উত্তরে ✓ চিহ্ন দিন)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {form.options.map((opt, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => setForm(f => ({ ...f, correctAnswer: i }))}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                          border: form.correctAnswer === i ? "none" : "2px solid #e2e8f0",
                          background: form.correctAnswer === i ? "#22c55e" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >
                        {form.correctAnswer === i && <CheckCircle size={14} color="white" />}
                      </button>
                      <span style={{ width: "20px", fontSize: "13px", fontWeight: "700", color: "#64748b" }}>{String.fromCharCode(65 + i)}.</span>
                      <input
                        value={opt}
                        onChange={e => setForm(f => { const opts = [...f.options]; opts[i] = e.target.value; return { ...f, options: opts } })}
                        placeholder={`অপশন ${String.fromCharCode(65 + i)}`}
                        style={{ ...inputStyle, flex: 1, border: form.correctAnswer === i ? "1px solid #86efac" : "1px solid #e2e8f0", background: form.correctAnswer === i ? "#f0fdf4" : "white" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "white", color: "#64748b", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                  বাতিল
                </button>
                <button onClick={handleAdd} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: "12px", color: "white", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)", fontFamily: "inherit" }}>
                  প্রশ্ন যোগ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "360px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "52px", height: "52px", background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>প্রশ্ন মুছবেন?</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>এই প্রশ্নটি স্থায়ীভাবে মুছে যাবে।</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "11px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "white", color: "#64748b", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>বাতিল</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "11px", border: "none", borderRadius: "10px", background: "#ef4444", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = { display: "block", fontSize: "12.5px", fontWeight: "600", color: "#475569", marginBottom: "6px" }
const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "10px",
  fontSize: "13px", color: "#0f172a", outline: "none", background: "white",
  fontFamily: "inherit", boxSizing: "border-box",
}