"use client"
import { usePathname } from "next/navigation"
import { Bell, User, ChevronRight } from "lucide-react"
import Link from "next/link"
import useAuthStore from "@/lib/store/authStore"

const pageTitles = {
  "/dashboard": { title: "ড্যাশবোর্ড", sub: "আপনার শিক্ষা কার্যক্রম" },
  "/subjects": { title: "বিষয়সমূহ", sub: "আপনার সকল বিষয় ও অধ্যায়" },
  "/quiz": { title: "কুইজ", sub: "MCQ প্র্যাকটিস করুন" },
  "/leaderboard": { title: "লিডারবোর্ড", sub: "শিক্ষার্থীদের র‌্যাংকিং" },
}

export default function TopBar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const page = pageTitles[pathname] || {
    title: pathname.includes("/subjects") ? "বিষয় ও অধ্যায়" : "EduPortal BD",
    sub: null,
  }

  return (
    <>
      <style>{`
        .topbar-title { font-size: 17px; }
        .topbar-sub { display: block; }
        .topbar-name { display: block; }
        @media (max-width: 768px) {
          .topbar-title { font-size: 15px; }
          .topbar-sub { display: none !important; }
          .topbar-name { display: none !important; }
          .topbar-inner { padding-left: 64px !important; }
        }
        @media (max-width: 480px) {
          .topbar-title { font-size: 14px; }
        }
      `}</style>
      <header style={{
        height: "64px", background: "white",
        borderBottom: "1px solid #e8f0fe",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px", flexShrink: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div className="topbar-inner" style={{ display: "flex", flexDirection: "column", gap: "1px", padding: "0" }}>
          <span className="topbar-title" style={{ fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
            {page.title}
          </span>
          {page.sub && (
            <span className="topbar-sub" style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "400" }}>
              {page.sub}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f8fafc", border: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", flexShrink: 0,
          }}>
            <Bell size={15} color="#64748b" />
            <div style={{
              position: "absolute", top: "7px", right: "7px",
              width: "7px", height: "7px", background: "#ef4444",
              borderRadius: "50%", border: "1.5px solid white",
            }} />
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "5px 10px 5px 5px",
            background: "#f8fafc", border: "1px solid #e2e8f0",
            borderRadius: "10px", flexShrink: 0,
          }}>
            <div style={{
              width: "28px", height: "28px",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={13} color="white" />
            </div>
            <span className="topbar-name" style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
              {user?.name?.split(" ")[0] || "শিক্ষার্থী"}
            </span>
          </div>
        </div>
      </header>
    </>
  )
}