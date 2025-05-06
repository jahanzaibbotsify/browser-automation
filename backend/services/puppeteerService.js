const puppeteer = require("puppeteer");
const gptService = require("./gptService"); // This handles GPT-4 integration
const { launchPuppeteer } = require("../config/puppeteerConfig");
const performType = require("../actions/type");
const performClick = require("../actions/click");
const performPress = require("../actions/press");
const performNavigate = require("../actions/navigate");
const performExtractDOM = require("../actions/extractDOM");
const performSubmitForm = require("../actions/submitForm");

const extractHybridActionableElements = require("../function/extractHybridActionableElements");
const {
  getLLMElementSelector,
  refineInstruction,
} = require("../services/gptService");

const startAutomation = async (url, instructions, config) => {
  const browser = await launchPuppeteer({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  const results = [];
  const refinedSteps = await refineInstruction(instructions);

  for (const step of refinedSteps) {
    const dom = await extractHybridActionableElements(page); // fresh DOM
    const gptAction = await getLLMElementSelector(step, dom); // GPT returns selector + action
    const result = await performAction(page, gptAction); // perform action based on GPT
    results.push(result);
  }

  return results;
};

const performAction = async (page, gptAction) => {
  const { action, details } = gptAction;
  if (!action || !details || !details.selector) {
    return { success: false, message: "Invalid GPT action format." };
  }

  switch (action) {
    case "type":
      return await performType(page, details.selector, details.text);
    case "click":
      return await performClick(page, details.selector);
    case "press":
      return await performPress(page, details.selector, details.key);
    case "navigate":
      return await performNavigate(page, details.url);
    case "submit":
      return await performSubmitForm(page, details.selector);
    case "extract":
      return await performExtractDOM(page, details.selector);
    default:
      return { success: false, message: "Unsupported action type from GPT." };
  }
};

module.exports = { startAutomation };
