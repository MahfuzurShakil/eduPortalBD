"use client"
import { useState } from "react"
import { Trophy, Medal, Crown, TrendingUp, Users, Star } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import leaderboardData from "@/data/leaderboard.json"
import useQuizStore from "@/lib/store/quizStore"

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const { result } = useQuizStore()
  const [filter, setFilter] = useState("global") // "global" | "class"

  const userClass = user?.profile?.class || ""
  const userGroup = user?.profile?.group || ""

  // Build full board: seed data + current user if they have quiz history
  const quizHistory = user?.quizHistory || []
  const userTotalScore = quizHistory.reduce((sum, q) => sum + q.score, 0)
  const userEntry = quizHistory.length > 0 ? {
    id: user?.id || "current-user",
    name: user?.name || "আপনি",
    class: userClass,
    group: userGroup,
    totalScore: userTotalScore,
    quizCount: quizHistory.length,
    avgScore: quizHistory.length > 0 ? Math.round(userTotalScore / quizHistory.length) : 0,
    badge: null,
    isCurrentUser: true,
  } : null

  // Merge and sort
  let board = [...leaderboardData]
  if (userEntry) {
    board = board.filter(e => e.id !== user?.id)
    board.push(userEntry)
  }
  board.sort((a, b) => b.totalScore - a.totalScore)

  // Apply filter
  const filtered = filter === "class"
    ? board.filter(e => e.class === userClass)
    : board

  const currentUserRank = board.findIndex(e => e.isCurrentUser || e.id === user?.id) + 1

  const getBadgeIcon = (badge, rank) => {
    if (rank === 1) return { icon: Crown, color: "#f59e0b", bg: "#fef3c7" }
    if (rank === 2) return { icon: Medal, color: "#94a3b8", bg: "#f1f5f9" }
    if (rank === 3) return { icon: Medal, color: "#cd7c2f", bg: "#fef3c7" }
    return null
  }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#7c2d12,#ea580c,#f97316)",
        borderRadius: "24px", padding: "32px 36px", marginBottom: "24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={26} color="white" />
            </div>
            <div>
              <h1 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "2px" }}>লিডারবোর্ড</h1>
              <p style={{ color: "#fed7aa", fontSize: "13px" }}>সেরা শিক্ষার্থীদের র‌্যাংকিং</p>
            </div>
          </div>

          {/* Current user rank card */}
          {currentUserRank > 0 && (
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: "800", fontSize: "16px" }}>#{currentUserRank}</span>
              </div>
              <div>
                <div style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>আপনার বর্তমান র‌্যাংক</div>
                <div style={{ color: "#fed7aa", fontSize: "12px" }}>মোট স্কোর: {userTotalScore} | কুইজ: {quizHistory.length} টি</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { key: "global", label: "🌐 গ্লোবাল", desc: "সকল শিক্ষার্থী" },
          { key: "class", label: "🎓 আমার ক্লাস", desc: userClass || "ক্লাস নেই" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "10px 20px", borderRadius: "12px", cursor: "pointer",
            background: filter === f.key ? "#1e3a8a" : "white",
            color: filter === f.key ? "white" : "#374151",
            border: `1.5px solid ${filter === f.key ? "#1e3a8a" : "#e2e8f0"}`,
            fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {filter === "global" && filtered.length >= 3 && (
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "12px", marginBottom: "28px" }}>
          {/* 2nd */}
          <PodiumCard rank={2} entry={filtered[1]} currentUserId={user?.id} />
          {/* 1st */}
          <PodiumCard rank={1} entry={filtered[0]} currentUserId={user?.id} />
          {/* 3rd */}
          <PodiumCard rank={3} entry={filtered[2]} currentUserId={user?.id} />
        </div>
      )}

      {/* Full table */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={16} color="#64748b" />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{filtered.length} জন শিক্ষার্থী</span>
        </div>

        {filtered.slice(0, 20).map((entry, idx) => {
          const rank = idx + 1
          const isMe = entry.isCurrentUser || entry.id === user?.id
          const badge = getBadgeIcon(entry.badge, rank)

          return (
            <div key={entry.id} style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 24px",
              background: isMe ? "#eff6ff" : "white",
              borderBottom: "1px solid #f8fafc",
              borderLeft: isMe ? "4px solid #2563eb" : "4px solid transparent",
            }}>
              {/* Rank */}
              <div style={{ width: "32px", textAlign: "center", flexShrink: 0 }}>
                {badge ? (
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: badge.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <badge.icon size={15} color={badge.color} fill={badge.color} />
                  </div>
                ) : (
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#94a3b8" }}>#{rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                background: isMe ? "#2563eb" : `hsl(${(rank * 47) % 360}, 65%, 55%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "14px", fontWeight: "800",
              }}>
                {entry.name.charAt(0)}
              </div>

              {/* Name + class */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: isMe ? "700" : "600", color: isMe ? "#1e40af" : "#0f172a" }}>
                  {entry.name} {isMe && <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>আপনি</span>}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{entry.class}{entry.group ? ` · ${entry.group}` : ""}</div>
              </div>

              {/* Quiz count */}
              <div style={{ textAlign: "center", display: "none" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#374151" }}>{entry.quizCount}</div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>কুইজ</div>
              </div>

              {/* Score */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "18px", fontWeight: "800", color: isMe ? "#1e40af" : "#0f172a" }}>{entry.totalScore}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{entry.quizCount} কুইজ</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PodiumCard({ rank, entry, currentUserId }) {
  const isMe = entry?.isCurrentUser || entry?.id === currentUserId
  const heights = { 1: "110px", 2: "80px", 3: "60px" }
  const colors = { 1: "#f59e0b", 2: "#94a3b8", 3: "#cd7c2f" }
  const icons = { 1: "🥇", 2: "🥈", 3: "🥉" }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: rank === 1 ? 1.2 : 1 }}>
      {/* Name + avatar */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={{
          width: rank === 1 ? "56px" : "46px", height: rank === 1 ? "56px" : "46px",
          borderRadius: "50%", margin: "0 auto 6px",
          background: isMe ? "#2563eb" : `hsl(${rank * 80}, 65%, 55%)`,
          border: `3px solid ${colors[rank]}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: rank === 1 ? "18px" : "14px", fontWeight: "800",
        }}>
          {entry?.name?.charAt(0) || "?"}
        </div>
        <div style={{ fontSize: rank === 1 ? "13px" : "12px", fontWeight: "700", color: "#0f172a", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {entry?.name?.split(" ")[0]}
        </div>
        <div style={{ fontSize: "11px", color: "#64748b" }}>{entry?.totalScore} পয়েন্ট</div>
      </div>
      {/* Podium block */}
      <div style={{
        width: "100%", height: heights[rank],
        background: `linear-gradient(180deg, ${colors[rank]}40, ${colors[rank]}20)`,
        border: `2px solid ${colors[rank]}60`,
        borderRadius: "10px 10px 0 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px",
      }}>
        {icons[rank]}
      </div>
    </div>
  )
}