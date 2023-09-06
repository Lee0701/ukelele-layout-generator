
const fs = require('fs')

const convertCode = (code) => String.fromCodePoint(parseInt(code.substring(2), 16))

const convert = (content) => {
    const lines = content.split('\n').filter((line) => !line.startsWith('#') && line.trim())
    const targets = lines.map((line) => line.split('\t')).filter((entry) => entry[1] == 'kCangjie')
    const sorted = targets.sort((a, b) => a[2].localeCompare(b[2]))
    const output = sorted.map((entry) => entry[2].toLowerCase() + '\t' + convertCode(entry[0]))
    return output.join('\n')
}

const main = async (...args) => {
    const [inFile, outFile] = ['Unihan/Unihan_DictionaryLikeData.txt', 'src/cangjie_unihan.tsv']
    const input = fs.readFileSync(inFile, 'utf8')
    const output = convert(input)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = { convert }
