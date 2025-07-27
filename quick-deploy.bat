@echo off
echo 🚀 QUANTY AI - QUICK FIREBASE DEPLOYMENT
echo ========================================

echo.
echo 📋 Step 1: Login to Firebase (browser will open)
firebase login

echo.
echo 🏗️ Step 2: Create Firebase project
firebase projects:create quanty-ai

echo.
echo ⚙️ Step 3: Initialize hosting
firebase init hosting

echo.
echo 🚀 Step 4: Deploy to Firebase
firebase deploy

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo 🌐 Your Quanty AI is now live at:
echo    https://quanty-ai.web.app
echo    https://quanty-ai.firebaseapp.com

echo.
echo 🎉 Quanty AI is now publicly accessible worldwide!
pause