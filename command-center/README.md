# VULT LABEL command center

The launch command center for VULT LABEL, built with Next.js and a free Supabase
database. It has two parts.

**Public**
- `/`: the launch page, with the countdown and the email waitlist.
- `/api/site`: the store's text and layout, and the launch the countdown points
  at. The store (`site-content.js`) reads it.
- `/api/waitlist`: the store's own waitlist form posts here.

**Private: `/command`, behind your password**
- **Overview**: set the launch name and date. Shows the countdown, the waitlist
  count, open tasks and the next posts.
- **Calendar**: the content calendar. Undated posts stay in the idea bank; a
  few ideas are filled in to start.
- **Board**: suppliers and samples, in three columns: to do, waiting on someone,
  done.
- **Waitlist**: everyone who signed up, with a CSV download.
- **Store**: the store's text, an announcement bar, the order and visibility of
  its sections, and which product is the large main feed.

Products, prices and stock stay in the store backend's admin: your Railway
address plus `/app` (see `backend/README.md`).

## How it is kept private

Every database table has row level security on and no policies, so Supabase's
public key can read and write nothing. Only this app's server touches the
database, with the service role key. That key never reaches a browser.

`/command` needs a signed login cookie, which only your password gives. The
store and the launch page get content and add sign-ups through the two public
routes. Those routes answer browsers only from the addresses in
`STORE_ORIGINS`.

## Set it up

### 1. Supabase (free)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, choose **New query**, paste all of `supabase/schema.sql`
   and choose **Run**. Running it again later is safe.
3. In **Project Settings > API**, copy:
   - the **Project URL**;
   - the **service_role** key. Projects that show the newer keys use the
     **secret** key instead. Keep this key private.

### 2. Vercel (free)

1. Sign in at [vercel.com](https://vercel.com) with GitHub, choose **Add New >
   Project** and import this repository.
2. Set **Root Directory** to `command-center`. Vercel detects Next.js.
3. Under **Environment Variables**, add:

   ```
   SUPABASE_URL=<the Project URL>
   SUPABASE_SERVICE_ROLE_KEY=<the service_role or secret key>
   COMMAND_PASSWORD=<the password you will log in with>
   SESSION_SECRET=<a long random string, 32 characters or more>
   STORE_ORIGINS=https://shyloq.github.io
   STORE_URL=https://shyloq.github.io/Elite-Luxuries/
   ```

4. Choose **Deploy**. Your command center is the address Vercel gives you, for
   example `https://vult-command-center.vercel.app`. Log in at that address
   plus `/command`.
5. Connect the store: on GitHub, edit `store-config.js` and put that address
   between the quotes of `HOSTED_COMMAND_CENTER`, keeping `https://`.

To change the password later, change `COMMAND_PASSWORD` in Vercel and
redeploy. Changing `SESSION_SECRET` logs out every device.

## Run it locally

```bash
cd command-center
npm install
cp .env.example .env.local     # fill in the values
npm run dev                    # http://localhost:3000, private pages at /command
```

When you open the store from `localhost` or `127.0.0.1`, it uses the command
center at `http://localhost:3000`. Add the store's local address to
`STORE_ORIGINS`, for example `http://localhost:8000`.
