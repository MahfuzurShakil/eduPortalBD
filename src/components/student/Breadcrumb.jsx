import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb({ items }) {
  return (
    <nav style={{
      display: "flex", alignItems: "center", gap: "6px",
      fontSize: "13px", color: "#64748b",
      marginBottom: "20px", flexWrap: "wrap",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
        <Home size={13} /> হোম
      </Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ChevronRight size={13} color="#cbd5e1" />
          {item.href ? (
            <Link href={item.href} style={{ color: "#64748b", textDecoration: "none" }}>{item.label}</Link>
          ) : (
            <span style={{ color: "#0f172a", fontWeight: "600" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}