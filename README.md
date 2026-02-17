# 🍳 ReciiPick

**ReciiPick** is an AI-powered service that recommends personalized recipes based on your ingredients or food photos.

![ReciiPick Screenshot](./public/reciipick.png)

## ✨ Key Features

*   **AI Recipe Generation**: Creates creative recipes tailored to your ingredients or dish names using Google Gemini AI.
*   **Image Recognition**: Analyze photos of your fridge or ingredients to suggest delicious meals.
*   **Save Recipes**: Bookmark your favorite recipes to access them anytime. (Powered by Firebase)
*   **User-Friendly UI**: Enjoy a natural, conversational experience with our friendly AI chef character.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS
*   **AI**: Google Gemini API (gemini-2.0-flash, gemini-pro, etc.)
*   **Backend / Serverless**: Express (Vercel Serverless Functions)
*   **Database & Auth**: Google Firebase (Firestore, Authentication)
*   **Deployment**: Vercel

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/mnigaon/ReciiPick.git
cd ReciiPick
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add the following variables.

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Locally

Start the development server.

```bash
npm run dev:all
```

Visit `http://localhost:5173` in your browser.

## 📂 Deployment

This project is optimized for **Vercel**.

1.  Import your GitHub repository to Vercel.
2.  Set the Framework Preset to **Vite**.
3.  Add all the Environment Variables listed above in the Vercel dashboard.
4.  Click **Deploy**!

---
Developed by You! 👩‍🍳
