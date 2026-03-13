# Deploy Script for GitHub Pages

echo "🚀 Building LinkedIn Automation Frontend for GitHub Pages..."
echo ""

# Set environment variables for production build
export VITE_API_BASE_URL=https://linkdin-automation-backend.onrender.com
export VITE_WS_BASE_URL=wss://linkdin-automation-backend.onrender.com

# Build the project
echo "📦 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to GitHub Pages..."
    
    # Deploy to GitHub Pages
    npx gh-pages -d dist
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🎉 Your site will be live at:"
        echo "   https://deepanshuigtm.github.io/linkedin_frontend/"
        echo ""
        echo "⚠️  IMPORTANT: Update backend CORS settings:"
        echo "   Go to Render → Backend → Environment"
        echo "   Set: FRONTEND_URL=https://deepanshuigtm.github.io"
        echo ""
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
