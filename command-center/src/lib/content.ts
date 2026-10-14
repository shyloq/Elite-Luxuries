// The store's editable text and layout. The defaults are the store's own text, so an
// empty or partial record in the database never blanks the site.
export const SECTIONS = ["drop", "next", "info"] as const
export type SectionId = (typeof SECTIONS)[number]

export const SECTION_NAMES: Record<SectionId, string> = {
  drop: "The drop (monitor wall)",
  next: "Next drop (countdown and waitlist)",
  info: "How the vault works",
}

export type InfoRow = { label: string; value: string }

export type SiteContent = {
  announcement: string
  statement: string
  heroButton: string
  dropTitle: string
  nextTitle: string
  nextNote: string
  infoTitle: string
  infoLede: string
  infoRows: InfoRow[]
  layout: { order: SectionId[]; hidden: SectionId[]; mainFeed: string }
}

export const DEFAULT_CONTENT: SiteContent = {
  announcement: "",
  statement: "Made in numbered runs. Locked until the drop.",
  heroButton: "View Drop 03",
  dropTitle: "Drop 03",
  nextTitle: "Next drop",
  nextNote: "Join the waitlist and we'll email you before the vault opens.",
  infoTitle: "How the vault works",
  infoLede: "VULT LABEL is a new label. Every visit starts at the door, and the combination is written on it.",
  infoRows: [
    { label: "Restocks", value: "Drops: never. Core line: always." },
    { label: "Shipping", value: "United States only. $8, free from $150." },
    { label: "Entry", value: "12 · 47 · 83" },
  ],
  layout: { order: ["drop", "next", "info"], hidden: [], mainFeed: "" },
}

export const LIMITS = { short: 60, line: 140, long: 400, rows: 8 }

const text = (value: unknown, fallback: string, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : fallback

/** Merge a stored or submitted record with the defaults, dropping anything malformed. */
export function normalizeContent(raw: unknown): SiteContent {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>
  const d = DEFAULT_CONTENT
  const rows = Array.isArray(r.infoRows)
    ? r.infoRows
        .map((row: any) => ({ label: text(row?.label, "", LIMITS.short), value: text(row?.value, "", LIMITS.line) }))
        .filter((row: InfoRow) => row.label && row.value)
        .slice(0, LIMITS.rows)
    : d.infoRows
  const layout = (r.layout && typeof r.layout === "object" ? r.layout : {}) as Record<string, any>
  const order = Array.isArray(layout.order) ? layout.order.filter((s: any) => SECTIONS.includes(s)) : []
  const fullOrder = [...new Set([...order, ...d.layout.order])] as SectionId[]
  const hidden = Array.isArray(layout.hidden) ? [...new Set(layout.hidden.filter((s: any) => SECTIONS.includes(s)))] as SectionId[] : []
  return {
    announcement: text(r.announcement, d.announcement, LIMITS.line),
    statement: text(r.statement, d.statement, LIMITS.line) || d.statement,
    heroButton: text(r.heroButton, d.heroButton, LIMITS.short) || d.heroButton,
    dropTitle: text(r.dropTitle, d.dropTitle, LIMITS.short) || d.dropTitle,
    nextTitle: text(r.nextTitle, d.nextTitle, LIMITS.short) || d.nextTitle,
    nextNote: text(r.nextNote, d.nextNote, LIMITS.line),
    infoTitle: text(r.infoTitle, d.infoTitle, LIMITS.short) || d.infoTitle,
    infoLede: text(r.infoLede, d.infoLede, LIMITS.long),
    infoRows: rows,
    layout: { order: fullOrder, hidden, mainFeed: text(layout.mainFeed, "", LIMITS.short) },
  }
}

export const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
