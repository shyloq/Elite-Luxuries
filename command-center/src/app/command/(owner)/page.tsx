import Link from "next/link"
import { check, db } from "@/lib/db"
import { Countdown } from "@/components/Countdown"
import { LaunchForm } from "./LaunchForm"

type Post = { id: string; post_date: string | null; platform: string; idea: string; status: string }

export default async function Overview() {
  const today = new Date().toISOString().slice(0, 10)
  const [launch, waitlist, tasks, posts] = await Promise.all([
    db().from("launch").select("name, launch_at").eq("id", 1).single(),
    db().from("waitlist").select("id", { count: "exact", head: true }),
    db().from("tasks").select("status"),
    db().from("posts").select("id, post_date, platform, idea, status").gte("post_date", today).order("post_date").limit(5),
  ])
  const l = check(launch) as { name: string; launch_at: string | null }
  const t = check(tasks) as { status: string }[]
  const count = (s: string) => t.filter((x) => x.status === s).length
  const upcoming = check(posts) as Post[]
  return (
    <>
      <section className="panel panel--feed">
        <p className="panel__label">Launch</p>
        <h1 className="cc-title">{l.name}</h1>
        <Countdown launchAt={l.launch_at} />
        <LaunchForm name={l.name} launchAt={l.launch_at} />
      </section>
      <div className="stats">
        <Link className="stat" href="/command/waitlist"><span className="stat__n">{waitlist.count ?? 0}</span><span>On the waitlist</span></Link>
        <Link className="stat" href="/command/board"><span className="stat__n">{count("todo")}</span><span>To do</span></Link>
        <Link className="stat" href="/command/board"><span className="stat__n">{count("waiting")}</span><span>Waiting on someone</span></Link>
        <Link className="stat" href="/command/board"><span className="stat__n">{count("done")}</span><span>Done</span></Link>
      </div>
      <section className="panel">
        <div className="panel__head"><h2>Coming up</h2><Link href="/command/calendar">Calendar</Link></div>
        {upcoming.length ? (
          <ul className="list">
            {upcoming.map((p) => (
              <li key={p.id}><span className="data">{p.post_date}</span><span className={"tag tag--" + p.platform}>{p.platform}</span><span>{p.idea}</span><span className="data">{p.status}</span></li>
            ))}
          </ul>
        ) : <p className="muted">Nothing scheduled yet. Give an idea a date in the calendar.</p>}
      </section>
    </>
  )
}
