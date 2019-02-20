import {CssSelector} from "@angular/compiler";

/** Creates a `CssSelector` given a tag name and a map of attributes. */
export function createCssSelector(tag: string, attributes: {[name: string]: string}): CssSelector {
  const cssSelector = new CssSelector();

  cssSelector.setElement(tag);

  Object.getOwnPropertyNames(attributes).forEach((name) => {
    const value = attributes[name];

    cssSelector.addAttribute(name, value);
    if (name.toLowerCase() === 'class') {
      const classes = value.trim().split(/\s+/);
      classes.forEach(className => cssSelector.addClassName(className));
    }
  });

  return cssSelector;
}
