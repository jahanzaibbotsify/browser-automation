const { getLLMElementSelector } = require("../services/gptService");
const getCleanedDOM = require("../function/getCleanDOM");
const extractHybridActionableElements = require("../function/extractHybridActionableElements");

const performPress = async (page, instruction) => {
  // Step 1: Get cleaned DOM and convert it to a string format
  // const cleanedDOM = await getCleanedDOM(page);
  const cleanedDOM = await extractHybridActionableElements(page);

  // Step 2: Send to GPT for parsing the element
  const parsed = await getLLMElementSelector(instruction, cleanedDOM);
  const selector = parsed?.details?.selector;
  const key = parsed?.details?.text; // Assuming key is provided as 'text' field

  if (!selector) throw new Error("❌ No selector found for press action");
  if (!key) throw new Error("❌ No key specified for press action");

  // Focus and press the key
  await page.waitForSelector(selector, { visible: true, timeout: 5000 });
  await page.focus(selector);
  await page.keyboard.press(key);

  console.log(`🎯 Pressed "${key}" on element: ${selector}`);
};

module.exports = performPress;
