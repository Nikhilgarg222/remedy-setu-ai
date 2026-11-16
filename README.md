# 🙏 Remedy Setu — AI Remedy Assistant

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-orange.svg)](https://aistudio.google.com/)

An AI-powered Vedic astrology remedy assistant built for **Remedy Setu**. It recommends authentic gemstones, rudraksha beads, and puja services strictly from a curated 18-item product catalogue based on a user's birth details and life concerns, complete with astrological reasoning in **Hindi and English**.

> **Assignment Role**: Software Development Intern (Full Stack)  
> **Company**: Remedy Setu (D A Dharm Sathi Pvt. Ltd.)  
> **Option Chosen**: Option 2 — AI Remedy Assistant (AI)

---

## 🌟 Key Features

- **Personalized Consultation Wizard**: 3-step animated flow capturing Name, Date of Birth, Gender, optional Birth Time & Place, Life Concern, and Language preference.
- **Strictly Catalogue-Bound AI**: Google Gemini AI is constrained by strict prompt rules (`temperature: 0.3`) and programmatic post-processing to ensure it **never recommends products outside the 18-item catalogue** or invents prices.
- **Bilingual Explanations**: Rich explanations in simple **Hindi** or **English**, connecting the user's concern to planetary influences (Saturn, Jupiter, Mercury, Sun, Rahu, etc.).
- **Product Catalogue Explorer**: Full searchable and categorised view (`/products`) with filter tabs (*Gemstones*, *Rudraksha*, *Puja Services*) and real-time search.
- **Consultation History Timeline**: Tracks past consultations (`/history`) with expandable cards and recommendation summaries.
- **Zero-Config Resilience**: Automatic **Vedic Rule Engine Fallback** ensures the entire application runs smoothly out-of-the-box even without a Gemini API key or MongoDB instance.
- **Mobile-First Spiritual UI**: Designed with warm saffron/amber palettes, smooth Framer Motion page transitions, and toast alerts.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | Fast SPA development & instant HMR |
| **Styling & Motion** | Tailwind CSS, Framer Motion | Spiritual warm theme & smooth step transitions |
| **Icons & Feedback** | React Icons, React Hot Toast | Visual feedback and rich iconography |
| **Backend** | Node.js, Express.js | REST API & AI orchestration |
| **Database** | MongoDB + Mongoose (with In-Memory Fallback) | Consultation history & catalogue persistence |
| **AI Model** | Google Gemini 1.5 Flash (`@google/generative-ai`) | Constrained astrological reasoning |
| **Security** | Helmet, CORS, Express Rate Limit | API protection & abuse prevention |

---

## 📂 Project Structure

```text
remedy-setu-ai/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/index.js        # Axios client with centralized endpoints
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive header with branding
│   │   │   ├── Footer.jsx           # Footer with links
│   │   │   ├── ConsultationForm.jsx # 3-step interactive consultation wizard
│   │   │   ├── RemedyResult.jsx     # AI analysis & recommended remedies card
│   │   │   └── ProductCard.jsx      # Reusable product card with stock badges
│   │   ├── pages/
│   │   │   ├── ProductsPage.jsx     # Searchable 18-item catalogue
│   │   │   └── HistoryPage.jsx      # Consultation history timeline
│   │   ├── App.jsx             # React router setup & toast provider
│   │   └── main.jsx            # React root
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vercel.json             # 1-click Vercel SPA rewrite
│   └── vite.config.js
├── server/                     # Express Backend
│   ├── config/db.js            # MongoDB connection with graceful fallback
│   ├── controllers/
│   │   ├── consultationController.js # AI prompt engineering & validation
│   │   └── productController.js      # Filtered catalogue API
│   ├── data/
│   │   └── catalogue.json      # 18 curated items (Gemstones, Rudraksha, Pujas)
│   ├── middleware/errorHandler.js # Global error handler
│   ├── models/
│   │   ├── Consultation.js     # Mongoose consultation schema
│   │   └── Product.js          # Mongoose product schema
│   ├── routes/api.js           # REST endpoints
│   ├── server.js               # Express server entry point
│   └── .env.example
├── package.json                # Root convenience scripts
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (< 2 Minutes)

You can run the entire application locally without needing MongoDB or paid API keys.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/remedy-setu-ai.git
cd remedy-setu-ai
```

### 2. Install dependencies
```bash
npm run install:all
```
*(Or run `cd server && npm install` then `cd ../client && npm install`)*

### 3. Start the Backend
```bash
cd server
npm run dev
```
> The server runs on `http://localhost:5000`. By default, it operates in in-memory mode with 18 pre-loaded catalogue products.

*(Optional)* To use live Gemini AI, add your API key in `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Frontend
In another terminal:
```bash
cd client
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔒 How We Enforce AI Safety & Prevent Hallucination

The assignment specifically evaluates **"how you stop the AI from giving wrong outputs (such as invented products or prices)"**. Here is our multi-layered approach:

1. **System Prompt Injection**: The full 18-item catalogue (IDs, names, prices, categories, benefits) is injected directly into the system instruction. The prompt explicitly orders:
   > *"ONLY recommend products that exist in the PRODUCT CATALOGUE below. You must reference them by their exact 'id' field. If no product fits, say so honestly — NEVER invent a product or price."*
2. **Low Temperature (`temperature: 0.3`)**: Reduces model variance and prevents creative fabrication of items.
3. **Structured JSON Mode**: Forces Gemini to output pure JSON adhering strictly to our schema.
4. **Post-Processing Validation Filter**: In `server/controllers/consultationController.js`, before responding to the user, every recommended product ID returned by the AI is cross-checked against the catalogue map:
   ```javascript
   aiResponse.recommendations = aiResponse.recommendations.filter((rec) => {
     if (!catalogueMap.has(rec.productId)) {
       console.warn(`Filtered out hallucinated product: ${rec.productId}`);
       return false;
     }
     return true;
   });
   ```
5. **Catalogue-Direct Pricing**: The frontend pulls official prices directly from `catalogue.json` rather than relying on the AI model for monetary numbers.

---

## 📋 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/consultation` | Takes birth details & concern, returns AI remedy & products |
| `GET` | `/api/consultations` | Returns past consultation history |
| `GET` | `/api/products` | Lists catalogue items (filters: `?category=Gemstones&search=neelam`) |
| `GET` | `/api/products/:id` | Returns single product details |
| `GET` | `/health` | Server health check and DB connection status |

### Sample Request:
```bash
curl -X POST http://localhost:5000/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Aarav Sharma",
    "dateOfBirth": "1996-08-12",
    "gender": "male",
    "concern": "career",
    "language": "en"
  }'
```

---

## 🎁 Bonus Items Attempted

- [x] **100% Bilingual Support**: Complete Hindi & English UI and AI generation with Devanagari font rendering (`Noto Sans Devanagari`).
- [x] **Zero-Downtime Vedic Engine Fallback**: Guarantees working product even when offline or unauthenticated.
- [x] **Hallucination Interceptor**: Rejects any product IDs not present in verified catalogue.
- [x] **Real-time Catalogue Search & Category Filtering**: Debounced search across names, Hindi names, and descriptions.
- [x] **Consultation History Timeline**: Tracks past advice with responsive card expansion.
- [x] **Security Middleware**: Express rate limiting (30 requests/min for consultations) and Helmet HTTP headers.

---

## 🔮 What I Would Add With One More Week

1. **WhatsApp One-Click Sharing**: Enable users and partner astrologers to instantly forward remedy consultations directly via WhatsApp Web/API.
2. **Kundali Chart Rendering (Lagna Chart)**: Generate an SVG South/North Indian horoscope chart alongside the textual analysis.
3. **Checkout & Puja Booking Integration**: Direct payment gateway (Razorpay) to purchase recommended gemstones or book temple pujas.
4. **Astrologer Partner Portal**: Login-protected interface where astrologers can edit and customize recommendations for their clients before sending.

---

## 📄 Submission Checklist

- [x] **Working Product**: Tested end-to-end locally on port 3000 & 5000.
- [x] **Clean GitHub Repository**: No API keys committed (`.env` in `.gitignore`), clean commits.
- [x] **README Documentation**: Setup in < 2 minutes, tech stack, API reference, safety constraints.
- [x] **Video Walkthrough Script**: Provided in project docs for recording.

---

*Built with ❤️ for Remedy Setu*
