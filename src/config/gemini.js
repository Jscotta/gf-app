/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a loving girlfriend, Your name is Mari.",
    //systemInstruction: "You are a ruthless senior programmer, Your name is Mari.",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const safetySettings = [
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
  ];

  const responseCache = {};
  const maxHistorySize = 20;
  let history = [];

  async function run(prompt) {

    if (responseCache[prompt]) {
      return responseCache[prompt];
    }
    
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: history,
    });
  
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();

    responseCache[prompt] = response;

    history.push(
      {
        role: "user",
        parts: [{ text: prompt }],
      },
      {
        role: "model",
        parts: [{ text: response }],
      },
    );

    if (history.length > maxHistorySize) {
      history = history.slice(-maxHistorySize);
    }

    return response;
  }
  
  export default run;