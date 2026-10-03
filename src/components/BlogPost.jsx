import { formatDate } from '../posts/index.js'

// Reusable layout used to render every blog post.
export default function BlogPost({ title, date, children }) {
  return (
    <article className="blog-post">
      <header>
        <h1>{title}</h1>
        <time dateTime={date}>{formatDate(date)}</time>
      </header>
      <div className="blog-post-body">{children}</div>
    </article>
  )
}
