const performSubmitForm = async (page, selector) => {
  try {
    if (!selector) {
      throw new Error("No selector found for submit form");
    }

    // Wait for and click the submit button to submit the form
    await page.waitForSelector(selector, { visible: true, timeout: 50000 });
    await page.click(selector);

    console.log(`✅ Submitted form using button: ${selector}`);
    return { success: true, message: `Form submitted using ${selector}` };
  } catch (error) {
    console.error("❌ Error submitting form:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = performSubmitForm;
