
const fs = require('fs')

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
        const set = new Set()
        result.push(`<action id="${id}">`)
        for(const [state, action] of Object.entries(actions[id])) {
            const {next, output} = action
            if(output) result.push(`    <when state="${state}" output="${output}"/>`)
            else if(next) result.push(`    <when state="${state}" next="${next}"/>`)
            set.add(state)
        }
        result.push(`</action>`)
    })
    return result.join('\n')
}

const format = (content) => {
    const template = fs.readFileSync('data/template.keylayout', 'utf-8')
    const replacements = {
        id: -Math.floor(Math.random() * 32768),
        name: 'TUT-Code',
        actions: content,
    }
    return template.replace(/\%([a-z]+)\%/g, (match, name) => replacements[name])
}

const main = async (inFile, outFile) => {
    const content = fs.readFileSync(inFile, 'utf-8')
    const result = convert(content)
    const output = format(result)
    fs.writeFileSync(outFile, output)
}

if(require.main === module) main(...process.argv.slice(2))
module.exports = {convert, format}
