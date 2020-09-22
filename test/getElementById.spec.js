/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { getElementById } from '../src/index.js'
import { assertResultEqual, withDom } from './utils.js'
import assert from 'assert'
import idLight1 from './fixtures/id1/light.html'
import idShadow1 from './fixtures/id1/shadow.html'

describe('getElementById', () => {
  const expected = [
    {
      tagName: 'SPAN',
      classList: ['text']
    }
  ]
  const existingId = 'myId'
  const nonExistingId = 'none'

  it('light DOM - getElementById should return match', () => {
    withDom(idLight1, context => {
      assertResultEqual(existingId, context.getElementById(existingId), expected, false)
    })
  })

  it('shadow DOM - getElementById should return match', () => {
    withDom(idShadow1, context => {
      assertResultEqual(existingId, getElementById(existingId, context), expected, false)
    })
  })

  it('light DOM - getElementById should return null', () => {
    withDom(idLight1, context => {
      assert.strictEqual(context.getElementById(nonExistingId), null, `Expected document.getElementById(${nonExistingId}) to be null`)
    })
  })

  it('shadow DOM - getElementById should return null', () => {
    withDom(idShadow1, context => {
      assert.strictEqual(getElementById(nonExistingId, context), null, `Expected document.getElementById(${nonExistingId}) to be null`)
    })
  })

  it('getElementById with a shadow root object', () => {
    withDom(idShadow1, document => {
      const customElement = document.querySelector('fancy-component')
      const shadow = customElement.shadowRoot
      assertResultEqual(existingId, getElementById(existingId, shadow), expected, false)
    })
  })

  it('getElementById with the global document', () => {
    withDom(idShadow1, () => {
      assert.strictEqual(getElementById(nonExistingId), null, `Expected document.getElementById(${nonExistingId}) to be null`)
    })
  })
})

describe('getElementById throws Error', () => {
  const id = 'myId'

  it('getElementById with a window object', () => {
    withDom(idLight1, document => {
      assert.throws(() => {
        getElementById(id, document.defaultView)
      },
      {
        name: 'TypeError',
        message: 'Provided context must be of type Document or ShadowRoot'
      })
    })
  })
})
