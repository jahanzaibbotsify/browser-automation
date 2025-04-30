const getCleanedDOM = async (page) => {
  return await page.evaluate(() => {
    function getCleanDOM(node) {
      if (
        [
          "SCRIPT",
          "STYLE",
          "NOSCRIPT",
          "IFRAME",
          "SVG",
          "IRON-ICONSET-SVG",
          "LINK",
        ].includes(node.tagName)
      ) {
        return null;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        return text ? text : null;
      }

      const obj = {
        tag: node.tagName,
        attrs: {},
        children: [],
      };

      for (let attr of node.attributes || []) {
        obj.attrs[attr.name] = attr.value;
      }

      for (let child of node.childNodes) {
        const cleaned = getCleanDOM(child);
        if (cleaned) obj.children.push(cleaned);
      }

      return obj.children.length || Object.keys(obj.attrs).length ? obj : null;
    }

    return getCleanDOM(document.body);
  });
};

module.exports = getCleanedDOM;
