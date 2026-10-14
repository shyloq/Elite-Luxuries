import { check, db } from "@/lib/db"
import { addTask, deleteTask, moveTask, updateTask } from "../../actions"

type Task = { id: string; title: string; category: string; status: string; contact: string | null; due_on: string | null; notes: string | null }

const COLUMNS = [["todo", "To do"], ["waiting", "Waiting on someone"], ["done", "Done"]] as const
const CATEGORIES = ["supplier", "sample", "other"]

function TaskFields({ task }: { task?: Task }) {
  return (
    <>
      <label className="wide">Task<input name="title" defaultValue={task?.title} maxLength={200} required /></label>
      <label>Type<select name="category" defaultValue={task?.category ?? "supplier"}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>Due<input type="date" name="due_on" defaultValue={task?.due_on ?? ""} /></label>
      <label className="wide">Contact<input name="contact" defaultValue={task?.contact ?? ""} maxLength={200} placeholder="Who, and how to reach them" /></label>
      <label className="wide">Notes<textarea name="notes" defaultValue={task?.notes ?? ""} maxLength={2000} rows={2} /></label>
    </>
  )
}

export default async function Board() {
  const tasks = check(await db().from("tasks").select("*").order("due_on", { nullsFirst: false }).order("created_at")) as Task[]
  const today = new Date().toISOString().slice(0, 10)
  return (
    <>
      <h1 className="cc-title">Suppliers and samples</h1>
      <div className="board">
        {COLUMNS.map(([status, label], col) => (
          <section key={status} className="board__col" aria-labelledby={"col-" + status}>
            <h2 id={"col-" + status}>{label} <span className="data muted">{tasks.filter((t) => t.status === status).length}</span></h2>
            {tasks.filter((t) => t.status === status).map((t) => (
              <article key={t.id} className="card">
                <p className="card__meta"><span className={"tag tag--" + t.category}>{t.category}</span>
                  {t.due_on && <span className={"data" + (t.due_on < today && status !== "done" ? " overdue" : "")}>due {t.due_on}</span>}</p>
                <h3 className="card__title">{t.title}</h3>
                {t.contact && <p className="card__line">{t.contact}</p>}
                {t.notes && <p className="card__line muted">{t.notes}</p>}
                <div className="card__actions">
                  {col > 0 && <form action={moveTask}><input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value={COLUMNS[col - 1][0]} /><button className="link-btn" type="submit">&larr; {COLUMNS[col - 1][1]}</button></form>}
                  {col < COLUMNS.length - 1 && <form action={moveTask}><input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value={COLUMNS[col + 1][0]} /><button className="link-btn" type="submit">{COLUMNS[col + 1][1]} &rarr;</button></form>}
                </div>
                <details className="card__edit">
                  <summary>Edit</summary>
                  <form action={updateTask} className="post-form">
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value={t.status} />
                    <TaskFields task={t} />
                    <div className="post-form__actions">
                      <button className="btn btn--small" type="submit">Save</button>
                      <button className="link-btn link-btn--danger" type="submit" formAction={deleteTask} formNoValidate>Delete</button>
                    </div>
                  </form>
                </details>
              </article>
            ))}
          </section>
        ))}
      </div>
      <section className="panel">
        <h2>New task</h2>
        <form action={addTask} className="post-form">
          <input type="hidden" name="status" value="todo" />
          <TaskFields />
          <div className="post-form__actions"><button className="btn btn--small" type="submit">Add task</button></div>
        </form>
      </section>
    </>
  )
}
