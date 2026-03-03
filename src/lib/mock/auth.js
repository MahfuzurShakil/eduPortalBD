import usersData from "@/data/users.json"
import { sleep } from "@/lib/utils"

// In-memory user store (starts from JSON seed)
let users = [...usersData]

export async function registerUser(formData) {
  await sleep(1000) // simulate API delay

  const exists = users.find((u) => u.phone === formData.phone)
  if (exists) {
    throw new Error("এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত।")
  }

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
  return { success: true, user: newUser }
}

export async function loginUser(phone, pin) {
  await sleep(800)

  const user = users.find((u) => u.phone === phone && u.pin === pin)
  if (!user) {
    throw new Error("ফোন নম্বর বা পিন সঠিক নয়।")
  }

  return { success: true, user }
}

export async function verifyOTP(phone, otp) {
  await sleep(600)

  // Demo: always accept 123456
  if (otp !== "123456") {
    throw new Error("OTP সঠিক নয়। সঠিক OTP দিন।")
  }

  return { success: true }
}

export async function resetPin(phone, newPin) {
  await sleep(800)

  const userIndex = users.findIndex((u) => u.phone === phone)
  if (userIndex === -1) {
    throw new Error("এই ফোন নম্বরটি নিবন্ধিত নয়।")
  }

  users[userIndex].pin = newPin
  return { success: true }
}

export async function sendOTP(phone) {
  await sleep(600)

  // In demo, just validate phone exists for forgot-pin
  return { success: true, message: "OTP পাঠানো হয়েছে।" }
}