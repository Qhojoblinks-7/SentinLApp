# Android SDK Setup (Command Line Only)

To build APKs locally without Android Studio, install only the Android SDK.

## 1. Download Android SDK Command Line Tools

1. Go to https://developer.android.com/studio#command-line-tools-only
2. Download "Command line tools only" for Windows
3. Extract to `C:\Android\cmdline-tools\latest\`

## 2. Set Environment Variables

### For Windows:

1. Open System Properties → Advanced → Environment Variables
2. Add new system variable:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Android` (create this folder)
3. Edit the `Path` variable and add:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
   - `%ANDROID_HOME%\cmdline-tools\bin`

## 3. Install SDK Components

Open Command Prompt and run:

```bash
# Navigate to SDK location
cd C:\Android

# Install platform tools
sdkmanager "platform-tools"

# Install build tools
sdkmanager "build-tools;34.0.0"

# Install platform
sdkmanager "platforms;android-34"

# Install emulator (optional)
sdkmanager "emulator"
```

## 4. Accept SDK Licenses

```bash
sdkmanager --licenses
```

Accept all licenses by typing 'y' for each.

## 5. Verify Installation

```bash
adb version
```

Should show Android Debug Bridge version.

## 6. Build the App

```bash
cd frontend
npx expo run:android
```

## Troubleshooting

- If sdkmanager not found, check Path variable
- For device connection issues, enable USB debugging
- Create emulator: `avdmanager create avd -n test -k "system-images;android-34;google_apis;x86_64"`

## Alternative: EAS Build

For cloud builds without local setup:

```bash
npm install -g @expo/cli
expo login
eas build --platform android
```