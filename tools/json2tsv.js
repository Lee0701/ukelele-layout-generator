
const fs = require('fs')

const keys = [
    ...[...'1234567890'],
    ...[...'qwertyuiop'],
    ...[...'asdfghjkl;'],
    ...[...'zxcvbnm,./'],
    ...[...'_'],
]

const _convert = (arr, key = '') => {
    if(typeof arr == 'string') return [[key, arr]]
    if(Array.isArray(arr)) return arr.flatMap((a, i) => {
        return _convert(a, key + keys[i])
    })
}

const build = (data) => data.filter(([_k, v]) => v.trim() && v.charAt(0) != '@')

const convert = (content) => {
    const converted = _convert(JSON.parse(content))
    const result = build(converted)
    const output = result.map((line) => line.join('\t')).join('\n')
    return output
}

const main = async (...args) => {
    const [inFile, outFile] = args
    const content = fs.readFileSync(inFile, 'utf8')
    const output = convert(content)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = { convert }
