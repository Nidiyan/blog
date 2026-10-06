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
## Hosting

The site is hosted at `https://nidiyan.com` with this request path:

```text
Cloudflare → Azure Front Door (AFD) → Azure Blob Storage static website
```

Cloudflare proxies the public domain to AFD, which routes requests to the
storage account's static website endpoint. Azure Blob Storage serves the files;
there is no application server or build step.

To set up hosting:

1. Enable **Static website** on the Azure storage account (`nidsblog` for the
   current deployment). Set the index document to `index.html` and the error
   document to `404.html`. Azure creates the `$web` container.
2. Upload the **contents** of `public/` into `$web`, so `index.html` is at the
   container root, not inside a `public` folder.
3. Configure AFD with the storage account's **static website endpoint** as its
   origin, not the Blob service endpoint. Use the website endpoint's hostname
   for the origin host header, HTTPS to the origin, and a route for `/*`.
4. Add the public domain to AFD and enable HTTPS. In Cloudflare, point the
   domain's DNS record to the AFD endpoint and enable proxying after completing
   AFD domain validation. Use Cloudflare **Full (strict)** SSL/TLS mode so the
   Cloudflare-to-AFD connection is also secured.

The static website endpoint is publicly readable; this setup alone does not
restrict access to Cloudflare or AFD.

## GitHub Actions deployment

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
runs on every push to `main`, including merged pull requests. It checks out the
repository, signs in to Azure, and uploads `./public` to the `nidsblog` storage
account's `$web` container with Azure CLI:

```sh
az storage blob upload-batch \
  --account-name nidsblog \
  --destination '$web' \
  --source ./public \
  --auth-mode login \
  --overwrite
```

### Credentials and permissions

Authentication uses **OpenID Connect (OIDC) federation with a Microsoft Entra
identity**, rather than a stored client secret, storage account key, or SAS
token. The workflow's `id-token: write` permission lets `azure/login@v2`
exchange a short-lived GitHub OIDC token for Azure access. It reads these
repository Actions secrets:

| Secret | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | Client ID of the Azure identity used for deployment |
| `AZURE_TENANT_ID` | Microsoft Entra tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |

These values identify the identity and subscription; they are not passwords.
To reproduce this setup, create a Microsoft Entra application/service principal
with a federated credential trusting GitHub Actions:

- Issuer: `https://token.actions.githubusercontent.com`
- Subject: `repo:Nidiyan/blog:ref:refs/heads/main`
- Audience: `api://AzureADTokenExchange`

Grant the deployment identity **Storage Blob Data Contributor** on the `$web`
container (or the storage account if broader access is needed), and add the
three identifiers above under **Settings → Secrets and variables → Actions**.
The data-plane role allows `--auth-mode login` to upload and overwrite blobs
without a storage key. Update the workflow's account name and federated subject
if deploying to another account or repository.

Uploads replace matching files but do **not** delete blobs whose source files
were removed. Remove obsolete blobs separately when needed. The workflow does
not provision hosting resources or purge Cloudflare/AFD caches; cached content
may remain until its cache lifetime expires or those caches are purged.
