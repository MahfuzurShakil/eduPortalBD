"use client"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e0f0ff 0%, #c8e4fb 40%, #ddf0ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background decorative circles */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "rgba(255,255,255,0.25)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "rgba(255,255,255,0.2)", pointerEvents: "none"
      }} />

      {/* Logo */}
      <Link href="/" style={{
        textDecoration: "none", display: "inline-flex",
        alignItems: "center", gap: "10px", marginBottom: "28px", zIndex: 1
      }}>
        <div style={{
          width: "42px", height: "42px", background: "#2563eb",
          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37,99,235,0.35)"
        }}>
          <GraduationCap size={22} color="white" />
        </div>
        <span style={{ fontSize: "20px", fontWeight: "800", color: "#1e3a8a" }}>
          EduPortal <span style={{ color: "#2563eb" }}>BD</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: "24px",
        padding: "40px 36px",
        boxShadow: "0 8px 40px rgba(37,99,235,0.12), 0 1px 2px rgba(0,0,0,0.04)",
        zIndex: 1,
      }}>
        {children}
      </div>

      <p style={{ marginTop: "20px", color: "rgba(30,58,138,0.45)", fontSize: "13px", zIndex: 1 }}>
        © 2026 EduPortal BD
      </p>
    </div>
  )
}