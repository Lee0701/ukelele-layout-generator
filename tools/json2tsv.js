
const fs = require('fs')

const keys = [
    ...[...'1234567890'],
    ...[...'qwertyuiop'],
    ...[...'asdfghjkl;'],
    ...[...'zxcvbnm,./'],
    ...[...'_'],
]

const flatten = (arr, key = '') => {
    if(typeof arr == 'string') return [[key, arr]]
    if(Array.isArray(arr)) return arr.flatMap((a, i) => {
        return flatten(a, key + keys[i])
    })
}

const build = (data) => Object.fromEntries(data.filter(([_k, v]) => v.trim() && v.charAt(0) != '@'))

const main = async (...args) => {
    const [inFile, outFile] = args
    const content = JSON.parse(fs.readFileSync(inFile, 'utf8'))
    const result = build(flatten(content))
    const output = Object.entries(result).map((line) => line.join('\t')).join('\n')
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
