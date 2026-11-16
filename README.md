# 🙏 Remedy Setu — AI Remedy Assistant

An AI-powered Vedic astrology remedy assistant that recommends gemstones, rudraksha, and puja services based on a user's birth details and life concerns.

> Built as a Full Stack Intern assignment for [Remedy Setu](https://remedysetu.com)

---

## 🌟 Features

- **Personalized Consultation**: Enter birth details (name, DOB, gender) and select a concern (Career, Marriage, Health, Finance)
- **AI-Powered Recommendations**: Google Gemini AI suggests remedies strictly from a curated product catalogue (18 items)
- **Bilingual Support**: Responses in English or Hindi (simple, accessible language)
- **Product Catalogue**: Browse all gemstones, rudraksha beads, and puja services with prices
- **Consultation History**: View past consultations and recommendations
- **Mobile-First Design**: Beautiful, responsive UI with warm spiritual aesthetics
- **Constrained AI**: The AI NEVER recommends products outside the catalogue — strict prompt engineering ensures accuracy

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (with Mongoose ODM) |
| AI | Google Gemini API (gemini-1.5-flash) |
| Deployment | Vercel (frontend) + Render (backend) |

## 📂 Project Structure

```
remedy-setu-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Error handling
│   ├── data/
│   │   └── catalogue.json  # Product catalogue (18 items)
│   └── server.js           # Entry point
├── .gitignore
└── README.md
```

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally OR a MongoDB Atlas URI
- Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/remedy-setu-ai.git
cd remedy-setu-ai
```

### 2. Setup Backend
```bash
cd server
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your keys:
#   GEMINI_API_KEY=your_gemini_api_key_here
#   MONGODB_URI=mongodb://localhost:27017/remedy-setu  (or your Atlas URI)

# Start the server
npm run dev
```
The backend starts on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`

### 4. Open the App
Visit `http://localhost:5173` in your browser.

> **Note**: The app works even without MongoDB — it falls back to in-memory storage. You only need the Gemini API key for AI recommendations.

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/consultation` | Submit birth details & get AI remedy |
| GET | `/api/consultations` | Get consultation history |
| GET | `/api/products` | Get all products (filter: `?category=&concern=`) |
| GET | `/api/products/:id` | Get single product details |

### Sample Request — Get Remedy
```json
POST /api/consultation
{
  "userName": "Rahul",
  "dateOfBirth": "1995-03-15",
  "gender": "Male",
  "concern": "career",
  "language": "en",
  "additionalDetails": "Facing issues with job stability"
}
```

## 🎨 Design Decisions

1. **Multi-step Wizard**: The consultation form uses a step-by-step wizard (birth details → concern → language → submit) for a clean, guided experience
2. **Strict AI Prompting**: The Gemini prompt includes the full catalogue and explicit instructions to only recommend from it. Temperature is set to 0.3 for consistency
3. **Bilingual**: Hindi/English support as most Remedy Setu customers are Hindi-speaking
4. **Product Catalogue**: 18 curated items (7 gemstones, 4 rudraksha, 7 pujas) with realistic Indian market prices
5. **Fallback Storage**: In-memory arrays when MongoDB is unavailable — ensures the demo always works

## 🔮 Product Catalogue Overview

- **Gemstones (7)**: Neelam, Pukhraj, Manik, Panna, Gomed, Lehsunia, Moti — ₹2,500 to ₹21,000
- **Rudraksha (4)**: 1 Mukhi, 5 Mukhi, 7 Mukhi, Gauri Shankar — ₹800 to ₹15,000
- **Puja Services (7)**: Navgraha Shanti, Mahamrityunjaya, Kaal Sarp Dosh, Vivah, Lakshmi, Brihaspati, Surya Puja — ₹1,100 to ₹11,000

## ✅ Features Done

- [x] Multi-step consultation form with smooth animations
- [x] AI remedy recommendations (Gemini API)
- [x] Product catalogue with category filtering
- [x] Consultation history
- [x] Bilingual (Hindi + English)
- [x] Mobile-responsive design
- [x] Error handling & loading states
- [x] In-memory fallback (no MongoDB required)
- [x] Rate limiting & security headers

## 🔜 What I'd Add Next (with more time)

- [ ] User authentication (login/signup)
- [ ] WhatsApp integration for sharing recommendations
- [ ] Product images from actual inventory
- [ ] Payment integration for purchasing recommended products
- [ ] Admin dashboard with analytics
- [ ] PDF export of consultation reports
- [ ] Push notifications for follow-up consultations

## 🔒 AI Safety & Constraints

The AI prompt enforces:
- **Catalogue-only**: Will never recommend products not in our catalogue
- **No medical advice**: Explicitly disclaims — remedies are spiritual, not medical
- **Honest pricing**: Always shows actual catalogue prices
- **No fabrication**: Temperature 0.3 + structured output + validation

## 📝 License

Built for the Remedy Setu internship assignment. Not for commercial use.

---

*Built with ❤️ using React, Express, MongoDB, and Google Gemini AI*
