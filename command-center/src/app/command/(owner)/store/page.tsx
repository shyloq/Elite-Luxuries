import { check, db } from "@/lib/db"
import { LIMITS, normalizeContent, SECTION_NAMES, SECTIONS } from "@/lib/content"
import { resetStore, saveStore } from "../../actions"

export default async function Store({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const row = check(await db().from("site_content").select("content, updated_at").eq("id", 1).single()) as { content: unknown; updated_at: string }
  const c = normalizeContent(row.content)
  const rows = [...c.infoRows, ...Array(Math.max(0, LIMITS.rows - c.infoRows.length)).fill({ label: "", value: "" })].slice(0, LIMITS.rows)
  const storeUrl = process.env.STORE_URL
  return (
    <>
      <div className="panel__head">
        <h1 className="cc-title">Store</h1>
        {storeUrl && <a href={storeUrl} target="_blank" rel="noreferrer">Open the store</a>}
      </div>
      <p className="muted">Changes show on the store within a minute. Products, prices and stock are edited in the store admin (your Railway address plus /app).</p>
      {saved && <p className="form-done" role="status">Saved.</p>}
      {/* Keyed on the save time, so the fields show what was just saved (or reset) */}
      <form key={row.updated_at} action={saveStore} className="store-form">
        <section className="panel">
          <h2>Layout</h2>
          <p className="muted">The opening camera and statement always come first. Number the rest in the order they should appear.</p>
          <div className="layout-rows">
            {SECTIONS.map((s) => (
              <div key={s} className="layout-row">
                <label className="inline">Position
                  <select name={"order_" + s} defaultValue={c.layout.order.indexOf(s) + 1}>{SECTIONS.map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
                </label>
                <label className="inline check"><input type="checkbox" name={"show_" + s} defaultChecked={!c.layout.hidden.includes(s)} /> Show</label>
                <span>{SECTION_NAMES[s]}</span>
              </div>
            ))}
          </div>
          <label>Main feed (the large camera)
            <input name="mainFeed" defaultValue={c.layout.mainFeed} maxLength={LIMITS.short} placeholder="Exact product name, e.g. Vault Hoodie. Empty: the first product." />
          </label>
        </section>
        <section className="panel">
          <h2>Text</h2>
          <label>Announcement bar <span className="muted">(empty hides it)</span><input name="announcement" defaultValue={c.announcement} maxLength={LIMITS.line} /></label>
          <label>Statement on the opening camera<input name="statement" defaultValue={c.statement} maxLength={LIMITS.line} required /></label>
          <label>Its button<input name="heroButton" defaultValue={c.heroButton} maxLength={LIMITS.short} required /></label>
          <label>Drop title (also the menu link)<input name="dropTitle" defaultValue={c.dropTitle} maxLength={LIMITS.short} required /></label>
          <label>Next drop title<input name="nextTitle" defaultValue={c.nextTitle} maxLength={LIMITS.short} required /></label>
          <label>Next drop note<input name="nextNote" defaultValue={c.nextNote} maxLength={LIMITS.line} /></label>
          <label>Info title<input name="infoTitle" defaultValue={c.infoTitle} maxLength={LIMITS.short} required /></label>
          <label>Info paragraph<textarea name="infoLede" defaultValue={c.infoLede} maxLength={LIMITS.long} rows={3} /></label>
          <fieldset className="rows">
            <legend>Info rows <span className="muted">(leave a row empty to remove it)</span></legend>
            {rows.map((r, i) => (
              <div key={i} className="info-row">
                <input name="row_label" defaultValue={r.label} maxLength={LIMITS.short} aria-label={`Row ${i + 1} label`} placeholder="Label" />
                <input name="row_value" defaultValue={r.value} maxLength={LIMITS.line} aria-label={`Row ${i + 1} text`} placeholder="Text" />
              </div>
            ))}
          </fieldset>
        </section>
        <div className="store-form__actions">
          <button className="btn" type="submit">Save store</button>
          <button className="link-btn" type="submit" formAction={resetStore} formNoValidate>Reset to the original text</button>
          <span className="muted data">Last saved {row.updated_at.slice(0, 16).replace("T", " ")} UTC</span>
        </div>
      </form>
    </>
  )
}
