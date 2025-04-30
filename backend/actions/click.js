const { getLLMElementSelector } = require("../services/gptService");
const getCleanedDOM = require("../function/getCleanDOM");
const extractHybridActionableElements = require("../function/extractHybridActionableElements");

const performClick = async (page, instruction) => {
  // Step 1: Get cleaned DOM and convert it to a string format
  // const cleanedDOM = await getCleanedDOM(page);
  const cleanedDOM = await extractHybridActionableElements(page);


  // Step 2: Send to GPT for parsing the element
  const parsed = await getLLMElementSelector(instruction, cleanedDOM);
  const selector = parsed?.details?.selector;

  if (!selector) {
    throw new Error("No selector found for click");
  }

  // Perform click
  await page.waitForSelector(selector, { visible: true, timeout: 5000 });
  await page.click(selector);
  console.log(`✅ Clicked element: ${selector}`);
};

module.exports = performClick;
