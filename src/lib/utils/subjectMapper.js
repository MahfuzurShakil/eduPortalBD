// ─── Education Flow Configuration ───────────────────────────────────────────

export const EDUCATION_TYPES = [
  { id: "general", label: "সাধারণ শিক্ষা", labelEn: "General Education", icon: "🎓" },
  { id: "madrasa", label: "মাদ্রাসা শিক্ষা", labelEn: "Madrasa Education", icon: "📖" },
  { id: "technical", label: "কারিগরি শিক্ষা", labelEn: "Technical / Vocational", icon: "🔧" },
]

export const MEDIUMS = [
  { id: "bangla", label: "বাংলা মিডিয়াম", labelEn: "Bangla Medium" },
  { id: "english", label: "ইংলিশ মিডিয়াম", labelEn: "English Medium" },
  { id: "english_version", label: "ইংলিশ ভার্সন", labelEn: "English Version" },
]

export const GENERAL_LEVELS = [
  { id: "primary", label: "প্রাথমিক স্তর", labelEn: "Primary Level", classes: ["Class 1","Class 2","Class 3","Class 4","Class 5"] },
  { id: "secondary", label: "মাধ্যমিক স্তর", labelEn: "Secondary Level", classes: ["Class 6","Class 7","Class 8","Class 9","Class 10"] },
]

export const MADRASA_STREAMS = [
  { id: "aliya", label: "আলিয়া মাদ্রাসা", labelEn: "Aliya Madrasa" },
  { id: "qawmi", label: "কওমি মাদ্রাসা", labelEn: "Qawmi Madrasa" },
]

export const ALIYA_LEVELS = [
  { id: "ebtedayi", label: "এবতেদায়ি", labelEn: "Ebtedayi (Class 1–5)", classes: ["Class 1","Class 2","Class 3","Class 4","Class 5"] },
  { id: "dakhil", label: "দাখিল", labelEn: "Dakhil (Class 6–10)", classes: ["Class 6","Class 7","Class 8","Class 9","Class 10"] },
]

export const QAWMI_LEVELS = [
  { id: "ibtidai", label: "ইবতিদাই", labelEn: "Ibtidai" },
  { id: "mutawassitah", label: "মুতাওয়াসসিতাহ", labelEn: "Mutawassitah" },
  { id: "sanubia", label: "সানুবিয়া উলয়া", labelEn: "Sanubia Ulya" },
  { id: "dawra", label: "দাওরায়ে হাদিস", labelEn: "Dawra-e-Hadith" },
]

export const GROUPS = [
  { id: "science", label: "বিজ্ঞান", labelEn: "Science" },
  { id: "commerce", label: "ব্যবসায় শিক্ষা", labelEn: "Business Studies" },
  { id: "arts", label: "মানবিক", labelEn: "Humanities (Arts)" },
]

export const GROUP_REQUIRED_CLASSES = ["Class 9", "Class 10"]
export const MADRASA_GROUP_REQUIRED = ["Class 9", "Class 10"]

// ─── Subject Mapping ─────────────────────────────────────────────────────────

