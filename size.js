const {readFileSync} = require('fs')
const zlib = require('zlib')
const {resolve} = require('path')

function gzip(buffer) {
  return zlib.gzipSync(buffer, {level: 9}).length
}

function brotli(buffer) {
  return zlib.brotliCompressSync(buffer).length
}

const indent = (txt) => {
  const regex = /^/gm
  return txt.replace(regex, ' '.repeat(4))
}

const prettyBytes = (bytes) => {
  return bytes > 1000 ? bytes / 1000 + 'kB' : bytes + 'B'
}

async function cli() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    return console.error(danger('Provide a file for sizesnap to size'))
  }

  if (args.length > 1) {
    return console.error(danger('Invalid args, only one argument accepted'))
  }

  const sizeString = await lite(resolve(args[0]))
  console.log(sizeString.trim())
}

async function lite(file) {
  const buf = readFileSync(file)
  const normName = (name) => {
    name = name.replace(__dirname, '')
    return (name.startsWith('/') && name.slice(1)) || name
  }
  let print = ''
  print += normName(file) + ' '
  print += prettyBytes(Buffer.byteLength(buf)) + ' '
  print += prettyBytes(gzip(buf)) + '/gz' + ' '
  print += prettyBytes(brotli(buf)) + '/br'

  return print
}

if (require.main === module) {
  cli()
}

module.exports = lite
