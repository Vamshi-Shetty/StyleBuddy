import axios from 'axios';
const API_URL = 'https://generativeai.googleapis.com/v1beta3/chat/completions'; // replace with the correct API endpoint

// API call function to Google Generative AI API
export const getAIResponse = async (message: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gemini-1.5-flash-002', // replace with your model ID
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Authorization': `AIzaSyA8KCKKSfTNF8SNaEmSiV_wivgu9_4zPfw`, // replace with your API key
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling Google Generative AI API:', error);
    throw new Error('Error while fetching AI response');
  }
};
