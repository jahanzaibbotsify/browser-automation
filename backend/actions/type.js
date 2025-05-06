const performType = async (page, selector, text) => {
  try {
    if (!selector || !text) {
      throw new Error("Missing selector or text for typing.");
    }

    await page.waitForSelector(selector, { timeout: 5000 });
    await page.type(selector, text, { delay: 100 });

    return { success: true, action: "type", selector, text };
  } catch (error) {
    console.error("Error in performType:", error.message);
    return { success: false, action: "type", error: error.message };
  }
};

module.exports = performType;
