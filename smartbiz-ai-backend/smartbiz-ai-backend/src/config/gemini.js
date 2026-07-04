const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 'gemini-pro' universal model hai jo 404 error nahi dega
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

module.exports = geminiModel;