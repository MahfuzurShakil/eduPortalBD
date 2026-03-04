"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Phone, Lock, Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminLogin } = useAdminStore()
  const [phone, setPhone] = useState("")
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    if (!phone || !pin) {
      setError("ফোন নম্বর ও পিন দিন")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = adminLogin(phone, pin)
    setLoading(false)
    if (result.success) {
      toast.success("অ্যাডমিন লগইন সফল!")
      router.push("/admin/dashboard")
    } else {
      setError("ফোন নম্বর বা পিন ভুল হয়েছে")
      toast.error("লগইন ব্যর্থ হয়েছে")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG accents */}
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(37,99,235,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(99,102,241,0.06)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "42px", height: "42px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,99,235,0.4)" }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "white" }}>
              Edu<span style={{ color: "#60a5fa" }}>Portal BD</span>
            </span>
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: "99px", padding: "6px 16px", marginBottom: "16px" }}>
            <ShieldCheck size={14} color="#60a5fa" />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#60a5fa", letterSpacing: "0.05em" }}>ADMIN ACCESS</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "6px" }}>অ্যাডমিন প্যানেল</h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>শুধুমাত্র অনুমোদিত ব্যবহারকারীর জন্য</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "36px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
              <AlertCircle size={15} color="#f87171" />
              <span style={{ fontSize: "13px", color: "#f87171" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Phone */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>ফোন নম্বর</label>
              <div style={{ position: "relative" }}>
                <Phone size={16} color="#475569" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01900000000"
                  style={{
                    width: "100%", padding: "12px 14px 12px 42px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px", color: "white", fontSize: "14px",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>অ্যাডমিন পিন</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#475569" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  style={{
                    width: "100%", padding: "12px 42px 12px 42px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px", color: "white", fontSize: "14px",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
                <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center" }}>
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", background: loading ? "#1e40af" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none", borderRadius: "12px", color: "white", fontSize: "15px",
                fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
                transition: "all 0.2s", fontFamily: "inherit", marginTop: "4px",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  অ্যাডমিন লগইন করুন
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "20px", padding: "14px", background: "rgba(37,99,235,0.08)", borderRadius: "10px", border: "1px solid rgba(37,99,235,0.15)" }}>
            <p style={{ fontSize: "12px", color: "#60a5fa", marginBottom: "4px", fontWeight: "600" }}>🔑 ডেমো ক্রেডেনশিয়াল</p>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Phone: 01900000000 | PIN: admin123</p>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link href="/login" style={{ fontSize: "13px", color: "#475569", textDecoration: "none" }}>
              ← শিক্ষার্থী লগইনে ফিরে যান
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}