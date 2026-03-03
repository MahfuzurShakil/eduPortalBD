"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  GraduationCap, LayoutDashboard, BookOpen,
  Trophy, BarChart2, LogOut, ChevronLeft, ChevronRight, User
} from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import toast from "react-hot-toast"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
  { href: "/subjects", icon: BookOpen, label: "বিষয়সমূহ" },
  { href: "/quiz", icon: Trophy, label: "কুইজ" },
  { href: "/leaderboard", icon: BarChart2, label: "লিডারবোর্ড" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success("লগআউট সফল হয়েছে")
    router.push("/login")
  }

  return (
    <aside style={{
      width: collapsed ? "72px" : "240px",
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.25s ease",
      flexShrink: 0,
      position: "relative",
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 0" : "20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        minHeight: "68px",
      }}>
        {!collapsed && (
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", background: "#2563eb", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>
              Edu<span style={{ color: "#60a5fa" }}>Portal</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div style={{ width: "34px", height: "34px", background: "#2563eb", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="white" />
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "7px",
          width: "28px", height: "28px", cursor: "pointer", color: "#94a3b8",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginLeft: collapsed ? "0" : "8px",
        }}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center",
              gap: "12px", padding: collapsed ? "10px 0" : "10px 12px",
              borderRadius: "10px", textDecoration: "none",
              justifyContent: collapsed ? "center" : "flex-start",
              background: active ? "rgba(37,99,235,0.2)" : "transparent",
              color: active ? "#60a5fa" : "#94a3b8",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: "14px", fontWeight: active ? "600" : "400" }}>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {!collapsed && user && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", marginBottom: "6px",
            background: "rgba(255,255,255,0.04)", borderRadius: "10px",
          }}>
            <div style={{ width: "32px", height: "32px", background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={15} color="white" />
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{user.profile?.class || "শিক্ষার্থী"}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "12px", padding: collapsed ? "10px 0" : "10px 12px",
          background: "none", border: "none", borderRadius: "10px",
          cursor: "pointer", color: "#ef4444", justifyContent: collapsed ? "center" : "flex-start",
          fontFamily: "inherit", transition: "all 0.15s",
        }}>
          <LogOut size={18} />
          {!collapsed && <span style={{ fontSize: "14px", fontWeight: "500" }}>লগআউট</span>}
        </button>
      </div>
    </aside>
  )
}