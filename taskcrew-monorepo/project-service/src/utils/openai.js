const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = openai;
