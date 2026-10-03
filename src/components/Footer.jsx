import { siteConfig } from '../config.js'

const year = new Date().getFullYear()

export default function Footer() {
  const { email, instagram } = siteConfig.socials
  return (
    <footer className="site-footer">
      <nav className="socials" aria-label="Social">
        <a href={`mailto:${email}`}>Email</a>
        <a href={instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </nav>
      <p>
        © {year} {siteConfig.author}
      </p>
    </footer>
  )
}
