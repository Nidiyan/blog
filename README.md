# blog

A dependency-free personal blog with Home, Posts, About, and a custom 404 page.
The complete site lives in `public/`: plain HTML and CSS, with no build step,
JavaScript, external fonts, or runtime services.

## Preview and test

From the repository root, serve the site with Python 3:

```sh
python3 -m http.server 8080 --directory public
```

Open `http://localhost:8080`. Node.js 22 or later is needed only for the tests:

```sh
npm test
```
Hosted on Azure at nidiyan.com
