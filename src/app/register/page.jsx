"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Phone, School, MapPin, ArrowRight, UserPlus, GraduationCap } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"

export default function RegisterPage() {
  const router = useRouter()
  const { setPendingRegistration } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState("")
  const [form, setForm] = useState({
    name: "", fatherName: "", motherName: "",
    phone: "", school: "", address: "", pin: "", confirmPin: "",
  })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "নাম আবশ্যক"
    if (!form.fatherName.trim()) e.fatherName = "পিতার নাম আবশ্যক"
    if (!form.motherName.trim()) e.motherName = "মাতার নাম আবশ্যক"
    if (!form.phone.match(/^01[3-9]\d{8}$/)) e.phone = "সঠিক মোবাইল নম্বর দিন"
    if (!form.school.trim()) e.school = "বিদ্যালয়ের নাম আবশ্যক"
    if (!form.address.trim()) e.address = "ঠিকানা আবশ্যক"
    if (form.pin.length < 6) e.pin = "পিন কমপক্ষে ৬ সংখ্যার হতে হবে"
    if (form.pin !== form.confirmPin) e.confirmPin = "পিন মিলছে না"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { confirmPin, ...data } = form
      setPendingRegistration(data)
      await new Promise(r => setTimeout(r, 800))
      toast.success("OTP পাঠানো হয়েছে!")
      router.push("/verify-otp?flow=register")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const focus = (f) => () => setFocused(f)
  const blur = () => setFocused("")

  const inputStyle = (name, noLeftPad) => ({
    width: "100%",
    padding: noLeftPad ? "11px 14px" : "11px 14px 11px 40px",
    borderRadius: "11px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    transition: "all 0.2s",
    background: focused === name ? "#f0f7ff" : "#f8fafc",
    border: errors[name]
      ? "1.5px solid #ef4444"
      : focused === name
      ? "1.5px solid #2563eb"
      : "1.5px solid #e2e8f0",
    boxSizing: "border-box",
  })

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .reg-page {
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
        .bg-c1 { position:absolute; top:-100px; right:-100px; width:400px; height:400px; border-radius:50%; background:rgba(255,255,255,0.28); pointer-events:none; }
        .bg-c2 { position:absolute; bottom:-120px; left:-80px; width:350px; height:350px; border-radius:50%; background:rgba(255,255,255,0.2); pointer-events:none; }
        .bg-c3 { position:absolute; top:35%; left:15%; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.13); pointer-events:none; }
        .logo-wrap { display:flex; align-items:center; gap:10px; margin-bottom:24px; text-decoration:none; z-index:1; }
        .logo-icon { width:42px; height:42px; background:#2563eb; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(37,99,235,0.4); }
        .logo-text { font-size:19px; font-weight:800; color:#1e3a8a; }
        .logo-text span { color:#2563eb; }
        .card {
          width:100%; max-width:480px;
          background:rgba(255,255,255,0.82);
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,0.95);
          border-radius:24px;
          padding:36px 36px 32px;
          box-shadow:0 8px 32px rgba(37,99,235,0.13), 0 1px 3px rgba(0,0,0,0.05);
          z-index:1;
        }
        .card-icon-wrap { width:50px; height:50px; background:#eff6ff; border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; border:1px solid #dbeafe; }
        .card-title { font-size:20px; font-weight:700; color:#0f172a; text-align:center; margin-bottom:4px; }
        .card-sub { font-size:13px; color:#64748b; text-align:center; margin-bottom:22px; }
        .field-label { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; }
        .field-wrap { position:relative; }
        .field-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none; }
        .field-error { color:#ef4444; font-size:11px; margin-top:4px; }
        .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; align-items:center; padding:0; }
        .submit-btn { width:100%; padding:13px; margin-top:18px; border:none; border-radius:12px; color:white; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:inherit; transition:all 0.2s; box-shadow:0 4px 14px rgba(37,99,235,0.35); }
        .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.35); border-top:2px solid white; border-radius:50%; animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .bottom-text { text-align:center; color:#64748b; font-size:13px; margin-top:18px; }
        .bottom-link { color:#2563eb; text-decoration:none; font-weight:600; }
        .footer-text { margin-top:18px; color:rgba(30,58,138,0.4); font-size:12px; z-index:1; }
        @media (max-width:520px) { .card { padding:28px 20px; } .grid-2 { grid-template-columns:1fr; gap:0; } }
      `}</style>

      <div className="reg-page">
        <div className="bg-c1" /><div className="bg-c2" /><div className="bg-c3" />

        {/* Logo */}
        <Link href="/" className="logo-wrap">
          <div className="logo-icon"><GraduationCap size={21} color="white" /></div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>

        {/* Card */}
        <div className="card">
          <div style={{ textAlign: "center" }}>
            <div className="card-icon-wrap"><UserPlus size={21} color="#2563eb" /></div>
            <h1 className="card-title">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="card-sub">আপনার তথ্য দিয়ে নিবন্ধন করুন</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full name */}
            <div style={{ marginBottom: "12px" }}>
              <label className="field-label">পূর্ণ নাম *</label>
              <div className="field-wrap">
                <span className="field-icon"><User size={14} color={focused === "name" ? "#2563eb" : "#94a3b8"} /></span>
                <input type="text" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={set("name")} onFocus={focus("name")} onBlur={blur} style={inputStyle("name")} />
              </div>
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* Father / Mother */}
            <div className="grid-2" style={{ marginBottom: "12px" }}>
              <div>
                <label className="field-label">পিতার নাম *</label>
                <div className="field-wrap">
                  <span className="field-icon"><User size={14} color={focused === "fatherName" ? "#2563eb" : "#94a3b8"} /></span>
                  <input type="text" placeholder="পিতার নাম" value={form.fatherName} onChange={set("fatherName")} onFocus={focus("fatherName")} onBlur={blur} style={inputStyle("fatherName")} />
                </div>
                {errors.fatherName && <p className="field-error">{errors.fatherName}</p>}
              </div>
              <div>
                <label className="field-label">মাতার নাম *</label>
                <div className="field-wrap">
                  <span className="field-icon"><User size={14} color={focused === "motherName" ? "#2563eb" : "#94a3b8"} /></span>
                  <input type="text" placeholder="মাতার নাম" value={form.motherName} onChange={set("motherName")} onFocus={focus("motherName")} onBlur={blur} style={inputStyle("motherName")} />
                </div>
                {errors.motherName && <p className="field-error">{errors.motherName}</p>}
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "12px" }}>
              <label className="field-label">মোবাইল নম্বর *</label>
              <div className="field-wrap">
                <span className="field-icon"><Phone size={14} color={focused === "phone" ? "#2563eb" : "#94a3b8"} /></span>
                <input type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} onFocus={focus("phone")} onBlur={blur} style={inputStyle("phone")} />
              </div>
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            {/* School */}
            <div style={{ marginBottom: "12px" }}>
              <label className="field-label">বিদ্যালয়ের নাম *</label>
              <div className="field-wrap">
                <span className="field-icon"><School size={14} color={focused === "school" ? "#2563eb" : "#94a3b8"} /></span>
                <input type="text" placeholder="আপনার বিদ্যালয়ের নাম" value={form.school} onChange={set("school")} onFocus={focus("school")} onBlur={blur} style={inputStyle("school")} />
              </div>
              {errors.school && <p className="field-error">{errors.school}</p>}
            </div>

            {/* Address */}
            <div style={{ marginBottom: "12px" }}>
              <label className="field-label">ঠিকানা *</label>
              <div className="field-wrap">
                <span className="field-icon"><MapPin size={14} color={focused === "address" ? "#2563eb" : "#94a3b8"} /></span>
                <input type="text" placeholder="গ্রাম/শহর, জেলা" value={form.address} onChange={set("address")} onFocus={focus("address")} onBlur={blur} style={inputStyle("address")} />
              </div>
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>

            {/* PIN grid */}
            <div className="grid-2" style={{ marginBottom: "12px" }}>
              <div>
                <label className="field-label">পিন (৬ সংখ্যা) *</label>
                <div className="field-wrap">
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="••••••" maxLength={6}
                    value={form.pin} onChange={set("pin")}
                    onFocus={focus("pin")} onBlur={blur}
                    style={{ ...inputStyle("pin", true), paddingRight: "40px" }}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPin(!showPin)}>
                    {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.pin && <p className="field-error">{errors.pin}</p>}
              </div>
              <div>
                <label className="field-label">পিন নিশ্চিত করুন *</label>
                <div className="field-wrap">
                  <input
                    type="password" placeholder="পুনরায় দিন" maxLength={6}
                    value={form.confirmPin} onChange={set("confirmPin")}
                    onFocus={focus("confirmPin")} onBlur={blur}
                    style={inputStyle("confirmPin", true)}
                  />
                </div>
                {errors.confirmPin && <p className="field-error">{errors.confirmPin}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn"
              style={{ background: loading ? "#93c5fd" : "#1e40af" }}>
              {loading
                ? <div className="spinner" />
                : <><span>OTP পাঠান</span><ArrowRight size={15} /></>
              }
            </button>
          </form>

          <p className="bottom-text">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="bottom-link">লগইন করুন</Link>
          </p>
        </div>
        <p className="footer-text">© 2026 EduPortal BD</p>
      </div>
    </>
  )
}