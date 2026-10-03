import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>
        Sorry, that page doesn&apos;t exist. <Link to="/">Go home</Link>.
      </p>
    </section>
  )
}
