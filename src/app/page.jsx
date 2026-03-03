"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Users, Trophy, Video, ChevronRight, GraduationCap, Star, CheckCircle } from "lucide-react"

const stats = [
  { label: "শিক্ষার্থী", value: "৫০,০০০+", icon: Users },
  { label: "বিষয়", value: "৩০০+", icon: BookOpen },
  { label: "ভিডিও লেসন", value: "২০০০+", icon: Video },
  { label: "কুইজ", value: "১০,০০০+", icon: Trophy },
]

const features = [
  { title: "সম্পূর্ণ পাঠ্যবই", desc: "NCTB অনুমোদিত সকল বইয়ের PDF চ্যাপ্টার ওয়াইজ পড়ুন", icon: BookOpen, color: "bg-blue-500" },
  { title: "বিশেষজ্ঞ ভিডিও", desc: "দেশের সেরা শিক্ষকদের ব্যাখ্যামূলক ভিডিও লেসন", icon: Video, color: "bg-purple-500" },
  { title: "স্মার্ট কুইজ", desc: "AI-চালিত কুইজ সিস্টেম, রিয়েল টাইম স্কোর ও লিডারবোর্ড", icon: Trophy, color: "bg-green-500" },
  { title: "সকল শিক্ষাধারা", desc: "সাধারণ, মাদ্রাসা ও কারিগরি শিক্ষার্থীদের জন্য আলাদা কন্টেন্ট", icon: GraduationCap, color: "bg-orange-500" },
]

const educationTypes = [
  { name: "সাধারণ শিক্ষা", desc: "বাংলা মিডিয়াম, ইংলিশ মিডিয়াম, ইংলিশ ভার্সন", icon: "🎓" },
  { name: "মাদ্রাসা শিক্ষা", desc: "আলিয়া মাদ্রাসা ও কওমি মাদ্রাসা", icon: "📖" },
  { name: "কারিগরি শিক্ষা", desc: "এসএসসি ভোকেশনাল", icon: "🔧" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">EduPortal <span className="text-blue-600">BD</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
                লগইন
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                নিবন্ধন করুন
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-bg pt-16 min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                বাংলাদেশের সেরা ডিজিটাল শিক্ষা প্ল্যাটফর্ম
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                স্মার্টভাবে<br />
                <span className="text-yellow-300">পড়ো, শেখো</span><br />
                এগিয়ে যাও!
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                NCTB পাঠ্যবই, বিশেষজ্ঞ ভিডিও লেসন, AI কুইজ এবং লাইভ লিডারবোর্ড — সব এক জায়গায়।
                ক্লাস ১ থেকে ১০ পর্যন্ত সকল শিক্ষাধারার শিক্ষার্থীদের জন্য।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg">
                  বিনামূল্যে শুরু করুন <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all text-center">
                  লগইন করুন
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Types */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">সকল শিক্ষাধারার জন্য</h2>
            <p className="text-slate-500 text-lg">আপনার শিক্ষাধারা যাই হোক, আমরা আছি আপনার পাশে</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {educationTypes.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 card-hover text-center"
              >
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{type.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">কেন EduPortal BD?</h2>
            <p className="text-slate-500 text-lg">আধুনিক প্রযুক্তি ও মানসম্পন্ন কন্টেন্টের সমন্বয়</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-200 card-hover"
              >
                <div className={`${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              আজই যোগ দিন, বিনামূল্যে!
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              ৫০,০০০ এর বেশি শিক্ষার্থী ইতিমধ্যে EduPortal BD ব্যবহার করছে।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {["✓ কোনো ক্রেডিট কার্ড লাগবে না", "✓ সম্পূর্ণ বিনামূল্যে", "✓ যেকোনো ডিভাইসে"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item.replace("✓ ", "")}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-2 shadow-lg">
                এখনই নিবন্ধন করুন <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">EduPortal BD</span>
          </div>
          <p className="text-sm">© 2026 EduPortal BD। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  )
}