const puppeteer = require("puppeteer-extra");
const puppeteerStealth = require("puppeteer-extra-plugin-stealth");

puppeteer.use(puppeteerStealth());

const launchPuppeteer = async () => {
  return puppeteer.launch({
    headless: false, // Headful mode for visibility
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
};

module.exports = { launchPuppeteer };
