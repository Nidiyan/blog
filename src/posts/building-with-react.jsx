import BlogPost from '../components/BlogPost.jsx'

export const meta = {
  title: 'Building This Blog With React',
  date: '2026-09-20',
  summary: 'How this site is put together.',
}

export default function Post() {
  return (
    <BlogPost {...meta}>
      <p>Sample post content about React, Vite and React Router.</p>
    </BlogPost>
  )
}
