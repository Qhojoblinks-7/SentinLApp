@echo off
echo Android SDK Installation Script for SentinL
echo ===========================================

set ANDROID_HOME=C:\Android
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\cmdline-tools\latest\bin

echo Setting ANDROID_HOME to %ANDROID_HOME%
setx ANDROID_HOME "%ANDROID_HOME%"

echo.
echo Accepting licenses...
echo y | call sdkmanager --licenses

echo Installing Android SDK components...
echo.

echo Installing platform-tools...
call sdkmanager "platform-tools"

echo Installing build-tools...
call sdkmanager "build-tools;34.0.0"

echo Installing platform...
call sdkmanager "platforms;android-34"

echo Installing emulator...
call sdkmanager "emulator"

echo.
echo Verifying installation...
adb version

echo.
echo Installation complete!
echo You can now run: npx expo run:android
pause