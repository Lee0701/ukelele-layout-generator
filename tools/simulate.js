
const fs = require('fs')
const formatTable = require('./table')

function drawLayout(layout) {
    clearScreen()
    console.log(formatTable(layout))
}

function loadLayout(filename) {
    return Object.fromEntries(fs.readFileSync(filename)
            .toString().split('\n')
            .map((line) => line.split('\t')))
}

function clearScreen() {
    const stdout = process.stdout
    stdout.write('\x1b[H')
    stdout.write('\x1b[0J')
}

function exit() {
    process.stdin.setRawMode(false)
    process.exit(0)
}

async function main(args) {
    const stdin = process.stdin
    const layout = loadLayout(args[0])
    const text = []
    const composing = []
    stdin.on('data', (data) => {
        data = data.toString()
        if(data == '\x1b') {
            exit()
        } else if(data == '\x7f') {
            if(composing.length) composing.splice(0, composing.length)
            else text.pop()
        } else {
            composing.push((data == ' ') ? '_' : data)
            if(composing.join('') == '_') text.push(composing.pop() && '\u3000')
        }
        const layoutToDraw = Object.fromEntries(Object.entries(layout)
            .filter(([k, v]) => k.startsWith(composing.join('')) && composing.length == k.length - 1)
            .map(([k, v]) => [k.slice(composing.length), v]))
        drawLayout(layoutToDraw)
        const val = layout[composing.join('')]
        if(val) {
            text.push(val)
            composing.splice(0, composing.length)
        }
        const key = composing.join('')
        process.stdout.write(text.join('') + (key ? `<${key}>` : ''))
    })
    stdin.setRawMode(true)
    drawLayout(layout)
    stdin.resume()
}

if(require.main === module) main(process.argv.slice(2))
