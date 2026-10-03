import BlogPost from '../components/BlogPost.jsx'

export const meta = {
  title: 'Why I Self-Host My Blog',
  date: '2026-09-10',
  summary: 'Running my own blog on an Azure VM instead of Squarespace.',
}

export default function Post() {
  return (
    <BlogPost {...meta}>
      <p>Sample post content. Squarespace is too easy, so here we are.</p>
    </BlogPost>
  )
}
