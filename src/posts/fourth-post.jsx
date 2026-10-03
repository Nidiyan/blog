import BlogPost from '../components/BlogPost.jsx'

export const meta = {
  title: 'A Fourth Post',
  date: '2026-10-01',
  summary: 'Another sample post so the home page has more than three.',
}

export default function Post() {
  return (
    <BlogPost {...meta}>
      <p>Sample post content. Delete these sample posts once you have real ones.</p>
    </BlogPost>
  )
}
