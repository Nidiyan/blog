import PostList from '../components/PostList.jsx'
import { posts } from '../posts/index.js'

export default function AllPosts() {
  return (
    <section>
      <h1>All Posts</h1>
      <PostList posts={posts} />
    </section>
  )
}
