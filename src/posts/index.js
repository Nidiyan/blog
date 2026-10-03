// Every `.jsx` file in this folder is a blog post, except files starting with
// an underscore (like `_template.jsx`). The file name becomes the post's URL
// slug, e.g. `hello-world.jsx` -> `/posts/hello-world`.
const modules = import.meta.glob(['./*.jsx', '!./_*.jsx'], { eager: true })

export function buildPosts(postModules) {
  return Object.entries(postModules)
    .map(([path, mod]) => ({
      slug: path.replace(/^.*\//, '').replace(/\.jsx$/, ''),
      ...mod.meta,
      Component: mod.default,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const posts = buildPosts(modules)

export function getRecentPosts(count = 3) {
  return posts.slice(0, count)
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
