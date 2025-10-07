# Vercel CI/CD Intro

This repo contains a minimal Next.js setup wired to deploy via GitHub Actions to Vercel.

## Live Version

https://vercel-first-ci-1zfc7h5ll-lennarts-projects-eba520ef.vercel.app/

## Deployment

Every push to `main` triggers `.github/workflows/deploy-vercel.yml`, which runs the build and deploys to Vercel using the configured repository secrets.
