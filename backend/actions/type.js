const { getLLMElementSelector } = require("../services/gptService");
const getCleanedDOM = require("../function/getCleanDOM");
const extractHybridActionableElements = require("../function/extractHybridActionableElements");

const performType = async (page, instruction) => {
  // Step 1: Get cleaned DOM and convert it to a string format
  // const cleanedDOM = await getCleanedDOM(page);
  const cleanedDOM = await extractHybridActionableElements(page);

  // Step 2: Send to GPT for parsing the element
  const parsed = await getLLMElementSelector(instruction, cleanedDOM);

  if (
    !parsed ||
    !parsed.details ||
    !parsed.details.selector ||
    !parsed.details.text
  ) {
    throw new Error("LLM response missing required details");
  }

  const { selector, text } = parsed.details;

  // Step 3: Type into the selected element
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.type(selector, text, { delay: 100 }); // optional delay to mimic human typing
};

module.exports = performType;
