
const fs = require('fs')
const { parse } = require('./parser')

const convert = (content) => {
    const lines = content.split('\n')
    const input = lines.filter((line) => !line.startsWith('#') && !line.startsWith(';;') && line.trim()).join('\n')
    const output = JSON.stringify(parse(input))
    return output
}

const main = async (...args) => {
    const [inFile, outFile] = args
    const input = fs.readFileSync(inFile, 'utf8')
    const output = convert(input)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = { convert }
