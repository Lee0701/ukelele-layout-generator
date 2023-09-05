
const fs = require('fs')
const { parse } = require('./parser')

const main = async (...args) => {
    const [inFile, outFile] = args
    const lines = fs.readFileSync(inFile, 'utf8').split('\n')
    const input = lines.filter((line) => !line.startsWith('#') && !line.startsWith(';;') && line.trim()).join('\n')
    const output = JSON.stringify(parse(input))
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
