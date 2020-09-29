/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */
import { assertResultEqual, withDom } from './utils.js'
import simpleLight1 from './fixtures/simple1/light.html'
// import simpleShadow1 from './fixtures/simple1/shadow.html'

describe(('element matches'), () => {
  it('light DOM - matches', () => {
    const selector = '.blah'
    const expected = []
    withDom(simpleLight1, context => {
      assertResultEqual(selector, context.querySelectorAll(selector), expected, true)
    })
  })
})
