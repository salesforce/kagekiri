import postcssSelectorParser from "postcss-selector-parser"
const parser = postcssSelectorParser()

function querySelector (selector, context = document) {
  return querySelectorAll(selector, context)[0]
}

function querySelectorAll(selector, context = document) {
  const ast = parser.astSync(selector)
}

export {
  querySelectorAll,
  querySelector
}
