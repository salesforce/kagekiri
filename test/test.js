/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { querySelectorAll, querySelector } from '../src/index.js'
import * as assert from 'assert'
import simpleLight1 from './fixtures/simple1/light.html'
import simpleShadow1 from './fixtures/simple1/shadow.html'
import deepLight1 from './fixtures/deep1/light.html'
import deepShadow1 from './fixtures/deep1/shadow.html'
import attributeLight1 from './fixtures/attribute1/light.html'
import attributeShadow1 from './fixtures/attribute1/shadow.html'
import attributeLight2 from './fixtures/attribute2/light.html'
import attributeShadow2 from './fixtures/attribute2/shadow.html'
import siblingLight1 from './fixtures/sibling1/light.html'
import siblingShadow1 from './fixtures/sibling1/shadow.html'
import idLight1 from './fixtures/id1/light.html'
import idShadow1 from './fixtures/id1/shadow.html'
import orderingLight1 from './fixtures/ordering1/light.html'
import orderingShadow1 from './fixtures/ordering1/shadow.html'
import slotsLight1 from './fixtures/slots1/light.html'
import slotsShadow1 from './fixtures/slots1/shadow.html'
import slotsLight2 from './fixtures/slots2/light.html'
import slotsShadow2 from './fixtures/slots2/shadow.html'
import slotsLight3 from './fixtures/slots3/light.html'
import slotsShadow3 from './fixtures/slots3/shadow.html'
import duplicateSlotsLight1 from './fixtures/duplicateSlots1/light.html'
import duplicateSlotsShadow1 from './fixtures/duplicateSlots1/shadow.html'
import nestedSlotsLight1 from './fixtures/nestedSlots1/light.html'
import nestedSlotsShadow1 from './fixtures/nestedSlots1/shadow.html'
import ofTypeLight1 from './fixtures/ofType1/light.html'
import ofTypeShadow1 from './fixtures/ofType1/shadow.html'
import nestedSlotsLight2 from './fixtures/nestedSlots2/light.html'
import nestedSlotsShadow2 from './fixtures/nestedSlots2/shadow.html'
import nestedSlotsLight3 from './fixtures/nestedSlots3/light.html'
import nestedSlotsShadow3 from './fixtures/nestedSlots3/shadow.html'
import nestedSlotsLight4 from './fixtures/nestedSlots4/light.html'
import nestedSlotsShadow4 from './fixtures/nestedSlots4/shadow.html'
import nestedSlotsLight5 from './fixtures/nestedSlots5/light.html'
import nestedSlotsShadow5 from './fixtures/nestedSlots5/shadow.html'
import nestedSlotsLight6 from './fixtures/nestedSlots6/light.html'
import nestedSlotsShadow6 from './fixtures/nestedSlots6/shadow.html'
import nestedSlotsLight7 from './fixtures/nestedSlots7/light.html'
import nestedSlotsShadow7 from './fixtures/nestedSlots7/shadow.html'

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

  describe('attribute selectors like *= and ^=', () => {
    const expected = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(attributeLight2, attributeShadow2, [
      {
        selector: '[data-foo^="Hello"]',
        expected
      },
      {
        selector: '[data-foo*="world"]',
        expected
      },
      {
        selector: '[data-foo$="world"]',
        expected
      },
      {
        selector: '[data-foo~="world"]',
        expected
      },
      {
        selector: '[data-foo|="Hello world"]',
        expected
      },
      {
        selector: '[data-foo*="HeLLo WoRLd" i]',
        expected
      },
      {
        selector: '[data-foo*="wrrrrld"]',
        expected: []
      },
      {
        selector: '[data-foo$="Hello"]',
        expected: []
      },
      {
        selector: '[data-foo^="world"]',
        expected: []
      },
      {
        selector: '[data-foo*="HeLLo WoRLd"]',
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
      },
      {
        selector: 'span.far-right:not(\n.red-herring\n)\n,\nspan:nth-child(\n3\n)\n,span:nth-child(4)',
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

  describe('slots 1', () => {
    const text = [
      {
        tagName: 'SPAN',
        classList: ['text']
      }
    ]
    testSelectors(slotsLight1, slotsShadow1, [
      {
        selector: '.component .inside-component .text',
        expected: text
      },
      {
        selector: '.component > .text',
        expected: []
      },
      {
        selector: '.container .inside-component .text',
        expected: text
      },
      {
        selector: '.text',
        expected: text
      },
      {
        selector: '.inside-component > .text-wrapper > .text',
        expected: text
      }
    ])
  })

  describe('slots 2', () => {
    const text = [
      {
        tagName: 'SPAN',
        classList: ['text', 'hello']
      },
      {
        tagName: 'SPAN',
        classList: ['text', 'world']
      }
    ]
    testSelectors(slotsLight2, slotsShadow2, [
      {
        selector: '.component .inside-component .text',
        expected: text
      },
      {
        selector: '.component > .text',
        expected: []
      },
      {
        selector: '.container .inside-component .text',
        expected: text
      },
      {
        selector: '.text',
        expected: text
      },
      {
        selector: '.inside-component > .text-wrapper > .text',
        expected: text
      }
    ])
  })

  describe('slots with default content', () => {
    testSelectors(slotsLight3, slotsShadow3, [
      {
        selector: '.component .default-content',
        expected: [
          {
            tagName: 'DIV',
            classList: ['default-content']
          }
        ]
      },
      {
        selector: '.default-content',
        expected: [
          {
            tagName: 'DIV',
            classList: ['default-content']
          }
        ]
      }
    ])
  })

  describe('slots are not duplicated', () => {
    const buttons = [
      {
        tagName: 'BUTTON',
        classList: ['button1']
      },
      {
        tagName: 'BUTTON',
        classList: ['button2']
      },
      {
        tagName: 'BUTTON',
        classList: ['button3']
      }
    ]
    testSelectors(duplicateSlotsLight1, duplicateSlotsShadow1, [
      {
        selector: 'button',
        expected: buttons
      }
    ])
  })

  describe('slots are not duplicated 2', () => {
    const wrapper = [
      {
        tagName: 'DIV',
        classList: ['text-wrapper']
      }
    ]
    testSelectors(slotsLight1, slotsShadow1, [
      {
        selector: '.text-wrapper',
        expected: wrapper
      },
      {
        selector: '.inside-component .text-wrapper',
        expected: wrapper
      },
      {
        selector: '.container .text-wrapper',
        expected: wrapper
      },
      {
        selector: 'fancy-component > .text-wrapper',
        expected: []
      }
    ])
  })

  describe('nested slots work', () => {
    const target = [
      {
        tagName: 'DIV',
        classList: ['target']
      }
    ]

    testSelectors(nestedSlotsLight1, nestedSlotsShadow1, [
      {
        selector: '.target',
        expected: target
      },
      {
        selector: '.component .target',
        expected: target
      },
      {
        selector: '.other-component .target',
        expected: target
      },
      {
        selector: '.other-component .component .target',
        expected: target
      },
      {
        selector: '.container .other-component .component .target',
        expected: target
      }
    ])
  })

  describe('of-type', () => {
    testSelectors(ofTypeLight1, ofTypeShadow1, [
      {
        selector: 'p:last-of-type',
        expected: [{ tagName: 'P', classList: ['third'] }]
      },
      {
        selector: 'p:first-of-type',
        expected: [{ tagName: 'P', classList: ['first'] }]
      },
      {
        selector: 'p:only-of-type',
        expected: []
      },
      {
        selector: 'br:only-of-type',
        expected: [{ tagName: 'BR', classList: ['br'] }]
      },
      {
        selector: 'p:nth-of-type(2)',
        expected: [{ tagName: 'P', classList: ['second'] }]
      },
      {
        selector: 'p:nth-last-of-type(2)',
        expected: [{ tagName: 'P', classList: ['second'] }]
      }
    ])
  })

  describe('nested slots 2', () => {
    testSelectors(nestedSlotsLight2, nestedSlotsShadow2, [
      {
        selector: '.outer-component .inner-component .another-component .hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      }
    ])
  })

  describe('nested slots 3', () => {
    testSelectors(nestedSlotsLight3, nestedSlotsShadow3, [
      {
        selector: '.outer-component .inner-component .another-component .yet-another-component .hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      },
      {
        selector: '.hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      }
    ])
  })

  describe('nested slots 4', () => {
    testSelectors(nestedSlotsLight4, nestedSlotsShadow4, [
      {
        selector: '.hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      },
      {
        selector: '.alpha-component .beta-component .gamma-component .hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      }
    ])
  })

  describe('nested slots 5', () => {
    testSelectors(nestedSlotsLight5, nestedSlotsShadow5, [
      {
        selector: '.hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      },
      {
        selector: '.alpha-component .beta-component .gamma-component .hello',
        expected: [{ tagName: 'DIV', classList: ['hello'] }]
      },
      {
        selector: '.default-content',
        expected: []
      }
    ])
  })

  describe('nested slots 6', () => {
    testSelectors(nestedSlotsLight6, nestedSlotsShadow6, [
      {
        selector: '.shown',
        expected: [{ tagName: 'SPAN', classList: ['shown'] }]
      },
      {
        selector: '.alpha-component .beta-component .shown',
        expected: [{ tagName: 'SPAN', classList: ['shown'] }]
      },
      {
        selector: '.not-shown',
        expected: []
      }
    ])
  })

  describe('nested slots 7', () => {
    testSelectors(nestedSlotsLight7, nestedSlotsShadow7, [
      {
        selector: '.hello',
        expected: [{ tagName: 'SPAN', classList: ['hello'] }]
      },
      {
        selector: '.alpha-component .beta-component .gamma-component .hello',
        expected: [{ tagName: 'SPAN', classList: ['hello'] }]
      },
      {
        selector: '.not-shown',
        expected: []
      },
      {
        selector: '.also-not-shown',
        expected: []
      }
    ])
  })

  describe('document vs element context', () => {
    const test = lightDom => document => {
      const qs = lightDom
        ? (context, selector) => context.querySelector(selector)
        : (context, selector) => querySelector(selector, context)
      const qsa = lightDom
        ? (context, selector) => context.querySelectorAll(selector)
        : (context, selector) => querySelectorAll(selector, context)

      const assertElement = (actual, expected) => (
        assert.deepStrictEqual(simplifyElement(actual), expected)
      )
      const assertElements = (actual, expected) => (
        assert.deepStrictEqual(simplifyElements(actual), expected)
      )

      const text = { tagName: 'SPAN', classList: ['text'] }

      assert.deepStrictEqual(qs(document, '.non-existing-element'), null)
      assertElement(qs(document, '.text'), text)
      assertElement(qs(qs(document, '.component'), '.text'), text)
      assertElement(qs(qs(document, '.container'), '.text'), text)
      assertElement(qs(qs(qs(document, 'body'), '.component'), '.text'), text)
      assertElement(qs(qs(qs(document, 'body'), '.component'), '.fake'), undefined)

      assertElements(qsa(document, '.text'), [text])
      assertElements(qsa(qs(document, '.component'), '.text'), [text])
      assertElements(qsa(qs(document, '.container'), '.text'), [text])
      assertElements(qsa(qs(qs(document, 'body'), '.component'), '.text'), [text])
      assertElements(qsa(qs(qs(document, 'body'), '.component'), '.fake'), [])
    }

    withDom(simpleLight1, test(true))
    withDom(simpleShadow1, test(false))
  })
})
