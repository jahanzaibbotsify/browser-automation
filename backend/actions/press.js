const performPress = async (page, selector, key) => {
  if (!selector) throw new Error("❌ No selector found for press action");
  if (!key) throw new Error("❌ No key specified for press action");

  // Focus and press the key
  await page.waitForSelector(selector, { visible: true, timeout: 50000 });
  await page.focus(selector);
  await page.keyboard.press(key);

  console.log(`🎯 Pressed "${key}" on element: ${selector}`);
};

module.exports = performPress;
