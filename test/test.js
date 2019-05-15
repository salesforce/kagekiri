/* global it describe */

import { querySelectorAll, querySelector } from '../src/index.js'
import * as assert from 'assert'
import simpleLight1 from './fixtures/simple1/light.html'
import simpleShadow1 from './fixtures/simple1/shadow.html'
import deepLight1 from './fixtures/deep1/light.html'
import deepShadow1 from './fixtures/deep1/shadow.html'
import attributeLight1 from './fixtures/attribute1/light.html'
import attributeShadow1 from './fixtures/attribute1/shadow.html'
import siblingLight1 from './fixtures/sibling1/light.html'
import siblingShadow1 from './fixtures/sibling1/shadow.html'
import idLight1 from './fixtures/id1/light.html'
import idShadow1 from './fixtures/id1/shadow.html'
import orderingLight1 from './fixtures/ordering1/light.html'
import orderingShadow1 from './fixtures/ordering1/shadow.html'

function withDom (html, cb) {
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

function simplifyElement (element) {
  if (!element) {
    return undefined
  }
  return {
    tagName: element.tagName,
    classList: [...element.classList]
  }
}

function simplifyElements (elements) {
  return [...elements].map(simplifyElement)
}

function stringify (obj) {
  if (typeof obj === 'undefined') {
    return obj
  }
  return JSON.stringify(obj)
}

function assertSelectorEqual (selector, actual, expected, qsa) {
  if (qsa) {
    actual = simplifyElements(actual)
  } else {
    actual = simplifyElement(actual)
    expected = expected[0]
  }
  assert.deepStrictEqual(actual, expected,
    `Selector failed: ${stringify(selector)}, ${stringify(actual)} !== ${stringify(expected)}`)
}

function testSelectors (lightDom, shadowDom, tests) {
  tests.forEach(({ selector, expected }) => {
    it('light DOM - qSA', () => {
      withDom(lightDom, context => {
        assertSelectorEqual(selector, context.querySelectorAll(selector), expected, true)
      })
    })
    it('shadow DOM - qSA', () => {
      withDom(shadowDom, context => {
        assertSelectorEqual(selector, querySelectorAll(selector, context), expected, true)
      })
    })
    it('light DOM - qS', () => {
      withDom(lightDom, context => {
        assertSelectorEqual(selector, context.querySelector(selector), expected, false)
      })
    })
    it('shadow DOM - qSA', () => {
      withDom(shadowDom, context => {
        assertSelectorEqual(selector, querySelector(selector, context), expected, false)
      })
    })
  })
}

describe('basic test suite', function () {
  this.timeout(120000) // useful for debugging

  describe('simple1', () => {
    const expected = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(simpleLight1, simpleShadow1, [
      {
        selector: '.container .component span',
        expected
      },
      {
        selector: '.container .component .text',
        expected
      },
      {
        selector: '.container .component span.text',
        expected
      },
      {
        selector: '.fake, .container .component span.text',
        expected
      },
      {
        selector: '.text',
        expected
      },
      {
        selector: '.component .text',
        expected
      },
      {
        selector: '.container .text',
        expected
      },
      {
        selector: '.container span',
        expected
      },
      {
        selector: '.fake span.text',
        expected: []
      },
      {
        selector: '.component > .text',
        expected
      },
      {
        selector: '.container .component > .text',
        expected
      },
      {
        selector: '.container > .component > .text',
        expected
      },
      {
        selector: 'body .container > .component > .text',
        expected
      }
    ])
  })

  describe('deepShadow1', () => {
    const expected = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(deepLight1, deepShadow1, [
      {
        selector: '.container .component .other-component span',
        expected
      },
      {
        selector: '.other-component span',
        expected
      },
      {
        selector: 'span.text',
        expected
      },
      {
        selector: '.fake span.text',
        expected: []
      }
    ])
  })

  describe('attribute selectors', () => {
    const expected = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(attributeLight1, attributeShadow1, [
      {
        selector: '[data-foo]',
        expected
      },
      {
        selector: '[data-foo="bar"]',
        expected
      },
      {
        selector: '[data-fake]',
        expected: []
      },
      {
        selector: '[data-foo="fake"]',
        expected: []
      }
    ])
  })

  describe('sibling selectors', () => {
    const center = [
      {
        tagName: 'SPAN',
        classList: ['center']
      }
    ]
    const left = [
      {
        tagName: 'SPAN',
        classList: ['left']
      }
    ]
    const farRight = [
      {
        tagName: 'SPAN',
        classList: ['far-right']
      }
    ]
    testSelectors(siblingLight1, siblingShadow1, [
      {
        selector: '.left + .center',
        expected: center
      },
      {
        selector: '.far-left + .left',
        expected: left
      },
      {
        selector: '.center + .left',
        expected: []
      },
      {
        selector: '.far-left + .center',
        expected: []
      },
      {
        selector: '.far-left ~ .center',
        expected: center
      },
      {
        selector: '.far-right ~ .center',
        expected: []
      },
      {
        selector: '.far-right + .center',
        expected: []
      },
      {
        selector: '.right ~ .center',
        expected: []
      },
      {
        selector: '.right + .center',
        expected: []
      },
      {
        selector: '.far-left + .far-right',
        expected: []
      },
      {
        selector: '.far-left ~ .far-right',
        expected: farRight
      },
      {
        selector: '.fake + .far-left',
        expected: []
      },
      {
        selector: '.fake ~ .far-left',
        expected: []
      },
      {
        selector: '.component > .left + .center',
        expected: center
      },
      {
        selector: '.component > .left ~ .center',
        expected: center
      },
      {
        selector: '.component .left + .center',
        expected: center
      },
      {
        selector: '.component .left ~ .center',
        expected: center
      },
      {
        selector: '.fake .left + .center',
        expected: []
      },
      {
        selector: '.fake .left ~ .center',
        expected: []
      },
      {
        selector: '.fake > .left + .center',
        expected: []
      },
      {
        selector: '.fake > .left ~ .center',
        expected: []
      },
      {
        selector: '.fake > span.left + .center',
        expected: []
      },
      {
        selector: '.fake > span.left ~ .center',
        expected: []
      },
      {
        selector: '.component > span.left + .center',
        expected: center
      },
      {
        selector: '.component > span.left ~ .center',
        expected: center
      },
      {
        selector: '.component > fake.left + .center',
        expected: []
      },
      {
        selector: '.component > fake.left ~ .center',
        expected: []
      }
    ])
  })

  describe(':not() selectors', () => {
    const text = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(simpleLight1, simpleShadow1, [
      {
        selector: 'span:not(.red-herring)',
        expected: text
      },
      {
        selector: 'span:not(.red-herring):not(.fake)',
        expected: text
      },
      {
        selector: 'span:not(.red-herring):not(.red-herring)',
        expected: text
      },
      {
        selector: '.text:not(.red-herring)',
        expected: text
      },
      {
        selector: '.text:not(.red-herring):not(.red-herring)',
        expected: text
      },
      {
        selector: 'span:not(.red-herring):not(.text)',
        expected: []
      }
    ])
  })

  describe('pseudo selectors', () => {
    const center = [
      {
        tagName: 'SPAN',
        classList: ['center']
      }
    ]
    const right = [
      {
        tagName: 'SPAN',
        classList: ['right']
      }
    ]
    const farRight = [
      {
        tagName: 'SPAN',
        classList: ['far-right']
      }
    ]
    testSelectors(siblingLight1, siblingShadow1, [
      {
        selector: 'span:nth-child(3)',
        expected: center
      },
      {
        selector: 'span.far-right,\nspan:nth-child(3)',
        expected: [...center, ...farRight]
      },
      {
        selector: 'span.far-right:not(.red-herring),\nspan:nth-child(3)',
        expected: [...center, ...farRight]
      },
      {
        selector: 'span.far-right:not(.red-herring),\nspan:nth-child(3)\n,span:nth-child(4)',
        expected: [...center, ...right, ...farRight]
      }
    ])
  })

  describe('id selector', () => {
    const text = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(idLight1, idShadow1, [
      {
        selector: '#myId',
        expected: text
      },
      {
        selector: '#fake',
        expected: []
      },
      {
        selector: '.component #myId',
        expected: text
      },
      {
        selector: '.fake #myId',
        expected: []
      }
    ])
  })

  describe('ordering', () => {
    const letterToElement = _ => ({ tagName: 'DIV', classList: ['target', _] })
    const allInOrder = 'abcdefghijk'.split('').map(letterToElement)
    const evens = 'd'.split('').map(letterToElement)
    const odds = 'abcefghijk'.split('').map(letterToElement)
    const firstChildren = 'abcfij'.split('').map(letterToElement)
    const secondChildren = 'd'.split('').map(letterToElement)
    const thirdChildren = 'eh'.split('').map(letterToElement)
    const lastChildren = 'dfgijk'.split('').map(letterToElement)

    testSelectors(orderingLight1, orderingShadow1, [
      {
        selector: '.target',
        expected: allInOrder
      },
      {
        selector: '.target:nth-child(even)',
        expected: evens
      },
      {
        selector: '.target:nth-child(odd)',
        expected: odds
      },
      {
        selector: '.target:nth-child(1)',
        expected: firstChildren
      },
      {
        selector: '.target:nth-child(2)',
        expected: secondChildren
      },
      {
        selector: '.target:nth-child(3)',
        expected: thirdChildren
      },
      {
        selector: '.target:last-child',
        expected: lastChildren
      }
    ])
  })
})
