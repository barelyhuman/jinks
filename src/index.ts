export type LinkMatch = {
  isLink: boolean
  value: string
}

/**
 * @description tests the given text with a grouping regex for links
 */
export const matcher = (text: string): IterableIterator<RegExpMatchArray> => {
  const linkRegex =
    /(https?:\/\/)?(www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b([-\w()@:%+.~#?&/=]*)/g
  return String(text).matchAll(linkRegex)
}

/**
 * @description handler that returns formatted values with each link as it's own item in the array.
 * which can then be used to handle dynamic scenarios
 */
export const jinks = (textToParse: string): LinkMatch[] => {
  const linksIterator = matcher(textToParse)
  const classifiedMatches: LinkMatch[] = []

  let slicedTillIndex = 0

  for (const linkItem of linksIterator) {
    if (linkItem.length === 0) {
      continue
    }

    if (!linkItem[0]) {
      continue
    }

    let endIndex
    if (typeof linkItem.index !== 'undefined') {
      endIndex = linkItem.index + linkItem[0].length
    }

    const currentSlice = {
      link: linkItem[0],
      index: linkItem.index,
      endIndex,
    }

    const prefix = textToParse.slice(slicedTillIndex, currentSlice.index)
    let linkText

    textToParse.slice(slicedTillIndex, currentSlice.index)

    if (currentSlice.endIndex) {
      linkText = textToParse.slice(currentSlice.index, currentSlice.endIndex)
    }

    if (prefix) {
      classifiedMatches.push({
        value: prefix,
        isLink: false,
      })
    }

    if (linkText) {
      classifiedMatches.push({
        value: linkText,
        isLink: true,
      })
    }

    slicedTillIndex = currentSlice.endIndex ?? slicedTillIndex
  }

  const remainingText = textToParse.slice(slicedTillIndex)

  if (remainingText) {
    classifiedMatches.push({
      value: remainingText,
      isLink: false,
    })
  }

  return classifiedMatches
}
