import { addPost, deletePost, updatePost } from "../actions"

export type Post = { id: string; post_date: string | null; platform: string; idea: string; status: string }

const PLATFORMS = ["instagram", "tiktok", "x", "other"]
const STATUS = ["idea", "draft", "scheduled", "posted"]

/** One form for adding and editing a post; editing adds a delete button. */
export function PostForm({ post, date }: { post?: Post; date?: string }) {
  return (
    <form action={post ? updatePost : addPost} className="post-form">
      {post && <input type="hidden" name="id" value={post.id} />}
      <label className="wide">Idea<textarea name="idea" defaultValue={post?.idea} maxLength={500} required rows={2} /></label>
      <label>Date<input type="date" name="post_date" defaultValue={post?.post_date ?? date ?? ""} /></label>
      <label>Platform
        <select name="platform" defaultValue={post?.platform ?? "instagram"}>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
      </label>
      <label>Status
        <select name="status" defaultValue={post?.status ?? "idea"}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <div className="post-form__actions">
        <button className="btn btn--small" type="submit">{post ? "Save" : "Add post"}</button>
        {post && <button className="link-btn link-btn--danger" type="submit" formAction={deletePost} formNoValidate>Delete</button>}
      </div>
    </form>
  )
}
