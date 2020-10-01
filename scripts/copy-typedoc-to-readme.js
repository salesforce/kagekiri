const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const START_MARKER = '<!-- begin API -->'
const END_MARKER = '<!-- end API -->'

// Take the typedoc output and insert it directly into the README
async function main () {
  let api = await readFile('./typedoc/modules/_kagekiri_d_.md', 'utf8')
  api = api.substring(api.indexOf('\n## Functions'))
  api = api.replace('## Functions', '## API')
  api = api.replace(/\*Defined in .*?\*/g, '')

  let readme = await readFile('./README.md', 'utf8')
  const startIdx = readme.indexOf(START_MARKER)
  const endIdx = readme.indexOf(END_MARKER)

  readme = readme.substring(0, startIdx) +
    `${START_MARKER}\n\n${api}\n\n${END_MARKER}` +
    readme.substring(endIdx + END_MARKER.length)

  await writeFile('./README.md', readme, 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
