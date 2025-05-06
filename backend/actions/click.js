const performClick = async (page, selector) => {
  try {
    if (!selector) {
      throw new Error("Missing selector.");
    }

    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);

    return { success: true, action: "click", selector };
  } catch (error) {
    console.error("Error in performClick:", error.message);
    return { success: false, action: "click", error: error.message };
  }
};

module.exports = performClick;
