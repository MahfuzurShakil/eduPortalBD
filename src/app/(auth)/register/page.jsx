"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Phone, School, MapPin, ArrowRight, UserPlus } from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "@/lib/store/authStore"

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "7px",
}

const errorStyle = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "5px",
}

function Field({ label, icon: Icon, error, focused, onFocus, onBlur, containerStyle, noIcon, ...props }) {
  return (
    <div style={{ marginBottom: "14px", ...containerStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: "relative" }}>
        {Icon && !noIcon && (
          <Icon size={15} color={focused ? "#2563eb" : "#94a3b8"}
            style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        )}
        <input
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
          style={{
            width: "100%",
            padding: "12px 14px",
            paddingLeft: Icon && !noIcon ? "40px" : "14px",
            background: focused ? "#f0f6ff" : "#f8fafc",
            border: error ? "1.5px solid #ef4444" : focused ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
            borderRadius: "12px",
            color: "#0f172a",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "all 0.2s",
            ...(props.style || {})
          }}
        />
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

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

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{
          width: "52px", height: "52px", background: "#eff6ff",
          borderRadius: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px", border: "1px solid #dbeafe"
        }}>
          <UserPlus size={22} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: "21px", fontWeight: "700", color: "#0f172a", marginBottom: "5px" }}>
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p style={{ color: "#64748b", fontSize: "13px" }}>আপনার তথ্য দিয়ে নিবন্ধন করুন</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Field label="পূর্ণ নাম *" icon={User} placeholder="আপনার পূর্ণ নাম"
          value={form.name} onChange={set("name")} error={errors.name}
          focused={focused === "name"} onFocus={focus("name")} onBlur={blur} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="পিতার নাম *" icon={User} placeholder="পিতার নাম"
            value={form.fatherName} onChange={set("fatherName")} error={errors.fatherName}
            focused={focused === "fatherName"} onFocus={focus("fatherName")} onBlur={blur} />
          <Field label="মাতার নাম *" icon={User} placeholder="মাতার নাম"
            value={form.motherName} onChange={set("motherName")} error={errors.motherName}
            focused={focused === "motherName"} onFocus={focus("motherName")} onBlur={blur} />
        </div>

        <Field label="মোবাইল নম্বর *" icon={Phone} placeholder="01XXXXXXXXX" type="tel"
          value={form.phone} onChange={set("phone")} error={errors.phone}
          focused={focused === "phone"} onFocus={focus("phone")} onBlur={blur} />

        <Field label="বিদ্যালয়ের নাম *" icon={School} placeholder="আপনার বিদ্যালয়ের নাম"
          value={form.school} onChange={set("school")} error={errors.school}
          focused={focused === "school"} onFocus={focus("school")} onBlur={blur} />

        <Field label="ঠিকানা *" icon={MapPin} placeholder="গ্রাম/শহর, জেলা"
          value={form.address} onChange={set("address")} error={errors.address}
          focused={focused === "address"} onFocus={focus("address")} onBlur={blur} />

        {/* PIN */}
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>পিন (৬ সংখ্যা) *</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="••••••"
              maxLength={6}
              value={form.pin}
              onChange={set("pin")}
              onFocus={focus("pin")}
              onBlur={blur}
              style={{
                width: "100%", padding: "12px 44px 12px 14px",
                background: focused === "pin" ? "#f0f6ff" : "#f8fafc",
                border: errors.pin ? "1.5px solid #ef4444" : focused === "pin" ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                borderRadius: "12px", color: "#0f172a", fontSize: "13px",
                outline: "none", boxSizing: "border-box", fontFamily: "inherit"
              }}
            />
            <button type="button" onClick={() => setShowPin(!showPin)} style={{
              position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
              display: "flex", alignItems: "center", padding: 0
            }}>
              {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
        </div>

        <Field label="পিন নিশ্চিত করুন *" noIcon placeholder="পিন পুনরায় দিন"
          type="password" maxLength={6}
          value={form.confirmPin} onChange={set("confirmPin")} error={errors.confirmPin}
          focused={focused === "confirmPin"} onFocus={focus("confirmPin")} onBlur={blur} />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "14px", marginTop: "6px",
          background: loading ? "#93c5fd" : "#1e40af",
          border: "none", borderRadius: "12px", color: "white",
          fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.35)"
        }}>
          {loading
            ? <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            : <><span>OTP পাঠান</span><ArrowRight size={16} /></>
          }
        </button>
      </form>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "13px", marginTop: "20px" }}>
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>লগইন করুন</Link>
      </p>
    </div>
  )
}