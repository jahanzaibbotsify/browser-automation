const performExtractDOM = async (page, selector) => {
  if (!selector) {
    throw new Error("No selector found for extraction");
  }

  // Wait for and extract text content
  await page.waitForSelector(selector, { timeout: 50000 });
  const text = await page.$eval(selector, (el) => el.textContent.trim());

  console.log(`📤 Extracted content: ${text}`);
  return text;
};
module.exports = performExtractDOM;
