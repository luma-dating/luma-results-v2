# LUMA Results App

Welcome to the codebase for **LUMA: Romantic Readiness Filter**—a results delivery app built to lovingly call people out.

## 🌐 Hosted Stack
Built with [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com).

## 🔧 How to Deploy

### 1. Upload to GitHub
- Create a new repo (e.g., `luma-results`)
- Upload all files manually via GitHub's interface

### 2. Deploy on Vercel
- Sign in at [vercel.com](https://vercel.com)
- Click "New Project" and select your GitHub repo
- Confirm project settings and deploy
- Vercel will host your app and provide a `.vercel.app` domain

### 3. Zapier Webhook Setup
- In Zapier, add a "Webhooks by Zapier" action
- Use the POST method to this URL: `https://your-vercel-domain.vercel.app/api/submit`
- Format the payload as JSON with answers:

```
{
  "Q1": 5,
  "Q2": 6,
  "Q3": 4,
  ...
  "Q72": 3
}
```

- API response format:

```
{
  "profile": "Steady Flame",
  "flag": "green",
  "fluency": 138,
  "maturity": 141,
  "bs": 132,
  "total": 411
}
```

## 🔮 Routes
- `/` → Landing page
- `/result/[profile]` → Dynamic result page
- `/api/submit` → Scoring endpoint for Zapier POST requests
