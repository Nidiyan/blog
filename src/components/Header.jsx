import { Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../config.js'

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        {siteConfig.title}
      </Link>
      <nav className="site-nav" aria-label="Main">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/posts">All Posts</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  )
}
