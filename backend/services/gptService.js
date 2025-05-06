const axios = require("axios");

const openaiHeaders = {
  Authorization: `Bearer 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`,
  "Content-Type": "application/json",
};

const callOpenAI = async (messages, max_tokens = 300) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages,
        temperature: 0.3,
        max_tokens,
      },
      { headers: openaiHeaders }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    throw error;
  }
};

// STEP 1: Refine the instruction
// STEP 1: Refine the instruction into an array of steps
const refineInstruction = async (instruction) => {
  const messages = [
    {
      role: "system",
      content: `You are an assistant that converts vague browser automation instructions into a precise, structured array of steps.
Output the steps in the following JSON format:
[
  "Go to https://example.com",
  "Type 'Hello' into the search bar",
  "Click the submit button"
]

Only return a pure JSON array. No extra text.`,
    },
    { role: "user", content: instruction.join(". ") },
  ];
  const jsonString = await callOpenAI(messages, 200);
  console.log("Refined Instruction Array:", jsonString);
  return JSON.parse(jsonString);
};

// STEP 2: Use refined instruction and cleaned DOM (structured JSON) to extract selector and action
const getLLMElementSelector = async (instruction, dom) => {
  const domJson = JSON.stringify(dom, null, 2);
  const prompt = `
  You are a smart browser automation agent.
  Given the user's instruction and the current cleaned DOM tree (in structured JSON), respond with the best action to take next.
  Use this JSON format only:
  
  {
    "action": "click" | "type" | "navigate" | "submit" | "press" | "extract",
    "details": {
      "selector": "CSS selector string",
      "text": "text to type (if applicable)",
      "key": "Enter/Tab/etc (if press)",
      "url": "https://... (if navigate)"
    }
  }
  
  Only return valid JSON. No explanation or extra text.
  
  Instruction: "${instruction}"
  DOM: ${domJson}
  `;

  const messages = [{ role: "user", content: prompt }];

  const jsonString = await callOpenAI(messages, 400);
  console.log("GPT JSON Output:", jsonString);
  return JSON.parse(jsonString);
};

module.exports = { getLLMElementSelector, refineInstruction };
