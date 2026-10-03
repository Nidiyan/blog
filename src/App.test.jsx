import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { buildPosts, posts } from './posts/index.js'
import { siteConfig } from './config.js'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('posts registry', () => {
  it('sorts posts newest first and derives slugs from file names', () => {
    const result = buildPosts({
      './old.jsx': { meta: { title: 'Old', date: '2020-01-01' }, default: () => null },
      './new.jsx': { meta: { title: 'New', date: '2024-01-01' }, default: () => null },
    })
    expect(result.map((p) => p.slug)).toEqual(['new', 'old'])
  })

  it('does not include the template', () => {
    expect(posts.find((p) => p.slug === '_template')).toBeUndefined()
  })
})

describe('layout', () => {
  it('renders header nav links and footer social links', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'All Posts' })).toHaveAttribute('href', '/posts')
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')

    const socials = screen.getByRole('navigation', { name: 'Social' })
    expect(within(socials).getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      `mailto:${siteConfig.socials.email}`,
    )
    expect(within(socials).getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      siteConfig.socials.instagram,
    )
  })
})

describe('pages', () => {
  it('home shows only the 3 most recent posts', () => {
    renderAt('/')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(Math.min(3, posts.length))
    posts.slice(0, 3).forEach((post) => {
      expect(screen.getByRole('link', { name: post.title })).toBeInTheDocument()
    })
  })

  it('all posts shows every post', () => {
    renderAt('/posts')
    expect(screen.getAllByRole('listitem')).toHaveLength(posts.length)
  })

  it('about page renders', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument()
  })

  it('renders an individual post', () => {
    const post = posts[0]
    renderAt(`/posts/${post.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: post.title })).toBeInTheDocument()
  })

  it('shows not found for unknown posts and routes', () => {
    renderAt('/posts/does-not-exist')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
