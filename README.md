# blog

A dependency-free personal blog with Home, Posts, About, and a custom 404 page.
The complete site lives in `public/`: plain HTML and CSS, with no build step,
JavaScript, external fonts, or runtime services.

The shared editorial styling uses a warm paper palette, plum accents, responsive
post cards, and a CSS-drawn landscape on the home page. Subtle entrance and
illustration animations respect the visitor's reduced-motion preference.

## Preview and test

From the repository root, serve the site with Python 3:

```sh
python3 -m http.server 8080 --directory public
```

Open `http://localhost:8080`. Node.js 22 or later is needed only for the tests:

```sh
npm test
```

## Creating posts with Copilot

Use the [`create-post` skill](.github/skills/create-post/SKILL.md) by asking
Copilot to create a post and supplying its title and complete content. You can
also supply a publication date and slug.

The skill creates the static page and updates the post listings while preserving
the supplied wording and formatting. It then lists grammar and punctuation
suggestions in numbered order, without applying them. Approve specific numbers
to make only those changes. If formatting was lost during pasting, the skill
asks for clarification rather than guessing. Creating a page does not deploy it.

## Hosting and routing

The site is hosted on Azure and served at [nidiyan.com](https://nidiyan.com).
Cloudflare manages DNS for the domain and forwards traffic to Azure Front Door
(AFD), which routes requests to the Azure Blob Storage static website.
