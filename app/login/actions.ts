"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prismaClient } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let admin;
  try {
    admin = await prismaClient.admin.findUnique({ where: { email } });
  } catch {
    return { error: "Database error. Please try again." };
  }

  if (!admin) {
    return { error: "Invalid email." };
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return { error: "Invalid email or password." };
  }

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
