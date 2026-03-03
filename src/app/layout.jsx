import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EduPortal BD — স্মার্ট শিক্ষা পোর্টাল",
  description: "বাংলাদেশের শিক্ষার্থীদের জন্য সেরা ডিজিটাল শিক্ষা পোর্টাল",
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #334155",
            },
          }}
        />
      </body>
    </html>
  )
}