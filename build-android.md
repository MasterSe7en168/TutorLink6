# Building TutorMatch Android App Bundle (.aab)

## Prerequisites
- Android Studio installed
- Android SDK configured
- Java 11+ installed

## Build Steps

1. **Download the android folder** from Replit
2. **Open Android Studio** and open the `android` project
3. **Build the app bundle:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew bundleRelease
   ```

## Output Location
Your `.aab` file will be created at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Alternative: GitHub Actions Auto-Build
If you want automatic builds, I can set up a GitHub Actions workflow to build your `.aab` file whenever you push code changes.

## App Configuration
- **App ID**: com.tutormatch.app
- **App Name**: TutorMatch
- **Web Source**: dist/public (your built web app)

## Signing for Google Play
To publish on Google Play Store, you'll need to:
1. Create a signing key
2. Configure signing in `android/app/build.gradle`
3. Build with `./gradlew bundleRelease`