const extractHybridActionableElements = async (page, limit = 40) => {
  return await page.evaluate((limit) => {
    function generateSelector(el) {
      if (el.id) return `#${el.id}`;
      if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name}"]`;
      if (el.className)
        return `${el.tagName.toLowerCase()}.${el.className
          .trim()
          .split(" ")
          .join(".")}`;
      return el.tagName.toLowerCase();
    }

    const allElements = Array.from(document.querySelectorAll("*"));
    const actionable = [];

    for (let el of allElements) {
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute("role");
      const onclick = el.getAttribute("onclick");
      const tabindex = el.getAttribute("tabindex");
      const isVisible = !!(
        el.offsetWidth ||
        el.offsetHeight ||
        el.getClientRects().length
      );
      if (!isVisible) continue;

      const text = (el.innerText || el.value || "").trim();
      const hasInteractivity =
        ["input", "button", "textarea", "select"].includes(tag) ||
        role === "button" ||
        role === "link" ||
        tabindex === "0" ||
        onclick !== null ||
        (["div", "span", "a"].includes(tag) && text.length > 0);

      if (!hasInteractivity) continue;

      actionable.push({
        tag,
        id: el.id || null,
        name: el.getAttribute("name") || null,
        class: el.className || null,
        type: el.getAttribute("type") || null,
        role,
        tabindex,
        onclick: !!onclick,
        text,
        outerHTML: el.outerHTML.slice(0, 500),
        selector: generateSelector(el),
      });

      if (actionable.length >= limit) break;
    }

    return actionable;
  }, limit);
};

module.exports = extractHybridActionableElements;
