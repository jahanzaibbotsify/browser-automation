const { getLLMElementSelector } = require('../services/gptService');

const performNavigate = async (page, instruction) => {
  // Get URL from GPT or fallback to regex
  const { details } = await getLLMElementSelector(instruction, '');
  const url = details?.url || extractUrl(instruction);

  if (!url) throw new Error('No URL found in instruction');

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  console.log(`Navigated to ${url}`);
};

const extractUrl = (text) => {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
};

module.exports = performNavigate;
