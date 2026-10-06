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

The site at `https://nidiyan.com` is served through:

```text
Cloudflare → Azure Front Door (AFD) → Azure Blob Storage static website
```

Azure storage account `nidsblog` hosts the contents of `public/` in its `$web`
container. There is no build step or application server.

Set up the hosting resources before configuring deployment:

1. Enable **Static website** on the storage account, with `index.html` as the
   index document and `404.html` as the error document. This creates `$web`.
2. Configure Azure Front Door (AFD) to route `/*` to the storage account's
   **static website endpoint**, not its Blob service endpoint. Set the origin
   host header to that website hostname and use HTTPS.
3. Add `nidiyan.com` as an AFD custom domain, complete domain validation, and
   enable HTTPS. Point Cloudflare DNS to the AFD endpoint, enable proxying, and
   use **Full (strict)** SSL/TLS mode.

The storage website endpoint remains publicly readable; this architecture
alone does not prevent direct access to the origin.

## GitHub Actions deployment

On every push to `main` (including merged pull requests),
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) checks out the
repository, authenticates using `azure/login@v2`, and runs this upload through
`azure/cli@v2`:

```sh
az storage blob upload-batch \
  --account-name nidsblog \
  --destination '$web' \
  --source ./public \
  --auth-mode login \
  --overwrite
```

This uploads files directly into `$web` and overwrites matching blobs. It does
not delete obsolete blobs or purge Cloudflare/AFD caches.

### One-time deployment identity setup (Azure CLI)

The credential type is **Microsoft Entra workload identity federation using
OpenID Connect (OIDC)**. GitHub gets short-lived Azure tokens; no client secret,
storage account key, or SAS token is stored. The workflow has `id-token: write`
to request its GitHub OIDC token and `contents: read` to check out the site.

The following Bash commands reproduce the identity setup for this workflow.
Run them locally with Azure CLI as an administrator allowed to create Entra
applications/service principals and assign Azure roles. These are one-time
setup commands, not commands executed by the deployment workflow.

**1. Sign in and select the subscription containing `nidsblog`.**

Replace the subscription and resource group placeholders with your values.

```sh
az login
az account set --subscription "<subscription-id>"

RESOURCE_GROUP="<storage-resource-group>"
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
TENANT_ID=$(az account show --query tenantId --output tsv)
```

**2. Create the Entra application and its service principal.**

The application holds the GitHub federation configuration. Its service
principal is the identity that receives permission to upload blobs.

```sh
CLIENT_ID=$(az ad app create \
  --display-name "blog-github-deploy" \
  --query appId --output tsv)

APP_OBJECT_ID=$(az ad app show --id "$CLIENT_ID" --query id --output tsv)

SP_OBJECT_ID=$(az ad sp create \
  --id "$CLIENT_ID" \
  --query id --output tsv)
```

**3. Trust GitHub Actions runs from this repository's `main` branch.**

```sh
az ad app federated-credential create \
  --id "$APP_OBJECT_ID" \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:Nidiyan/blog:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

The subject must match the repository and branch exactly. This workflow does
not use a GitHub environment; adding one requires updating the federated
subject to match that environment.

**4. Allow the service principal to upload to `$web` only.**

Static website hosting must already be enabled so the container exists.

```sh
STORAGE_ID=$(az storage account show \
  --name nidsblog \
  --resource-group "$RESOURCE_GROUP" \
  --query id --output tsv)

az role assignment create \
  --assignee-object-id "$SP_OBJECT_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "${STORAGE_ID}/blobServices/default/containers/\$web"
```

This data-plane role allows the workflow's `--auth-mode login` upload without
giving the identity permission to manage the storage account. Role assignments
can take a few minutes to propagate.

**5. Add the identifiers as GitHub Actions secrets.**

Retrieve the values from the same shell:

```sh
printf 'AZURE_CLIENT_ID=%s\nAZURE_TENANT_ID=%s\nAZURE_SUBSCRIPTION_ID=%s\n' \
  "$CLIENT_ID" "$TENANT_ID" "$SUBSCRIPTION_ID"
```

In **Settings → Secrets and variables → Actions** for `Nidiyan/blog`, create:

| Repository secret | Value from the setup |
| --- | --- |
| `AZURE_CLIENT_ID` | `CLIENT_ID` (application client ID, not an object ID) |
| `AZURE_TENANT_ID` | `TENANT_ID` |
| `AZURE_SUBSCRIPTION_ID` | `SUBSCRIPTION_ID` |

These are identifiers, not passwords. Once configured, pushes to `main`
automatically publish `public/` to `$web`. Hosting resources are managed
separately; the workflow only uploads the site.
