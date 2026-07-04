const axios = require('axios');

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work.');
}

// Hum ek helper object bana rahe hain jo purane geminiModel ki tarah hi kaam karega
const geminiModel = {
    generateContent: async (prompt) => {
        const apiKey = process.env.GEMINI_API_KEY;
        // Yahan humne explicitly stable 'v1' endpoint ko hit kiya hai
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        try {
            const contents = typeof prompt === 'string' 
                ? [{ parts: [{ text: prompt }] }] 
                : prompt.contents;

            const response = await axios.post(url, { contents }, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Controller ke liye dummy response object structure taaki baki backend code na tute
            return {
                response: {
                    text: () => response.data.candidates[0].content.parts[0].text
                }
            };
        } catch (error) {
            console.error('Direct Gemini API Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || 'Failed to generate content');
        }
    }
};

module.exports = geminiModel;