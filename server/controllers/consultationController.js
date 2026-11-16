const { GoogleGenerativeAI } = require('@google/generative-ai');
const catalogue = require('../data/catalogue.json');

// ---------------------------------------------------------------------------
// In-memory fallback store for consultations
// ---------------------------------------------------------------------------
let inMemoryConsultations = [];

/**
 * Determine whether to use Mongoose or in-memory storage.
 */
function useDB(req) {
  return req.app.locals.dbConnected === true;
}

// ---------------------------------------------------------------------------
// Build the system prompt — this is the heart of the AI's behaviour.
// ---------------------------------------------------------------------------
function buildSystemPrompt(language) {
  const lang = language === 'hi' ? 'Hindi' : 'English';

  const catalogueText = catalogue
    .map(
      (p) =>
        `- ID: ${p.id} | Name: ${p.name} (${p.nameHindi}) | Category: ${p.category} | Price: ₹${p.price} | Concerns: ${p.concerns.join(', ')} | Benefits: ${p.benefits.join(', ')} | In Stock: ${p.inStock}`
    )
    .join('\n');

  return `
You are **"Remedy Setu Pandit Ji"**, a warm, knowledgeable, and trustworthy Vedic astrology consultant working for the Remedy Setu platform.

═══════════════════════════════════════════════════
ABSOLUTE RULES — NEVER VIOLATE THESE
═══════════════════════════════════════════════════

1. **ONLY recommend products that exist in the PRODUCT CATALOGUE below.** You must reference them by their exact "id" field. If no product fits, say so honestly — NEVER invent a product or price.
2. **NEVER provide medical, legal, or financial advice.** You are an astrology consultant, not a doctor, lawyer, or financial advisor. Always add a disclaimer.
3. **Respond in ${lang}.** Keep the tone respectful, empathetic, and simple enough for a common person to understand.
4. **Return ONLY valid JSON** in the exact schema specified below. No markdown, no code fences, no extra text outside the JSON.
5. **Recommend 2–3 products maximum** per consultation (e.g. 1 Gemstone, 1 Rudraksha, or 1 Puja). Prioritize relevance.
6. **Do NOT hallucinate** any astrological claims. Keep advice general, respectful, and positive.
7. **Include the product ID** in every recommendation so the frontend can link to it.

═══════════════════════════════════════════════════
PRODUCT CATALOGUE (this is ALL that exists)
═══════════════════════════════════════════════════

${catalogueText}

═══════════════════════════════════════════════════
YOUR RESPONSE SCHEMA (strict JSON, no deviation)
═══════════════════════════════════════════════════

{
  "greeting": "A warm personalised greeting for the user by name.",
  "analysis": "A 3–5 sentence astrological analysis based on their date of birth, gender, and concern. Mention which planetary energies influence their concern.",
  "recommendations": [
    {
      "productId": "<exact id from catalogue>",
      "productName": "<exact name from catalogue>",
      "reason": "2–3 sentences explaining why this product helps their specific concern."
    }
  ],
  "generalAdvice": "2–3 sentences of positive lifestyle or spiritual advice relevant to their concern. End with an encouraging note.",
  "disclaimer": "A short disclaimer that this is spiritual guidance, not a substitute for professional medical/financial advice."
}

Do NOT add any keys beyond those listed. Return ONLY the JSON object.
`.trim();
}

/**
 * Clean and parse JSON from model output (handling code fences if present).
 */
