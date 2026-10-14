"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { check, db } from "@/lib/db"
import { requireOwner } from "@/lib/owner"
import { SESSION_COOKIE, SESSION_DAYS, createSession, timingSafeEqual } from "@/lib/session"
import { normalizeContent, SECTIONS, type SectionId } from "@/lib/content"

const str = (form: FormData, name: string, max = 500) => String(form.get(name) ?? "").trim().slice(0, max)
const oneOf = <T extends string>(value: string, options: readonly T[], fallback: T): T =>
  (options as readonly string[]).includes(value) ? (value as T) : fallback
const isoDate = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null)

// ---------- Login ----------

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const expected = process.env.COMMAND_PASSWORD
  if (!expected) return "COMMAND_PASSWORD is not set on the server."
  // Compare digests so the comparison takes the same time whatever was typed
  const digest = async (s: string) => Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))).toString("hex")
  const given = String(form.get("password") ?? "")
  if (!timingSafeEqual(await digest(given), await digest(expected))) {
    await new Promise((r) => setTimeout(r, 800))
    return "That password is not right."
  }
  ;(await cookies()).set(SESSION_COOKIE, await createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_DAYS * 86400,
  })
  redirect("/command")
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect("/command/login")
}

// ---------- Launch ----------

export async function saveLaunch(form: FormData) {
  await requireOwner()
  const local = str(form, "launch_at", 20) // "2026-11-20T18:00" in the owner's own time zone
  const offset = Number(form.get("tz_offset")) // minutes, from the owner's browser
  let launchAt: string | null = null
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local) && Number.isFinite(offset)) {
    launchAt = new Date(Date.parse(local + ":00Z") + offset * 60000).toISOString()
  }
  check(await db().from("launch").update({ name: str(form, "name", 60) || "Next drop", launch_at: launchAt, updated_at: new Date().toISOString() }).eq("id", 1))
  revalidatePath("/command")
  revalidatePath("/")
}

// ---------- Content calendar ----------

const PLATFORMS = ["instagram", "tiktok", "x", "other"] as const
const POST_STATUS = ["idea", "draft", "scheduled", "posted"] as const

function postFields(form: FormData) {
  return {
    idea: str(form, "idea", 500),
    post_date: isoDate(str(form, "post_date", 10)),
    platform: oneOf(str(form, "platform"), PLATFORMS, "instagram"),
    status: oneOf(str(form, "status"), POST_STATUS, "idea"),
  }
}

export async function addPost(form: FormData) {
  await requireOwner()
  const fields = postFields(form)
  if (!fields.idea) return
  check(await db().from("posts").insert(fields))
  revalidatePath("/command", "layout")
}

export async function updatePost(form: FormData) {
  await requireOwner()
  const fields = postFields(form)
  if (!fields.idea) return
  check(await db().from("posts").update(fields).eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

export async function deletePost(form: FormData) {
  await requireOwner()
  check(await db().from("posts").delete().eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

// ---------- Supplier and sample board ----------

const CATEGORIES = ["supplier", "sample", "other"] as const
const TASK_STATUS = ["todo", "waiting", "done"] as const

function taskFields(form: FormData) {
  return {
    title: str(form, "title", 200),
    category: oneOf(str(form, "category"), CATEGORIES, "other"),
    status: oneOf(str(form, "status"), TASK_STATUS, "todo"),
    contact: str(form, "contact", 200) || null,
    due_on: isoDate(str(form, "due_on", 10)),
    notes: str(form, "notes", 2000) || null,
  }
}

export async function addTask(form: FormData) {
  await requireOwner()
  const fields = taskFields(form)
  if (!fields.title) return
  check(await db().from("tasks").insert(fields))
  revalidatePath("/command", "layout")
}

export async function updateTask(form: FormData) {
  await requireOwner()
  const fields = taskFields(form)
  if (!fields.title) return
  check(await db().from("tasks").update(fields).eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

export async function moveTask(form: FormData) {
  await requireOwner()
  check(await db().from("tasks").update({ status: oneOf(str(form, "status"), TASK_STATUS, "todo") }).eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

export async function deleteTask(form: FormData) {
  await requireOwner()
  check(await db().from("tasks").delete().eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

// ---------- Waitlist ----------

export async function removeFromWaitlist(form: FormData) {
  await requireOwner()
  check(await db().from("waitlist").delete().eq("id", str(form, "id", 40)))
  revalidatePath("/command", "layout")
}

// ---------- Store text and layout ----------

export async function saveStore(form: FormData) {
  await requireOwner()
  const labels = form.getAll("row_label").map(String)
  const values = form.getAll("row_value").map(String)
  const order = [...SECTIONS].sort((a, b) => Number(form.get("order_" + a)) - Number(form.get("order_" + b)))
  const content = normalizeContent({
    announcement: str(form, "announcement"),
    statement: str(form, "statement"),
    heroButton: str(form, "heroButton"),
    dropTitle: str(form, "dropTitle"),
    nextTitle: str(form, "nextTitle"),
    nextNote: str(form, "nextNote"),
    infoTitle: str(form, "infoTitle"),
    infoLede: str(form, "infoLede"),
    infoRows: labels.map((label, i) => ({ label, value: values[i] ?? "" })),
    layout: {
      order,
      hidden: SECTIONS.filter((s) => form.get("show_" + s) !== "on") as SectionId[],
      mainFeed: str(form, "mainFeed", 60),
    },
  })
  check(await db().from("site_content").update({ content, updated_at: new Date().toISOString() }).eq("id", 1))
  revalidatePath("/command/store")
  redirect("/command/store?saved=1")
}

export async function resetStore() {
  await requireOwner()
  check(await db().from("site_content").update({ content: {}, updated_at: new Date().toISOString() }).eq("id", 1))
  revalidatePath("/command/store")
  redirect("/command/store?saved=1")
}
