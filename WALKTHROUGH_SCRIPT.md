# 🎬 6–10 Minute Video Recording Script for Remedy Setu

Follow this structured script while recording your screen (using Loom, QuickTime, or OBS). Keep your webcam on in the corner if possible!

---

## ⏱️ Section 1: Product Demo (3–4 Minutes)

### Step 1: Introduction (30 seconds)
> *"Hello everyone! Today I'm presenting my submission for the Software Development Intern role at Remedy Setu. I chose **Option 2 — AI Remedy Assistant**, an AI-powered Vedic astrology tool that takes a user's birth details and primary life concern, provides personalized astrological analysis, and recommends remedies strictly from our 18-item product catalogue in English or Hindi."*

### Step 2: Live Demo — English Consultation (1.5 minutes)
1. Open **`http://localhost:3000`** in Chrome.
2. Step 1 (Personal Details):
   - Name: `Aarav Sharma`
   - Date of Birth: `12 August 1996`
   - Gender: Click `Male`
   - Click `Next`.
3. Step 2 (Your Concern):
   - Click on the **Career** card (💼).
   - Click `Next`.
4. Step 3 (Language & Details):
   - Select **English**.
   - (Optional) Type in details: `"Looking for career growth and overcoming work obstacles"`.
   - Click **Get Vedic Remedies ✨**.
5. Show the result screen:
   - Point out the **Greeting** by name.
   - Show the **Astrological Analysis** explaining how Saturn (Shani) and Mercury (Budh) energies influence career.
   - Point out the **Recommended Products** (e.g. *Blue Sapphire / Neelam*, *1 Mukhi Rudraksha*, *Navgraha Shanti Puja*).
   - Point out the **Prices** in ₹, **Weights**, and the **"Why this remedy helps"** explanation for each item.
   - Highlight the **General Spiritual Advice** and **Disclaimer**.

### Step 3: Live Demo — Hindi Consultation (1 minute)
1. Click **Start Another Consultation**.
2. Enter:
   - Name: `Priya Patel`
   - Date of Birth: `20 May 1998`
   - Gender: `Female`
   - Concern: **Marriage** (💑)
   - Language: **Hindi** (हिंदी)
3. Submit and show the results rendered in beautiful Hindi:
   - Show the greeting: *"नमस्ते Priya Patel जी..."*
   - Show the Jupiter/Venus (बृहस्पति और शुक्र) analysis.
   - Show the Hindi product titles (*पुखराज*, *गौरी शंकर रुद्राक्ष*, *विवाह पूजा*).

### Step 4: Catalogue & History Pages (1 minute)
1. Click **Products** in the navbar:
   - Show the category filter tabs: click **Gemstones**, **Rudraksha**, **Puja Services**.
   - Type `"Neelam"` in the search bar to demonstrate real-time search.
2. Click **History** in the navbar:
   - Show that Aarav and Priya's consultations are saved.
   - Click the expand chevron to reveal the recommended remedies and advice.

---

## ⏱️ Section 2: Code Walkthrough (3–4 Minutes)

### Step 1: Project Architecture (1 minute)
1. Open your code editor and show the folders:
   - `client/`: React 18, Vite, Tailwind CSS, Framer Motion for animations.
   - `server/`: Express.js, MongoDB Mongoose, and Google Gemini 1.5 Flash API.
   - Show `server/data/catalogue.json`: 18 realistic items with categories, prices in INR, origins, and concern tags.

### Step 2: AI Prompting & Hallucination Defense (2 minutes)
Open **`server/controllers/consultationController.js`** and explain:
1. **The System Prompt (`buildSystemPrompt`)**:
   > *"Here is how we control the AI. We inject the full 18-item catalogue directly into the system prompt. Rule #1 is absolute: 'ONLY recommend products that exist in the catalogue by their exact ID. Never invent a product or price.'"*
2. **Temperature & JSON Mode**:
   > *"We set `temperature: 0.3` to keep answers factual and predictable, and force `responseMimeType: 'application/json'` to receive clean JSON."*
3. **The Hallucination Filter**:
   > *"Even with prompt rules, LLMs can occasionally hallucinate. So we added a post-processing interceptor in line 180: we cross-reference every returned `productId` against a Set of valid catalogue IDs. Any hallucinated ID is immediately stripped out before sending to the client."*
4. **Catalogue-Direct Pricing**:
   > *"Notice that prices are NOT fetched from the LLM. We merge the AI's astrological reasons with our own hardcoded `catalogue.json` so prices are always 100% accurate."*

### Step 3: In-Memory / MongoDB Fallback (1 minute)
Open **`server/config/db.js`**:
> *"To ensure that this project is reliable and can be run locally in under 2 minutes without needing MongoDB installed, we created an automatic in-memory fallback. If MongoDB is connected, it persists to the database; if not, it gracefully uses in-memory data structures."*

---

## ⏱️ Section 3: Decisions & Next Steps (1–2 Minutes)

### Why this option & tech stack:
> *"I chose Option 2 because remedies are the core business of Remedy Setu. Demonstrating constrained AI that respects inventory is a direct, real-world business need. I chose React and Express with Tailwind because it allowed me to deliver a polished, mobile-friendly experience with animations and bilingual support quickly."*

### Where I got stuck & how I solved it:
> *"One challenge was ensuring consistent Hindi responses while maintaining structured JSON format. Sometimes LLMs return markdown code fences around JSON. I solved this by adding a sanitizing JSON parser and low temperature generation."*

### What I'd add with one more week:
1. *"WhatsApp sharing so astrologers can send consultations to clients directly."*
2. *"Real horoscope / kundali chart SVG rendering (Lagna & Navamsha)."*
3. *"Razorpay payment checkout to purchase recommended items on the spot."*

### Closing (15 seconds):
> *"Thank you for reviewing my assignment! All instructions to run the project in under 2 minutes are in the README, and the GitHub repository is public. I look forward to discussing this in the technical round!"*
