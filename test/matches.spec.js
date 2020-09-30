/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */
import { matches, querySelector } from '../src/index.js'
import { withDom } from './utils.js'
import simpleLight1 from './fixtures/simple1/light.html'
import simpleShadow1 from './fixtures/simple1/shadow.html'
import assert from 'assert'

describe(('element matches'), () => {
  const selector = '.container .component span'

  it('light DOM - matches', () => {
    withDom(simpleLight1, context => {
      const element = context.querySelector(selector)
      assert.strictEqual(element.matches(selector), true)
    })
  })

  it('shadow DOM - matches', () => {
    withDom(simpleShadow1, context => {
      const element = querySelector(selector, context)
      assert(typeof element !== 'undefined')
      assert.strictEqual(matches(selector, element), true)
    })
  })
})

describe('matches throws Error', () => {
  const selector = '.container'

  it('throws an error when passing in a document object', () => {
    withDom(simpleLight1, document => {
      assert.throws(() => {
        matches(selector, document)
      },
      {
        name: 'TypeError',
        message: 'Provided context must be of type Element'
      })
    })
  })

  it('throws an error when passing in a window object', () => {
    withDom(simpleLight1, document => {
      assert.throws(() => {
        matches(selector, document.defaultView)
      },
      {
        name: 'TypeError',
        message: 'Provided context must be of type Element'
      })
    })
  })
})
