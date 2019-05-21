import postcssSelectorParser from 'postcss-selector-parser'

function getChildren (node) {
  if (node.shadowRoot) { // shadow host
    return node.shadowRoot.children
  } else if (typeof node.assignedElements === 'function') { // slot
    return node.assignedElements()
  } else if (node.documentElement) { // document
    return node.documentElement.children
  } else { // regular element
    return node.children
  }
}

class ElementIterator {
  constructor (context) {
    this._queue = [context]
    this.next() // disregard the root
  }

  next () {
    // create the results list in depth-first order
    const node = this._queue.pop()
    if (node) {
      const children = getChildren(node)
      if (children) {
        for (let i = children.length - 1; i >= 0; i--) {
          this._queue.push(children[i])
        }
      }
    }
    return node
  }
}

// given a list of ast nodes, find the final list and stop when hitting
// a combinator. for instance "div span > button span strong.foo" should return "strong.foo"
function getLastNonCombinatorNodes (nodes) {
  const results = []
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.type === 'combinator') {
      break
    }
    results.push(node)
  }
  return results.reverse()
}

function getParentIgnoringShadow (element) {
  // if an element is slotted, ignore the "real" parent and use the shadow DOM parent
  if (element.assignedSlot) {
    return element.assignedSlot.parentElement
  }
  if (element.parentElement) {
    return element.parentElement
  }
  // if an element is inside the shadow DOM, break outside of it
  const rootNode = element.getRootNode()
  if (rootNode !== document) {
    return rootNode.host
  }
}

function getFirstMatchingAncestor (element, nodes) {
  let ancestor = getParentIgnoringShadow(element)
  while (ancestor) {
    if (matches(ancestor, { nodes })) {
      return ancestor
    }

    ancestor = getParentIgnoringShadow(ancestor)
  }
}

function getFirstMatchingPreviousSibling (element, nodes) {
  let sibling = element.previousElementSibling
  while (sibling) {
    if (matches(sibling, { nodes })) {
      return sibling
    }
    sibling = sibling.previousElementSibling
  }
}

function matches (element, ast) {
  const { nodes } = ast
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.type === 'id') {
      if (element.id !== node.value) {
        return false
      }
    } else if (node.type === 'class') {
      if (!element.classList.contains(node.value)) {
        return false
      }
    } else if (node.type === 'tag') {
      if (element.tagName.toLowerCase() !== node.value.toLowerCase()) {
        return false
      }
    } else if (node.type === 'attribute') {
      if (node.value) { // e.g. [data-foo="bar"]
        if (element.getAttribute(node.attribute) !== node.value) {
          return false
        }
      } else { // e.g. [data-foo]
        if (!element.hasAttribute(node.attribute)) {
          return false
        }
      }
    } else if (node.type === 'pseudo') {
      // For pseudos, just use the native element matcher.
      // `sourceCode` comes from `attachSourceToPseudos()`
      if (!element.matches(node.sourceCode)) {
        return false
      }
    } else if (node.type === 'combinator') {
      if (node.value === ' ') {
        // walk all ancestors
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const ancestor = getFirstMatchingAncestor(element, precedingNodes)
        if (!ancestor) {
          return false
        } else {
          element = ancestor
          i -= precedingNodes.length
        }
      } else if (node.value === '>') {
        // walk immediate parent only
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const ancestor = getParentIgnoringShadow(element)
        if (!ancestor || !matches(ancestor, { nodes: precedingNodes })) {
          return false
        } else {
          element = ancestor
          i -= 1
        }
      } else if (node.value === '+') {
        // walk immediate sibling only
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const sibling = element.previousElementSibling
        if (!sibling || !matches(sibling, { nodes: precedingNodes })) {
          return false
        } else {
          i -= precedingNodes.length
        }
      } else if (node.value === '~') {
        // walk all previous siblings
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const sibling = getFirstMatchingPreviousSibling(element, precedingNodes)
        if (!sibling) {
          return false
        } else {
          i -= precedingNodes.length
        }
      }
    }
  }
  return true
}

function getMatchingElements (elementIterator, ast, multiple) {
  const results = multiple && []
  let element
  while ((element = elementIterator.next())) {
    for (const node of ast.nodes) { // multiple nodes here are comma-separated
      if (matches(element, node)) {
        if (multiple) {
          results.push(element)
        } else {
          return element
        }
      }
    }
  }
  return results
}

// For convenience, attach the source to all pseudo selectors.
// We need this later, and it's easier than passing the selector into every function.
function attachSourceToPseudos ({ nodes }, selector) {
  const splitSelector = selector.split('\n')
  for (const node of nodes) {
    if (node.type === 'pseudo') {
      let sourceCode
      const { start, end } = node.source
      if (start.line === end.line) {
        const line = splitSelector[start.line - 1]
        sourceCode = line.substring(start.column, end.column)
      } else {
        const startLine = splitSelector[start.line - 1]
        const endLine = splitSelector[end.line - 1]
        sourceCode = startLine.substring(start.column) + endLine.substring(0, end.column)
      }
      node.sourceCode = ':' + sourceCode
    }
    if (node.nodes) {
      attachSourceToPseudos(node, selector)
    }
  }
}

function query (selector, context, multiple) {
  const ast = postcssSelectorParser().astSync(selector)
  attachSourceToPseudos(ast, selector)

  const elementIterator = new ElementIterator(context)
  return getMatchingElements(elementIterator, ast, multiple)
}

function querySelector (selector, context = document) {
  return query(selector, context, false)
}

function querySelectorAll (selector, context = document) {
  return query(selector, context, true)
}

export {
  querySelectorAll,
  querySelector
}
