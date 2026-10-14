import Link from "next/link"
import { logout } from "../actions"
import { requireOwner } from "@/lib/owner"

export const dynamic = "force-dynamic"
export const metadata = { title: "Command center · VULT LABEL" }

const NAV = [
  ["/command", "Overview"],
  ["/command/calendar", "Calendar"],
  ["/command/board", "Board"],
  ["/command/waitlist", "Waitlist"],
  ["/command/store", "Store"],
] as const

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  await requireOwner()
  return (
    <div className="cc">
      <header className="cc-bar">
        <Link className="wordmark" href="/command">VULT LABEL</Link>
        <nav className="cc-nav" aria-label="Command center">
          {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <form action={logout}><button className="link-btn" type="submit">Log out</button></form>
      </header>
      <main className="cc-main">{children}</main>
    </div>
  )
}
