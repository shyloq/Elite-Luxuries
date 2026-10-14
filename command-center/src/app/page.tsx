import { db } from "@/lib/db"
import { Countdown } from "@/components/Countdown"
import { WaitlistForm } from "@/components/WaitlistForm"

export const dynamic = "force-dynamic"

// The public launch page: what is coming, when, and the waitlist.
export default async function Landing() {
  const { data: launch } = await db().from("launch").select("name, launch_at").eq("id", 1).maybeSingle()
  const storeUrl = process.env.STORE_URL
  return (
    <main className="landing">
      <div className="feed-grain" aria-hidden="true" />
      <p className="osd osd--tl"><span className="rec-dot" aria-hidden="true" />REC&ensp;CAM 10 &middot; LAUNCH</p>
      <div className="landing__inner">
        <p className="wordmark">VULT LABEL</p>
        <h1 className="landing__title">{launch?.name || "Next drop"}</h1>
        <Countdown launchAt={launch?.launch_at ?? null} />
        <p className="landing__lede">Made in numbered runs. Locked until the drop. Get an email before the vault opens.</p>
        <WaitlistForm />
        {storeUrl && <a className="landing__store" href={storeUrl}>Enter the store</a>}
      </div>
    </main>
  )
}
