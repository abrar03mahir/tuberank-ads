# TubeRank v3 — YouTube SEO Suite
### Free with Google AdSense | Mobile + PC | Gemini AI

---

## 🚀 Setup in 4 steps

### Step 1 — Install Node.js
https://nodejs.org (choose LTS)

### Step 2 — Get FREE Gemini API key
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google → Create API Key (free, no card needed)

### Step 3 — Get Google AdSense ID
1. Go to: https://adsense.google.com
2. Sign up (need a website/domain)
3. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
4. Create an Ad Unit → get your Slot ID

### Step 4 — Add keys to .env and run
```
GEMINI_API_KEY=AIzaSy_your_key_here
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_SLOT_ID=XXXXXXXXXX
PORT=3000
```

Then:
```bash
npm install
npm start
```

Open: http://localhost:3000

---

## 💰 How the ad model works

- Users get 5 FREE searches on arrival
- When they run out → ad gate modal appears
- They watch a 30-second ad → unlock 5 more searches
- Cycle repeats — free forever for users, revenue for you

## 📱 Mobile + PC
- Fully responsive layout
- Works on all screen sizes
- Touch-friendly tag selection
- Mobile header with usage counter

---

## ☁️ Deploy free on Render

1. Push to GitHub
2. Render.com → New Web Service → connect repo
3. Add env vars: GEMINI_API_KEY, ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID
4. Start: `npm start`
5. Done — live URL instantly

---

## 📁 Files
```
tuberank-ads/
├── server.js          ← Backend + Gemini API + AdSense config
├── package.json
├── .env               ← Your keys (never share!)
├── .gitignore
├── README.md
└── public/
    └── index.html     ← Full responsive frontend
```

## ⚠️ AdSense Note
AdSense requires your site to be live (not localhost) for real ads to show.
Deploy to Render first, then submit your site for AdSense review.
