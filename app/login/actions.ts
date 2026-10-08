"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prismaClient } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attemptsByEmail = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const entry = attemptsByEmail.get(email);
  const now = Date.now();

  if (!entry || now > entry.resetAt) {
    attemptsByEmail.set(email, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(email: string) {
  attemptsByEmail.delete(email);
}

const GENERIC_ERROR = "Invalid email or password.";

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (isRateLimited(email)) {
    return {
      error: "Too many sign-in attempts. Please try again in a few minutes.",
    };
  }

  let admin;
  try {
    admin = await prismaClient.admin.findUnique({ where: { email } });
  } catch {
    return { error: "Database error. Please try again." };
  }

  if (!admin) {
    return { error: GENERIC_ERROR };
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return { error: GENERIC_ERROR };
  }

  clearAttempts(email);

  try {
    await createSession(admin.id);
  } catch {
    return { error: "Session error. Please try again." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
