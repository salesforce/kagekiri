/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* global it describe */

import { getElementsByClassName } from '../src/index.js'
import { assertResultEqual, withDom } from './utils.js'
import classNamesLight1 from './fixtures/classNames1/light.html'
import classNamesShadow1 from './fixtures/classNames1/shadow.html'

describe('getElementsByClassName', () => {
  const expected = [
    {
      tagName: 'DIV',
      classList: ['container', 'main']
    },
    {
      tagName: 'SPAN',
      classList: ['container', 'main', 'outerText']
    },
    {
      tagName: 'SPAN',
      classList: ['container', 'main', 'innerText']
    }
  ]

  it('light DOM - getElementsByClassName', () => {
    const classNames = 'container main'
    withDom(classNamesLight1, context => {
      assertResultEqual(classNames, context.getElementsByClassName(classNames), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName', () => {
    const classNames = 'container main'
    withDom(classNamesShadow1, context => {
      assertResultEqual('.container.main', getElementsByClassName(classNames, context), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName with the global document', () => {
    const classNames = 'container main'
    withDom(classNamesShadow1, () => {
      assertResultEqual('.container.main', getElementsByClassName(classNames), [], true)
    })
  })

  it('light DOM - getElementsByClassName with multiple spaces', () => {
    withDom(classNamesLight1, context => {
      const classNames = 'container      main'
      assertResultEqual(classNames, context.getElementsByClassName(classNames), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName with multiple spaces', () => {
    withDom(classNamesShadow1, context => {
      const classNames = 'container      main'
      assertResultEqual(classNames, getElementsByClassName(classNames, context), expected, true)
    })
  })

  it('light DOM - getElementsByClassName with line breaks', () => {
    withDom(classNamesLight1, context => {
      const classNames = `main
      
      
      
      container`
      assertResultEqual(classNames, context.getElementsByClassName(classNames), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName with line breaks', () => {
    withDom(classNamesShadow1, context => {
      const classNames = `main
      
      
      
      container`
      assertResultEqual(classNames, getElementsByClassName(classNames, context), expected, true)
    })
  })

  it('light DOM - getElementsByClassName with tabs', () => {
    withDom(classNamesLight1, context => {
      const classNames = 'main	container' // eslint-disable-line
      assertResultEqual(classNames, context.getElementsByClassName(classNames), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName with tabs', () => {
    withDom(classNamesShadow1, context => {
      const classNames = 'main	container' // eslint-disable-line
      assertResultEqual(classNames, getElementsByClassName(classNames, context), expected, true)
    })
  })

  it('light DOM - getElementsByClassName with spaces, line breaks, and tabs', () => {
    withDom(classNamesLight1, context => {
      // eslint-disable-next-line
      const classNames = `	main	container
      
            
      `
      assertResultEqual(classNames, context.getElementsByClassName(classNames), expected, true)
    })
  })

  it('shadow DOM - getElementsByClassName with spaces, line breaks, and tabs', () => {
    withDom(classNamesShadow1, context => {
      // eslint-disable-next-line
      const classNames = `	main	container
        
            
        `
      assertResultEqual(classNames, getElementsByClassName(classNames, context), expected, true)
    })
  })
})
