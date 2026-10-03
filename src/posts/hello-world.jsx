import BlogPost from '../components/BlogPost.jsx'

export const meta = {
  title: 'Hello, World',
  date: '2026-09-01',
  summary: 'The obligatory first post.',
}

export default function Post() {
  return (
    <BlogPost {...meta}>
      <p>Welcome to my blog! This is a sample post — replace it with your own.</p>
    </BlogPost>
  )
}
