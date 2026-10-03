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

Tests check page structure, metadata, and local links. No dependency installation
is required. There is no lint or build command.

## Make it yours

- Edit the introduction in `public/index.html` and the bio in `public/about.html`.
- **Before publishing**, replace the Instagram homepage URL with your profile URL
  and `hello@example.com` with your email address in `public/about.html`. These are
  placeholders, not configured contact details.
- Replace or remove the sample post in `public/posts/welcome.html`.
- To add a post, copy that HTML page to a new filename under `public/posts/`.
  Update its title, description, date, and content, then add a matching entry to
  `public/posts.html` and update the latest-writing entry in `public/index.html`.
  Keep the archive in newest-first order. Entries are maintained manually.
- Change shared colors, typography, and layout in `public/styles.css`.

Pages use explicit `.html` URLs so Azure does not need SPA routing or rewrite
rules. All navigation works without JavaScript.

## Host on Azure Blob Storage

Use an Azure Storage account that supports static website hosting. In the Azure
portal, enable **Static website**, set **Index document name** to `index.html`
and **Error document path** to `404.html`, and save. Upload the **contents** of
`public/` to the generated `$web` container, preserving the `posts/` directory.
Do not upload the repository root.

Alternatively, with Azure CLI installed and signed in:

```sh
az login
ACCOUNT="your-storage-account"

az storage blob service-properties update \
  --account-name "$ACCOUNT" --auth-mode login \
  --static-website --index-document index.html --404-document 404.html

az storage blob upload-batch \
  --account-name "$ACCOUNT" --auth-mode login \
  --destination '$web' --source public --overwrite true

az storage account show --name "$ACCOUNT" \
  --query primaryEndpoints.web --output tsv
```

Your signed-in identity needs permission to configure the account and upload
blobs (for example, **Storage Blob Data Contributor** for uploads). Open the
HTTPS **static website endpoint** returned by Azure, not the blob container URL.
Check the Home, Posts, About, sample-post, and nonexistent-page URLs. Ensure HTML
blobs have `text/html` content type and the stylesheet has `text/css` if uploading
with a tool that does not infer MIME types.

Repeat the upload to publish changes. Uploading does not delete old blobs; remove
retired post files from `$web` separately. A custom domain with HTTPS can be added
later through Azure Front Door or a CDN.

## Subscriptions (later)

No subscription form, endpoint, email storage, or email delivery is implemented.
Azure Blob hosts static files only. When needed, a separate service such as an
Azure Function can accept subscription payloads and handle consent, validation,
rate limits, and email delivery. Do not place credentials or subscriber data in
the public site.
