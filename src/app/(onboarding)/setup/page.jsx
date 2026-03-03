"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { GraduationCap, ArrowLeft, Check } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import useAuthStore from "@/lib/store/authStore"
import useOnboardingStore from "@/lib/store/onboardingStore"
import { resolveSubjects, EDUCATION_TYPES, MEDIUMS, GENERAL_LEVELS, MADRASA_STREAMS, ALIYA_LEVELS, QAWMI_LEVELS, GROUPS, GROUP_REQUIRED_CLASSES, MADRASA_GROUP_REQUIRED } from "@/lib/utils/subjectMapper"

// ─── Step definitions per flow ────────────────────────────────────────────────
const STEP_LABELS = {
  0: "শিক্ষাধারা",
  1: "মাধ্যম / স্ট্রিম",
  2: "স্তর",
  3: "শ্রেণি",
  4: "বিভাগ",
}

// ─── Reusable Option Card ─────────────────────────────────────────────────────
function OptionCard({ icon, label, sublabel, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%",
      padding: "16px 20px",
      background: selected ? "#eff6ff" : "#f8fafc",
      border: selected ? "2px solid #2563eb" : "2px solid #e2e8f0",
      borderRadius: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      transition: "all 0.18s",
      textAlign: "left",
      fontFamily: "inherit",
      position: "relative",
    }}>
      {icon && <span style={{ fontSize: "24px", flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: "600", color: selected ? "#1d4ed8" : "#0f172a" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{sublabel}</div>
        )}
      </div>
      {selected && (
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Check size={13} color="white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// ─── Class Grid ───────────────────────────────────────────────────────────────
function ClassGrid({ classes, selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
      {classes.map((cls) => (
        <button key={cls} onClick={() => onSelect(cls)} style={{
          padding: "14px 8px",
          background: selected === cls ? "#eff6ff" : "#f8fafc",
          border: selected === cls ? "2px solid #2563eb" : "2px solid #e2e8f0",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          color: selected === cls ? "#1d4ed8" : "#374151",
          fontFamily: "inherit",
          transition: "all 0.18s",
          textAlign: "center",
        }}>
          {cls.replace("Class ", "")} শ্রেণি
        </button>
      ))}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
// function ProgressBar({ current, total }) {
//   const pct = Math.round((current / total) * 100)
//   return (
//     <div style={{ marginBottom: "28px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
//         <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
//           ধাপ {current} / {total}
//         </span>
//         <span style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>{pct}%</span>
//       </div>
//       <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
//         <div style={{
//           height: "100%",
//           width: `${pct}%`,
//           background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
//           borderRadius: "99px",
//           transition: "width 0.4s ease",
//         }} />
//       </div>
//     </div>
//   )
// }

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SetupPage() {
  const router = useRouter()
  const { user, updateProfile } = useAuthStore()
  const { currentStep, selections, stepHistory, setSelection, goToStep, goBack, resetOnboarding } = useOnboardingStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/login")
    else if (user.isOnboarded) router.push("/dashboard")
  }, [user])

  // Compute total steps based on flow
  const getTotalSteps = () => {
    if (!selections.educationType) return 4
    if (selections.educationType === "technical") return 1
    if (selections.educationType === "madrasa") {
      if (selections.stream === "qawmi") return 3
      if (selections.stream === "aliya") {
        if (selections.level === "dakhil" && GROUP_REQUIRED_CLASSES.includes(selections.className)) return 5
        return 4
      }
      return 3
    }
    // general
    if (selections.level === "secondary" && GROUP_REQUIRED_CLASSES.includes(selections.className)) return 5
    return 4
  }

  const totalSteps = getTotalSteps()

  // ── Handle next step logic ──────────────────────────────────────────────────
  const handleEducationType = (type) => {
    setSelection("educationType", type)
    setSelection("medium", null)
    setSelection("stream", null)
    setSelection("level", null)
    setSelection("className", null)
    setSelection("group", null)
    if (type === "technical") {
      goToStep(10) // straight to confirm
    } else if (type === "madrasa") {
      goToStep(2) // stream selection
    } else {
      goToStep(1) // medium selection
    }
  }

  const handleMedium = (medium) => {
    setSelection("medium", medium)
    goToStep(3) // level
  }

  const handleStream = (stream) => {
    setSelection("stream", stream)
    setSelection("level", null)
    setSelection("className", null)
    setSelection("group", null)
    if (stream === "qawmi") {
      goToStep(6) // qawmi level
    } else {
      goToStep(5) // aliya level
    }
  }

  const handleLevel = (level) => {
    setSelection("level", level)
    setSelection("className", null)
    setSelection("group", null)
    goToStep(4) // class selection
  }

  const handleQawmiLevel = (level) => {
    setSelection("level", level)
    handleComplete({ ...selections, level })
  }

  const handleClass = (cls) => {
    setSelection("className", cls)
    const needsGroup =
      (selections.educationType === "general" && GROUP_REQUIRED_CLASSES.includes(cls)) ||
      (selections.educationType === "madrasa" && selections.stream === "aliya" && MADRASA_GROUP_REQUIRED.includes(cls))

    if (needsGroup) {
      goToStep(9) // group
    } else {
      handleComplete({ ...selections, className: cls })
    }
  }

  const handleGroup = (group) => {
    setSelection("group", group)
    handleComplete({ ...selections, group })
  }

  const handleComplete = (finalSelections) => {
    const profile = finalSelections || selections
    const subjects = resolveSubjects(profile)
    updateProfile({ ...profile, subjects })
    toast.success("প্রোফাইল সেটআপ সম্পন্ন হয়েছে!")
    resetOnboarding()
    router.push("/dashboard")
  }

  // ── Render correct step ─────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {

      // Step 0 — Education Type
      case 0:
        return (
          <StepWrapper title="আপনার শিক্ষাধারা বেছে নিন" subtitle="আপনি কোন ধরনের শিক্ষা প্রতিষ্ঠানে পড়েন?" stepNum={1} total={totalSteps}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {EDUCATION_TYPES.map(type => (
                <OptionCard
                  key={type.id}
                  icon={type.icon}
                  label={type.label}
                  sublabel={type.labelEn}
                  selected={selections.educationType === type.id}
                  onClick={() => handleEducationType(type.id)}
                />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 1 — Medium (General only)
      case 1:
        return (
          <StepWrapper title="মাধ্যম বেছে নিন" subtitle="আপনার বিদ্যালয়ের শিক্ষার মাধ্যম কী?" stepNum={2} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {MEDIUMS.map(m => (
                <OptionCard key={m.id} label={m.label} sublabel={m.labelEn}
                  selected={selections.medium === m.id} onClick={() => handleMedium(m.id)} />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 2 — Madrasa Stream
      case 2:
        return (
          <StepWrapper title="মাদ্রাসার ধরন বেছে নিন" subtitle="আপনি কোন ধারার মাদ্রাসায় পড়েন?" stepNum={2} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {MADRASA_STREAMS.map(s => (
                <OptionCard key={s.id} label={s.label} sublabel={s.labelEn}
                  selected={selections.stream === s.id} onClick={() => handleStream(s.id)} />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 3 — General Level
      case 3:
        return (
          <StepWrapper title="স্তর বেছে নিন" subtitle="আপনি কোন স্তরে পড়েন?" stepNum={3} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {GENERAL_LEVELS.map(l => (
                <OptionCard key={l.id} label={l.label} sublabel={l.labelEn}
                  selected={selections.level === l.id} onClick={() => handleLevel(l.id)} />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 4 — Class selection (General)
      case 4: {
        const levelData = GENERAL_LEVELS.find(l => l.id === selections.level)
        return (
          <StepWrapper title="শ্রেণি বেছে নিন" subtitle="আপনি কোন শ্রেণিতে পড়েন?" stepNum={4} total={totalSteps} onBack={goBack}>
            <ClassGrid classes={levelData?.classes || []} selected={selections.className} onSelect={handleClass} />
          </StepWrapper>
        )
      }

      // Step 5 — Aliya Level
      case 5:
        return (
          <StepWrapper title="আলিয়া স্তর বেছে নিন" subtitle="আপনি কোন স্তরে পড়েন?" stepNum={3} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ALIYA_LEVELS.map(l => (
                <OptionCard key={l.id} label={l.label} sublabel={l.labelEn}
                  selected={selections.level === l.id} onClick={() => handleLevel(l.id)} />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 6 — Qawmi Level
      case 6:
        return (
          <StepWrapper title="কওমি স্তর বেছে নিন" subtitle="আপনি কোন স্তরে পড়েন?" stepNum={3} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {QAWMI_LEVELS.map(l => (
                <OptionCard key={l.id} label={l.label} sublabel={l.labelEn}
                  selected={selections.level === l.id} onClick={() => handleQawmiLevel(l.id)} />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 9 — Group selection
      case 9:
        return (
          <StepWrapper title="বিভাগ বেছে নিন" subtitle="আপনি কোন বিভাগে পড়েন?" stepNum={totalSteps} total={totalSteps} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {GROUPS.map(g => (
                <OptionCard
                  key={g.id}
                  icon={g.id === "science" ? "🔬" : g.id === "commerce" ? "💼" : "🎭"}
                  label={g.label}
                  sublabel={g.labelEn}
                  selected={selections.group === g.id}
                  onClick={() => handleGroup(g.id)}
                />
              ))}
            </div>
          </StepWrapper>
        )

      // Step 10 — Technical confirm
      case 10:
        return (
          <StepWrapper title="কারিগরি শিক্ষা" subtitle="আপনার কোর্স নিশ্চিত করুন" stepNum={1} total={1} onBack={goBack}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <OptionCard icon="🛠️" label="এসএসসি ভোকেশনাল" sublabel="SSC Vocational"
                selected={true} onClick={() => {}} />
              <button onClick={() => handleComplete(selections)} style={{
                width: "100%", padding: "14px", marginTop: "8px",
                background: "#1e40af", border: "none", borderRadius: "12px",
                color: "white", fontSize: "15px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}>
                সম্পন্ন করুন →
              </button>
            </div>
          </StepWrapper>
        )

      default:
        return null
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        .setup-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #bfdbfe 0%, #dbeafe 40%, #e0f2fe 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .bg-c1{position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,0.28);pointer-events:none;}
        .bg-c2{position:absolute;bottom:-120px;left:-80px;width:350px;height:350px;border-radius:50%;background:rgba(255,255,255,0.2);pointer-events:none;}
        .logo-wrap{display:flex;align-items:center;gap:10px;margin-bottom:24px;text-decoration:none;z-index:1;}
        .logo-icon{width:42px;height:42px;background:#2563eb;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(37,99,235,0.4);}
        .logo-text{font-size:19px;font-weight:800;color:#1e3a8a;}
        .logo-text span{color:#2563eb;}
        .card{width:100%;max-width:480px;background:rgba(255,255,255,0.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.95);border-radius:24px;padding:36px;box-shadow:0 8px 32px rgba(37,99,235,0.13),0 1px 3px rgba(0,0,0,0.05);z-index:1;}
        .step-title{font-size:20px;font-weight:700;color:#0f172a;margin-bottom:6px;}
        .step-sub{font-size:13px;color:#64748b;margin-bottom:24px;}
        .back-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;padding:0;font-family:inherit;margin-bottom:20px;}
        .footer-text{margin-top:18px;color:rgba(30,58,138,0.4);font-size:12px;z-index:1;}
        @media(max-width:520px){.card{padding:28px 20px;}}
      `}</style>

      <div className="setup-page">
        <div className="bg-c1" /><div className="bg-c2" />

        <Link href="/" className="logo-wrap">
          <div className="logo-icon"><GraduationCap size={21} color="white" /></div>
          <span className="logo-text">EduPortal <span>BD</span></span>
        </Link>

        <div className="card">
          {renderStep()}
        </div>

        <p className="footer-text">© ২০২৪ EduPortal BD</p>
      </div>
    </>
  )
}

// ─── Step Wrapper Component ───────────────────────────────────────────────────
function StepWrapper({ title, subtitle, stepNum, total, onBack, children }) {
  return (
    <div>
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={15} /> পেছনে যান
        </button>
      )}
      <ProgressBar current={stepNum} total={total} />
      <h2 className="step-title">{title}</h2>
      <p className="step-sub">{subtitle}</p>
      {children}
    </div>
  )
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>ধাপ {current} / {total}</span>
        <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>{pct}%</span>
      </div>
      <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg,#2563eb,#0ea5e9)",
          borderRadius: "99px", transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  )
}
// ```

// ---

// ## Phase 2 Checklist
// ```
// □ Create src/lib/utils/subjectMapper.js
// □ Create src/lib/store/onboardingStore.js
// □ Create src/app/(onboarding)/layout.jsx
// □ Create src/app/(onboarding)/setup/page.jsx
// □ npm run dev → go to /setup after login
// □ Test General → Bangla Medium → Secondary → Class 10 → Science
// □ Test Madrasa → Aliya → Dakhil → Class 9 → Science
// □ Test Madrasa → Qawmi → Dawra-e-Hadith
// □ Test Technical → SSC Vocational
// □ Confirm profile saves to Zustand
// □ Confirm redirect to /dashboard after completion