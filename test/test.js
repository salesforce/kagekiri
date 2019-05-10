import {querySelectorAll, querySelector} from '../index.js'
import * as assert from 'assert'
import simpleLight1 from './fixtures/simple1/light.html'
import simpleShadow1 from './fixtures/simple1/shadow.html'

function withDom(html, cb) {
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

function simplifyElement(element) {
  return {
    tagName: element.tagName,
    classList: [...element.classList]
  }
}

function simplifyElements(elements) {
  return [...elements].map(simplifyElement)
}

function testSelectors(lightDom, shadowDom, tests) {
  tests.forEach(({ selector, expected }) => {
    it('light DOM - qSA', () => {
      withDom(lightDom, context => {
        const elements = context.querySelectorAll(selector)
        assert.deepStrictEqual(simplifyElements(elements), expected)
      })
    })
    it('shadow DOM - qSA', () => {
      withDom(shadowDom, context => {
        const elements = querySelectorAll(selector, context)
        assert.deepStrictEqual(simplifyElements(elements), expected)
      })
    })
    it('light DOM - qS', () => {
      withDom(lightDom, context => {
        const element = context.querySelector(selector)
        assert.deepStrictEqual(simplifyElement(element), expected[0])
      })
    })
    it('shadow DOM - qSA', () => {
      withDom(shadowDom, context => {
        const element = querySelector(selector, context)
        assert.deepStrictEqual(simplifyElement(element), expected[0])
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
      }
    ])
  })

})