function parseModelJson(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

/**
 * Deterministic fallback Vedic engine for when Gemini API key is missing or quota is exhausted.
 * This guarantees the application works out-of-the-box in any demo or evaluation scenario.
 */
function generateVedicFallback({ userName, dateOfBirth, gender, concern, language }) {
  const isHi = language === 'hi';
  
  // Filter products by concern
  const relevantProducts = catalogue.filter((p) => p.concerns.includes(concern) && p.inStock);

  // Group by category to give balanced recommendation (1 gemstone/rudraksha + 1 puja)
  const gems = relevantProducts.filter((p) => p.category === 'Gemstones');
  const rudrakshas = relevantProducts.filter((p) => p.category === 'Rudraksha');
  const pujas = relevantProducts.filter((p) => p.category === 'Puja Services');

  const selected = [];
  if (gems.length > 0) selected.push(gems[0]);
  if (rudrakshas.length > 0) selected.push(rudrakshas[0]);
  if (pujas.length > 0 && selected.length < 3) selected.push(pujas[0]);

  // If still fewer than 2, pick anything relevant
  if (selected.length < 2 && relevantProducts.length > selected.length) {
    for (const p of relevantProducts) {
      if (!selected.find((s) => s.id === p.id)) {
        selected.push(p);
        if (selected.length >= 2) break;
      }
    }
  }

  const concernTitles = {
    career: { en: 'Career & Professional Growth', hi: 'करियर और कार्यक्षेत्र में उन्नति' },
    marriage: { en: 'Marriage & Relationship Harmony', hi: 'विवाह और वैवाहिक सुख' },
    health: { en: 'Health, Vitality & Well-being', hi: 'स्वास्थ्य और दीर्घायु' },
    finance: { en: 'Financial Stability & Wealth', hi: 'धन-समृद्धि और आर्थिक स्थिति' },
  };

  const planetMap = {
    career: { en: 'Saturn (Shani) and Mercury (Budh)', hi: 'शनि और बुध' },
    marriage: { en: 'Jupiter (Brihaspati) and Venus (Shukra)', hi: 'बृहस्पति और शुक्र' },
    health: { en: 'Sun (Surya) and Moon (Chandra)', hi: 'सूर्य और चंद्र देव' },
    finance: { en: 'Lakshmi and Mercury (Budh)', hi: 'माता लक्ष्मी और बुध ग्रह' },
  };

  const greeting = isHi
    ? `नमस्ते ${userName} जी! रेमेडी सेतु के वैदिक परामर्श मंच पर आपका हार्दिक स्वागत है।`
    : `Namaste ${userName} ji! Welcome to Remedy Setu's Vedic astrology consultation.`;

  const analysis = isHi
    ? `आपकी जन्मतिथि (${dateOfBirth}) और ${concernTitles[concern].hi} की चिंता का अध्ययन करने पर ज्ञात होता है कि वर्तमान समय में ${planetMap[concern].hi} की ऊर्जा को संतुलित करने की आवश्यकता है। ग्रहों के प्रभाव को सकारात्मक दिशा देने के लिए शास्त्रीय उपायों का विशेष महत्व है। सही रत्न, रुद्राक्ष एवं वैदिक अनुष्ठान से आपके मार्ग की बाधाएं दूर हो सकती हैं।`
    : `Based on your birth date (${dateOfBirth}) and focus on ${concernTitles[concern].en}, your astrological energies indicate a need to strengthen the influences of ${planetMap[concern].en}. Planetary alignments suggest that focused remedies can help dispel obstacles and align favorable cosmic energies for progress.`;

  const recommendations = selected.map((prod) => ({
    productId: prod.id,
    productName: isHi ? `${prod.nameHindi} (${prod.name})` : prod.name,
    reason: isHi
      ? `${prod.nameHindi} आपके ${concernTitles[concern].hi} से जुड़े ग्रहों को बल प्रदान करता है। यह ${prod.benefits.slice(0, 2).join(' और ')} के लिए अत्यंत लाभकारी सिद्ध होता है।`
      : `${prod.name} channels auspicious energies directly aligning with your ${concernTitles[concern].en}. It is traditionally revered for ${prod.benefits.slice(0, 2).join(' and ')}.`,
  }));

  const generalAdvice = isHi
    ? `प्रतिदिन प्रातः सूर्य देव को जल अर्पित करें और सकारात्मक संकल्प के साथ दिन की शुरुआत करें। धैर्य और निष्ठा से किए गए वैदिक उपाय शीघ्र फलदायी होते हैं।`
    : `Begin your mornings with positive affirmations and offer water to the rising sun. Maintain patience and consistency, as Vedic remedies gradually harmonize inner peace and external circumstances.`;

  const disclaimer = isHi
    ? `यह परामर्श प्राचीन वैदिक मान्यताओं पर आधारित आध्यात्मिक मार्गदर्शन है। यह किसी कानूनी, वित्तीय या चिकित्सीय सलाह का विकल्प नहीं है।`
    : `This consultation is spiritual guidance rooted in Vedic traditions. It is not a substitute for professional medical, legal, or financial advice.`;

  return {
    greeting,
    analysis,
    recommendations,
    generalAdvice,
    disclaimer,
  };
}

// ---------------------------------------------------------------------------
// POST /api/consultation — Main remedy endpoint
// ---------------------------------------------------------------------------
async function getRemedy(req, res, next) {
  try {
    const rawName = req.body.userName || req.body.name;
    const { dateOfBirth, gender, concern } = req.body;
    const rawLang = req.body.language || 'en';

    // ---- Validation --------------------------------------------------------
    if (!rawName || !dateOfBirth || !gender || !concern) {
      const err = new Error(
        'Missing required fields: name (or userName), dateOfBirth, gender, concern'
      );
      err.statusCode = 400;
      throw err;
    }

    const userName = rawName.trim();
    const validConcerns = ['career', 'marriage', 'health', 'finance'];
    if (!validConcerns.includes(concern.toLowerCase())) {
      const err = new Error(
        `Invalid concern. Must be one of: ${validConcerns.join(', ')}`
      );
      err.statusCode = 400;
      throw err;
    }

    const normalizedGender = gender.toLowerCase();
    const normalizedConcern = concern.toLowerCase();
    const lang = (rawLang.toLowerCase().startsWith('hi')) ? 'hi' : 'en';

    let aiResponse = null;
    let engineUsed = 'Gemini 1.5 Flash';

    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidKey = apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here';

    if (hasValidKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        });

        const dob = new Date(dateOfBirth);
        const age = Math.floor(
          (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );

        const userMessage = `
User Details:
- Name: ${userName}
- Date of Birth: ${dateOfBirth} (Approx age: ${isNaN(age) ? 'N/A' : age})
- Gender: ${normalizedGender}
- Primary Concern: ${normalizedConcern}
- Preferred Language: ${lang === 'hi' ? 'Hindi' : 'English'}

Based on the above, provide your astrological analysis and recommend suitable products ONLY from the catalogue. Follow the JSON schema exactly.
`.trim();

        const systemPrompt = buildSystemPrompt(lang);

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        });

        const responseText = result.response.text();
        aiResponse = parseModelJson(responseText);
      } catch (geminiError) {
        console.warn('⚠️ Gemini API call failed, falling back to Vedic rule engine:', geminiError.message);
        engineUsed = 'Vedic Rule Engine (API Fallback)';
        aiResponse = generateVedicFallback({
          userName,
          dateOfBirth,
          gender: normalizedGender,
          concern: normalizedConcern,
          language: lang,
        });
      }
    } else {
      console.log('ℹ️ No GEMINI_API_KEY configured. Using Vedic Rule Engine fallback.');
      engineUsed = 'Vedic Rule Engine (Demo Mode)';
      aiResponse = generateVedicFallback({
        userName,
        dateOfBirth,
        gender: normalizedGender,
        concern: normalizedConcern,
        language: lang,
      });
    }

    // Safety guard: Validate that every recommended product ID actually exists in catalogue
    const catalogueMap = new Map(catalogue.map((p) => [p.id, p]));
    if (Array.isArray(aiResponse.recommendations)) {
      aiResponse.recommendations = aiResponse.recommendations.filter((rec) => {
        if (!catalogueMap.has(rec.productId)) {
          console.warn(
            `⚠️  Filtering out invalid/hallucinated product "${rec.productId}".`
          );
          return false;
        }
        return true;
      });
    }

    const recommendedProductIds = (aiResponse.recommendations || []).map(
      (r) => r.productId
    );

    const recommendedProducts = recommendedProductIds
      .map((id) => catalogueMap.get(id))
      .filter(Boolean);

    // ---- Persist consultation ---------------------------------------------
    const consultationRecord = {
      userName,
      dateOfBirth: new Date(dateOfBirth),
      gender: normalizedGender,
      concern: normalizedConcern,
      language: lang,
      aiResponse,
      recommendedProducts: recommendedProductIds,
      engine: engineUsed,
      createdAt: new Date(),
    };

    if (useDB(req)) {
      try {
        const Consultation = require('../models/Consultation');
        await Consultation.create(consultationRecord);
      } catch (dbErr) {
        console.error('Failed to save to DB, keeping in memory:', dbErr.message);
        inMemoryConsultations.push({
          _id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          ...consultationRecord,
        });
      }
    } else {
      inMemoryConsultations.push({
        _id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...consultationRecord,
      });
    }

    // ---- Respond ----------------------------------------------------------
    res.status(200).json({
      success: true,
      meta: {
        engine: engineUsed,
      },
      data: {
        consultation: aiResponse,
        products: recommendedProducts,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/consultations?limit=20
// ---------------------------------------------------------------------------
async function getHistory(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    let consultations;

    if (useDB(req)) {
      const Consultation = require('../models/Consultation');
      consultations = await Consultation.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } else {
      consultations = inMemoryConsultations
        .slice()
        .reverse()
        .slice(0, limit);
    }

    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRemedy, getHistory };
