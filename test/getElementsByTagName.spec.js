/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { assertResultEqual, withDom } from './utils.js'
import { getElementsByTagName, getElementsByTagNameNS } from '../src/index.js'

import tagNameLight1 from './fixtures/tagName1/light.html'
import tagNameShadow1 from './fixtures/tagName1/shadow.html'

function testTagNames (scenario, tagNames, lightDom, shadowDom, expected, expectedShadow) {
  it(`light DOM - ${scenario}`, () => {
    withDom(lightDom, context => {
      assertResultEqual(tagNames, context.getElementsByTagName(tagNames), expected, true)
    })
  })

  it(`shadow DOM - ${scenario}`, () => {
    withDom(shadowDom, context => {
      if (expectedShadow) {
        expected = expectedShadow
      }
      assertResultEqual(tagNames, getElementsByTagName(tagNames, context), expected, true)
    })
  })
}

function testTagNamesNS (scenario, namespaceURI, tagNames, lightDom, shadowDom, expected, expectedShadow) {
  it(`light DOM - ${scenario}`, () => {
    withDom(lightDom, context => {
      assertResultEqual(tagNames, context.getElementsByTagNameNS(namespaceURI, tagNames), expected, true)
    })
  })

  it(`shadow DOM - ${scenario}`, () => {
    withDom(shadowDom, context => {
      if (expectedShadow) {
        expected = expectedShadow
      }
      assertResultEqual(tagNames, getElementsByTagNameNS(namespaceURI, tagNames, context), expected, true)
    })
  })
}

describe('getElementsByTagName', () => {
  const expectedSvg = [
    {
      tagName: 'svg',
      classList: []
    }
  ]

  testTagNames('handles tag names', 'svg', tagNameLight1, tagNameShadow1, expectedSvg)

  const expectedSpan = [
    {
      tagName: 'SPAN',
      classList: []
    }
  ]
  testTagNames('handles tag names', 'span', tagNameLight1, tagNameShadow1, expectedSpan)

  const expectedWildcard = [
    {
      tagName: 'HTML',
      classList: []
    },
    {
      tagName: 'HEAD',
      classList: []
    },
    {
      tagName: 'BODY',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['container']
    },
    {
      tagName: 'DIV',
      classList: ['outer-component']
    },
    {
      tagName: 'DIV',
      classList: ['wrapper']
    },
    {
      tagName: 'DIV',
      classList: ['inner-component']
    },
    {
      tagName: 'SPAN',
      classList: []
    },
    {
      tagName: 'svg',
      classList: []
    },
    {
      tagName: 'defs',
      classList: []
    },
    {
      tagName: 'linearGradient',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'circle',
      classList: []
    }
  ]

  const expectedWildcardShadow = [
    {
      tagName: 'HEAD',
      classList: []
    },
    {
      tagName: 'BODY',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['container']
    },
    {
      tagName: 'OUTER-COMPONENT',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['wrapper']
    },
    {
      tagName: 'INNER-COMPONENT',
      classList: []
    },
    {
      tagName: 'SPAN',
      classList: []
    },
    {
      tagName: 'svg',
      classList: []
    },
    {
      tagName: 'defs',
      classList: []
    },
    {
      tagName: 'linearGradient',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'circle',
      classList: []
    },
    {
      tagName: 'SCRIPT',
      classList: []
    }
  ]
  testTagNames('handles wildcard tag name', '*', tagNameLight1, tagNameShadow1, expectedWildcard, expectedWildcardShadow)

  const expectedCaseInsensitive = [
    {
      tagName: 'SPAN',
      classList: []
    }
  ]
  testTagNames('is case insensitive', 'SpAn', tagNameLight1, tagNameShadow1, expectedCaseInsensitive)
})

describe('getElementsByTagNameNS', () => {
  testTagNamesNS('returns empty with falsy ns', '', '*', tagNameLight1, tagNameShadow1, [])
  testTagNamesNS('returns empty with falsy ns', false, '*', tagNameLight1, tagNameShadow1, [])
  testTagNamesNS('returns empty with falsy ns', undefined, '*', tagNameLight1, tagNameShadow1, [])
  testTagNamesNS('returns empty with falsy ns', null, '*', tagNameLight1, tagNameShadow1, [])
  testTagNamesNS('returns empty with falsy ns', 0, '*', tagNameLight1, tagNameShadow1, [])

  testTagNamesNS('is case sensitive', '*', 'sPaN', tagNameLight1, tagNameShadow1, [])
  testTagNamesNS('is case sensitive', '*', 'SPAN', tagNameLight1, tagNameShadow1, [])
  const expectedCaseSensitive = [
    {
      tagName: 'SPAN',
      classList: []
    }
  ]
  testTagNamesNS('is case sensitive', '*', 'span', tagNameLight1, tagNameShadow1, expectedCaseSensitive)

  const expectedNSMatches = [
    {
      tagName: 'svg',
      classList: []
    },
    {
      tagName: 'defs',
      classList: []
    },
    {
      tagName: 'linearGradient',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'stop',
      classList: []
    },
    {
      tagName: 'circle',
      classList: []
    }
  ]
  testTagNamesNS('returns ns matches', 'http://www.w3.org/2000/svg', '*', tagNameLight1, tagNameShadow1, expectedNSMatches)

  const expectedSpan = [
    {
      tagName: 'SPAN',
      classList: []
    }
  ]
  testTagNamesNS('handles wildcard namespace', '*', 'span', tagNameLight1, tagNameShadow1, expectedSpan)

  const expectedWildcard = [
    {
      tagName: 'HTML',
      classList: []
    },
    {
      tagName: 'HEAD',
      classList: []
    },
    {
      tagName: 'BODY',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['container']
    },
    {
      tagName: 'DIV',
      classList: ['outer-component']
    },
    {
      tagName: 'DIV',
      classList: ['wrapper']
    },
    {
      tagName: 'DIV',
      classList: ['inner-component']
    },
    {
      tagName: 'SPAN',
      classList: []
    }
  ]

  const expectedWildcardShadow = [
    {
      tagName: 'HEAD',
      classList: []
    },
    {
      tagName: 'BODY',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['container']
    },
    {
      tagName: 'OUTER-COMPONENT',
      classList: []
    },
    {
      tagName: 'DIV',
      classList: ['wrapper']
    },
    {
      tagName: 'INNER-COMPONENT',
      classList: []
    },
    {
      tagName: 'SPAN',
      classList: []
    },
    {
      tagName: 'SCRIPT',
      classList: []
    }
  ]

  testTagNamesNS('handles wildcard tagName', 'http://www.w3.org/1999/xhtml', '*', tagNameLight1, tagNameShadow1, expectedWildcard, expectedWildcardShadow)
})
