export type LinkMatch = {
  isLink: boolean;
  value: string;
};

/**
 * @name matcher
 * @description tests the given text with a grouping regex for links
 * @param {String} text
 */
export const matcher = (text: string): IterableIterator<RegExpMatchArray> => {
  const linkRegex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  return String(text).matchAll(linkRegex);
};

/**
 * @name jinks
 * @description handler that returns formatted values with each link as it's own item in the array.
 * which can then be used to handle dynamic scenarios
 * @param {String} textToParse
 * @returns @type {Array<LinkMatch>}
 */
export const jinks = (textToParse: string): LinkMatch[] => {
  const linksIterator = matcher(textToParse);
  const classifiedMatches: LinkMatch[] = [];

  // TODO: remove the additional loop , can be combined with the `forEach` on the bottom
  const linkMatchesAsArray = [...linksIterator].map((iter) => ({
    link: iter[0],
    index: iter.index,
    endIndex:
      typeof iter.index != "undefined" ? iter.index + iter[0].length : null,
  }));

  let slicedTillIndex = 0;

  linkMatchesAsArray.forEach((item) => {
    const prefix = textToParse.slice(slicedTillIndex, item.index);
    let linkText;

    if (item.endIndex) {
      linkText = textToParse.slice(item.index, item.endIndex);
    }

    if (prefix) {
      classifiedMatches.push({
        value: prefix,
        isLink: false,
      });
    }
    if (linkText) {
      classifiedMatches.push({
        value: linkText,
        isLink: true,
      });
    }

    slicedTillIndex = item.endIndex || slicedTillIndex;
  });

  const remainingText = textToParse.slice(slicedTillIndex);

  if (remainingText) {
    classifiedMatches.push({
      value: remainingText,
      isLink: false,
    });
  }

  return classifiedMatches as LinkMatch[];
};
