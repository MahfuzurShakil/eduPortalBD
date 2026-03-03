import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone) {
  return phone.replace(/(\d{5})(\d{6})/, "$1-$2")
}

export function generateOTP() {
  return "123456" // Always 123456 for demo
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}