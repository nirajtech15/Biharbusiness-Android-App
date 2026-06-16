# BiharBusiness App — Android

> React.js + Capacitor 8 Android app for Bihar's local business directory

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat&logo=capacitor)
![Android](https://img.shields.io/badge/Android-App-3DDC84?style=flat&logo=android)

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Mobile:** Capacitor 8
- **Auth:** Firebase Phone OTP
- **Payments:** Razorpay UPI (WebView compatible)
- **API:** Laravel 11 REST API
- **Package ID:** com.biharbusiness.app

## Features
- Firebase Phone OTP login
- Business listings with district/category filter
- Razorpay UPI payment for tier upgrade
- Free / Featured ₹999 / Premium ₹2499 tiers
- WhatsApp direct connect
- Offline-friendly with local caching

## Project Structure

## Setup

```bash
git clone https://github.com/nirajtech15/biharbusiness-app.git
cd biharbusiness-app
npm install
cp .env.example .env
# .env mein Firebase + API credentials daalo
npm run dev
```

## Android Build

```bash
npm run build
npx cap sync android
npx cap open android
# Android Studio mein Run karo
```

## Related Repos
- [biharbusiness-api](https://github.com/nirajtech15/biharbusiness-api) — Laravel Backend

## Live
🌐 [biharbusiness.com](https://biharbusiness.com)

## Developer
**Er. Niraj Singh** — Senior Full-Stack Developer  
[GitHub](https://github.com/nirajtech15)
