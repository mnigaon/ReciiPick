import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3001;

// Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: GEMINI_API_KEY is missing in .env file!');
}
const genAI = new GoogleGenerativeAI(apiKey || 'dummy_key');

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', apiKeySet: !!apiKey });
});

// Recipe Generation Endpoint (Google Gemini API - FREE Tier)
app.post('/api/recipe', async (req, res) => {
    const { ingredients, image } = req.body;

    try {
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            throw new Error('GEMINI_API_KEY is not properly configured in .env file');
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        const systemPrompt = `You are a friendly and professional chef. 
        Response Guidelines:
        - Use a friendly, casual tone 🍳👨‍🍳✨.
        - Respond in the language used by the user (Korean if they use Korean).
        - Explain recipes in step-by-step detail.
        - Include useful cooking tips and encouraging messages.
        - ALWAYS start with a praise for the user's ingredients.
        `;

        let promptParts = [systemPrompt];

        if (image) {
            const imageData = image.split(',')[1];
            promptParts.push({
                inlineData: {
                    data: imageData,
                    mimeType: "image/jpeg"
                }
            });
            promptParts.push(ingredients || "What can I cook with these?");
        } else {
            promptParts.push(ingredients);
        }

        const result = await model.generateContent(promptParts);
        const responseText = result.response.text();

        res.json({ text: responseText });
    } catch (error) {
        console.error('=== Gemini API Error ===');
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.error('API Key (first 10 chars):', apiKey?.substring(0, 10));
        console.error('======================');
        res.status(500).json({
            error: 'Failed to generate recipe',
            details: error.message,
            hasApiKey: !!apiKey,
            errorName: error.name
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (Using FREE Gemini Model)`);
});
