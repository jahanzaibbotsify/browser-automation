const puppeteer = require("puppeteer");
const gptService = require("./gptService"); // This handles GPT-4 integration
const { launchPuppeteer } = require("../config/puppeteerConfig");
const performType = require("../actions/type");
const performClick = require("../actions/click");
const performPress = require("../actions/press");
const performNavigate = require("../actions/navigate");
const performExtractDOM = require("../actions/extractDOM");
const performSubmitForm = require("../actions/submitForm");
const { refineInstruction } = require("../services/gptService");

// Start automation with detailed steps
const startAutomation = async (url, instructions, config) => {
  const browser = await launchPuppeteer({ headless: false });
  const page = await browser.newPage();

  // Set viewport and stealth mode
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  const results = [];
  const refinedSteps = await refineInstruction(instructions);
  for (const instruction of refinedSteps) {
    const actionResult = await performAction(page, instruction, config);
    results.push(actionResult);
  }

  // await browser.close();
  return results;
};

const performAction = async (page, instruction) => {
  const intent = instruction.toLowerCase();

  if (
    intent.includes("type") ||
    intent.includes("enter text") ||
    intent.includes("search")
  )
    return await performType(page, instruction);

  if (intent.includes("click")) return await performClick(page, instruction);
  if (intent.includes("press")) return await performPress(page, instruction);
  if (intent.includes("submit") && intent.includes("form"))
    return await performSubmitForm(page, instruction);

  if (
    intent.includes("extract") ||
    intent.includes("scrape") ||
    intent.includes("get text")
  )
    return await performExtractDOM(page, instruction);

  return {
    success: false,
    message: "No matching action found for instruction.",
  };
};

module.exports = { startAutomation };
