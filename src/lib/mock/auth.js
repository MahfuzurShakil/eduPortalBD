import usersData from "@/data/users.json"
import { sleep } from "@/lib/utils"

const STORAGE_KEY = "eduportal-users"

// Load users: merge JSON seed with any localStorage-persisted users
function loadUsers() {
  if (typeof window === "undefined") return [...usersData]
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const storedUsers = stored ? JSON.parse(stored) : []
    // Merge: stored users override seed users by phone
    const merged = [...usersData]
    storedUsers.forEach((su) => {
      const idx = merged.findIndex((u) => u.phone === su.phone)
      if (idx !== -1) merged[idx] = su
      else merged.push(su)
    })
    return merged
  } catch {
    return [...usersData]
  }
}

function saveUsers(users) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {}
}

export async function registerUser(formData) {
  await sleep(1000)
  const users = loadUsers()
  const exists = users.find((u) => u.phone === formData.phone)
  if (exists) throw new Error("এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত।")

  const newUser = {
    id: `u${Date.now()}`,
    ...formData,
    role: "student",
    isOnboarded: false,
    profile: null,
    quizHistory: [],
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)
  return { success: true, user: newUser }
}

export async function loginUser(phone, pin) {
  await sleep(800)
  const users = loadUsers()
  const user = users.find((u) => u.phone === phone && u.pin === pin)
  if (!user) throw new Error("ফোন নম্বর বা পিন সঠিক নয়।")
  return { success: true, user }
}

export async function verifyOTP(phone, otp) {
  await sleep(600)
  if (otp !== "123456") throw new Error("OTP সঠিক নয়। সঠিক OTP দিন।")
  return { success: true }
}

export async function resetPin(phone, newPin) {
  await sleep(800)
  const users = loadUsers()
  const idx = users.findIndex((u) => u.phone === phone)
  if (idx === -1) throw new Error("এই ফোন নম্বরটি নিবন্ধিত নয়।")
  users[idx].pin = newPin
  saveUsers(users)
  return { success: true }
}

export async function sendOTP(phone) {
  await sleep(600)
  return { success: true, message: "OTP পাঠানো হয়েছে।" }
}

// Call this after onboarding completes to persist profile to localStorage
export function persistUserProfile(phone, profile) {
  const users = loadUsers()
  const idx = users.findIndex((u) => u.phone === phone)
  if (idx !== -1) {
    users[idx].isOnboarded = true
    users[idx].profile = profile
    saveUsers(users)
  }
}