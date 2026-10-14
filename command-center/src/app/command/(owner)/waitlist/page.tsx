import { check, db } from "@/lib/db"
import { removeFromWaitlist } from "../../actions"

type Entry = { id: string; email: string; source: string; created_at: string }

export default async function Waitlist() {
  const list = check(await db().from("waitlist").select("id, email, source, created_at").order("created_at", { ascending: false }).limit(1000)) as Entry[]
  return (
    <>
      <div className="panel__head">
        <h1 className="cc-title">Waitlist <span className="data muted">{list.length}</span></h1>
        {list.length > 0 && <a className="btn btn--small" href="/command/waitlist/export" download>Download CSV</a>}
      </div>
      {list.length ? (
        <table className="table">
          <thead><tr><th scope="col">Email</th><th scope="col">From</th><th scope="col">Joined</th><th scope="col"><span className="sr-only">Remove</span></th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>{e.email}</td><td className="data">{e.source}</td><td className="data">{e.created_at.slice(0, 16).replace("T", " ")}</td>
                <td><form action={removeFromWaitlist}><input type="hidden" name="id" value={e.id} /><button className="link-btn link-btn--danger" type="submit" aria-label={"Remove " + e.email}>Remove</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted">No one yet. Share the launch page, or open the store: its Next drop section has the same form.</p>}
    </>
  )
}
