
const fs = require('fs')
const path = require('path')
const { convert: _tbl2json } = require('./tbl2json')
const { convert: _json2tsv } = require('./json2tsv')
const { convert, format } = require('./tsv2xml')

const findFiles = (dirname, extname) => {
    if(Array.isArray(dirname)) return dirname.flatMap((dir) => findFiles(dir, extname))
    return fs.readdirSync(dirname)
            .map((file) => path.join(dirname, file))
            .filter((file) => path.extname(file) == extname)
}

const tbl2json = (inDir, outDir) => {
    const list = findFiles(inDir, '.tbl')
    list.forEach((file) => {
        const name = path.basename(file, path.extname(file))
        const content = fs.readFileSync(file, 'utf-8')
        const output = _tbl2json(content)
        fs.writeFileSync(path.join(outDir, `${name}.json`), output, 'utf-8')
    })
}

const json2tsv = (inDir, outDir) => {
    const list = findFiles(inDir, '.json')
    list.forEach((file) => {
        const name = path.basename(file, path.extname(file))
        const content = fs.readFileSync(file, 'utf-8')
        const output = _json2tsv(content)
        fs.writeFileSync(path.join(outDir, `${name}.tsv`), output, 'utf-8')
    })
}

const tsv2xml = (inDir, outDir) => {
    const list = findFiles(inDir, '.tsv')
    return list.forEach((file) => {
        const id = -Math.floor(Math.random() * 32768)
        const name = path.basename(file, path.extname(file))
        const content = fs.readFileSync(file, 'utf-8')
        const result = convert(content)
        const output = format(id, name, result)
        fs.writeFileSync(path.join(outDir, `${name}.keylayout`), output, 'utf-8')
    })
}

const main = async (...args) => {
    const out = 'out'
    const dirnames = ['src', out]
    tbl2json(dirnames, out)
    json2tsv(dirnames, out)
    tsv2xml(dirnames, out)
}

if(require.main === module) main(...process.argv.slice(2))
