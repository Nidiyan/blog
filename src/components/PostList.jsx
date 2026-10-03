import { Link } from 'react-router-dom'
import { formatDate } from '../posts/index.js'

export default function PostList({ posts }) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>
  }
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug} className="post-card">
          <h2>
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.summary && <p>{post.summary}</p>}
        </li>
      ))}
    </ul>
  )
}
