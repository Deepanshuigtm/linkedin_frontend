# GitHub Pages Deployment Guide

## Your Frontend Will Be Hosted At:
```
https://deepanshuigtm.github.io/linkedin_frontend/
```

## Quick Deployment Steps

### Step 1: Push to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial commit - GitHub Pages ready"
git branch -M main
git remote add origin https://github.com/Deepanshuigtm/linkedin_frontend.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository: https://github.com/Deepanshuigtm/linkedin_frontend
2. Click **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source:** Select "GitHub Actions"
4. That's it! GitHub Actions will automatically deploy

### Step 3: Update Backend CORS

⚠️ **CRITICAL:** Update your backend environment variable on Render:

1. Go to Render Dashboard → Your backend service
2. Environment tab
3. Update or add:
   ```
   FRONTEND_URL=https://deepanshuigtm.github.io
   ```
4. Save (backend will redeploy)

### Step 4: Wait for Deployment

- GitHub Actions will run automatically
- Check progress: Go to "Actions" tab in your repository
- Deployment takes ~2-3 minutes
- Your site will be live at: `https://deepanshuigtm.github.io/linkedin_frontend/`

## Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

```bash
cd frontend
npm install gh-pages --save-dev
npm run deploy
```

This will build and deploy directly to GitHub Pages.

## Configuration Summary

### Frontend (GitHub Pages)
- **URL:** `https://deepanshuigtm.github.io/linkedin_frontend/`
- **Environment Variables:** Built into the app from `.env.production`
  ```
  VITE_API_BASE_URL=https://linkdin-automation-backend.onrender.com
  VITE_WS_BASE_URL=wss://linkdin-automation-backend.onrender.com
  ```

### Backend (Render)
- **URL:** `https://linkdin-automation-backend.onrender.com`
- **Required Environment Variable:**
  ```
  FRONTEND_URL=https://deepanshuigtm.github.io
  ```

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Automatically run when you push to `main` or `master`
- ✅ Build your React app with production settings
- ✅ Deploy to GitHub Pages
- ✅ No manual steps needed after initial push

## Updating Your Site

To update your deployed site:

```bash
cd frontend
# Make your changes
git add .
git commit -m "Update: your changes"
git push
```

GitHub Actions will automatically rebuild and redeploy!

## Troubleshooting

### Issue: 404 Not Found on GitHub Pages
**Solution:** Make sure you enabled GitHub Pages with "GitHub Actions" as source (not branch).

### Issue: Blank page or assets not loading
**Solution:** Check that `vite.config.js` has correct base path: `base: '/linkedin_frontend/'`

### Issue: CORS Error
**Solution:** Update backend `FRONTEND_URL` to: `https://deepanshuigtm.github.io`

### Issue: API calls failing
**Solution:** Check browser console. Make sure `.env.production` has correct backend URLs without trailing slashes.

### Issue: WebSocket not connecting
**Solution:** Ensure you're using `wss://` (not `ws://`) in `.env.production`

## Testing Locally Before Deploy

To test the production build locally:

```bash
npm run build
npm run preview
```

This will show you exactly how it will look on GitHub Pages.

## Custom Domain (Optional)

To use a custom domain instead of GitHub Pages default:

1. Add a `CNAME` file in `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update backend `FRONTEND_URL` to your custom domain

## Files Modified for GitHub Pages

- ✅ `vite.config.js` - Added base path `/linkedin_frontend/`
- ✅ `package.json` - Added deploy script and gh-pages dependency
- ✅ `.env.production` - Backend URLs configured
- ✅ `.github/workflows/deploy.yml` - Automatic deployment workflow
- ✅ `.gitignore` - Proper git ignore rules

## Deployment Status

After pushing, check deployment status:
- **Actions tab:** Shows build/deploy progress
- **Settings → Pages:** Shows site URL when ready
- **Environments:** Shows deployment history

Your site will be live at: **https://deepanshuigtm.github.io/linkedin_frontend/** 🚀
