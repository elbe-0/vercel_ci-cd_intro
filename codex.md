# Minimal Next.js auf Vercel – 1-Click + GitHub Actions

Ziel: **Hello-World** mit Next.js (App Router) als statische/SSR-fähige App, **1-Click Deploy** auf Vercel **und** ein schlanker CI-Workflow via Vercel-CLI.

## Projektstruktur

```
/
├─ app/
│  ├─ api/health/route.ts
│  └─ page.tsx
├─ public/
│  └─ vercel.svg
├─ .github/
│  └─ workflows/
│     └─ deploy-vercel.yml
├─ .gitignore
├─ next.config.ts
├─ package.json
├─ tsconfig.json
└─ codex.md   ← dieses Dokument
```

---

## 1-Click Deploy Button

Ersetze `<REPO_URL>` durch die HTTPS-URL eures GitHub-Repos, z. B. `https://github.com/org/repo`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<REPO_URL>&project-name=nextjs-hello&repository-name=nextjs-hello)

Nach dem Klick legt Vercel das Projekt an und macht ein erstes Deployment.

---

## Dateien

### `package.json`

```json
{
  "name": "nextjs-hello",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.11",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "typescript": "^5.6.3"
  }
}
```

> Falls ihr Next 15 nutzen wollt, könnt ihr die Versionsnummern anheben. Ich beziehe mich hier bewusst auf eine **stabile 14er**-Schiene, da die am weitesten verbreitet ist.

---

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Default-Einstellungen genügen; App Router ist aktiv, da /app existiert
  }
};

export default nextConfig;
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "types": ["node"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

### `app/page.tsx`

```tsx
export default function HomePage() {
  return (
    <main style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"
    }}>
      <div style={{
        padding: "2rem 2.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        textAlign: "center"
      }}>
        <h1>✅ Hello Next.js on Vercel</h1>
        <p>Es funktioniert. Diese Seite wird mit dem App Router ausgeliefert.</p>
        <p>
          Health-Check: <a href="/api/health">/api/health</a>
        </p>
      </div>
    </main>
  );
}
```

---

### `app/api/health/route.ts`

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
```

---

### `public/vercel.svg`

```svg
<svg width="76" height="65" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M37.5 0L75 65H0L37.5 0Z" fill="black"/>
</svg>
```

---

### `.gitignore`

```
# Node
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
package-lock.json
pnpm-lock.yaml
yarn.lock

# Next
.next
out
.cache

# Env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

> Lockfile: Für maximale Reproduzierbarkeit **einen** Lockfile verwenden (npm/pnpm/yarn). Oben ignoriere ich alle; wenn ihr z. B. npm nutzt, entfernt `package-lock.json` aus `.gitignore` und committed ihn.

---

## GitHub Actions (Vercel Deploy)

Dieser Workflow baut eure Next-App und deployed via **Vercel-CLI** nach **Production**, sobald auf `main` gepusht wird.
Er benötigt **drei Secrets** im Repo: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

### `.github/workflows/deploy-vercel.yml`

```yaml
name: Deploy to Vercel (Next.js)

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install deps
        run: npm ci

      - name: Install Vercel CLI
        run: npm i -g vercel@latest

      - name: Vercel Pull (Production env)
        run: vercel pull --yes --environment=production --token "${{ secrets.VERCEL_TOKEN }}"
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build Next.js
        run: npm run build

      - name: Create prebuilt output
        run: vercel build --prod --token "${{ secrets.VERCEL_TOKEN }}"
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --yes --token "${{ secrets.VERCEL_TOKEN }}"
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Erforderliche GitHub-Secrets

* `VERCEL_TOKEN` – Personal Token (Vercel Dashboard → Settings → Tokens).
* `VERCEL_ORG_ID` – Organization-ID (Projekt → Settings → General).
* `VERCEL_PROJECT_ID` – Project-ID (Projekt → Settings → General).

**Einmalige Verknüpfung (lokal, optional):**

```bash
npm i -g vercel
vercel login
vercel link    # Projekt anlegen/verbinden
# IDs im Dashboard ablesen → als GitHub-Secrets setzen
```

---

## 1-Click Deploy (kurz)

1. Auf den **Deploy-Button** oben klicken (Repo-URL einsetzen).
2. Vercel erstellt das Projekt und macht ein erstes Deploy.
3. Secrets in GitHub setzen → ab dann deployt **Actions** beim Push auf `main`.

---

## Optional: Projekt schützen

* Vercel → **Settings → Deployment Protection**:

  * **Vercel Authentication** (kostenlos) für Team-Only.
  * Password-Schutz/Trusted IPs je nach Plan.
    Ich kenne eure Policy nicht; prüft, ob **Hobby (nicht-kommerziell)** ausreicht.

---

## Lokal starten

```bash
npm ci
npm run dev
# http://localhost:3000
```

---

**Fertig.** Damit habt ihr ein minimales, produktionsfähiges Grundgerüst mit Next.js, 1-Click-Deploy und automatischem Deployment via GitHub Actions. Wenn ihr zusätzlich einen Python-API-Teil benötigt, können wir daneben ein **zweites Repo** (FastAPI @ Vercel Functions) aufsetzen – ich liefere euch gern das passende Skeleton.
