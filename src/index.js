/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* global Element */

import 'string.prototype.startswith'
import 'string.prototype.endswith'
import postcssSelectorParser from 'postcss-selector-parser'

// IE11 does not have Element.prototype.matches, we can use msMatchesSelector.
// This is ignored for code coverage because we don't run code coverage in IE.
const nativeMatches = Element.prototype.matches || /* istanbul ignore next */ Element.prototype.msMatchesSelector

function getChildren (node) {
  if (node.documentElement) { // document, make sure <html> is the first "child"
    return [node.documentElement]
  } else if (node.shadowRoot) { // shadow host
    return node.shadowRoot.children
  } else if (typeof node.assignedElements === 'function') { // slot
    // If the slot has assigned slottable nodes (text or elements), then it is rendering
    // those instead of the default content. Otherwise, return the default content.
    // See: https://dom.spec.whatwg.org/#concept-slotable
    return node.assignedNodes().length ? node.assignedElements() : node.children
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
      // In IE, children may be undefined if the `node` is the document.
      // We don't run coverage tests for IE, so it's ignored.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Browser_compatibility
      /* istanbul ignore else */
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

function getParent (element) {
  // If an element is slotted, ignore the "real" parent and use the shadow DOM parent.
  // Unless the slot is also slotted; just return the parent element in this case.
  if (typeof element.assignedElements !== 'function' && element.assignedSlot && element.assignedSlot.parentElement) {
    return element.assignedSlot.parentElement
  }
  if (element.parentElement) {
    return element.parentElement
  }
  // if an element is inside the shadow DOM, break outside of it
  const rootNode = typeof element.getRootNode === 'function' ? element.getRootNode() : document
  /* istanbul ignore else */
  if (rootNode !== document) {
    return rootNode.host
  }
}

function getFirstMatchingAncestor (element, nodes) {
  let ancestor = getParent(element)
  while (ancestor) {
    if (matchesSelector(ancestor, { nodes })) {
      return ancestor
    }

    ancestor = getParent(ancestor)
  }
}

function getFirstMatchingPreviousSibling (element, nodes) {
  let sibling = element.previousElementSibling
  while (sibling) {
    if (matchesSelector(sibling, { nodes })) {
      return sibling
    }
    sibling = sibling.previousElementSibling
  }
}

function matchesSelector (element, ast) {
  const { nodes } = ast
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    /* istanbul ignore else */
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
    } else if (node.type === 'pseudo' || node.type === 'attribute') {
      // For pseudos and attributes, just use the native element matcher.
      // `sourceCode` comes from `attachSourceIfNecessary()`
      if (!nativeMatches.call(element, node.sourceCode)) {
        return false
      }
    } else if (node.type === 'combinator') {
      /* istanbul ignore else */
      if (node.value === ' ') {
        // walk all ancestors
        const lastNonCombinatorNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const nodesBeforeLastNonCombinatorNodes = nodes.slice(0, i - lastNonCombinatorNodes.length)
        return evaluateAncestorTree(element, lastNonCombinatorNodes, nodesBeforeLastNonCombinatorNodes)
      } else if (node.value === '>') {
        // walk immediate parent only
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const ancestor = getParent(element)
        if (!ancestor || !matchesSelector(ancestor, { nodes: precedingNodes })) {
          return false
        } else {
          element = ancestor
          i -= 1
        }
      } else if (node.value === '+') {
        // walk immediate sibling only
        const precedingNodes = getLastNonCombinatorNodes(nodes.slice(0, i))
        const sibling = element.previousElementSibling
        if (!sibling || !matchesSelector(sibling, { nodes: precedingNodes })) {
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

/**
 * Even though the first ancestor matches the selector, the ancestor should match all preceding nodes.
 * For example, consider a tree like `body > div > div > div > button`.
 * The selector `body > div button` should match the button, but it won't if we simply grab the first
 * div that is an ancestor of the button. Instead, we have to keep walking up the tree, trying all divs, until
 * we find one that matches the *previous selectors*, i.e. until we match the div that is the immediate
 * child of the body.
 * Note that this can get quite expensive, as it is an O(n^2) algorithm, but it is correct. Also, this algorithm
 * only needs to be implemented for the space (`' '`) combinator - the `'>'` combinator only needs to
 * look at the immediate parent, so it doesn't need to iterate through all possible matching ancestors.
*/
function evaluateAncestorTree (element, lastNonCombinatorNodes, nodesBeforeLastNonCombinatorNodes) {
  let ancestor = getFirstMatchingAncestor(element, lastNonCombinatorNodes)
  if (!ancestor) {
    return false
  }
  // Even though first ancestor matches the selector, ancestor should match all preceding nodes
  while (ancestor) {
    // If this ancestor is compatible with the preceding nodes, then it is a match
    // If not, walk up the ancestor tree until a match is found
    if (matchesSelector(ancestor, { nodes: nodesBeforeLastNonCombinatorNodes })) {
      return true
    }
    ancestor = getFirstMatchingAncestor(ancestor, lastNonCombinatorNodes)
  }
  // While loop has exhausted all the possible ancestors and not found a match
  return false
}

function getMatchingElements (elementIterator, ast, multiple) {
  const results = multiple ? [] : null
  let element
  while ((element = elementIterator.next())) {
    for (const node of ast.nodes) { // comma-separated selectors, e.g. .foo, .bar
      if (matchesSelector(element, node)) {
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

function getMatchingElementsByTagName (elementIterator, tagName) {
  const results = []
  let element
  const tagNameAsLowerCase = tagName.toLowerCase()
  while ((element = elementIterator.next())) {
    if (tagName === '*' || tagNameAsLowerCase === element.tagName.toLowerCase()) {
      results.push(element)
    }
  }
  return results
}

function getMatchingElementsByName (elementIterator, name) {
  const results = []
  let element
  while ((element = elementIterator.next())) {
    if (element.name === name) {
      results.push(element)
    }
  }
  return results
}

/**
 * https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 */
function getMatchingElementsByTagNameNS (elementIterator, namespaceURI, tagName) {
  const results = []
  // exit early if null, empty string or undefined is provided
  // these will not match the element namespace
  if (!namespaceURI) {
    return results
  }
  let element

  while ((element = elementIterator.next())) {
    // we'll do a case insensitive match to find out where the tag name is
    const outerHTMLAsUppercase = element.outerHTML.toUpperCase()
    // we are not not guaranteed to have an uppercase element.tagName, eg: svg elements
    const index = outerHTMLAsUppercase.indexOf(element.tagName.toUpperCase())
    // now we can get the original, non-uppercased tag name
    const originalTagName = element.outerHTML.substr(index, element.tagName.length)
    // tagName supports a wildcard parameter
    const tagMatches = tagName === originalTagName || tagName === '*'
    // namespace supports a wildcard parameter
    const namespaceMatches = element.namespaceURI === namespaceURI || namespaceURI === '*'
    if (tagMatches && namespaceMatches) {
      results.push(element)
    }
  }
  return results
}

function getMatchingElementsByClassName (elementIterator, classNames) {
  const results = []
  let element

  while ((element = elementIterator.next())) {
    const elementClassList = element.classList
    const contains = classNames.every(function (className) {
      return elementClassList.contains(className)
    })
    if (contains) {
      results.push(element)
    }
  }
  return results
}

function getMatchingElementById (elementIterator, id) {
  let element
  while ((element = elementIterator.next())) {
    if (element.id === id) {
      return element
    }
  }

  return null
}

// For convenience, attach the source to all pseudo selectors.
// We need this later, and it's easier than passing the selector into every function.
function attachSourceIfNecessary ({ nodes }, selector) {
  for (const node of nodes) {
    if (node.type === 'pseudo' || node.type === 'attribute') {
      const splitSelector = selector.split('\n')
      const { start, end } = node.source
      let sourceCode = ''
      for (let i = start.line - 1; i < end.line; i++) {
        const line = splitSelector[i]
        const stringStart = i === start.line - 1 ? start.column : 0
        const stringEnd = i === end.line - 1 ? end.column : line.length
        sourceCode += line.substring(stringStart, stringEnd)
      }
      node.sourceCode = (node.type === 'pseudo' ? ':' : '[') + sourceCode
    }
    if (node.nodes) {
      attachSourceIfNecessary(node, selector)
    }
  }
}

function assertIsDocumentOrShadowRoot (context) {
  if (context.nodeType !== 11 && context.nodeType !== 9) {
    throw new TypeError('Provided context must be of type Document or ShadowRoot')
  }
}

function assertIsElement (element) {
  if (!element || element.nodeType !== 1) {
    throw new TypeError('Provided context must be of type Element')
  }
}

function parse (selector) {
  const ast = postcssSelectorParser().astSync(selector)
  attachSourceIfNecessary(ast, selector)
  return ast
}

function query (selector, context, multiple) {
  const ast = parse(selector)
  const elementIterator = new ElementIterator(context)
  return getMatchingElements(elementIterator, ast, multiple)
}

function getElementsByTagName (tagName, context = document) {
  const elementIterator = new ElementIterator(context)
  return getMatchingElementsByTagName(elementIterator, tagName)
}

function getElementsByTagNameNS (namespaceURI, tagName, context = document) {
  const elementIterator = new ElementIterator(context)
  return getMatchingElementsByTagNameNS(elementIterator, namespaceURI, tagName)
}

function querySelector (selector, context = document) {
  return query(selector, context, false)
}

function querySelectorAll (selector, context = document) {
  return query(selector, context, true)
}

function getElementsByClassName (classNames, context = document) {
  const elementIterator = new ElementIterator(context)
  const classNamesSplit = classNames.trim().split(/\s+/)
  return getMatchingElementsByClassName(elementIterator, classNamesSplit, context)
}

function getElementById (id, context = document) {
  assertIsDocumentOrShadowRoot(context)
  const elementIterator = new ElementIterator(context)
  return getMatchingElementById(elementIterator, id)
}

function getElementsByName (name, context = document) {
  assertIsDocumentOrShadowRoot(context)
  const elementIterator = new ElementIterator(context)
  return getMatchingElementsByName(elementIterator, name)
}

function matches (selector, element) {
  assertIsElement(element)
  const ast = parse(selector)

  for (const node of ast.nodes) { // comma-separated selectors, e.g. .foo, .bar
    if (matchesSelector(element, node)) {
      return true
    }
  }
  return false
}

function closest (selector, element) {
  const ast = parse(selector)

  for (const node of ast.nodes) { // comma-separated selectors, e.g. .foo, .bar
    if (matchesSelector(element, node)) {
      return element
    }

    const matchingAncestor = getFirstMatchingAncestor(element, node.nodes)
    if (matchingAncestor) {
      return matchingAncestor
    }
  }
  return null
}

export {
  querySelectorAll,
  querySelector,
  getElementsByTagName,
  getElementsByTagNameNS,
  getElementsByClassName,
  getElementById,
  getElementsByName,
  matches,
  closest
}
