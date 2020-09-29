/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { getElementsByName } from '../src/index.js'
import { assertResultEqual, withDom } from './utils.js'
import assert from 'assert'

import nameLight1 from './fixtures/name1/light.html'
import nameShadow1 from './fixtures/name1/shadow.html'

describe('getElementsByName', () => {
  it('light DOM - getElementsByName should return all matching elements', () => {
    withDom(nameLight1, context => {
      let name = 'contactForm'
      let expected = [
        {
          tagName: 'FORM',
          classList: []
        }
      ]
      assertResultEqual(name, context.getElementsByName(name), expected, true)

      name = 'firstname'
      expected = [
        {
          tagName: 'INPUT',
          classList: []
        }
      ]
      assertResultEqual(name, context.getElementsByName(name), expected, true)

      name = 'email'
      expected = [
        {
          tagName: 'INPUT',
          classList: []
        }
      ]
      assertResultEqual(name, context.getElementsByName(name), expected, true)

      name = 'test'
      expected = [
        {
          tagName: 'BUTTON',
          classList: []
        }
      ]
      assertResultEqual(name, context.getElementsByName(name), expected, true)
    })
  })

  it('shadow DOM - getElementsByName should return all matching elements', () => {
    withDom(nameShadow1, context => {
      let name = 'contactForm'
      let expected = [
        {
          tagName: 'FORM',
          classList: []
        }
      ]
      assertResultEqual(name, getElementsByName(name, context), expected, true)

      name = 'firstname'
      expected = [
        {
          tagName: 'INPUT',
          classList: []
        }
      ]
      assertResultEqual(name, getElementsByName(name, context), expected, true)

      name = 'email'
      expected = [
        {
          tagName: 'INPUT',
          classList: []
        }
      ]
      assertResultEqual(name, getElementsByName(name, context), expected, true)

      name = 'test'
      expected = [
        {
          tagName: 'BUTTON',
          classList: []
        }
      ]
      assertResultEqual(name, getElementsByName(name, context), expected, true)
    })
  })
})

describe('getElementsByName throws Error', () => {
  const name = 'name'

  it('getElementsByName with a window object', () => {
    withDom(nameShadow1, document => {
      assert.throws(() => {
        getElementsByName(name, document.defaultView)
      },
      {
        name: 'TypeError',
        message: 'Provided context must be of type Document or ShadowRoot'
      })
    })
  })
})

describe('getElementsByName with a default document context', () => {
  it('should return no items', () => {
    withDom(nameShadow1, document => {
      const name = 'firstname'
      assertResultEqual(name, getElementsByName(name), [], true)
    })
  })
})
