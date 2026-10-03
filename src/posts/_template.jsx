// TEMPLATE: copy this file to create a new blog post.
//
//   1. Copy it to a new file in this folder, e.g. `my-new-post.jsx`.
//      (Files starting with `_` are ignored, so this template is never shown.)
//   2. The file name becomes the URL: /posts/my-new-post
//   3. Fill in `meta` below. `date` must be YYYY-MM-DD; posts are sorted by it.
//   4. Write your post as JSX inside <BlogPost>.

import BlogPost from '../components/BlogPost.jsx'

export const meta = {
  title: 'Post Title',
  date: '2026-01-01',
  summary: 'A one-sentence summary shown in post lists.',
}

export default function Post() {
  return (
    <BlogPost {...meta}>
      <p>Write your first paragraph here.</p>

      <h2>A section heading</h2>
      <p>
        More content. You can use <a href="https://example.com">links</a>,{' '}
        <strong>bold</strong>, <em>italics</em>, lists and images.
      </p>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
      </ul>
    </BlogPost>
  )
}
