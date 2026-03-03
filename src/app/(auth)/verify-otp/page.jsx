"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"
import { verifyOTP, registerUser } from "@/lib/mock/auth"

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flow = searchParams.get("flow")
  const { pendingRegistration, setUser, clearPendingRegistration } = useAuthStore()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
    const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[i] = val.slice(-1)
    setOtp(newOtp)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length !== 6) { toast.error("৬ সংখ্যার OTP দিন"); return }
    setLoading(true)
    try {
      await verifyOTP(pendingRegistration?.phone, code)
      if (flow === "register" && pendingRegistration) {
        const result = await registerUser(pendingRegistration)
        setUser(result.user)
        clearPendingRegistration()
        toast.success("নিবন্ধন সফল হয়েছে!")
        router.push("/setup")
      } else if (flow === "forgot") {
        toast.success("OTP যাচাই সফল!")
        router.push("/forgot-pin?step=reset")
      }
    } catch (err) {
      toast.error(err.message)
      setOtp(["", "", "", "", "", ""])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const phone = pendingRegistration?.phone || "01XXXXXXXXX"
  const filled = otp.join("").length === 6

  return (
    <div>
      <button onClick={() => router.back()} style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        color: "#64748b", fontSize: "13px", background: "none",
        border: "none", cursor: "pointer", marginBottom: "24px",
        padding: 0, fontWeight: "500", fontFamily: "inherit"
      }}>
        <ArrowLeft size={15} /> ফিরে যান
      </button>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          width: "52px", height: "52px", background: "#eff6ff",
          borderRadius: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px", border: "1px solid #dbeafe"
        }}>
          <Shield size={22} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: "21px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
          OTP যাচাই করুন
        </h1>
        <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6" }}>
          <span style={{ color: "#0f172a", fontWeight: "600" }}>{phone}</span> নম্বরে<br />পাঠানো ৬ সংখ্যার কোড দিন
        </p>
        {/* <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          marginTop: "12px", background: "#fefce8",
          border: "1px solid #fde68a", borderRadius: "8px", padding: "6px 14px"
        }}>
          <span style={{ color: "#92400e", fontSize: "12px" }}>🔑 ডেমো OTP: <strong>123456</strong></span>
        </div> */}
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP boxes */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: "48px", height: "56px", textAlign: "center",
                fontSize: "20px", fontWeight: "700",
                background: digit ? "#eff6ff" : "#f8fafc",
                border: digit ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                borderRadius: "12px", color: "#0f172a", outline: "none",
                caretColor: "#2563eb", fontFamily: "inherit",
                transition: "all 0.15s"
              }}
            />
          ))}
        </div>

        <button type="submit" disabled={loading || !filled} style={{
          width: "100%", padding: "14px",
          background: !filled ? "#bfdbfe" : "#1e40af",
          border: "none", borderRadius: "12px", color: "white",
          fontSize: "15px", fontWeight: "700",
          cursor: !filled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit",
          boxShadow: filled ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
          transition: "all 0.2s"
        }}>
          {loading
            ? <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            : "যাচাই করুন"
          }
        </button>
      </form>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "13px", marginTop: "20px" }}>
        {resendTimer > 0
          ? <span>পুনরায় পাঠান ({resendTimer}s)</span>
          : <button onClick={() => setResendTimer(30)} style={{
            background: "none", border: "none", color: "#2563eb",
            cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit"
          }}>পুনরায় OTP পাঠান</button>
        }
      </p>
    </div>
  )
}