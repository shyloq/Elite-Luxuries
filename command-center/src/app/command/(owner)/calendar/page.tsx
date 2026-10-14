import Link from "next/link"
import { check, db } from "@/lib/db"
import { PostForm, type Post } from "../PostForm"

const pad = (n: number) => String(n).padStart(2, "0")
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default async function Calendar({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams
  const now = new Date()
  const [year, month] = /^\d{4}-\d{2}$/.test(m ?? "") ? m!.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1]
  const first = `${year}-${pad(month)}-01`
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const last = `${year}-${pad(month)}-${pad(days)}`
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7 // Monday first
  const prev = month === 1 ? `${year - 1}-12` : `${year}-${pad(month - 1)}`
  const next = month === 12 ? `${year + 1}-01` : `${year}-${pad(month + 1)}`
  const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const [dated, bank] = await Promise.all([
    db().from("posts").select("id, post_date, platform, idea, status").gte("post_date", first).lte("post_date", last).order("created_at"),
    db().from("posts").select("id, post_date, platform, idea, status").is("post_date", null).order("created_at"),
  ])
  const posts = check(dated) as Post[]
  const ideas = check(bank) as Post[]

  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => `${year}-${pad(month)}-${pad(i + 1)}`)]
  while (cells.length % 7) cells.push(null) // finish the last week
  return (
    <>
      <div className="panel__head">
        <h1 className="cc-title">Content calendar</h1>
        <div className="month-nav"><Link href={`?m=${prev}`} aria-label="Previous month">&larr;</Link><span className="data">{label}</span><Link href={`?m=${next}`} aria-label="Next month">&rarr;</Link></div>
      </div>
      <div className="calendar" role="grid" aria-label={label}>
        {WEEKDAYS.map((d) => <div key={d} className="calendar__dow" role="columnheader">{d}</div>)}
        {cells.map((date, i) => date ? (
          <div key={date} className={"calendar__day" + (date === today ? " is-today" : "")} role="gridcell">
            <span className="calendar__num data">{Number(date.slice(8))}</span>
            {posts.filter((p) => p.post_date === date).map((p) => (
              <details key={p.id} className={"chip chip--" + p.status}>
                <summary><span className={"tag tag--" + p.platform}>{p.platform}</span> {p.idea}</summary>
                <PostForm post={p} />
              </details>
            ))}
          </div>
        ) : <div key={"blank" + i} className="calendar__day calendar__day--blank" aria-hidden="true" />)}
      </div>
      <div className="split">
        <section className="panel">
          <h2>New post</h2>
          <PostForm date={today.startsWith(`${year}-${pad(month)}`) ? today : first} />
        </section>
        <section className="panel">
          <h2>Idea bank <span className="data muted">{ideas.length}</span></h2>
          <p className="muted">Ideas without a date. Give one a date to put it on the calendar.</p>
          {ideas.map((p) => (
            <details key={p.id} className="chip chip--idea">
              <summary><span className={"tag tag--" + p.platform}>{p.platform}</span> {p.idea}</summary>
              <PostForm post={p} />
            </details>
          ))}
        </section>
      </div>
    </>
  )
}
