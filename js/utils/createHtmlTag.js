export default function createHtmlTag(type, attributes, html, ...children) {
  const element = document.createElement(type);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (html) {
    element.innerHTML = html;
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}
