# Vercel CI/CD Intro

Dieses Repository liefert eine minimale Next.js-Anwendung, die per GitHub Actions nach Vercel deployt wird. Das Setup eignet sich als Ausgangspunkt für eigene Experimente mit Continuous Deployment.

## Live-Version

https://vercel-first-ci-1zfc7h5ll-lennarts-projects-eba520ef.vercel.app/

## Automatischer Deploy

Jeder Push auf `main` löst den Workflow `.github/workflows/deploy-vercel.yml` aus. Der Job führt `npm ci`, `vercel build` sowie `vercel deploy` aus und benötigt die Secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` und `VERCEL_PROJECT_ID`.

## Leitfaden: Eigene Version erstellen

Die folgenden Schritte helfen Studierenden, aus der Vorlage eine eigene Anwendung zu machen. Die Reihenfolge ist so gewählt, dass zunächst ein unverändertes Deployment auf dem eigenen Vercel-Account funktioniert, bevor Anpassungen erfolgen.

1. **Repository klonen**
   ```bash
   git clone https://github.com/elbe-0/vercel_ci-cd_intro.git
   cd vercel_ci-cd_intro
   npm install
   ```
2. **Eigenen Vercel-Account einrichten**
   - https://vercel.com/signup öffnen und registrieren bzw. anmelden.
   - Vercel CLI lokal einloggen: `npm i -g vercel && vercel login`.
   - Optional: `vercel link` im Projektordner ausführen, um das lokale Projekt mit einem neuen Vercel-Projekt zu verbinden. Dabei legt Vercel `.vercel/project.json` mit `orgId` und `projectId` an.
3. **Zugriffstoken und IDs beschaffen**
   - `VERCEL_TOKEN`: Im Vercel-Dashboard unter **Account → Settings → Tokens** erzeugen. Der Token liegt danach zusätzlich in `~/.vercel/auth.json` (Feld `token`).
   - `VERCEL_ORG_ID` und `VERCEL_PROJECT_ID`: Entweder aus `.vercel/project.json` entnehmen oder im Vercel-Dashboard unter **Settings → General** des Projekts ablesen.
4. **`env.local` anlegen**
   Eine lokale Datei `.env.local` erstellen (bleibt wegen `.gitignore` nur lokal) und die Werte hinterlegen:
   ```bash
   cat <<'ENV' > .env.local
   VERCEL_TOKEN=<dein-token>
   VERCEL_ORG_ID=<deine-org-id>
   VERCEL_PROJECT_ID=<deine-project-id>
   ENV
   ```
5. **Eigenes GitHub-Repository vorbereiten**
   - Neues Repository bei GitHub anlegen (z. B. `vercel-ci-experiment`).
   - Remote setzen: `git remote remove origin` (falls nötig) und `git remote add origin https://github.com/<user>/<repo>.git`.
6. **GitHub-Secrets setzen**
   - Terminal-Session kurz mit den Werten aus `.env.local` füllen:
     ```bash
     set -a
     source .env.local
     set +a
     ```
   - Anschließend die Secrets per GitHub CLI anlegen:
     ```bash
     gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
     gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID"
     gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"
     ```
   - Alternativ die Werte manuell aus `.env.local` kopieren und im GitHub-Webinterface unter **Settings → Secrets and variables → Actions → New repository secret** hinterlegen.
7. **Erstes Deployment ohne Code-Änderungen testen**
   - Initialen Push durchführen:
     ```bash
     git add .
     git commit -m "Initial import"
     git push -u origin main
     ```
   - In GitHub Actions prüfen, dass der Workflow „Deploy to Vercel (Next.js)“ erfolgreich durchläuft.
   - Die generierte Vercel-Preview bzw. Production-URL öffnen und testen.
8. **Feature-Branch für eigene Änderungen anlegen**
   ```bash
   git checkout -b feature/<thema>
   ```
   Änderungen im Code vornehmen (z. B. Texte, Komponenten, Styling) und lokal testen.
9. **Änderungen deployen**
   - Branch committen und pushen (`git push -u origin feature/<thema>`).
   - Nach Code-Review oder direktem Merge auf `main` erneut pushen. Jeder Merge/Push auf `main` triggert wieder den Vercel-Deploy.
   - Optional: Branch-spezifische Previews über Vercel testen.
10. **Aufräumen**
    - Nach erfolgreicher Einrichtung `rm .env.local` ausführen oder sicher verwahren.
    - Tokens wie benötigt regelmäßig erneuern.

Mit diesen Schritten besitzen die Studierenden eine individuelle Kopie, können Deployments nachvollziehen und iterativ eigene Änderungen veröffentlichen.
