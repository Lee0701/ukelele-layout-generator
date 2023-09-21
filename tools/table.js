
const fs = require('fs')
const compile = require('string-template/compile')

function buildTableKeys(table) {
    const tableKeys = fs.readFileSync('res/layout_table.txt', 'utf8').split('\n')
    return tableKeys.map((line, i) => {
        if(i % 2 == 0) {
            const upper = line.toUpperCase().split('').map((c, j) => {
                return table[c] || (isAlphabetic(c) || isNumeric(c) ? c : isSymbol(c) ? tableKeys[i + 1].charAt(j) : '')
            })
            return upper
        } else {
            const lower = line.split('').map((c) => {
                const k = table[c] || ''
                return (isAlphanumeric(k) || k == '') ? k.padStart(4, ' ') : k.padStart(3, ' ')
            })
            return lower
        }
    })
}

function buildTableTemplate() {
    let template = fs.readFileSync('res/layout_template.txt', 'utf8')
    let i = 0
    template = template.replace(/\{\{\}\}/g, () => `{${i++}}`)
    template = compile(template)
    return template
}

function formatTable(template, keys) {
    const values = keys.flat().map((k) => {
        return (isAlphanumeric(k) || k == '') ? k.padEnd(4, ' ') : k.padEnd(3, ' ')
    })
    return template(values)
}

const isAlphabetic = (c) => c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z'
const isNumeric = (c) => c >= '0' && c <= '9'
const isSymbol = (c) => `\`!@#$%^&*()_+-={}[]|\\:;'<>,.?/`.includes(c)
const isAlphanumeric = (c) => isAlphabetic(c) || isNumeric(c) || isSymbol(c)

async function main(args) {
    console.log(formatTable(buildTableTemplate(), buildTableKeys({})))
}

if(require.main === module) main(process.argv.slice(2))
module.exports = (table) => formatTable(buildTableTemplate(), buildTableKeys(table))
