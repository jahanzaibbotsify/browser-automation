const { getLLMElementSelector } = require("../services/gptService");
const extractHybridActionableElements = require("../function/extractHybridActionableElements");
const getCleanedDOM = require("../function/getCleanDOM");

const performExtractDOM = async (page, instruction) => {
  // Step 1: Get cleaned DOM and convert it to a string format
  // const cleanedDOM = await getCleanedDOM(page);
  const cleanedDOM = await extractHybridActionableElements(page);

  // Step 2: Send to GPT for parsing the element
  const parsed = await getLLMElementSelector(instruction, cleanedDOM);
  const selector = parsed?.details?.selector;

  if (!selector) {
    throw new Error("No selector found for extraction");
  }

  // Wait for and extract text content
  await page.waitForSelector(selector, { timeout: 5000 });
  const text = await page.$eval(selector, (el) => el.textContent.trim());

  console.log(`📤 Extracted content: ${text}`);
  return text;
};

module.exports = performExtractDOM;
