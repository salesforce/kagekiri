import { querySelectorAll } from '../index.js'
import * as assert from 'assert'
import simpleLight1 from './fixtures/simple1/light.html'
import simpleShadow1 from './fixtures/simple1/shadow.html'

function withContainer(html, cb) {
  const container = document.createElement('div')

  container.innerHTML = html

  cb(container)
}

describe('test suite', () => {
  it('simple1 light', () => {
    withContainer(simpleLight1, context => {
      const elements = context.querySelectorAll('.container .button span')
      assert.deepStrictEqual(elements.length, 1)
    })
  })

  it('simple1 shadow', () => {
    withContainer(simpleLight1, context => {
      const elements = querySelectorAll('.container .button span', context)
      assert.deepStrictEqual(elements.length, 1)
    })
  })
})
