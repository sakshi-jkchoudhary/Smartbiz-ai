const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set.');
}

// v1 API version ko force karne ke liye apiVersion pass karenge
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const geminiModel = {
    generateContent: async (prompt) => {
        try {
            // Nayi key format ke liye apiVersion: 'v1' dena zaroori hai
            const model = genAI.getGenerativeModel(
                { model: "gemini-1.5-flash" },
                { apiVersion: 'v1' }
            );
            
            const promptText = typeof prompt === 'string' 
                ? prompt 
                : prompt.contents?.[0]?.parts?.[0]?.text || JSON.stringify(prompt);

            const result = await model.generateContent(promptText);
            const response = await result.response;
            
            return {
                response: {
                    text: () => response.text()
                }
            };
        } catch (error) {
            console.error('Gemini SDK Error:', error.message);
            throw error;
        }
    }
};

module.exports = geminiModel;