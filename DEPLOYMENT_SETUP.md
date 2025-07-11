# Vercel Deployment Setup Guide

This guide will help you set up automatic deployment of your HexCastle game to Vercel using GitHub Actions.

## Prerequisites

- GitHub repository with your code
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Node.js 18+ installed locally

## Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Leave the default settings (they should match our `vercel.json` config)
6. Click "Deploy"

## Step 2: Get Required Secrets

### Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions" or similar
4. Copy the token (save it securely)

### Get Organization ID
1. Go to [Vercel Team Settings](https://vercel.com/teams)
2. Copy your team/organization ID from the URL or settings page

### Get Project ID
1. Go to your Vercel project dashboard
2. Go to Settings > General
3. Copy the Project ID

## Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret" and add these three secrets:

   - **Name**: `VERCEL_TOKEN`
     **Value**: Your Vercel token from Step 2

   - **Name**: `VERCEL_ORG_ID`
     **Value**: Your organization ID from Step 2

   - **Name**: `VERCEL_PROJECT_ID`
     **Value**: Your project ID from Step 2

## Step 4: Test the Deployment

1. Make a small change to your code
2. Commit and push to a feature branch
3. Create a pull request to `main`
4. The GitHub Action should run and create a preview deployment
5. Merge the PR to `main`
6. The GitHub Action should run again and deploy to production

## How It Works

- **Pull Requests**: Creates preview deployments for testing
- **Main Branch**: Deploys to production when code is merged
- **Build Process**: Runs `npm ci`, `npm run build`, then deploys the `dist` folder

## Monitoring Deployments

- Check GitHub Actions tab for build status
- Check Vercel dashboard for deployment status
- View deployment logs in both platforms

## Troubleshooting

### Build Fails
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in GitHub Actions

### Deployment Fails
- Verify all three Vercel secrets are correctly set
- Check Vercel project settings
- Ensure the repository is connected to the correct Vercel project

### Preview Deployments Not Working
- Ensure the GitHub repository is connected to Vercel
- Check if the Vercel GitHub integration is properly configured

## Commands

- **Local development**: `npm run dev`
- **Local build**: `npm run build`
- **Local preview**: `npm run preview`

## File Structure

The deployment setup includes:

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vercel.json` - Vercel configuration
- `package.json` - Build scripts and dependencies

## Next Steps

After successful setup:
1. Your app will be available at your Vercel domain
2. Every merge to `main` will trigger automatic deployment
3. Pull requests will get preview deployments with unique URLs
4. You can set up custom domains in Vercel dashboard

Your HexCastle game is now ready for continuous deployment! 🎉