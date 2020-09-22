/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { getElementById } from '../src/index.js'
import { assertResultEqual, withDom, withDocument } from './utils.js'
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

  it('light DOM - getElementById', () => {
    withDom(idLight1, context => {
      assertResultEqual(existingId, context.getElementById(existingId), expected, false)
    })
  })

  it('light DOM - getElementById', () => {
    withDom(idLight1, context => {
      assert.strictEqual(context.getElementById(nonExistingId), null, `Expected document.getElementById(${nonExistingId}) to be null`)
    })
  })

  it('shadow DOM - getElementById', () => {
    withDocument(idShadow1, () => {
      assertResultEqual(existingId, getElementById(existingId), expected, false)
      assert.strictEqual(getElementById(nonExistingId), null, `Expected document.getElementById(${nonExistingId}) to be null`)
    })
  })
})
