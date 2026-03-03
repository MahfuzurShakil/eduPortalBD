"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Phone, Lock, ArrowLeft, CheckCircle, KeyRound, GraduationCap } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"
import { sendOTP, resetPin } from "@/lib/mock/auth"

import { Suspense } from "react"

const SHARED_STYLES = `
  * { box-sizing:border-box; margin:0; padding:0; }
  .fp-page {
    min-height:100vh;
    background:linear-gradient(160deg,#bfdbfe 0%,#dbeafe 40%,#e0f2fe 100%);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:24px 16px;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    position:relative; overflow:hidden;
  }
  .bg-c1{position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,0.28);pointer-events:none;}
  .bg-c2{position:absolute;bottom:-120px;left:-80px;width:350px;height:350px;border-radius:50%;background:rgba(255,255,255,0.2);pointer-events:none;}
  .logo-wrap{display:flex;align-items:center;gap:10px;margin-bottom:24px;text-decoration:none;z-index:1;}
  .logo-icon{width:42px;height:42px;background:#2563eb;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(37,99,235,0.4);}
  .logo-text{font-size:19px;font-weight:800;color:#1e3a8a;}
  .logo-text span{color:#2563eb;}
  .card{width:100%;max-width:420px;background:rgba(255,255,255,0.82);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.95);border-radius:24px;padding:36px;box-shadow:0 8px 32px rgba(37,99,235,0.13),0 1px 3px rgba(0,0,0,0.05);z-index:1;}
  .back-link{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:13px;text-decoration:none;font-weight:500;margin-bottom:24px;}
  .icon-wrap{width:52px;height:52px;background:#eff6ff;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;border:1px solid #dbeafe;}
  .card-title{font-size:21px;font-weight:700;color:#0f172a;text-align:center;margin-bottom:6px;}
  .card-sub{font-size:13px;color:#64748b;text-align:center;margin-bottom:26px;}
  .field-label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:7px;}
  .field-wrap{position:relative;margin-bottom:14px;}
  .field-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;}
  .field-input{width:100%;padding:13px 14px 13px 40px;border-radius:12px;font-size:14px;color:#0f172a;outline:none;font-family:inherit;transition:all 0.2s;box-sizing:border-box;}
  .field-error{color:#ef4444;font-size:12px;margin-top:4px;}
  .submit-btn{width:100%;padding:14px;border:none;border-radius:12px;color:white;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 14px rgba(37,99,235,0.3);}
  .spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,0.35);border-top:2px solid white;border-radius:50%;animation:spin 0.8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .footer-text{margin-top:18px;color:rgba(30,58,138,0.4);font-size:12px;z-index:1;}
  @media(max-width:480px){.card{padding:28px 20px;}}
`



function ForgotPinContent() {
  // ... ALL your existing code goes here (keep everything same)
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

  const inputStyle = (name) => ({
    background: focused === name ? "#f0f7ff" : "#f8fafc",
    border: focused === name ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
  })

  // ── Success state ──
  if (done) return (
    <>
      <style>{SHARED_STYLES}</style>
      <div className="fp-page">
        <div className="bg-c1" /><div className="bg-c2" />
        <Link href="/" className="logo-wrap">
          <div className="logo-icon"><GraduationCap size={21} color="white" /></div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid #bbf7d0" }}>
            <CheckCircle size={32} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>পিন পরিবর্তন সফল!</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>আপনার নতুন পিন দিয়ে লগইন করুন।</p>
          <Link href="/login" style={{ display: "inline-block", background: "#1e40af", color: "white", padding: "13px 36px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
            লগইন করুন
          </Link>
        </div>
        <p className="footer-text">© ২০২৪ EduPortal BD</p>
      </div>
    </>
  )

  return (
    <>
      <style>{SHARED_STYLES}</style>
      <div className="fp-page">
        <div className="bg-c1" /><div className="bg-c2" />

        <Link href="/" className="logo-wrap">
          <div className="logo-icon"><GraduationCap size={21} color="white" /></div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>

        <div className="card">
          {/* <Link href="/login" className="back-link">
            <ArrowLeft size={15} /> লগইনে ফিরুন
          </Link> */}

          <div style={{ textAlign: "center" }}>
            <div className="icon-wrap"><KeyRound size={22} color="#2563eb" /></div>
            <h1 className="card-title">পিন পুনরুদ্ধার</h1>
            <p className="card-sub">
              {step === "reset" ? "নতুন পিন সেট করুন" : "আপনার নিবন্ধিত মোবাইল নম্বর দিন"}
            </p>
          </div>

          {step === "reset" ? (
            <form onSubmit={handleReset}>
              {/* New PIN */}
              <div>
                <label className="field-label">নতুন পিন *</label>
                <div className="field-wrap">
                  <span className="field-icon"><Lock size={15} color={focused === "pin1" ? "#2563eb" : "#94a3b8"} /></span>
                  <input
                    type="password" maxLength={6} placeholder="নতুন ৬ সংখ্যার পিন"
                    value={newPin} onChange={e => setNewPin(e.target.value)}
                    onFocus={() => setFocused("pin1")} onBlur={() => setFocused("")}
                    className="field-input" style={inputStyle("pin1")}
                  />
                </div>
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="field-label">পিন নিশ্চিত করুন *</label>
                <div className="field-wrap">
                  <span className="field-icon"><Lock size={15} color={focused === "pin2" ? "#2563eb" : "#94a3b8"} /></span>
                  <input
                    type="password" maxLength={6} placeholder="পিন পুনরায় দিন"
                    value={confirmPin} onChange={e => setConfirmPin(e.target.value)}
                    onFocus={() => setFocused("pin2")} onBlur={() => setFocused("")}
                    className="field-input" style={inputStyle("pin2")}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn"
                style={{ background: loading ? "#93c5fd" : "#1e40af" }}>
                {loading ? <div className="spinner" /> : "পিন পরিবর্তন করুন"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendOTP}>
              <label className="field-label">নিবন্ধিত মোবাইল নম্বর</label>
              <div className="field-wrap">
                <span className="field-icon"><Phone size={15} color={focused === "phone" ? "#2563eb" : "#94a3b8"} /></span>
                <input
                  type="tel" placeholder="01XXXXXXXXX"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                  className="field-input" style={inputStyle("phone")}
                />
              </div>
              <button type="submit" disabled={loading} className="submit-btn"
                style={{ background: loading ? "#93c5fd" : "#1e40af" }}>
                {loading ? <div className="spinner" /> : "OTP পাঠান"}
              </button>
            </form>
          )}
        </div>

        <p className="footer-text">© 2026 EduPortal BD</p>
      </div>
    </>
  )
}

export default function ForgotPinPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#bfdbfe 0%,#dbeafe 40%,#e0f2fe 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"32px",height:"32px",border:"3px solid #bfdbfe",borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
    </div>}>
      <ForgotPinContent />
    </Suspense>
  )
}
