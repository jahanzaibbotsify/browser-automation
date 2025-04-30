const { getLLMElementSelector } = require("../services/gptService");
const getCleanedDOM = require("../function/getCleanDOM");
const extractHybridActionableElements = require("../function/extractHybridActionableElements");

const performSubmitForm = async (page, instruction) => {
  try {
    // Step 1: Get cleaned DOM and convert it to a string format
    // const cleanedDOM = await getCleanedDOM(page);
    const cleanedDOM = await extractHybridActionableElements(page);

    // Step 2: Send to GPT for parsing the element
    const parsed = await getLLMElementSelector(instruction, cleanedDOM);
    const selector = parsed?.details?.selector;

    if (!selector) throw new Error("No selector found for submit form");

    // Click to submit the form
    await page.waitForSelector(selector, { visible: true, timeout: 5000 });
    await page.click(selector);

    console.log(`✅ Submitted form using button: ${selector}`);
    return { success: true, message: `Form submitted using ${selector}` };
  } catch (error) {
    console.error("❌ Error submitting form:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = performSubmitForm;
