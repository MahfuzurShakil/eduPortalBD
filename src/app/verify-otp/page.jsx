"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Shield, GraduationCap } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import useAuthStore from "@/lib/store/authStore"
import { verifyOTP, registerUser } from "@/lib/mock/auth"


import { Suspense } from "react"

function VerifyOTPContent() {
  // ... ALL your existing code goes here (keep everything same)

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
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        .otp-page {
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
        .back-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;padding:0;font-family:inherit;margin-bottom:24px;}
        .icon-wrap{width:52px;height:52px;background:#eff6ff;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;border:1px solid #dbeafe;}
        .card-title{font-size:21px;font-weight:700;color:#0f172a;text-align:center;margin-bottom:8px;}
        .card-sub{font-size:13px;color:#64748b;text-align:center;line-height:1.6;}
        .demo-badge{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:6px 14px;}
        .demo-badge span{color:#92400e;font-size:12px;}
        .otp-boxes{display:flex;gap:10px;justify-content:center;margin:28px 0;}
        .otp-input{width:48px;height:56px;text-align:center;font-size:20px;font-weight:700;border-radius:12px;color:#0f172a;outline:none;font-family:inherit;transition:all 0.15s;caret-color:#2563eb;}
        .submit-btn{width:100%;padding:14px;border:none;border-radius:12px;color:white;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;transition:all 0.2s;}
        .spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,0.35);border-top:2px solid white;border-radius:50%;animation:spin 0.8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .resend-text{text-align:center;color:#64748b;font-size:13px;margin-top:18px;}
        .resend-btn{background:none;border:none;color:#2563eb;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;}
        .footer-text{margin-top:18px;color:rgba(30,58,138,0.4);font-size:12px;z-index:1;}
        @media(max-width:480px){.card{padding:28px 20px;} .otp-input{width:42px;height:50px;font-size:18px;}}
      `}</style>

      <div className="otp-page">
        <div className="bg-c1" /><div className="bg-c2" />

        <Link href="/" className="logo-wrap">
          <div className="logo-icon"><GraduationCap size={21} color="white" /></div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>

        <div className="card">
          {/* <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={15} /> ফিরে যান
          </button> */}

          <div style={{ textAlign: "center" }}>
            <div className="icon-wrap"><Shield size={22} color="#2563eb" /></div>
            <h1 className="card-title">OTP যাচাই করুন</h1>
            <p className="card-sub">
              <strong style={{ color: "#0f172a" }}>{phone}</strong> নম্বরে<br />পাঠানো ৬ সংখ্যার কোড দিন
            </p>
            {/* <div className="demo-badge">
              <span>🔑 ডেমো OTP: <strong>123456</strong></span>
            </div> */}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="otp-boxes">
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
                  className="otp-input"
                  style={{
                    background: digit ? "#eff6ff" : "#f8fafc",
                    border: digit ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  }}
                />
              ))}
            </div>

            <button type="submit" disabled={loading || !filled} className="submit-btn"
              style={{
                background: !filled ? "#bfdbfe" : "#1e40af",
                cursor: !filled ? "not-allowed" : "pointer",
                boxShadow: filled ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
              }}>
              {loading
                ? <div className="spinner" />
                : "যাচাই করুন"
              }
            </button>
          </form>

          <p className="resend-text">
            {resendTimer > 0
              ? <span>পুনরায় পাঠান ({resendTimer}s)</span>
              : <button className="resend-btn" onClick={() => setResendTimer(30)}>পুনরায় OTP পাঠান</button>
            }
          </p>
        </div>

        <p className="footer-text">© 2026 EduPortal BD</p>
      </div>
    </>
  )
}


export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#bfdbfe 0%,#dbeafe 40%,#e0f2fe 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"32px",height:"32px",border:"3px solid #bfdbfe",borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
    </div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}