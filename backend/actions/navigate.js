const performNavigate = async (page, url) => {
  if (!url) throw new Error("No URL found in instruction");

  await page.goto(url, { waitUntil: "domcontentloaded" });
  console.log(`Navigated to ${url}`);
};

module.exports = performNavigate;
