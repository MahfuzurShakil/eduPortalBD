"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  GraduationCap, LayoutDashboard, HelpCircle, Video,
  Users, LogOut, ShieldCheck, ChevronRight
} from "lucide-react"
import useAdminStore from "@/lib/store/adminStore"
import toast from "react-hot-toast"

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
  { href: "/admin/questions", icon: HelpCircle, label: "প্রশ্ন ব্যবস্থাপনা" },
  { href: "/admin/videos", icon: Video, label: "ভিডিও ব্যবস্থাপনা" },
  { href: "/admin/students", icon: Users, label: "শিক্ষার্থী তালিকা" },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdminAuthenticated, adminUser, adminLogout } = useAdminStore()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Only redirect if NOT on the login page and not authenticated
    if (!isLoginPage && !isAdminAuthenticated) {
      router.replace("/admin/login")
    }
  }, [isAdminAuthenticated, isLoginPage])

  // If this is the login page, just render children directly — no sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // For all other admin pages, block render until authenticated
  if (!isAdminAuthenticated) return null

  const handleLogout = () => {
    adminLogout()
    toast.success("লগআউট সফল")
    router.push("/admin/login")
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px", minHeight: "100vh", background: "#0f172a",
        display: "flex", flexDirection: "column", flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          minHeight: "68px", display: "flex", alignItems: "center", gap: "10px"
        }}>
          <div style={{
            width: "34px", height: "34px", background: "#2563eb", borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "white" }}>
              EduPortal<span style={{ color: "#60a5fa" }}>BD</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={10} color="#22c55e" />
              <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: "600", letterSpacing: "0.05em" }}>ADMIN</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", textDecoration: "none",
                background: active ? "rgba(37,99,235,0.2)" : "transparent",
                color: active ? "#60a5fa" : "#94a3b8",
                transition: "all 0.15s",
              }}>
                <Icon size={17} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "13.5px", fontWeight: active ? "600" : "400" }}>{label}</span>
                {active && <ChevronRight size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Admin user + logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", marginBottom: "6px",
            background: "rgba(255,255,255,0.04)", borderRadius: "10px"
          }}>
            <div style={{
              width: "32px", height: "32px",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0
            }}>
              <ShieldCheck size={15} color="white" />
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {adminUser?.name || "Admin"}
              </div>
              <div style={{ fontSize: "10px", color: "#22c55e" }}>● অনলাইন</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", background: "none", border: "none", borderRadius: "10px",
            cursor: "pointer", color: "#ef4444", fontFamily: "inherit", transition: "all 0.15s",
          }}>
            <LogOut size={17} />
            <span style={{ fontSize: "13.5px", fontWeight: "500" }}>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  )
}