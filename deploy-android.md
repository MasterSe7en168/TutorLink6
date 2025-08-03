# Online Android Build Setup

## GitHub Actions Build Service

I've set up an automated build system that will create your .aab file online using GitHub Actions.

### How It Works:
1. **Push your code** to GitHub (any branch)
2. **GitHub Actions automatically builds** your Android app
3. **Download the .aab file** from the GitHub Actions artifacts

### Steps to Get Your .aab File:

1. **Create a GitHub Repository:**
   - Go to github.com
   - Create a new repository 
   - Upload your project files

2. **Push Your Code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Android app"
   git remote add origin https://github.com/yourusername/tutormatch-app.git
   git push -u origin main
   ```

3. **Automatic Build:**
   - GitHub Actions will automatically start building
   - Wait 5-10 minutes for the build to complete

4. **Download Your .aab:**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Click on the latest build
   - Scroll down to "Artifacts"
   - Download "android-aab"

### What Gets Built:
- **app-release.aab** - Ready for Google Play Store
- **app-release-unsigned.apk** - For testing on devices

### Alternative Online Build Services:

If you prefer other services, I can also set up:
- **EAS Build** (Expo's service)
- **Bitrise** 
- **CircleCI**
- **Azure DevOps**

### Signing for Production:
For Google Play Store, you'll need to add signing keys to GitHub Secrets:
- ANDROID_KEYSTORE
- KEYSTORE_PASSWORD  
- KEY_ALIAS
- KEY_PASSWORD