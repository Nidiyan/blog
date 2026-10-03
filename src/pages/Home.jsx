import { Link } from 'react-router-dom'
import PostList from '../components/PostList.jsx'
import { getRecentPosts } from '../posts/index.js'

export default function Home() {
  return (
    <section>
      <h1>Recent Posts</h1>
      <PostList posts={getRecentPosts(3)} />
      <Link to="/posts">See all posts →</Link>
    </section>
  )
}
