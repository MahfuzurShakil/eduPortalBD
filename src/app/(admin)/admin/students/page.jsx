"use client"
import { useState, useMemo } from "react"
import { Users, Search, X, Eye, Trash2, Trophy, BookOpen, User, Phone, MapPin, School, ChevronDown, Filter } from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import toast from "react-hot-toast"

export default function AdminStudentsPage() {
  const { students, deleteStudent } = useAdminStore()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = useMemo(() => {
    return students.filter(s => {
      if (search && !s.name?.toLowerCase().includes(search.toLowerCase()) && !s.phone?.includes(search) && !s.school?.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus === "onboarded" && !s.isOnboarded) return false
      if (filterStatus === "pending" && s.isOnboarded) return false
      if (filterClass && s.profile?.class !== filterClass) return false
      return true
    })
  }, [students, search, filterStatus, filterClass])

  const classes = useMemo(() => {
    const set = new Set(students.map(s => s.profile?.class).filter(Boolean))
    return [...set].sort()
  }, [students])

  const handleDelete = (id) => {
    deleteStudent(id)
    setDeleteConfirm(null)
    if (selectedStudent?.id === id) setSelectedStudent(null)
    toast.success("শিক্ষার্থী মুছে ফেলা হয়েছে")
  }

  const totalQuizzes = students.reduce((acc, s) => acc + (s.quizHistory?.length || 0), 0)
  const onboardedCount = students.filter(s => s.isOnboarded).length

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>শিক্ষার্থী ব্যবস্থাপনা</h1>
          <p style={{ fontSize: "13px", color: "#64748b" }}>মোট {students.length}জন · ফিল্টার: {filtered.length}জন</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { label: "মোট", value: students.length, color: "#2563eb", bg: "#eff6ff" },
            { label: "সক্রিয়", value: onboardedCount, color: "#22c55e", bg: "#f0fdf4" },
            { label: "কুইজ", value: totalQuizzes, color: "#d97706", bg: "#fffbeb" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: "12px", padding: "10px 16px", textAlign: "center", minWidth: "70px" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: s.color, fontWeight: "600", opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "14px", padding: "16px 20px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম, ফোন বা স্কুল খুঁজুন..." style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", background: "white", fontFamily: "inherit", cursor: "pointer" }}>
          <option value="">সব স্ট্যাটাস</option>
          <option value="onboarded">সক্রিয়</option>
          <option value="pending">অসম্পূর্ণ</option>
        </select>
        {classes.length > 0 && (
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", background: "white", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="">সব ক্লাস</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {(search || filterStatus || filterClass) && (
          <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterClass("") }} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "9px 12px", border: "1px solid #fca5a5", borderRadius: "10px", background: "#fef2f2", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            <X size={13} /> মুছুন
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedStudent ? "1fr 380px" : "1fr", gap: "20px" }}>
        {/* Table */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["#", "শিক্ষার্থী", "ফোন", "ক্লাস", "স্ট্যাটাস", "কুইজ", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: "11.5px", fontWeight: "700", color: "#64748b", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                    <Users size={40} color="#e2e8f0" style={{ display: "block", margin: "0 auto 12px" }} />
                    কোনো শিক্ষার্থী পাওয়া যায়নি
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: selectedStudent?.id === s.id ? "#eff6ff" : "white", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (selectedStudent?.id !== s.id) e.currentTarget.style.background = "#f8fafc" }}
                  onMouseLeave={e => { if (selectedStudent?.id !== s.id) e.currentTarget.style.background = "white" }}
                  onClick={() => setSelectedStudent(selectedStudent?.id === s.id ? null : s)}
                >
                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{i + 1}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `hsl(${(i * 47 + 200) % 360},65%,58%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{s.name?.[0]}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{s.name}</p>
                        <p style={{ fontSize: "11px", color: "#94a3b8" }}>{s.school || "স্কুল অজানা"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: "12.5px", color: "#64748b" }}>{s.phone}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: "12px", color: "#475569" }}>{s.profile?.class || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "99px", background: s.isOnboarded ? "#f0fdf4" : "#fef9c3", color: s.isOnboarded ? "#22c55e" : "#d97706", fontWeight: "700" }}>
                      {s.isOnboarded ? "● সক্রিয়" : "○ অসম্পূর্ণ"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                    {s.quizHistory?.length || 0}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedStudent(selectedStudent?.id === s.id ? null : s) }}
                        style={{ width: "30px", height: "30px", border: "1px solid #bfdbfe", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteConfirm(s.id) }}
                        style={{ width: "30px", height: "30px", border: "1px solid #fca5a5", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Profile Panel */}
        {selectedStudent && (
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", alignSelf: "start", position: "sticky", top: "24px" }}>
            {/* Profile Header */}
            <div style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "24px", position: "relative" }}>
              <button onClick={() => setSelectedStudent(null)} style={{ position: "absolute", top: "14px", right: "14px", width: "28px", height: "28px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={13} />
              </button>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: "2px solid rgba(255,255,255,0.3)" }}>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "white" }}>{selectedStudent.name?.[0]}</span>
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "white", marginBottom: "2px" }}>{selectedStudent.name}</h2>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>ID: {selectedStudent.id}</p>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Contact Info */}
              <div style={{ marginBottom: "18px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", marginBottom: "10px" }}>যোগাযোগ তথ্য</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { icon: Phone, label: selectedStudent.phone },
                    { icon: MapPin, label: selectedStudent.address || "ঠিকানা নেই" },
                    { icon: School, label: selectedStudent.school || "স্কুল নেই" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "28px", height: "28px", background: "#f8fafc", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={13} color="#64748b" />
                      </div>
                      <span style={{ fontSize: "12.5px", color: "#475569" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family */}
              <div style={{ marginBottom: "18px", padding: "12px", background: "#f8fafc", borderRadius: "10px" }}>
                <p style={{ fontSize: "11.5px", color: "#64748b", marginBottom: "4px" }}>পিতা: <span style={{ color: "#0f172a", fontWeight: "600" }}>{selectedStudent.fatherName || "—"}</span></p>
                <p style={{ fontSize: "11.5px", color: "#64748b" }}>মাতা: <span style={{ color: "#0f172a", fontWeight: "600" }}>{selectedStudent.motherName || "—"}</span></p>
              </div>

              {/* Education Profile */}
              {selectedStudent.isOnboarded && selectedStudent.profile ? (
                <div style={{ marginBottom: "18px" }}>
                  <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", marginBottom: "10px" }}>শিক্ষা প্রোফাইল</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {Object.entries(selectedStudent.profile).map(([key, val]) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "#f8fafc", borderRadius: "8px" }}>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>{key}</span>
                        <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#0f172a" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: "12px", background: "#fef9c3", borderRadius: "10px", marginBottom: "18px", border: "1px solid #fef08a" }}>
                  <p style={{ fontSize: "12px", color: "#d97706", fontWeight: "600" }}>⚠️ অনবোর্ডিং সম্পন্ন হয়নি</p>
                </div>
              )}

              {/* Quiz History */}
              <div>
                <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", marginBottom: "10px" }}>
                  কুইজ ইতিহাস ({selectedStudent.quizHistory?.length || 0}টি)
                </h3>
                {!selectedStudent.quizHistory?.length ? (
                  <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>এখনো কোনো কুইজ দেওয়া হয়নি</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                    {selectedStudent.quizHistory.map((q, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#f8fafc", borderRadius: "8px" }}>
                        <div>
                          <p style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a" }}>{q.subject || "কুইজ"}</p>
                          <p style={{ fontSize: "10px", color: "#94a3b8" }}>{q.date ? new Date(q.date).toLocaleDateString("bn-BD") : ""}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "14px", fontWeight: "800", color: q.score >= 70 ? "#22c55e" : q.score >= 40 ? "#d97706" : "#ef4444" }}>{q.score || 0}%</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8" }}>{q.correct || 0}/{q.total || 0} সঠিক</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "340px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "52px", height: "52px", background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>শিক্ষার্থী মুছবেন?</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>এই শিক্ষার্থীর সব তথ্য স্থায়ীভাবে মুছে যাবে।</p>
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