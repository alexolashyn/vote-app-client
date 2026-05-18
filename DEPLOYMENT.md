# Deployment Guide

## Overview

The frontend uses a fully automated CI/CD pipeline built with GitHub Actions and deployed to [Vercel](https://vercel.com).

```
develop branch  →  Staging  (preview deployment on Vercel)
master branch   →  Production  (vote-app-client.vercel.app)
pull request    →  Preview URL (unique per PR)
```

---

## Environments

| Environment | Branch | URL |
|-------------|--------|-----|
| Preview | any pull request | unique Vercel preview URL per PR |
| Staging | `develop` | `$VERCEL_STAGING_URL` (GitHub Variable) |
| Production | `master` | `$VERCEL_PRODUCTION_URL` (GitHub Variable) |

---

## CI/CD Pipeline

Every push to `develop` or `master`, and every pull request, triggers the pipeline automatically.

### Jobs

```
lint ── test ── build ──── version* ──── deploy-production*
                      └─── deploy-staging**
                      └─── deploy-preview***
```

`*` runs only on `master`  
`**` runs only on `develop`  
`***` runs only on pull requests

| Job | What it does |
|-----|-------------|
| **lint** | Runs ESLint across all source files |
| **test** | Runs unit tests with code coverage via Vitest, uploads report to Codecov |
| **build** | Builds the app via `vite build`, saves `dist/` as a build artifact (7 days) |
| **version** | Bumps version and creates a git tag using Semantic Versioning |
| **deploy-preview** | Deploys a unique preview URL for each pull request |
| **deploy-staging** | Deploys to Vercel staging environment |
| **deploy-production** | Deploys to Vercel production + runs health check |

---

## Versioning

Versions are bumped automatically on every merge to `master` based on commit messages ([Conventional Commits](https://www.conventionalcommits.org)):

| Commit message | Version bump | Example |
|----------------|-------------|---------|
| `BREAKING CHANGE` in body | Major | `v1.2.3 → v2.0.0` |
| `feat: ...` | Minor | `v1.2.3 → v1.3.0` |
| `fix: ...`, `ci: ...`, etc. | Patch | `v1.2.3 → v1.2.4` |

A git tag (e.g. `v1.0.1`) is created and pushed automatically. Tags are visible in the GitHub **Tags** tab.

---

## Deployment Strategy (Canary)

Vercel atomically promotes each new build to production:

1. New code is merged to `develop` and deployed to **staging**
2. After manual verification on staging, a PR merges `develop` → `master`
3. Vercel builds and deploys the new version to **production**
4. The pipeline runs a health check — if it passes, deployment is complete
5. If the health check fails — the pipeline errors; the previous Vercel deployment stays active

---

## Health Check

After every production deployment the pipeline polls the production URL until it returns `200 OK` or times out.

- Production: 5 attempts × 15 s = max 75 s

---

## How to Deploy

### Deploy to Staging
```bash
git checkout develop
# make changes, commit using Conventional Commits
git push origin develop
# pipeline runs automatically
```

### Deploy to Production
```bash
# option 1 — via Pull Request (recommended)
# open PR: develop → master on GitHub

# option 2 — direct merge
git checkout master
git merge develop
git push origin master
```

### Preview Deployment (Pull Request)
Every pull request to `master` or `develop` automatically gets a unique preview URL from Vercel. The URL is posted in the PR checks.

---

## Rollback

### Via Vercel CLI
```bash
npm install -g vercel
vercel rollback --token <VERCEL_TOKEN>
```

### Via Vercel Dashboard
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the project (`vote-app-client`)
3. Go to **Deployments**
4. Find the last successful deployment → click **...** → **Promote to Production**

---

## Required GitHub Secrets & Variables

| Type | Name | Description |
|------|------|-------------|
| Secret | `VERCEL_TOKEN` | Vercel API token (Account Settings → Tokens) |
| Secret | `VERCEL_ORG_ID` | Vercel team/account ID (Account Settings → General → Your ID) |
| Secret | `VERCEL_PROJECT_ID` | Vercel project ID (Project → Settings → General → Project ID) |
| Secret | `CODECOV_TOKEN` | Codecov upload token |
| Variable | `VITE_API_URL` | Backend API URL used during build |
| Variable | `VERCEL_PRODUCTION_URL` | Production deployment URL |
| Variable | `VERCEL_STAGING_URL` | Staging deployment URL |

---

## Vercel Project Configuration

| Field | Value |
|-------|-------|
| Framework Preset | Vite |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Node Version | 20 |

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | `https://vote-app-backend-en7g.onrender.com` | Production, Preview |
