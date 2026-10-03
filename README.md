# blog
my blog, to be hosted by myself bc square space is too easy.

Built with [React](https://react.dev), [Vite](https://vite.dev) and
[React Router](https://reactrouter.com).

## Sections

| Path           | Page                                  |
| -------------- | ------------------------------------- |
| `/`            | Home – the 3 most recent posts        |
| `/posts`       | All posts, newest first               |
| `/posts/:slug` | A single post                         |
| `/about`       | About me (placeholder)                |

Every page shares a header (site title + section links) and a footer
(email + Instagram links). Update the title, author and social links in
[`src/config.js`](src/config.js).

## Development

```sh
npm install
npm run dev      # start dev server
npm test         # run tests
npm run lint     # lint
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Adding a new post

1. Copy [`src/posts/_template.jsx`](src/posts/_template.jsx) to a new file in
   `src/posts/`, e.g. `src/posts/my-new-post.jsx`.
2. Fill in `meta` (`title`, `date` as `YYYY-MM-DD`, `summary`) and write the
   post body as JSX inside `<BlogPost>`.

That's it — the post is picked up automatically. The file name becomes the URL
(`/posts/my-new-post`), and posts are sorted by `date`. Files starting with `_`
(like the template) are ignored. The sample posts can be deleted.

## Deploying to an Azure VM

1. On the VM, install nginx: `sudo apt install nginx`.
2. Build the site with `npm run build` and copy the contents of `dist/` to
   `/var/www/blog` on the VM (e.g. with `scp -r dist/* user@vm:/var/www/blog`).
3. Use [`deploy/nginx.conf`](deploy/nginx.conf) as the nginx site config. It
   falls back to `index.html` so routes like `/about` work on refresh.
4. `sudo nginx -t && sudo systemctl reload nginx`, and make sure port 80
   (and 443 if you add HTTPS, e.g. with certbot) is open in the VM's network
   security group.
