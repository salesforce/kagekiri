/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Simple script to check our bundlesize
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import { gzip as gzipCallback } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import bytes from 'bytes'
import * as terser from 'terser'

async function main () {
  const gzip = promisify(gzipCallback)
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const pkgJsonFile = path.join(__dirname, '../package.json')
  const { bundlesize: bundlesizeFiles } = JSON.parse(await fs.readFile(pkgJsonFile, 'utf-8'))

  let failed = false

  for (const { path: filePath, maxSize, compression } of bundlesizeFiles) {
    const absoluteFile = path.join(__dirname, '..', filePath)
    const unminifiedSource = await fs.readFile(absoluteFile, 'utf-8')
    const prodSource = unminifiedSource.replaceAll('process.env.NODE_ENV', '"production"')
    const { code: minifiedSource } = await terser.minify(prodSource, {
      mangle: true,
      compress: true,
      toplevel: true
    })

    const bufferToMeasure = compression === 'gzip'
      ? await gzip(Buffer.from(minifiedSource, 'utf-8'), { level: 9 })
      : minifiedSource

    if (bufferToMeasure.length > bytes.parse(maxSize)) {
      console.log(`FAIL: ${filePath}: ${bytes.format(bufferToMeasure.length)} > ${maxSize} (compression: ${compression})`)
      failed = true
    } else {
      console.log(`PASS: ${filePath}: ${bytes.format(bufferToMeasure.length)} <= ${maxSize} (compression: ${compression})`)
    }
  }

  if (failed) {
    throw new Error('bundlesize check failed')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
