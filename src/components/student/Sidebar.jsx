"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  GraduationCap, LayoutDashboard, BookOpen,
  Trophy, BarChart2, LogOut, X, Menu, User, ChevronRight
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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = () => {
    logout()
    toast.success("লগআউট সফল হয়েছে")
    router.push("/login")
  }

  const profile = user?.profile || {}
  const classLabel = profile.className || "শিক্ষার্থী"
  const groupLabel = profile.group
    ? ` · ${profile.group === "science" ? "বিজ্ঞান" : profile.group === "commerce" ? "ব্যবসায়" : "মানবিক"}`
    : ""

  const SidebarContent = () => (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        padding: "0 20px", height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid #e8f0fe", flexShrink: 0,
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <GraduationCap size={17} color="white" />
          </div>
          <span style={{ fontSize: "15px", fontWeight: "800", color: "#1e3a8a", letterSpacing: "-0.3px" }}>
            Edu<span style={{ color: "#2563eb" }}>Portal</span>
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="sidebar-mobile-close"
          style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            padding: "6px", borderRadius: "8px", color: "#64748b",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav section label */}
      <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "0 12px", flex: 1, overflowY: "auto", minHeight: 0 }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{ textDecoration: "none", display: "block", marginBottom: "2px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px",
                background: active ? "#eff6ff" : "transparent",
                color: active ? "#1d4ed8" : "#475569",
                transition: "all 0.15s",
                cursor: "pointer",
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8fafc" }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                  background: active ? "#dbeafe" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  <Icon size={16} color={active ? "#1d4ed8" : "#64748b"} />
                </div>
                <span style={{
                  fontSize: "14px", fontWeight: active ? "600" : "500",
                  letterSpacing: "-0.1px",
                }}>
                  {label}
                </span>
                {active && (
                  <ChevronRight size={14} color="#93c5fd" style={{ marginLeft: "auto" }} />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User card + Logout — always visible at bottom */}
      <div style={{
        padding: "12px", borderTop: "1px solid #e8f0fe", flexShrink: 0,
        background: "#fafbff",
      }}>
        {user && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", marginBottom: "6px",
            background: "white", borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{
              width: "34px", height: "34px", background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={15} color="white" />
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: "13px", fontWeight: "600", color: "#0f172a",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user.name}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {classLabel}{groupLabel}
              </div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", background: "none", border: "1px solid transparent",
          borderRadius: "10px", cursor: "pointer", color: "#ef4444",
          fontFamily: "inherit", transition: "all 0.15s", fontSize: "14px", fontWeight: "500",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca" }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "transparent" }}
        >
          <LogOut size={16} />
          লগআউট
        </button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        /* Desktop sidebar */
        .edu-sidebar {
          width: 220px;
          min-height: 100vh;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2ecff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          overflow: hidden;
          box-shadow: 1px 0 0 #e8f0fe;
        }
        /* Mobile hamburger button */
        .sidebar-hamburger {
          display: none !important;
        }
        /* Mobile overlay */
        .sidebar-overlay {
          display: none;
        }
        /* Mobile sidebar drawer */
        .sidebar-mobile-close {
          display: none !important;
        }

        @media (max-width: 768px) {
          .edu-sidebar {
            display: none !important;
          }
          .sidebar-hamburger {
            display: flex !important;
          }
          .sidebar-mobile-close {
            display: flex !important;
          }
        }

        /* Mobile drawer */
        .sidebar-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: white;
          border-right: 1px solid #e2ecff;
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .sidebar-drawer.open {
          transform: translateX(0);
        }
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.4);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
        }
        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: all;
          display: block !important;
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="edu-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger — rendered inside TopBar via portal-like approach */}
      {/* We expose a global toggle fn via window for TopBar to use */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        id="sidebar-hamburger-btn"
        style={{
          position: "fixed", top: "14px", left: "16px", zIndex: 998,
          background: "white", border: "1px solid #e2e8f0", borderRadius: "10px",
          width: "40px", height: "40px", cursor: "pointer",
          display: "none", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Menu size={18} color="#475569" />
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`sidebar-drawer ${mobileOpen ? "open" : ""}`}>
        <SidebarContent />
      </div>
    </>
  )
}