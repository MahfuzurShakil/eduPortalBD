"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Eye, EyeOff, LogIn } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"
import { loginUser } from "@/lib/mock/auth"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [form, setForm] = useState({ phone: "", pin: "" })
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState("")

  const validate = () => {
    const e = {}
    if (!form.phone.match(/^01[3-9]\d{8}$/)) e.phone = "সঠিক মোবাইল নম্বর দিন"
    if (!form.pin) e.pin = "পিন দিন"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const result = await loginUser(form.phone, form.pin)
      setUser(result.user)
      toast.success(`স্বাগতম, ${result.user.name}!`)
      if (result.user.role === "admin") router.push("/admin/dashboard")
      else if (!result.user.isOnboarded) router.push("/setup")
      else router.push("/dashboard")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = (name) => ({
    width: "100%",
    padding: "13px 16px",
    paddingLeft: "44px",
    background: focused === name ? "#f0f6ff" : "#f8fafc",
    border: errors[name]
      ? "1.5px solid #ef4444"
      : focused === name
      ? "1.5px solid #2563eb"
      : "1.5px solid #e2e8f0",
    borderRadius: "12px",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
    fontFamily: "inherit",
  })

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "52px", height: "52px", background: "#eff6ff",
          borderRadius: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 16px",
          border: "1px solid #dbeafe"
        }}>
          <LogIn size={22} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
          লগইন করুন
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>
      </div>

      {/* Demo hint */}
      {/* <div style={{
        background: "#eff6ff", border: "1px solid #bfdbfe",
        borderRadius: "12px", padding: "12px 16px", marginBottom: "24px",
      }}>
        <p style={{ color: "#1d4ed8", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
          🔑 ডেমো অ্যাকাউন্ট
        </p>
        <p style={{ color: "#3b82f6", fontSize: "12px", lineHeight: "1.8", margin: 0 }}>
          শিক্ষার্থী: <strong>01711000002</strong> | পিন: <strong>123456</strong><br />
          অ্যাডমিন: <strong>01900000000</strong> | পিন: <strong>admin123</strong>
        </p>
      </div> */}

      <form onSubmit={handleSubmit}>
        {/* Phone */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px" }}>
            মোবাইল নম্বর
          </label>
          <div style={{ position: "relative" }}>
            <Phone size={16} color={focused === "phone" ? "#2563eb" : "#94a3b8"}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused("")}
              style={fieldStyle("phone")}
            />
          </div>
          {errors.phone && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px" }}>{errors.phone}</p>}
        </div>

        {/* PIN */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>পিন</label>
            <Link href="/forgot-pin" style={{ color: "#2563eb", fontSize: "12px", textDecoration: "none", fontWeight: "500" }}>
              পিন ভুলে গেছেন?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="আপনার পিন দিন"
              value={form.pin}
              onChange={e => setForm(p => ({ ...p, pin: e.target.value }))}
              onFocus={() => setFocused("pin")}
              onBlur={() => setFocused("")}
              style={{ ...fieldStyle("pin"), paddingLeft: "16px", paddingRight: "44px" }}
            />
            <button type="button" onClick={() => setShowPin(!showPin)} style={{
              position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#94a3b8", display: "flex", alignItems: "center", padding: 0
            }}>
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.pin && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px" }}>{errors.pin}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "14px", marginTop: "20px",
          background: loading ? "#93c5fd" : "#1e40af",
          border: "none", borderRadius: "12px", color: "white",
          fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "background 0.2s", fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(37,99,235,0.35)"
        }}>
          {loading
            ? <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            : <><LogIn size={16} /> লগইন করুন</>
          }
        </button>
      </form>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "13px", marginTop: "24px" }}>
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/register" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
          নিবন্ধন করুন
        </Link>
      </p>
    </div>
  )
}