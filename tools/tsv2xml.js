
const fs = require('fs')
const path = require('path')

const indent = '    '
const indent2 = indent + indent
const indent3 = indent + indent + indent
const space = '\u3000'

const getKeys = (content) => {
    const keys = [
        ...new Array(26).fill().map((_, i) => String.fromCharCode(0x61 + i)),
        ...new Array(10).fill('').map((_, i) => String.fromCharCode(0x30 + i)),
        ...';,./'.split(''),
        '_',
    ].map((key) => {
        const value = (content.includes(`<action id="${key}">`)) ? `action="${key}"` : `output="${key}"`
        return [`key_${key}`, value]
    })
    return Object.fromEntries(keys)
}

const convert = (content) => {
    const entries = content.split(/\r?\n/).map((line) => line.split('\t'))
    const actions = {}
    entries.forEach(([key, value]) => {
        const id = key.charAt(key.length - 1)
        const state = key.slice(0, -1)
        const output = value.trim()

        if(!actions[id]) actions[id] = {}
        actions[id][state] = {output}

        const s = state.slice(0, -1) || 'none'
        const i = state.charAt(state.length - 1)
        const next = state
        if(!actions[i]) actions[i] = {}
        if(!actions[i][s]) actions[i][s] = {next}
    })

    const result = []
    Object.keys(actions).forEach((id) => {
        if(!id) return
        result.push(indent2 + `<action id="${id}">`)
        for(const [state, action] of Object.entries(actions[id])) {
            const {next, output} = action
            if(output) result.push(indent3 + `<when state="${state || 'none'}" output="${output}"/>`)
            else if(next && next != id) result.push(indent3 + `<when state="${state || 'none'}" next="${next}"/>`)
        }
        if(id == '_') {
            result.push(indent3 + `<when state="none" output="${space}"/>`)
        }
        result.push(indent2 + `</action>`)
    })
    return result.join('\n')
}

const format = (id, name, actions) => {
    const template = fs.readFileSync('data/template.keylayout', 'utf-8')
    const keys = getKeys(actions)
    const replacements = {
        id, name, actions, ...keys,
    }
    return template.replace(/\%([a-z0-9;,./_]+)\%/g, (match, name) => replacements[name] || match)
}

const main = async (inFile, outFile) => {
    const id = -Math.floor(Math.random() * 32768)
    const name = path.basename(inFile, path.extname(inFile))
    const content = fs.readFileSync(inFile, 'utf-8')
    const result = convert(content)
    const output = format(id, name, result)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = { convert, format }
