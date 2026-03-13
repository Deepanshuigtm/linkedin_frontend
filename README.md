# LinkedIn Automation Frontend

React + Vite frontend for LinkedIn automation with real-time log streaming.

## Features

- Modern React UI with Tailwind CSS
- Real-time WebSocket log streaming
- Form validation
- Resume upload (PDF)
- Dark mode support
- Cloud-ready configuration

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Cloud Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Set Environment Variables** (in Vercel dashboard or CLI):
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://linkdin-automation-backend.onrender.com

vercel env add VITE_WS_BASE_URL
# Enter: wss://linkdin-automation-backend.onrender.com
```

4. **Production deployment:**
```bash
vercel --prod
```

**Or use Vercel Dashboard:**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Environment variables are auto-detected from `vercel.json`
- Deploy!

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

**Or use Netlify Dashboard:**
- Go to [netlify.com](https://netlify.com)
- Import your GitHub repository
- Build settings are auto-detected from `netlify.toml`
- Deploy!

### Option 3: GitHub Pages

1. **Update `vite.config.js`:**
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

2. **Build and deploy:**
```bash
npm run build
npx gh-pages -d dist
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL (without trailing slash) | `https://your-backend.onrender.com` |
| `VITE_WS_BASE_URL` | WebSocket URL (without trailing slash) | `wss://your-backend.onrender.com` |

**Important:** 
- Use `https://` for API_BASE_URL in production
- Use `wss://` (not `ws://`) for WS_BASE_URL with HTTPS sites
- No trailing slashes

## Backend CORS Configuration

Make sure your backend allows your frontend domain. In Render backend environment variables, set:

```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Or for multiple domains:
```
CORS_ORIGINS=https://app1.vercel.app,https://app2.netlify.app
```

## Troubleshooting

### API Connection Issues

- Verify `VITE_API_BASE_URL` is correct (no trailing slash)
- Check backend CORS settings allow your frontend domain
- Test backend health: `curl https://your-backend.onrender.com/`

### WebSocket Connection Fails

- Use `wss://` (not `ws://`) for HTTPS sites
- Check backend `/ws/logs` endpoint is accessible
- Some hosting providers may not support WebSockets (Vercel does, GitHub Pages doesn't)

### Build Fails

- Clear cache: `rm -rf node_modules dist && npm install`
- Check Node version: `node --version` (should be 18+)
- Verify all dependencies are installed

### Environment Variables Not Working

- Vite embeds env vars at **build time**, not runtime
- After changing env vars, rebuild: `npm run build`
- Variables must start with `VITE_`

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **WebSocket API** - Real-time logs

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AutomationForm.jsx  # Main form component
│   │   └── LogConsole.jsx      # Real-time log viewer
│   ├── services/
│   │   └── api.js              # API & WebSocket client
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Support

For deployment-specific issues:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
