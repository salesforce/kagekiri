/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global DOMParser */

import assert from 'assert'

export function withDom (html, cb) {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  const iframeDocument = iframe.contentWindow.document
  iframeDocument.open('text/html', 'replace')
  iframeDocument.write(html)
  iframeDocument.close()
  try {
    cb(iframeDocument)
  } finally {
    document.body.removeChild(iframe)
  }
}

export function withDocument (html, cb) {
  const parser = new DOMParser()
  const dom = parser.parseFromString(html, 'text/html')
  const scriptTag = dom.querySelector('script')

  const container = document.createElement('div')
  container.classList.add('container')
  document.body.appendChild(container)

  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.innerHTML = scriptTag.innerHTML
  document.body.appendChild(script)

  try {
    cb()
  } finally {
    // clean up
    document.body.removeChild(script)
    document.body.removeChild(container)
  }
}

export function assertResultEqual (selector, actual, expected, isCollection) {
  if (isCollection) {
    actual = simplifyElements(actual)
  } else {
    actual = simplifyElement(actual)
    expected = expected[0]
  }
  assert.deepStrictEqual(actual, expected,
      `Selector failed: ${stringify(selector)}, ${stringify(actual)} !== ${stringify(expected)}`)
}

export function simplifyElement (element) {
  if (!element) {
    return undefined
  }
  return {
    tagName: element.tagName,
    classList: [...element.classList]
  }
}

export function simplifyElements (elements) {
  return [...elements].map(simplifyElement)
}

function stringify (obj) {
  if (typeof obj === 'undefined') {
    return obj
  }
  return JSON.stringify(obj)
}
