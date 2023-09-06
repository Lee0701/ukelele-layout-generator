
const fs = require('fs')

const convert = (content) => {
    const lines = content.split('\n')
            .filter((line) => line.trim())
            .map((line) => line.split('\t'))
    const map = {}
    lines.forEach(([code, char]) => {
        if(!map[code]) map[code] = []
        map[code].push(char)
    })
    const result = Object.entries(map).flatMap(([code, chars]) => {
        if(chars.length == 1) {
            return [`${code}\t${chars[0]}`]
        } else {
            return [
                `${code}_\t${chars[0]}`,
                ...chars.map((char, i) => `${code}${i + 1}\t${char}`),
            ]
        }
    })
    const output = result.join('\n')
    return output
}

const main = async (...args) => {
    const [inFile, outFile] = ['src/cangjie_unihan.tsv', 'out/cangjie_unihan.tsv']
    const input = fs.readFileSync(inFile, 'utf8')
    const output = convert(input)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = { convert }