export const SUBJECTS = {
  // General - Primary (Class 1-5)
  general_primary: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "bgs", name: "বাংলাদেশ ও বিশ্বপরিচয়", icon: "🌍", color: "#10b981" },
    { id: "science", name: "বিজ্ঞান", icon: "🔬", color: "#f59e0b" },
    { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", icon: "☪️", color: "#6366f1" },
    { id: "arts", name: "চারু ও কারুকলা", icon: "🎨", color: "#ec4899" },
    { id: "pe", name: "শারীরিক শিক্ষা", icon: "⚽", color: "#14b8a6" },
  ],

  // General - Secondary Class 6-8
  general_secondary_junior: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "gen_science", name: "সাধারণ বিজ্ঞান", icon: "🔬", color: "#f59e0b" },
    { id: "bgs", name: "বাংলাদেশ ও বিশ্বপরিচয়", icon: "🌍", color: "#10b981" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
    { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", icon: "☪️", color: "#6366f1" },
    { id: "pe", name: "শারীরিক শিক্ষা", icon: "⚽", color: "#14b8a6" },
  ],

  // General - Secondary Science (Class 9-10)
  general_secondary_science: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "physics", name: "পদার্থবিজ্ঞান", icon: "⚛️", color: "#f59e0b" },
    { id: "chemistry", name: "রসায়ন", icon: "🧪", color: "#10b981" },
    { id: "higher_math", name: "উচ্চতর গণিত", icon: "📐", color: "#6366f1" },
    { id: "biology", name: "জীববিজ্ঞান", icon: "🧬", color: "#ec4899" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
    { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", icon: "☪️", color: "#6366f1" },
  ],

  // General - Secondary Commerce (Class 9-10)
  general_secondary_commerce: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "gen_math", name: "সাধারণ গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "finance", name: "ফিন্যান্স ও ব্যাংকিং", icon: "💰", color: "#f59e0b" },
    { id: "business", name: "ব্যবসায় উদ্যোগ", icon: "📊", color: "#10b981" },
    { id: "accounting", name: "হিসাববিজ্ঞান", icon: "🧾", color: "#6366f1" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
    { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", icon: "☪️", color: "#6366f1" },
  ],

  // General - Secondary Arts (Class 9-10)
  general_secondary_arts: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "gen_math", name: "সাধারণ গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "civics", name: "পৌরনীতি ও নাগরিকতা", icon: "🏛️", color: "#f59e0b" },
    { id: "economics", name: "অর্থনীতি", icon: "📈", color: "#10b981" },
    { id: "history", name: "ইতিহাস / ভূগোল", icon: "🗺️", color: "#6366f1" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
    { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", icon: "☪️", color: "#6366f1" },
  ],

  // Madrasa - Ebtedayi (Class 1-5)
  madrasa_ebtedayi: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "gen_science", name: "সাধারণ বিজ্ঞান", icon: "🔬", color: "#f59e0b" },
    { id: "islamic", name: "ইসলাম শিক্ষা", icon: "☪️", color: "#10b981" },
    { id: "arabic", name: "আরবি", icon: "🌙", color: "#6366f1" },
  ],

  // Madrasa - Dakhil (Class 6-8)
  madrasa_dakhil_junior: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "arabic", name: "আরবি", icon: "🌙", color: "#6366f1" },
    { id: "islamic", name: "ইসলামিক স্টাডিজ", icon: "☪️", color: "#10b981" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
  ],

  // Madrasa - Dakhil Science (Class 9-10)
  madrasa_dakhil_science: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "arabic", name: "আরবি", icon: "🌙", color: "#6366f1" },
    { id: "islamic", name: "ইসলামিক স্টাডিজ", icon: "☪️", color: "#10b981" },
    { id: "physics", name: "পদার্থবিজ্ঞান", icon: "⚛️", color: "#f59e0b" },
    { id: "chemistry", name: "রসায়ন", icon: "🧪", color: "#ec4899" },
    { id: "biology", name: "জীববিজ্ঞান", icon: "🧬", color: "#14b8a6" },
  ],

  // Madrasa - Dakhil Humanities (Class 9-10)
  madrasa_dakhil_arts: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "arabic", name: "আরবি", icon: "🌙", color: "#6366f1" },
    { id: "islamic", name: "ইসলামিক স্টাডিজ", icon: "☪️", color: "#10b981" },
    { id: "history", name: "ইতিহাস", icon: "🗺️", color: "#f59e0b" },
    { id: "civics", name: "পৌরনীতি", icon: "🏛️", color: "#0ea5e9" },
    { id: "economics", name: "অর্থনীতি", icon: "📈", color: "#8b5cf6" },
  ],

  // Madrasa - Qawmi (all levels)
  madrasa_qawmi: [
    { id: "quran", name: "কুরআন মাজিদ", icon: "📖", color: "#10b981" },
    { id: "arabic", name: "আরবি", icon: "🌙", color: "#6366f1" },
    { id: "hadith", name: "হাদিস", icon: "☪️", color: "#f59e0b" },
    { id: "fiqh", name: "ফিকহ", icon: "📜", color: "#ef4444" },
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
  ],

  // Technical - SSC Vocational
  technical_ssc: [
    { id: "bangla", name: "বাংলা", icon: "📚", color: "#ef4444" },
    { id: "english", name: "English", icon: "📖", color: "#3b82f6" },
    { id: "math", name: "গণিত", icon: "🔢", color: "#8b5cf6" },
    { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", icon: "💻", color: "#0ea5e9" },
    { id: "trade_theory", name: "ট্রেড থিওরি", icon: "📋", color: "#f59e0b" },
    { id: "trade_practical", name: "ট্রেড প্র্যাকটিক্যাল", icon: "🔧", color: "#10b981" },
  ],
}

// ─── Subject Resolver ─────────────────────────────────────────────────────────
// Given a completed profile, returns the correct subject list

export function resolveSubjects(profile) {
  const { educationType, level, className, group, stream, qawmiLevel } = profile

  if (educationType === "general") {
    if (level === "primary") return SUBJECTS.general_primary
    if (level === "secondary") {
      if (["Class 6", "Class 7", "Class 8"].includes(className)) return SUBJECTS.general_secondary_junior
      if (group === "science") return SUBJECTS.general_secondary_science
      if (group === "commerce") return SUBJECTS.general_secondary_commerce
      if (group === "arts") return SUBJECTS.general_secondary_arts
    }
  }

  if (educationType === "madrasa") {
    if (stream === "qawmi") return SUBJECTS.madrasa_qawmi
    if (stream === "aliya") {
      if (level === "ebtedayi") return SUBJECTS.madrasa_ebtedayi
      if (level === "dakhil") {
        if (["Class 6", "Class 7", "Class 8"].includes(className)) return SUBJECTS.madrasa_dakhil_junior
        if (group === "science") return SUBJECTS.madrasa_dakhil_science
        if (group === "arts") return SUBJECTS.madrasa_dakhil_arts
      }
    }
  }

  if (educationType === "technical") return SUBJECTS.technical_ssc

  return []
}