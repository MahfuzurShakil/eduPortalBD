"use client"
import { useState, useMemo } from "react"
import { Plus, Trash2, Play, Video, X, ExternalLink, Search, Eye } from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import toast from "react-hot-toast"

const SUBJECTS = ["bangla", "english", "math", "physics", "chemistry", "biology", "ict", "higher_math", "gen_science", "finance", "accounting", "arabic", "trade_theory"]
const CHAPTER_NUMS = ["c1", "c2", "c3", "c4", "c5"]

const emptyForm = { subject: "physics", chapter: "c1", youtubeId: "", title: "", teacher: "", duration: "" }

function extractYouTubeId(input) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  for (const p of patterns) {
    const m = input.match(p)
    if (m) return m[1]
  }
  return input
}

export default function AdminVideosPage() {
  const { videos, addVideo, deleteVideo } = useAdminStore()
  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [previewId, setPreviewId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const videoList = useMemo(() => {
    return Object.entries(videos)
      .filter(([key, v]) => {
        if (filterSubject && !key.startsWith(filterSubject)) return false
        if (search && !(v.title || "").toLowerCase().includes(search.toLowerCase()) && !(v.teacher || "").toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
  }, [videos, filterSubject, search])

  const handleAdd = () => {
    if (!form.youtubeId.trim()) return toast.error("YouTube লিংক বা ID দিন")
    if (!form.title.trim()) return toast.error("ভিডিওর শিরোনাম দিন")
    const chapterKey = `${form.subject}-${form.chapter}`
    const extractedId = extractYouTubeId(form.youtubeId)
    addVideo(chapterKey, { youtubeId: extractedId, title: form.title, teacher: form.teacher, duration: form.duration })
    toast.success("ভিডিও সফলভাবে যোগ হয়েছে!")
    setShowAddModal(false)
    setForm(emptyForm)
  }

  const handleDelete = (key) => {
    deleteVideo(key)
    setDeleteConfirm(null)
    toast.success("ভিডিও মুছে ফেলা হয়েছে")
  }

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>ভিডিও ব্যবস্থাপনা</h1>
          <p style={{ fontSize: "13px", color: "#64748b" }}>মোট {Object.keys(videos).length}টি ভিডিও · ফিল্টার করা: {videoList.length}টি</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setForm(emptyForm) }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px", background: "linear-gradient(135deg, #0891b2, #0e7490)", border: "none", borderRadius: "12px", color: "white", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 14px rgba(8,145,178,0.35)", fontFamily: "inherit" }}
        >
          <Plus size={16} />
          নতুন ভিডিও যোগ করুন
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: "14px", padding: "16px 20px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="শিরোনাম বা শিক্ষক খুঁজুন..." style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", background: "white", fontFamily: "inherit", cursor: "pointer" }}>
          <option value="">সব বিষয়</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(filterSubject || search) && (
          <button onClick={() => { setFilterSubject(""); setSearch("") }} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "9px 12px", border: "1px solid #fca5a5", borderRadius: "10px", background: "#fef2f2", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            <X size={13} /> ফিল্টার মুছুন
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {previewId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "840px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>ভিডিও প্রিভিউ</span>
              <button onClick={() => setPreviewId(null)} style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${previewId}?autoplay=1`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
        {videoList.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <Video size={48} color="#e2e8f0" style={{ display: "block", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "15px", fontWeight: "600" }}>কোনো ভিডিও পাওয়া যায়নি</p>
          </div>
        ) : videoList.map(([key, v]) => (
          <div key={key} style={{ background: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)" }}>
            {/* Thumbnail */}
            <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f172a", overflow: "hidden", cursor: "pointer" }} onClick={() => setPreviewId(v.youtubeId)}>
              <img
                src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                alt={v.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                onError={e => { e.target.style.display = "none" }}
              />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                  <Play size={18} color="#0f172a" style={{ marginLeft: "2px" }} />
                </div>
              </div>
              {v.duration && (
                <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.75)", color: "white", fontSize: "11px", padding: "2px 7px", borderRadius: "6px", fontWeight: "600" }}>{v.duration}</span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                <h3 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a", lineHeight: "1.4", flex: 1 }}>{v.title}</h3>
              </div>
              {v.teacher && <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>👨‍🏫 {v.teacher}</p>}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "99px", background: "#ecfeff", color: "#0891b2", fontWeight: "600" }}>{key}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setPreviewId(v.youtubeId)} style={{ width: "30px", height: "30px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Eye size={13} />
                  </button>
                  <a href={`https://youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ width: "30px", height: "30px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => setDeleteConfirm(key)} style={{ width: "30px", height: "30px", border: "1px solid #fca5a5", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>নতুন ভিডিও যোগ করুন</h2>
              <button onClick={() => setShowAddModal(false)} style={{ width: "32px", height: "32px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>বিষয়</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inputStyle}>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>অধ্যায়</label>
                  <select value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))} style={inputStyle}>
                    {CHAPTER_NUMS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>YouTube URL বা Video ID *</label>
                <input value={form.youtubeId} onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))} placeholder="https://youtube.com/watch?v=... বা dQw4w9WgXcQ" style={inputStyle} />
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>সম্পূর্ণ লিংক বা শুধু Video ID উভয়ই চলবে</p>
              </div>

              {/* Live Preview */}
              {form.youtubeId && (
                <div style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9", background: "#f8fafc" }}>
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(form.youtubeId)}/mqdefault.jpg`}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>ভিডিওর শিরোনাম *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="ভিডিওর শিরোনাম লিখুন" style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>শিক্ষকের নাম</label>
                  <input value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} placeholder="শিক্ষকের নাম" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>সময়কাল</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="যেমন: 18:30" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "white", color: "#64748b", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>বাতিল</button>
                <button onClick={handleAdd} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#0891b2,#0e7490)", border: "none", borderRadius: "12px", color: "white", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(8,145,178,0.35)", fontFamily: "inherit" }}>ভিডিও যোগ করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "340px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "52px", height: "52px", background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>ভিডিও মুছবেন?</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>"{deleteConfirm}" অধ্যায়ের ভিডিও মুছে যাবে।</p>
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
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white", fontFamily: "inherit", boxSizing: "border-box" }