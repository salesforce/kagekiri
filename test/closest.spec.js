/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import assert from 'assert'
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
  const expected = []
  const selector = '.something'

  it('light DOM - does not find closest ancestor', () => {
    withDom(lightSimple1, context => {
      const element = context.querySelector('.text')
      const actual = element.closest(selector)
      assertResultEqual(selector, actual, expected, false)
      assert.deepStrictEqual(actual, null, 'should be null, not undefined')
    })
  })

  it('shadow DOM - does not find closest ancestor', () => {
    withDom(shadowSimple1, context => {
      const element = querySelector('.text', context)
      const actual = closest(selector, element)
      assertResultEqual(selector, actual, expected, false)
      assert.deepStrictEqual(actual, null, 'should be null, not undefined')
    })
  })
})

describe(('closest is own element'), () => {
  const expected = [{
    tagName: 'SPAN',
    classList: ['text']
  }]
  const selector = '.text'

  it('light DOM - finds closest ancestor', () => {
    withDom(lightSimple1, context => {
      const element = context.querySelector(selector)
      assertResultEqual(selector, element.closest(selector), expected, false)
    })
  })

  it('shadow DOM - finds closest ancestor', () => {
    withDom(shadowSimple1, context => {
      const element = querySelector(selector, context)
      assertResultEqual(selector, closest(selector, element), expected, false)
    })
  })
})
