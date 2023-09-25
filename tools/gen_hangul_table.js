
const fs = require('fs')

const STD_CHO = 'ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'
const STD_JUNG = 'ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ'
const STD_JONG = 'ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ'

const COMPAT_CHO = 'ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const COMPAT_JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'

const CONVERT_CHO = 'ᄀᄁ ᄂ  ᄃᄄᄅ       ᄆᄇᄈ ᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'
const CONVERT_JUNG = 'ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ'
const CONVERT_JONG = 'ᆨᆩᆪᆫᆬᆭᆮ ᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸ ᆹᆺᆻᆼᆽ ᆾᆿᇀᇁᇂ'

function parseHanguJamo(jamo) {
    if(jamo.startsWith('_') && jamo.endsWith('_')) {
        const jung = jamo.charAt(1)
        if(COMPAT_JUNG.includes(jung)) {
            return CONVERT_JUNG[COMPAT_JUNG.indexOf(jung)]
        } else {
            return jamo
        }
    } else if(jamo.endsWith('_')) {
        const cho = jamo.charAt(0)
        if(COMPAT_CHO.includes(cho)) {
            return CONVERT_CHO[COMPAT_CHO.indexOf(cho)]
        } else {
            return jamo
        }
    } else if(jamo.startsWith('_')) {
        const jong = jamo.charAt(1)
        if(COMPAT_CHO.includes(jong)) {
            return CONVERT_JONG[COMPAT_CHO.indexOf(jong)]
        } else {
            return jamo
        }
    } else {
        return jamo
    }
}

function generateSyllableTable(jamoTable) {
    const reverseJamoTable = Object.fromEntries(Object.entries(jamoTable).map(([k, v]) => [parseHanguJamo(v), k]))
    const syllables = new Array(11172).fill().map((_, i) => String.fromCharCode(0xac00 + i))
    return Object.fromEntries(syllables.map((syllable) => {
        const jamos = syllable.normalize('NFD').split('').map((jamo) => reverseJamoTable[jamo] || null)
        if(jamos.some((jamo) => jamo === null)) return null
        return [jamos.join(''), syllable]
    }).filter((e) => e !== null))
}

async function main(args) {
    const [input, output] = args
    const jamoTable = Object.fromEntries(fs.readFileSync(input)
            .toString().split('\n')
            .map((line) => line.split('\t')))
    const syllableTable = generateSyllableTable(jamoTable)
    fs.writeFileSync(output, Object.entries(syllableTable).map((line) => line.join('\t')).join('\n'))
}

if(require.main === module) main(process.argv.slice(2))
