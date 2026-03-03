"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Eye, EyeOff, LogIn, GraduationCap } from "lucide-react"
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

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #bfdbfe 0%, #dbeafe 40%, #e0f2fe 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .bg-circle-1 {
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .bg-circle-2 {
          position: absolute;
          bottom: -120px; left: -80px;
          width: 350px; height: 350px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          pointer-events: none;
        }
        .bg-circle-3 {
          position: absolute;
          top: 40%; left: 20%;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          pointer-events: none;
        }
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          text-decoration: none;
          z-index: 1;
        }
        .logo-icon {
          width: 44px; height: 44px;
          background: #2563eb;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(37,99,235,0.4);
        }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: #1e3a8a;
        }
        .logo-text span { color: #2563eb; }
        .card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.95);
          border-radius: 24px;
          padding: 40px 36px;
          box-shadow: 0 8px 32px rgba(37,99,235,0.13), 0 1px 3px rgba(0,0,0,0.05);
          z-index: 1;
        }
        .card-icon-wrap {
          width: 54px; height: 54px;
          background: #eff6ff;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          border: 1px solid #dbeafe;
        }
        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 6px;
        }
        .card-subtitle {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          margin-bottom: 28px;
        }
        .demo-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 24px;
        }
        .demo-title {
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .demo-text {
          color: #3b82f6;
          font-size: 12px;
          line-height: 1.9;
        }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .field-input {
          width: 100%;
          padding: 13px 16px 13px 42px;
          border-radius: 12px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          font-family: inherit;
          transition: all 0.2s;
        }
        .field-error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 5px;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 7px;
        }
        .forgot-link {
          color: #2563eb;
          font-size: 12px;
          text-decoration: none;
          font-weight: 500;
        }
        .eye-btn {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 0;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          margin-top: 22px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .bottom-text {
          text-align: center;
          color: #64748b;
          font-size: 13px;
          margin-top: 22px;
        }
        .bottom-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .footer-text {
          margin-top: 20px;
          color: rgba(30,58,138,0.45);
          font-size: 12px;
          z-index: 1;
        }
        @media (max-width: 480px) {
          .card { padding: 32px 24px; }
        }
      `}</style>

      <div className="login-page">
        <div className="bg-circle-1" />
        <div className="bg-circle-2" />
        <div className="bg-circle-3" />

        {/* Logo */}
        <Link href="/" className="logo-wrap">
          <div className="logo-icon">
            <GraduationCap size={22} color="white" />
          </div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>

        {/* Card */}
        <div className="card">
          {/* Icon */}
          <div style={{ textAlign: "center" }}>
            <div className="card-icon-wrap">
              <LogIn size={22} color="#2563eb" />
            </div>
            <h1 className="card-title">লগইন করুন</h1>
            <p className="card-subtitle">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          {/* Demo hint */}
          {/* <div className="demo-box">
            <p className="demo-title">🔑 ডেমো অ্যাকাউন্ট</p>
            <p className="demo-text">
              শিক্ষার্থী: <strong>01711000002</strong> | পিন: <strong>123456</strong><br />
              অ্যাডমিন: <strong>01900000000</strong> | পিন: <strong>admin123</strong>
            </p>
          </div> */}

          <form onSubmit={handleSubmit}>
            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label className="field-label">মোবাইল নম্বর</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Phone size={16} color={focused === "phone" ? "#2563eb" : "#94a3b8"} />
                </span>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  className="field-input"
                  style={{
                    background: focused === "phone" ? "#f0f7ff" : "#f8fafc",
                    border: errors.phone ? "1.5px solid #ef4444" : focused === "phone" ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  }}
                />
              </div>
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            {/* PIN */}
            <div style={{ marginBottom: "4px" }}>
              <div className="label-row">
                <label className="field-label" style={{ marginBottom: 0 }}>পিন</label>
                <Link href="/forgot-pin" className="forgot-link">পিন ভুলে গেছেন?</Link>
              </div>
              <div className="field-wrap" style={{ marginTop: "7px" }}>
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="আপনার পিন দিন"
                  value={form.pin}
                  onChange={e => setForm(p => ({ ...p, pin: e.target.value }))}
                  onFocus={() => setFocused("pin")}
                  onBlur={() => setFocused("")}
                  className="field-input"
                  style={{
                    paddingLeft: "16px",
                    paddingRight: "44px",
                    background: focused === "pin" ? "#f0f7ff" : "#f8fafc",
                    border: errors.pin ? "1.5px solid #ef4444" : focused === "pin" ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPin(!showPin)}>
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.pin && <p className="field-error">{errors.pin}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{ background: loading ? "#93c5fd" : "#1e40af" }}
            >
              {loading
                ? <div className="spinner" />
                : <><LogIn size={16} /> লগইন করুন</>
              }
            </button>
          </form>

          <p className="bottom-text">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="bottom-link">নিবন্ধন করুন</Link>
          </p>
        </div>

        <p className="footer-text">© 2026 EduPortal BD</p>
      </div>
    </>
  )
}