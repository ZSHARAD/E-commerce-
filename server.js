import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `You are ZS Connect, the friendly assistant for ZSHARAD, a premium electronics store.

STORE INFO:
- Products: ZSHARAD Phone ₹82,999 (titanium, 6.7" 120Hz display, 48MP camera, 29h battery), Watch Ultra ₹33,999 (49mm, dual-band GPS, 100m water resistant, 36h battery), AirBuds Pro ₹16,999 (ANC, spatial audio, 6h battery), MagCharge ₹4,199 (25W wireless charger), Nova Book ₹1,07,999 (14" display, 22h battery, 16GB RAM, 1TB storage)
- Address: Uslapur, Bilaspur, Chhattisgarh, India 495001
- Phone/WhatsApp: +91 89823 79366
- Email: info@zsharad.com
- Delivery: All India 3–7 days; Bilaspur/Chhattisgarh 1–2 days. Free shipping.

RULES:
- ALWAYS reply in the same language the customer writes in (Hindi, English, Chhattisgarhi, Spanish, Arabic, any language).
- Be warm, human, and concise — usually 1-3 short sentences.
- For orders, complaints, refunds, or anything you can't handle, share the WhatsApp number +91 89823 79366.
- Never invent products, discounts, or policies not listed above.`;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10)
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ reply: 'Sorry, I had trouble connecting. Please WhatsApp us at +91 89823 79366!' });
  }
});

app.listen(3000, () => console.log('✅ ZSHARAD running at http://localhost:3000'));
