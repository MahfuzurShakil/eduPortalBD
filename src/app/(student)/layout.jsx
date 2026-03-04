"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/student/Sidebar"
import TopBar from "@/components/student/TopBar"
import useAuthStore from "@/lib/store/authStore"

export default function StudentLayout({ children }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login")
    } else if (!user.isOnboarded) {
      router.replace("/setup")
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated || !user) return null

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { height: 100%; margin: 0; padding: 0; }

        .student-shell {
          display: flex;
          min-height: 100vh;
          background: #f5f8ff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .student-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 100vh;
        }
        .student-content {
          flex: 1;
          overflow-y: auto;
        }

        /* Mobile: hide sidebar, show content full width */
        @media (max-width: 768px) {
          .student-shell {
            flex-direction: column;
          }
          .student-main {
            min-height: 100vh;
          }
        }
      `}</style>

      <div className="student-shell">
        <Sidebar />
        <div className="student-main">
          <TopBar />
          <div className="student-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}