/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { closest, querySelector } from '../src/index.js'
import { withDom, assertResultEqual } from './utils'
import lightSimple1 from './fixtures/simple1/light.html'
import shadowSimple1 from './fixtures/simple1/shadow.html'

describe('closest matching', () => {
  const expected = [{
    tagName: 'DIV',
    classList: ['container']
  }]
  const selector = '.container'

  it('light DOM - finds closest ancestor', () => {
    withDom(lightSimple1, context => {
      const element = context.querySelector('.text')
      assertResultEqual(selector, element.closest(selector), expected, false)
    })
  })

  it('shadow DOM - finds closest ancestor', () => {
    withDom(shadowSimple1, context => {
      const element = querySelector('.text', context)
      assertResultEqual(selector, closest(selector, element), expected, false)
    })
  })
})

describe(('closest not matching'), () => {
  const selector = '.something'

  it('light DOM - does not find closest ancestor', () => {
    withDom(lightSimple1, context => {
      const element = context.querySelector('.text')
      assertResultEqual(selector, element.closest(selector), [], false)
    })
  })

  it('shadow DOM - does not find closest ancestor', () => {
    withDom(shadowSimple1, context => {
      const element = querySelector('.text', context)
      assertResultEqual(selector, closest(selector, element), [], false)
    })
  })
})

describe(('closest is own element'), () => {
  const expected = [{
    tagName: 'SPAN',
    classList: ['text']
  }]
  const selector = '.text'

  it('light DOM - does not find closest ancestor', () => {
    withDom(lightSimple1, context => {
      const element = context.querySelector(selector)
      assertResultEqual(selector, element.closest(selector), expected, false)
    })
  })

  it('shadow DOM - does not find closest ancestor', () => {
    withDom(shadowSimple1, context => {
      const element = querySelector(selector, context)
      assertResultEqual(selector, closest(selector, element), expected, false)
    })
  })
})
