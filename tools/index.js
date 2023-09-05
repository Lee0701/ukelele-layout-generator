
const fs = require('fs')
const path = require('path')
const { convert, format } = require('./tsv2xml')

const main = async (...args) => {
    const dirname = 'src'
    const list = fs.readdirSync(dirname).map((file) => `${dirname}/${file}`)
    list.forEach((file) => {
        const id = -Math.floor(Math.random() * 32768)
        const name = path.basename(file, path.extname(file))
        const content = fs.readFileSync(file, 'utf-8')
        const result = convert(content)
        const output = format(id, name, result)
        fs.writeFileSync(`out/${name}.keylayout`, output, 'utf-8')
    })
}

if(require.main === module) main(...process.argv.slice(2))
