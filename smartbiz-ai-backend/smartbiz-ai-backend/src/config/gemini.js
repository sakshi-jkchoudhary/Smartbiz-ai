if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work.');
}

const geminiModel = {
    generateContent: async (prompt) => {
        try {
            const apiKey = process.env.GEMINI_API_KEY || '';
            
            // Extract text prompt securely
            const promptText = typeof prompt === 'string' 
                ? prompt 
                : prompt.contents?.[0]?.parts?.[0]?.text || JSON.stringify(prompt);

            // Direct HTTPS injection to enforce global v1 stable endpoint bypass
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: promptText }]
                        }]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `HTTP Error ${response.status}`);
            }

            // Map structural interface exactly to your original controller setup
            return {
                response: {
                    text: () => data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text available.'
                }
            };
        } catch (error) {
            console.error('Direct Gemini Fetch Error:', error.message);
            throw error;
        }
    }
};

module.exports = geminiModel;