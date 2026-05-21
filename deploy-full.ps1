# deploy-full.ps1
# Deploys source to mohammeddsial/portfolio (main branch)
# Builds and deploys to Vercel
# Copies dist to prod\build and pushes to mohammeddsial/shersial-app (build branch)

cd D:\projects\portfolio\portfolio

# 1. Commit and push source code to your main portfolio repo
git add .
git commit -m "Source update before build $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin main   # now pushes to https://github.com/mohammeddsial/portfolio.git

# 2. Build the Vite project
npm run build
# check if build is successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Exiting." -ForegroundColor Red
    exit $LASTEXITCODE
}
# 3. Deploy to Vercel (your site https://shersial.vercel.app)
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
npx vercel --prod --yes

# 4. Prepare the production folder (prod\build)
Write-Host "🧹 Emptying prod\build (keeping .git)..." -ForegroundColor Cyan
Get-ChildItem -Path D:\projects\portfolio\prod\build -Exclude .git | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 5. Copy built files from portfolio\dist to prod\build
robocopy "D:\projects\portfolio\portfolio\dist" "D:\projects\portfolio\prod\build" /E /IS /IT

# 6. Push the built files to your deployment repo (mohammeddsial/shersial-app) on branch 'build'
cd D:\projects\portfolio\prod\build
$env:GIT_REDIRECT_STDERR = '2>&1'

if (-not (Test-Path ".git")) { git init }
git remote set-url origin https://github.com/mohammeddsial/shersial-app.git 2>$null
if ($LASTEXITCODE -ne 0) { git remote add origin https://github.com/mohammeddsial/shersial-app.git }

git add .
git commit -m "Deploy build $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -u origin HEAD:build --force

# 7. Create a zip archive of the build (optional)
Compress-Archive -Path "D:\projects\portfolio\prod\build\*" -DestinationPath "D:\projects\portfolio\prod\build.zip" -Force

Write-Host "✅ All done! Source pushed, Vercel deployed, build pushed to shersial-app." -ForegroundColor Green