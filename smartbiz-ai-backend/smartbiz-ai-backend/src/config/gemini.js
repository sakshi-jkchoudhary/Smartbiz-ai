const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work.');
}

// Ekdum simple initialization bina kisi extra option ke
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Yahan model ke naam ke aage 'v1/' lagakar system ko direct sahi endpoint par bhejte hain
const geminiModel = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

module.exports = geminiModel;