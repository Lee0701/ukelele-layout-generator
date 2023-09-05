
const fs = require('fs')

const convert = (actions) => {
    const result = []
    Object.keys(actions).forEach((id) => {
        const set = new Set()
        result.push(`<action id="${id}">`)
        for(action of actions[id]) {
            const {state, next, output} = action
            if(output) result.push(`    <when state="${state}" output="${output}"/>`)
            else if(next) result.push(`    <when state="${state}" next="${next}"/>`)
            set.add(state)
        }
        result.push(`</action>`)
    })
    return result.join('\n')
}

const main = async (inFile, outFile) => {
    const content = fs.readFileSync(inFile, 'utf-8')
    const entries = content.split('\n').map((line) => line.split('\t'))
    const actions = {}
    entries.forEach(([key, value]) => {
        const id = key.charAt(key.length - 1)
        const state = key.slice(0, -1)
        const output = value.trim()
        if(!actions[id]) actions[id] = []
        actions[id].push({state, output})
    })
    const result = convert(actions)
    fs.writeFileSync(outFile, result)
}

if(require.main === module) main(...process.argv.slice(2))
