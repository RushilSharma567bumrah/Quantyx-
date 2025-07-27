@echo off
echo 🚀 QUANTY AI - FIREBASE DEPLOYMENT SCRIPT
echo ==========================================

echo.
echo 📋 Step 1: Installing Firebase CLI globally...
npm install -g firebase-tools

echo.
echo 🔐 Step 2: Login to Firebase...
echo Make sure you're logged into quantumrushilll123@gmail.com
firebase login

echo.
echo 🏗️ Step 3: Creating Firebase project 'quanty-ai'...
firebase projects:create quanty-ai

echo.
echo ⚙️ Step 4: Setting up Firebase hosting...
firebase use quanty-ai

echo.
echo 🚀 Step 5: Deploying Quanty AI to Firebase...
firebase deploy

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo 🌐 Your Quanty AI is now live at: https://quanty-ai.web.app
echo 🔗 Alternative URL: https://quanty-ai.firebaseapp.com

pause