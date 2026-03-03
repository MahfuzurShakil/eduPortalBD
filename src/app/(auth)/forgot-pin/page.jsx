"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Phone, Lock, ArrowLeft, CheckCircle, KeyRound } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"
import { sendOTP, resetPin } from "@/lib/mock/auth"

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px" }

function PinInput({ label, value, onChange, placeholder, focused, onFocus, onBlur, error }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <Lock size={15} color={focused ? "#2563eb" : "#94a3b8"}
          style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          type="password" maxLength={6}
          placeholder={placeholder}
          value={value} onChange={onChange}
          onFocus={onFocus} onBlur={onBlur}
          style={{
            width: "100%", padding: "13px 14px 13px 40px",
            background: focused ? "#f0f6ff" : "#f8fafc",
            border: error ? "1.5px solid #ef4444" : focused ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
            borderRadius: "12px", color: "#0f172a", fontSize: "14px",
            outline: "none", boxSizing: "border-box", fontFamily: "inherit"
          }}
        />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
    </div>
  )
}

export default function ForgotPinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "phone"
  const { setPendingRegistration, pendingRegistration } = useAuthStore()
  const [phone, setPhone] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [focused, setFocused] = useState("")

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!phone.match(/^01[3-9]\d{8}$/)) { toast.error("সঠিক মোবাইল নম্বর দিন"); return }
    setLoading(true)
    try {
      await sendOTP(phone)
      setPendingRegistration({ phone })
      toast.success("OTP পাঠানো হয়েছে!")
      router.push("/verify-otp?flow=forgot")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPin.length < 6) { toast.error("পিন কমপক্ষে ৬ সংখ্যার হতে হবে"); return }
    if (newPin !== confirmPin) { toast.error("পিন মিলছে না"); return }
    setLoading(true)
    try {
      await resetPin(pendingRegistration?.phone, newPin)
      setDone(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const btnStyle = {
    width: "100%", padding: "14px", marginTop: "8px",
    background: loading ? "#93c5fd" : "#1e40af",
    border: "none", borderRadius: "12px", color: "white",
    fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{
        width: "64px", height: "64px", background: "#f0fdf4",
        borderRadius: "50%", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 20px", border: "1px solid #bbf7d0"
      }}>
        <CheckCircle size={32} color="#22c55e" />
      </div>
      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
        পিন পরিবর্তন সফল!
      </h2>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
        আপনার নতুন পিন দিয়ে লগইন করুন।
      </p>
      <Link href="/login" style={{
        display: "inline-block", background: "#1e40af", color: "white",
        padding: "13px 36px", borderRadius: "12px", fontWeight: "700",
        fontSize: "14px", textDecoration: "none",
        boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
      }}>লগইন করুন</Link>
    </div>
  )

  return (
    <div>
      <Link href="/login" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        color: "#64748b", fontSize: "13px", textDecoration: "none", marginBottom: "24px",
        fontWeight: "500"
      }}>
        <ArrowLeft size={15} /> লগইনে ফিরুন
      </Link>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "52px", height: "52px", background: "#eff6ff",
          borderRadius: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px", border: "1px solid #dbeafe"
        }}>
          <KeyRound size={22} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: "21px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
          পিন পুনরুদ্ধার
        </h1>
        <p style={{ color: "#64748b", fontSize: "13px" }}>
          {step === "reset" ? "নতুন পিন সেট করুন" : "আপনার নিবন্ধিত মোবাইল নম্বর দিন"}
        </p>
      </div>

      {step === "reset" ? (
        <form onSubmit={handleReset}>
          <PinInput label="নতুন পিন *" value={newPin} onChange={e => setNewPin(e.target.value)}
            placeholder="নতুন ৬ সংখ্যার পিন" focused={focused === "pin1"}
            onFocus={() => setFocused("pin1")} onBlur={() => setFocused("")} />
          <PinInput label="পিন নিশ্চিত করুন *" value={confirmPin} onChange={e => setConfirmPin(e.target.value)}
            placeholder="পিন পুনরায় দিন" focused={focused === "pin2"}
            onFocus={() => setFocused("pin2")} onBlur={() => setFocused("")} />
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading
              ? <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : "পিন পরিবর্তন করুন"
            }
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendOTP}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>নিবন্ধিত মোবাইল নম্বর</label>
            <div style={{ position: "relative" }}>
              <Phone size={15} color={focused === "phone" ? "#2563eb" : "#94a3b8"}
                style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                type="tel" placeholder="01XXXXXXXXX" value={phone}
                onChange={e => setPhone(e.target.value)}
                onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                style={{
                  width: "100%", padding: "13px 14px 13px 40px",
                  background: focused === "phone" ? "#f0f6ff" : "#f8fafc",
                  border: focused === "phone" ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  borderRadius: "12px", color: "#0f172a", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit"
                }}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading
              ? <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : "OTP পাঠান"
            }
          </button>
        </form>
      )}
    </div>
  )
}