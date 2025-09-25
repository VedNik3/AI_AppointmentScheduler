// This is a standalone script to verify your Gemini API key.
// To run it from your terminal: node test-api-key.js

// --- Imports ---
// This line MUST be at the very top to load variables from the .env file.
// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Main Test Function ---
async function runApiKeyTest() {
  console.log('--- Starting API Key Validation Test ---');

  // 1. Load the API key from the environment variables
  const apiKey = "AIzaSyD3i7VYHFkQ6_1Paid-bc8DwbS0ut16dKg";

  // 2. Check if the key was loaded from the .env file at all
  if (!apiKey) {
    console.error('❌ FAILED: The GEMINI_API_KEY was not found in your .env file.');
    console.log('Please ensure your .env file exists and has the correct variable name.');
    return; // Stop the script
  }

  console.log('✅ API Key successfully loaded from .env file.');

  // 3. Try to make a simple API call
  try {
    console.log('Attempting to connect to Google Generative AI...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

    // Make the simplest possible request
    const prompt = 'Say "Hello, World!"';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Your API Key is valid.');
    console.log('Response from Gemini:', text);

  } catch (error) {
    console.error('❌ FAILED: The API key is invalid or another error occurred.');
    console.error('--- Full Error Details ---');
    // Log the full error to see the exact reason for the failure
    console.error(error);
  } finally {
    console.log('--- Test Finished ---');
  }
}

// --- Execute the test ---
runApiKeyTest();
