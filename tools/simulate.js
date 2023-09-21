
const fs = require('fs')
const formatTable = require('./table')

function drawLayout(layout) {
    clearScreen()
    console.log(formatTable(layout))
}

function loadLayout(filename) {
    return Object.fromEntries(fs.readFileSync(filename, 'utf8').split('\n')
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
    stdin.on('data', (data) => {
        if(data.toString() === '\x1b') {
            exit()
        }
        drawLayout(layout)
        text.push(data.toString())
        process.stdout.write(text.join(''))
    })
    stdin.setRawMode(true)
    drawLayout(layout)
    stdin.resume()
}

if(require.main === module) main(process.argv.slice(2))
