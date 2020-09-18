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

export function assertResultEqual (selector, actual, expected, qsa) {
  if (qsa) {
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
