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
        model: "gpt-4",
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
  const domJson = JSON.stringify(dom, null, 2).slice(0, 25000);
  console.log(domJson);
  const prompt = `
You are a smart browser automation agent.
Given the user's instruction and the page's cleaned DOM tree (in structured JSON), identify the best action to take.
Respond in the following JSON format:

{
  "action": "type", 
  "details": {
    "selector": "input[name='search']",
    "text": "Laptops"
  }
}

Only return valid JSON. No explanation or additional commentary.

Instruction: "${instruction}"
DOM: ${domJson}
`;

  const messages = [{ role: "user", content: prompt }];

  const jsonString = await callOpenAI(messages, 400);
  console.log("GPT JSON Output:", jsonString);
  return JSON.parse(jsonString);
};

module.exports = { getLLMElementSelector, refineInstruction };
