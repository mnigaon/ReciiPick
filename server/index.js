import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
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

        // List of models to try in order
        const systemPrompt = `You are ReciiPick, a friendly AI chef assistant who helps users create recipes.

🎯 YOUR MISSION:
Analyze user input and decide whether to CREATE A RECIPE or REJECT the request.

==================================================
📊 INPUT CATEGORIES:
==================================================

✅ CATEGORY 1: ACCEPT - User mentions specific dish name
Examples: "pancake", "kimchi stew", "pasta carbonara", "감자볶음", "된장찌개"
→ CREATE RECIPE for that dish

✅ CATEGORY 2: ACCEPT - User lists ingredients
Examples: "eggs, onions, cheese", "양파, 계란, 치즈", "potato"
→ CREATE RECIPE using those ingredients

✅ CATEGORY 3: ACCEPT - User asks for recipe type
Examples: "quick 15min meal", "간단한 15분 요리", "breakfast ideas"
→ CREATE RECIPE matching the request

❌ CATEGORY 4: REJECT - Completely unrelated to food
Examples: "computer", "sky", "hello", "gg", "a", "안녕", "노트북"
→ SEND REJECTION MESSAGE

==================================================
✅ IF INPUT IS ACCEPTED (Category 1, 2, or 3):
==================================================

Respond with EXACTLY this format:

[DISH_NAME: Recipe Title in User's Language]

📋 재료: (or "Ingredients:" for English)
- Ingredient 1 with quantity
- Ingredient 2 with quantity

👨‍🍳 조리 과정: (or "Cooking Steps:" for English)
1. First step with clear instructions
2. Second step with clear instructions

💡 팁: (or "Tip:" for English)
- One helpful cooking tip

RULES:
- Keep it concise and practical
- Match the user's language (Korean for Korean input, English for English input)
- Use emojis sparingly (🍳 👨‍🍳 ✨)
- ALWAYS start with [DISH_NAME: ...]
- NO chitchat before or after the recipe

==================================================
❌ IF INPUT IS REJECTED (Category 4):
==================================================

Respond with EXACTLY this format:

For Korean users:
[REJECTED: 죄송하지만 저는 요리와 레시피만 도와드릴 수 있어요! 👨‍🍳 어떤 재료가 있는지 알려주시거나 재료 사진을 올려주시면 맛있는 레시피를 만들어드릴게요! 🍳]

For English users:
[REJECTED: I'm sorry, but I can only help with cooking and recipes! 👨‍🍳 Please tell me what ingredients you have or upload a photo of your ingredients, and I'll create a delicious recipe for you! 🍳]

==================================================
🔍 DECISION LOGIC:
==================================================

1. Does the input mention ANY food, ingredient, or dish?
   → YES = CREATE RECIPE (Category 1, 2, or 3)
   → NO = REJECT (Category 4)

2. When in doubt, CREATE A RECIPE rather than rejecting.

3. Even single-word food inputs should generate a recipe:
   - "potato" → Create potato recipe
   - "kimchi" → Create kimchi recipe
   - "eggs" → Create egg recipe
`;

        // Prepare prompt parts (User input only)
        let promptParts = [systemPrompt];

        console.log("=== Recipe Generation Debug ===");
        console.log("User Input:", ingredients);
        console.log("Has Image:", !!image);

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

        // List of models to try in order
        const modelNames = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-001",
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-pro-latest",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-1.5-pro",
            "gemini-1.0-pro"
        ];

        let result = null;
        let modelError = null;

        // Try each model until one works
        for (const modelName of modelNames) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    ],
                });

                result = await model.generateContent(promptParts);
                console.log(`✅ Success with model: ${modelName}`);
                break; // Stop if successful
            } catch (error) {
                const errorMsg = `⚠️ Failed with model ${modelName}: ${error.message}\n`;
                console.warn(errorMsg);
                fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - ${errorMsg}`);
                modelError = error;
                // Continue to next model
            }
        }

        if (!result) {
            const finalError = `All models failed. Last error: ${modelError?.message}`;
            fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - ❌ ${finalError}\n`);
            throw new Error(finalError);
        }

        // Helper function to detect language and return appropriate rejection message
        const getRejectionMessage = (input) => {
            const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(input || '');
            if (hasKorean) {
                return '[REJECTED: 죄송하지만 저는 요리와 레시피만 도와드릴 수 있어요! 👨‍🍳 어떤 재료가 있는지 알려주시거나 재료 사진을 올려주시면 맛있는 레시피를 만들어드릴게요! 🍳]';
            } else {
                return '[REJECTED: I\'m sorry, but I can only help with cooking and recipes! 👨‍🍳 Please tell me what ingredients you have or upload a photo of your ingredients, and I\'ll create a delicious recipe for you! 🍳]';
            }
        };

        // Safely extract response text
        let responseText = '';
        try {
            responseText = result.response.text();
        } catch (textError) {
            // Handle blocked or empty responses
            console.error('Error extracting response text:', textError);
            console.error('Response object:', JSON.stringify(result.response, null, 2));

            // Check if response was blocked
            if (result.response.promptFeedback?.blockReason) {
                responseText = getRejectionMessage(ingredients);
            } else {
                throw new Error('Failed to extract response text from AI');
            }
        }

        // Validate response is not empty
        if (!responseText || responseText.trim().length === 0) {
            responseText = getRejectionMessage(ingredients);
        }

        res.json({ text: responseText });
    } catch (error) {
        console.error('=== Gemini API Error ===');
        console.error('Error message:', error.message);

        // Log details but DO NOT crash or send 500
        // Instead, send a polite rejection message so the client shows the ErrorModal

        // Detect language from request body (user input)
        const userInput = req.body.ingredients || '';
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userInput);

        let rejectionMessage;
        if (hasKorean) {
            rejectionMessage = '[REJECTED: 죄송하지만 저는 요리와 레시피만 도와드릴 수 있어요! 👨‍🍳 어떤 재료가 있는지 알려주시거나 재료 사진을 올려주시면 맛있는 레시피를 만들어드릴게요! 🍳]';
        } else {
            rejectionMessage = '[REJECTED: I\'m sorry, but I can only help with cooking and recipes! 👨‍🍳 Please tell me what ingredients you have or upload a photo of your ingredients, and I\'ll create a delicious recipe for you! 🍳]';
        }

        res.json({ text: rejectionMessage });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (Using FREE Gemini Model)`);
});
